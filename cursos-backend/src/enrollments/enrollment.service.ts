// enrollments/enrollment.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentFilterDto } from './dto/enrollment-filter.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { UserInterface } from '../common/interfaces/user.interface';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/enums';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment.dto';
import { AddObservationDto } from './dto/AddObservationDto';
import { Workbook } from 'exceljs';
import { GetEnrollmentReportDto } from './dto/get-enrollment-report.dto';

dayjs.extend(isBetween);

interface CurrencyFormat {
  symbol: string;
  description: string;
}

interface CurrencyFormats {
  [key: string]: CurrencyFormat;
}

const CURRENCY_FORMATS: CurrencyFormats = {
  ARS: { symbol: '$', description: 'Pesos argentinos' },
  USD: { symbol: '$', description: 'Dólares estadounidenses' },
  CLP: { symbol: '$', description: 'Pesos chilenos' },
  BRL: { symbol: 'R$', description: 'Reales brasileños' },
  COP: { symbol: '$', description: 'Pesos colombianos' },
  CUP: { symbol: '$', description: 'Pesos cubanos' },
  EUR: { symbol: '€', description: 'Euros' },
  SVC: { symbol: '₡', description: 'Colones salvadoreños' },
  GTQ: { symbol: 'Q', description: 'Quetzales guatemaltecos' },
  HNL: { symbol: 'L', description: 'Lempiras hondureños' },
  MXN: { symbol: '$', description: 'Pesos mexicanos' },
  NIO: { symbol: 'C$', description: 'Córdobas nicaragüenses' },
  PAB: { symbol: 'B/.', description: 'Balboas panameños' },
  BOB: { symbol: 'Bs.', description: 'Bolivianos' },
  PYG: { symbol: '₲', description: 'Guaraníes paraguayos' },
  PEN: { symbol: 'S/', description: 'Soles peruanos' },
  DOP: { symbol: '$', description: 'Pesos dominicanos' },
  UYU: { symbol: '$', description: 'Pesos uruguayos' },
  VES: { symbol: 'Bs.', description: 'Bolívares venezolanos' },
  GBP: { symbol: '£', description: 'Libras esterlinas' },
  CAD: { symbol: '$', description: 'Dólares canadienses' },
  CHF: { symbol: 'CHF', description: 'Francos suizos' },
  JPY: { symbol: '¥', description: 'Yenes japoneses' },
  CNY: { symbol: '¥', description: 'Yuanes chinos' },
};

@Injectable()
export class EnrollmentService {
  constructor(private readonly prisma: PrismaService) {}

  private async getUserRoleId(
    user: UserInterface,
  ): Promise<{ vendedorId?: string; profesorId?: string }> {
    const result: { vendedorId?: string; profesorId?: string } = {};

    if (
      user.rol === Role.VENDEDOR ||
      user.rol === Role.PROFESORVENDEDOR ||
      user.rol === Role.ADMIN ||
      user.rol === Role.FINANZAS
    ) {
      const vendedor = await this.prisma.vendedor.findUnique({
        where: { usuarioId: user.id },
        select: { id: true },
      });
      result.vendedorId = vendedor?.id || null;
    } else if (user.rol === Role.PROFESOR) {
      const profesor = await this.prisma.profesor.findUnique({
        where: { usuarioId: user.id },
        select: { id: true },
      });
      result.profesorId = profesor?.id || null;
    }

    return result;
  }

  private async buildEnrollmentWhereClause(
    filterDto: EnrollmentFilterDto,
    user: UserInterface,
  ): Promise<Prisma.InscripcionWhereInput> {
    const {
      fechaInicio,
      fechaFin,
      vendedorId,
      alumnoId,
      comisionId,
      status,
      search,
    } = filterDto;
    const where: Prisma.InscripcionWhereInput = {};

    // // Aplicar filtros
    // if (fechaInicio && fechaFin) {
    //   where.createdAt = {
    //     gte: new Date(fechaInicio),
    //     lte: new Date(fechaFin),
    //   };
    // }
    if (fechaInicio || fechaFin) {
      where.createdAt = {
        ...(fechaInicio && { gte: new Date(fechaInicio) }), // Si se especifica fechaInicio, se usa como límite inferior
        ...(fechaFin && { lte: new Date(fechaFin) }), // Si se especifica fechaFin, se usa como límite superior
      };
    }

    if (vendedorId) where.vendedorId = vendedorId;
    if (alumnoId) where.alumnoId = alumnoId;
    if (comisionId) where.comisionId = comisionId;
    if (status) where.estado = status;
    if (search) {
      const searchTerms = search.trim().split(/\s+/);

      where.AND = searchTerms.map((term) => ({
        OR: [
          {
            alumno: {
              usuario: { nombre: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            alumno: {
              usuario: { apellido: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            alumno: {
              usuario: { email: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            alumno: {
              usuario: { dni: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            comision: {
              curso: { nombre: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            comision: {
              curso: { codigo: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            comision: {
              codigoComision: { contains: term, mode: 'insensitive' },
            },
          },
          {
            vendedor: {
              usuario: { nombre: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            vendedor: {
              usuario: { apellido: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            vendedor: {
              usuario: { email: { contains: term, mode: 'insensitive' } },
            },
          },
          {
            vendedor: {
              usuario: { dni: { contains: term, mode: 'insensitive' } },
            },
          },
        ],
      }));
    }

    // Obtener el ID de rol del usuario si es necesario
    const { vendedorId: vendedorIdUsuario, profesorId: profesorIdUsuario } =
      await this.getUserRoleId(user);

    if (
      user.rol === Role.VENDEDOR ||
      user.rol === Role.PROFESORVENDEDOR // Añadir aquí
    ) {
      where.vendedorId = vendedorIdUsuario;
    } else if (user.rol === Role.PROFESOR && profesorIdUsuario) {
      where.comision = {
        profesores: {
          some: { profesorId: profesorIdUsuario },
        },
      };
    }

    return where;
  }

  async findAll(filterDto: EnrollmentFilterDto, user: UserInterface) {
    const where = await this.buildEnrollmentWhereClause(filterDto, user);
    const { page, limit } = filterDto;
    const take = limit || 20;
    const skip = page && limit ? (page - 1) * limit : 0;
    const selectFields = {
      id: true,
      createdAt: true,
      estado: true,
      observaciones: true,
      cantidadCuotas: true,
      totalAcordado: true,
      alumno: {
        select: {
          // id: true,
          // nombre: true,
          // apellido: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
              dni: true,
              pais: true,
              telefono: true,
              email: true,
            },
          },
        },
      },
      // comision: {
      //   select: {
      //     id: true,
      //     nombre: true,
      //     curso: {
      //       select: {
      //         id: true,
      //         titulo: true,
      //       },
      //     },
      //   },
      // },
      vendedor: {
        select: {
          usuario: {
            select: {
              id: true,
              nombre: true,
              apellido: true,
            },
          },
        },
      },
      pagos: {
        select: {
          id: true,
          monto: true,
          moneda: true,
          // fechaPago: true,
        },
      },
    };

    const [enrollments, totalItems] = await this.prisma.$transaction([
      this.prisma.inscripcion.findMany({
        where,
        skip,
        take,
        orderBy: [
          {
            estado: 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
        select: selectFields,
      }),
      this.prisma.inscripcion.count({
        where,
      }),
    ]);

    return {
      items: enrollments,
      totalItems,
      currentPage: page || 1,
      totalPages: Math.ceil(totalItems / (limit || 20)),
      hasNextPage: skip + take < totalItems,
      hasPreviousPage: skip > 0,
    };
  }

  async findOne(id: string, user: UserInterface) {
    // Verificar el acceso al inicio con datos mínimos
    const inscripcionAcceso = await this.prisma.inscripcion.findUnique({
      where: { id },
      select: {
        id: true,
        vendedorId: true,
        comision: {
          select: {
            id: true,
            profesores: {
              select: {
                profesorId: true,
              },
            },
          },
        },
      },
    });

    if (!inscripcionAcceso) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    // Llamar a la función de verificación de acceso antes de recuperar más datos
    await this.checkAccessToEnrollment(inscripcionAcceso, user);

    // Recuperar todos los detalles completos solo si el usuario tiene acceso
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id },
      select: {
        id: true,
        createdAt: true,
        estado: true,
        observaciones: true,
        alumno: {
          select: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                dni: true,
                pais: true,
                telefono: true,
                email: true,
              },
            },
          },
        },
        comision: {
          select: {
            id: true,
            codigoComision: true,
            curso: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
          },
        },
        vendedor: {
          select: {
            usuario: {
              select: {
                id: true,
                nombre: true,
                apellido: true,
                dni: true,
                pais: true,
                telefono: true,
                email: true,
              },
            },
          },
        },
        pagos: {
          select: {
            id: true,
            monto: true,
            metodoPago: true,
            tipoPago: true,
            fechaPago: true,
            observaciones: true,
          },
        },
      },
    });

    return inscripcion; // Devolver los detalles completos si se tiene acceso
  }

  async create(createEnrollmentDto: CreateEnrollmentDto, user: UserInterface) {
    const { alumnoId, comisionId, vendedorId } = createEnrollmentDto;
    const { vendedorId: vendedorIdUsuario } = await this.getUserRoleId(user);

    if (
      (user.rol === Role.VENDEDOR ||
        user.rol === Role.PROFESORVENDEDOR ||
        user.rol === Role.ADMIN ||
        user.rol === Role.FINANZAS) &&
      !vendedorIdUsuario
    ) {
      throw new ForbiddenException(
        'No tienes permisos para crear inscripciones',
      );
    }

    return this.prisma.inscripcion.create({
      data: {
        alumnoId: alumnoId,
        comisionId: comisionId,
        vendedorId: vendedorId || vendedorIdUsuario,
      },
      select: { id: true },
    });
  }

  // async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
  //   try {
  //     const inscripcion = await this.prisma.inscripcion.update({
  //       where: { id },
  //       data: updateEnrollmentDto,
  //       select: { id: true },
  //     });
  //     return inscripcion;
  //   } catch (error) {
  //     if (
  //       error instanceof Prisma.PrismaClientKnownRequestError &&
  //       error.code === 'P2025'
  //     ) {
  //       throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
  //     }
  //     throw error;
  //   }
  // }
  async updateStatus(
    id: string,
    updateStatusDto: UpdateEnrollmentStatusDto,
    user: UserInterface,
  ) {
    const enrollment = await this.prisma.inscripcion.findUnique({
      where: { id },
      select: { vendedorId: true },
    });

    if (!enrollment) {
      throw new NotFoundException(`Inscripción con ID ${id} no encontrada`);
    }

    // Obtener el vendedorId del usuario si es necesario
    const { vendedorId: vendedorIdUsuario } = await this.getUserRoleId(user);

    // Verificar los permisos del usuario
    if (
      (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) &&
      enrollment.vendedorId !== vendedorIdUsuario
    ) {
      throw new ForbiddenException(
        'No tienes permisos para actualizar esta inscripción',
      );
    }

    // Si el usuario es ADMIN, FINANZAS, o es VENDEDOR/PROFESORVENDEDOR con el vendedorId correcto
    if (
      user.rol === Role.ADMIN ||
      user.rol === Role.FINANZAS ||
      ((user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) &&
        enrollment.vendedorId === vendedorIdUsuario)
    ) {
      return this.prisma.inscripcion.update({
        where: { id },
        data: { estado: updateStatusDto.estado },
        select: { id: true, estado: true },
      });
    }

    throw new ForbiddenException(
      'No tienes permisos para actualizar esta inscripción',
    );
  }
  async getPayments(enrollmentId: string, user: UserInterface) {
    // Verificar el acceso a la inscripción
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id: enrollmentId },
      include: {
        pagos: {
          orderBy: {
            fechaPago: 'desc',
          },
        },
      },
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `Inscripción con ID ${enrollmentId} no encontrada`,
      );
    }

    await this.checkAccessToEnrollment(inscripcion, user);

    return inscripcion.pagos; // Retorna la lista de pagos
  }

  // Método para agregar un nuevo pago (ya existente en tu código)
  async addPayment(
    enrollmentId: string,
    addPaymentDto: AddPaymentDto,
    user: UserInterface,
  ) {
    const { vendedorId: vendedorIdUsuario } = await this.getUserRoleId(user);

    return this.prisma.$transaction(async (prisma) => {
      const inscripcion = await prisma.inscripcion.findUnique({
        where: { id: enrollmentId },
        include: {
          comision: {
            include: {
              profesores: { include: { profesor: true } },
            },
          },
          vendedor: true,
        },
      });

      if (!inscripcion)
        throw new NotFoundException(
          `Inscripción con ID ${enrollmentId} no encontrada`,
        );

      await this.checkAccessToEnrollment(inscripcion, user);

      await prisma.pago.create({
        data: {
          inscripcionId: enrollmentId,
          vendedorId:
            user.rol === Role.VENDEDOR ||
            user.rol === Role.PROFESORVENDEDOR ||
            user.rol === Role.ADMIN ||
            user.rol === Role.FINANZAS
              ? vendedorIdUsuario
              : null,
          monto: addPaymentDto.monto,
          moneda: addPaymentDto.moneda,
          metodoPago: addPaymentDto.metodoPago,
          tipoPago: addPaymentDto.tipoPago,
          cuentaPropia: addPaymentDto.cuentaPropia,
          fechaPago: addPaymentDto.fechaPago
            ? new Date(addPaymentDto.fechaPago)
            : undefined,
          observaciones: addPaymentDto.observaciones,
        },
        // select: { id: true },
      });
      if (inscripcion.estado === 'Pendiente') {
        await prisma.inscripcion.update({
          where: { id: enrollmentId },
          data: { estado: 'Parcial' },
        });
      }
    });
  }

  async addObservation(
    enrollmentId: string,
    addObservationDto: AddObservationDto,
    user: UserInterface,
  ) {
    return this.prisma.$transaction(async (prisma) => {
      const inscripcion = await prisma.inscripcion.findUnique({
        where: { id: enrollmentId },
        include: {
          vendedor: true,
          comision: {
            include: {
              profesores: { include: { profesor: true } },
            },
          },
        },
      });

      if (!inscripcion) {
        throw new NotFoundException(
          `Inscripción con ID ${enrollmentId} no encontrada`,
        );
      }

      await this.checkAccessToEnrollment(inscripcion, user);

      return prisma.inscripcion.update({
        where: { id: enrollmentId },
        data: {
          observaciones: addObservationDto.observaciones,
          totalAcordado: addObservationDto.totalAcordado,
          cantidadCuotas: addObservationDto.cantidadCuotas,
        },
        select: {
          id: true,
          observaciones: true,
          totalAcordado: true,
          cantidadCuotas: true,
        },
      });
    });
  }

  private async checkAccessToEnrollment(inscripcion: any, user: UserInterface) {
    // Omitir la verificación para ADMIN y FINANZAS
    if (user.rol === Role.ADMIN || user.rol === Role.FINANZAS) {
      return; // Permitir acceso completo sin restricciones
    }

    const { vendedorId: vendedorIdUsuario, profesorId: profesorIdUsuario } =
      await this.getUserRoleId(user);

    if (
      user.rol === Role.VENDEDOR ||
      user.rol === Role.PROFESORVENDEDOR // Añadir aquí
    ) {
      if (inscripcion.vendedorId !== vendedorIdUsuario) {
        throw new ForbiddenException('No tienes acceso a esta inscripción');
      }
    }

    if (user.rol === Role.PROFESOR) {
      const esProfesorAsignado = inscripcion.comision.profesores.some(
        (asignacion) => asignacion.profesorId === profesorIdUsuario,
      );
      if (!esProfesorAsignado) {
        throw new ForbiddenException('No tienes acceso a esta inscripción');
      }
    }
  }

  // Definir los estilos como constante en la clase
  private readonly styles = {
    colors: {
      headerGroup: 'F6ECFB', // Violeta claro para los grupos
      columnNames: 'E6E6E6', // Gris medio claro para nombres de columnas
      states: {
        Pendiente: 'F5F5F5', // Gris claro
        Parcial: 'FFF4E5', // Naranja claro
        Completo: 'E8F8ED', // Verde claro
        Cancelado: 'FEECEB', // Rojo claro
        Inactivo: 'F5F7F8', // Gris más oscuro
      },
      border: 'C0C2C9', // Gris oscuro para bordes
    },
  };

  private formatCurrencyAmount(currency: string, amount: string): string {
    try {
      const currencyInfo = CURRENCY_FORMATS[currency];
      const numericAmount = Number(amount);
      if (isNaN(numericAmount)) {
        return `${currency} Error`;
      }
      return `${currency} ${currencyInfo?.symbol || ''}${amount}`;
    } catch (error) {
      console.error('Error formateando monto:', error);
      return 'Error formato';
    }
  }

  private calculateTotalPaymentsByCurrency(pagos: any[]): string {
    try {
      const totals = pagos.reduce(
        (acc, pago) => {
          const amount = Number(pago.monto);
          if (!isNaN(amount)) {
            acc[pago.moneda] = (acc[pago.moneda] || 0) + amount;
          }
          return acc;
        },
        {} as { [key: string]: number },
      );

      return (
        Object.entries(totals)
          .map(([currency, amount]) => {
            const currencyInfo = CURRENCY_FORMATS[currency];
            return `${currencyInfo?.symbol || ''}${amount} ${currency}`;
          })
          .join(' + ') || ''
      );
    } catch (error) {
      console.error('Error calculando total:', error);
      return 'Error cálculo';
    }
  }

  private formatDate(date: Date): string {
    try {
      return dayjs(date).format('DD/MM/YYYY');
    } catch (error) {
      console.error('Error formateando fecha:', error);
      return '';
    }
  }

  async generateEnrollmentReport(
    reportDto: GetEnrollmentReportDto,
    user: UserInterface,
  ): Promise<{ buffer: Buffer; fileName: string }> {
    const { comisionId, fechaInicio, fechaFin } = reportDto;

    // Verificar acceso a la comisión
    if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
      const { vendedorId: vendedorIdUsuario } = await this.getUserRoleId(user);
      const tieneAcceso = await this.prisma.asignacionVendedor.findFirst({
        where: {
          comisionId,
          vendedorId: vendedorIdUsuario,
        },
      });

      if (!tieneAcceso) {
        throw new ForbiddenException('No tienes acceso a esta comisión');
      }
    }

    try {
      // Obtener inscripciones
      const inscripciones = await this.prisma.inscripcion.findMany({
        where: {
          comisionId,
          createdAt: {
            gte: new Date(fechaInicio),
            lte: new Date(fechaFin),
          },
        },
        include: {
          alumno: {
            include: {
              usuario: true,
            },
          },
          vendedor: {
            include: {
              usuario: true,
            },
          },
          pagos: {
            orderBy: {
              fechaPago: 'asc',
            },
          },
          comision: {
            include: {
              curso: true,
            },
          },
        },
        orderBy: [
          {
            estado: 'asc',
          },
          {
            createdAt: 'desc',
          },
        ],
      });

      if (inscripciones.length === 0) {
        throw new NotFoundException(
          'No se encontraron inscripciones para los criterios proporcionados',
        );
      }

      // Crear workbook con nombre personalizado
      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet(
        `${inscripciones[0].comision.codigoComision || 'SIN_CODIGO'} ${dayjs(fechaInicio).format('DD-MM-YYYY')} al ${dayjs(fechaFin).format('DD-MM-YYYY')}`,
      );
      // Encontrar el máximo número de pagos
      const maxPagos = Math.max(...inscripciones.map((i) => i.pagos.length), 0);

      // Definir grupos de columnas
      const columnGroups = {
        inscripcion: [
          { header: 'Estado', key: 'estado', width: 15 },
          { header: 'Observación', key: 'observacion', width: 60 },
          { header: 'Total Acordado', key: 'totalAcordado', width: 15 },
          { header: 'Cuotas', key: 'cuotas', width: 10 },
          { header: 'Total Pagado', key: 'totalPagado', width: 25 },
          { header: 'Neto', key: 'neto', width: 15 },
          { header: 'Fecha de Inscripción', key: 'fecha', width: 20 },
        ],
        alumno: [
          { header: 'Nombre', key: 'alumnoNombre', width: 20 },
          { header: 'Apellido', key: 'alumnoApellido', width: 20 },
          { header: 'Teléfono', key: 'alumnoTelefono', width: 15 },
          { header: 'País', key: 'alumnoPais', width: 15 },
          { header: 'DNI', key: 'alumnoDni', width: 15 },
          { header: 'Email', key: 'alumnoEmail', width: 25 },
        ],
        vendedor: [
          { header: 'Nombre', key: 'vendedorNombre', width: 20 },
          { header: 'Apellido', key: 'vendedorApellido', width: 20 },
          { header: 'Teléfono', key: 'vendedorTelefono', width: 15 },
          { header: 'País', key: 'vendedorPais', width: 15 },
          { header: 'DNI', key: 'vendedorDni', width: 15 },
          { header: 'Email', key: 'vendedorEmail', width: 25 },
        ],
      };

      // Generar columnas de pagos dinámicamente
      const pagoColumns = Array.from({ length: maxPagos }, (_, index) => ({
        header: `Pago ${index + 1}`,
        columns: [
          { header: 'Fecha de Pago', key: `pago${index + 1}Fecha`, width: 15 },
          { header: 'Monto', key: `pago${index + 1}Monto`, width: 15 },
          { header: 'Método', key: `pago${index + 1}Metodo`, width: 15 },
          { header: 'Forma', key: `pago${index + 1}Forma`, width: 15 },
          { header: 'Cuenta Propia', key: `pago${index + 1}Cuenta`, width: 15 },
          {
            header: 'Comentario',
            key: `pago${index + 1}Comentario`,
            width: 25,
          },
        ],
      }));

      // Combinar todas las columnas
      worksheet.columns = [
        ...columnGroups.inscripcion,
        ...columnGroups.alumno,
        ...columnGroups.vendedor,
        ...pagoColumns.flatMap((pago) => pago.columns),
      ];

      // Calcular posiciones para las fusiones de celdas
      let currentColumn = 1;

      // Crear directamente la primera fila con los grupos (fila 1)
      const groupRow = worksheet.getRow(1);

      // Inscripción
      worksheet.mergeCells(
        1,
        currentColumn,
        1,
        columnGroups.inscripcion.length,
      );
      groupRow.getCell(currentColumn).value = 'Inscripción';
      currentColumn += columnGroups.inscripcion.length;

      // Alumno
      worksheet.mergeCells(
        1,
        currentColumn,
        1,
        currentColumn + columnGroups.alumno.length - 1,
      );
      groupRow.getCell(currentColumn).value = 'Alumno';
      currentColumn += columnGroups.alumno.length;

      // Vendedor
      worksheet.mergeCells(
        1,
        currentColumn,
        1,
        currentColumn + columnGroups.vendedor.length - 1,
      );
      groupRow.getCell(currentColumn).value = 'Vendedor';
      currentColumn += columnGroups.vendedor.length;

      // Pagos individuales
      pagoColumns.forEach((pago) => {
        worksheet.mergeCells(
          1,
          currentColumn,
          1,
          currentColumn + pago.columns.length - 1,
        );
        groupRow.getCell(currentColumn).value = pago.header;
        currentColumn += pago.columns.length;
      });

      // Aplicar estilos a la primera fila (grupos)
      groupRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.styles.colors.headerGroup },
        };
        cell.font = { bold: true, size: 13 };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cell.border = {
          top: { style: 'thin', color: { argb: this.styles.colors.border } },
          left: { style: 'thin', color: { argb: this.styles.colors.border } },
          bottom: { style: 'thin', color: { argb: this.styles.colors.border } },
          right: { style: 'thin', color: { argb: this.styles.colors.border } },
        };
      });

      // Añadir headers de columnas (fila 2)
      const headerRow = worksheet.addRow(
        worksheet.columns.map((col) => col.header),
      );

      // Aplicar estilos a la segunda fila (headers)
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: this.styles.colors.columnNames },
        };
        cell.font = { bold: true, size: 11 };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cell.border = {
          top: { style: 'thin', color: { argb: this.styles.colors.border } },
          left: { style: 'thin', color: { argb: this.styles.colors.border } },
          bottom: { style: 'thin', color: { argb: this.styles.colors.border } },
          right: { style: 'thin', color: { argb: this.styles.colors.border } },
        };
      });

      // Ajustar altura de las filas de encabezado
      worksheet.getRow(1).height = 25;
      worksheet.getRow(2).height = 20;

      // Agregar filas de datos
      inscripciones.forEach((inscripcion) => {
        try {
          const baseRowData = {
            // Datos de Inscripción
            estado: inscripcion.estado,
            observacion: inscripcion.observaciones || '',
            totalAcordado: inscripcion.totalAcordado || '',
            cuotas: inscripcion.cantidadCuotas || '',
            totalPagado:
              this.calculateTotalPaymentsByCurrency(inscripcion.pagos) || '',
            neto: '',
            fecha: this.formatDate(inscripcion.createdAt),

            // Datos de Alumno
            alumnoNombre: inscripcion.alumno.usuario.nombre || '',
            alumnoApellido: inscripcion.alumno.usuario.apellido || '',
            alumnoTelefono: inscripcion.alumno.usuario.telefono || '',
            alumnoPais: inscripcion.alumno.usuario.pais || '',
            alumnoDni: inscripcion.alumno.usuario.dni || '',
            alumnoEmail: inscripcion.alumno.usuario.email || '',

            // Datos de Vendedor
            vendedorNombre: inscripcion.vendedor?.usuario.nombre || '',
            vendedorApellido: inscripcion.vendedor?.usuario.apellido || '',
            vendedorTelefono: inscripcion.vendedor?.usuario.telefono || '',
            vendedorPais: inscripcion.vendedor?.usuario.pais || '',
            vendedorDni: inscripcion.vendedor?.usuario.dni || '',
            vendedorEmail: inscripcion.vendedor?.usuario.email || '',
          };

          // Agregar datos de pagos dinámicamente
          const pagoData = {};
          for (let i = 0; i < maxPagos; i++) {
            const pago = inscripcion.pagos[i];
            if (pago) {
              try {
                pagoData[`pago${i + 1}Fecha`] = this.formatDate(pago.fechaPago);
                pagoData[`pago${i + 1}Monto`] = this.formatCurrencyAmount(
                  pago.moneda,
                  pago.monto || '0',
                );
                pagoData[`pago${i + 1}Metodo`] = pago.metodoPago || '';
                pagoData[`pago${i + 1}Forma`] = pago.tipoPago || '';
                pagoData[`pago${i + 1}Cuenta`] = pago.cuentaPropia
                  ? 'Sí'
                  : 'No';
                pagoData[`pago${i + 1}Comentario`] = pago.observaciones || '';
              } catch (error) {
                console.error(`Error procesando pago ${i + 1}:`, error);
                pagoData[`pago${i + 1}Fecha`] = 'Error';
                pagoData[`pago${i + 1}Monto`] = 'Error';
                pagoData[`pago${i + 1}Metodo`] = 'Error';
                pagoData[`pago${i + 1}Forma`] = 'Error';
                pagoData[`pago${i + 1}Cuenta`] = 'Error';
                pagoData[`pago${i + 1}Comentario`] = 'Error procesando pago';
              }
            } else {
              pagoData[`pago${i + 1}Fecha`] = '';
              pagoData[`pago${i + 1}Monto`] = '';
              pagoData[`pago${i + 1}Metodo`] = '';
              pagoData[`pago${i + 1}Forma`] = '';
              pagoData[`pago${i + 1}Cuenta`] = '';
              pagoData[`pago${i + 1}Comentario`] = '';
            }
          }

          const rowData = { ...baseRowData, ...pagoData };
          const dataRow = worksheet.addRow(rowData);

          // Aplicar estilos a la fila
          dataRow.eachCell({ includeEmpty: true }, (cell, colNumber) => {
            // Calcular hasta qué columna debemos aplicar el color
            const columnasPrincipales =
              columnGroups.inscripcion.length +
              columnGroups.alumno.length +
              columnGroups.vendedor.length;

            const columnasPorPago = 6; // Número de columnas por cada pago
            const numeroPagos = inscripcion.pagos.length;
            const ultimaColumnaConColor =
              columnasPrincipales + numeroPagos * columnasPorPago;

            // Aplicar el color de fondo solo hasta la última columna que corresponde
            if (colNumber <= ultimaColumnaConColor) {
              const estadoColor = this.styles.colors.states[inscripcion.estado];
              if (estadoColor) {
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: estadoColor },
                };
              }
            }

            // El resto de los estilos se aplican a todas las celdas
            cell.alignment = {
              vertical: 'middle',
              horizontal: 'left',
              wrapText: false,
            };

            cell.border = {
              top: {
                style: 'thin',
                color: { argb: this.styles.colors.border },
              },
              left: {
                style: 'thin',
                color: { argb: this.styles.colors.border },
              },
              bottom: {
                style: 'thin',
                color: { argb: this.styles.colors.border },
              },
              right: {
                style: 'thin',
                color: { argb: this.styles.colors.border },
              },
            };
          });
        } catch (error) {
          console.error('Error procesando inscripción:', error);
          // Agregar fila con datos básicos y error en las demás columnas
          const errorRow = {
            estado: inscripcion.estado || 'Error',
            observacion: 'Error procesando inscripción',
            // ... resto de campos con 'Error' ...
          };
          worksheet.addRow(errorRow);
        }
      });

      // Fijar las dos primeras filas
      worksheet.views = [
        {
          state: 'frozen',
          xSplit: 0,
          ySplit: 2,
          topLeftCell: 'A3',
          activeCell: 'A3',
        },
      ];

      const buffer = await workbook.xlsx.writeBuffer();
      // Generar nombre del archivo
      const fileName = `${inscripciones[0].comision.codigoComision || 'SIN_CODIGO'} ${dayjs(fechaInicio).format('DD-MM-YYYY')} al ${dayjs(fechaFin).format('DD-MM-YYYY')}.xlsx`;

      // Retornar tanto el buffer como el nombre del archivo
      return {
        buffer: buffer as Buffer,
        fileName,
      };
    } catch (error) {
      console.error('Error al generar el Excel:', error);
      throw new InternalServerErrorException('No se pudo generar el Excel');
    }
  }
}
