import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Prisma, Comision } from '@prisma/client';
import { FindCommissionDto } from './dto/find-commission.dto';
import dayjs from 'dayjs';
import { CommissionWithEnrollmentDataDto } from './dto/CommissionWithEnrollmentDataDto';
import { FindCommissionWithEnrollmentsDto } from './dto/FindCommissionWithEnrollmentsDto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Role } from 'src/common/enums/enums';

type CommissionWithStatus = Partial<Comision> & { estado: string };

@Injectable()
export class CommissionsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCommissionDto: CreateCommissionDto,
  ): Promise<CommissionWithStatus> {
    const {
      horarios,
      profesores,
      vendedores,
      codigoComision,
      links,
      ...comisionData
    } = createCommissionDto;
    // console.log('createCommissionDto service', createCommissionDto);
    try {
      let generatedCodigoComision = codigoComision;

      if (!generatedCodigoComision) {
        // Obtener la información del curso asociado
        const curso = await this.prisma.curso.findUnique({
          where: { id: comisionData.cursoId },
          select: { codigo: true },
        });

        if (!curso) {
          throw new Error('Curso no encontrado');
        }

        // Generar la fecha actual en formato `dd-mm-yyyy` usando dayjs
        const formattedDate = dayjs().format('DD/MM/YYYY');

        // Combinar el código del curso con la fecha para formar el `codigoComision`
        generatedCodigoComision = `${curso.codigo}-${formattedDate}`;
      }

      const profesorRecords = await this.prisma.profesor.findMany({
        where: { usuarioId: { in: profesores || [] } },
        select: { id: true },
      });

      const vendedorRecords = await this.prisma.vendedor.findMany({
        where: { usuarioId: { in: vendedores || [] } },
        select: { id: true },
      });

      const createdCommission = await this.prisma.comision.create({
        data: {
          ...comisionData,
          codigoComision: generatedCodigoComision,

          horarios: horarios?.length
            ? {
                create: horarios.map((horario) => ({
                  day: horario.day,
                  startTime: horario.startTime,
                  endTime: horario.endTime,
                })),
              }
            : undefined,
          profesores: {
            create: profesorRecords.map((profesor) => ({
              profesor: { connect: { id: profesor.id } },
            })),
          },
          vendedores: {
            create: vendedorRecords.map((vendedor) => ({
              vendedor: { connect: { id: vendedor.id } },
            })),
          },
          links: links?.length
            ? {
                create: links.map((link) => ({
                  titulo: link.titulo,
                  url: link.url,
                })),
              }
            : undefined,
        },
        select: this.selectCommissionFields(),
      });
      return this.formatCommissionResponse({
        ...createdCommission,
        estado: this.calculateCommissionStatus(
          createdCommission.fechaInicio,
          createdCommission.fechaFin,
        ),
      });
    } catch (error) {
      console.log(error);
      this.handleDatabaseError(error);
    }
  }

  async findAll(query: FindCommissionDto): Promise<{
    items: CommissionWithStatus[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const { limit = 20, page = 1, courseId } = query;
    const skip = (page - 1) * limit;

    try {
      // Construir la condición where
      const where: Prisma.ComisionWhereInput = {
        ...(courseId && { cursoId: courseId }),
      };

      // Ejecutar las consultas en paralelo para mejor rendimiento
      const [commissions, totalItems] = await this.prisma.$transaction([
        this.prisma.comision.findMany({
          where,
          select: this.selectCommissionFields(),
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.comision.count({ where }),
      ]);

      // Procesar los resultados
      const formattedCommissions = commissions.map((commission) =>
        this.formatCommissionResponse({
          ...commission,
          estado: this.calculateCommissionStatus(
            commission.fechaInicio,
            commission.fechaFin,
          ),
        }),
      );

      // Retornar objeto con datos de paginación
      return {
        items: formattedCommissions,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
        hasPreviousPage: skip > 0,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // MÉTODO MODIFICADO SEGÚN TUS REQUERIMIENTOS
  async findAllWithEnrollments(
    query: FindCommissionWithEnrollmentsDto,
    user: UserInterface,
  ): Promise<{
    items: (CommissionWithEnrollmentDataDto & { linkReferido?: string })[];
    totalItems: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }> {
    const { page, limit, courseId, search, fechaInicio, fechaFin, status } =
      query;
    const take = limit || 20;
    const skip = page && limit ? (page - 1) * limit : 0;
    const today = dayjs().startOf('day').toISOString(); // Fecha actual al inicio del día

    const andConditions: Prisma.ComisionWhereInput[] = [];

    if (courseId) {
      andConditions.push({ cursoId: courseId });
    }

    if (search) {
      andConditions.push({
        OR: [
          { codigoComision: { contains: search, mode: 'insensitive' } },
          { curso: { nombre: { contains: search, mode: 'insensitive' } } },
        ],
      });
    }

    if (status) {
      if (status === 'Próxima') {
        andConditions.push({ fechaInicio: { gt: today } });
      } else if (status === 'En curso') {
        andConditions.push({ fechaInicio: { lte: today } });
        andConditions.push({ fechaFin: { gte: today } });
      } else if (status === 'Finalizada') {
        andConditions.push({ fechaFin: { lt: today } });
      }
    } else {
      if (fechaInicio) {
        andConditions.push({
          fechaInicio: { gte: dayjs(fechaInicio).toISOString() },
        });
      }
      if (fechaFin) {
        andConditions.push({
          fechaFin: { lte: dayjs(fechaFin).toISOString() },
        });
      }
    }

    const vendedorIdUsuario = await this.getVendedorIdIfApplicable(user);

    if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
      if (vendedorIdUsuario) {
        andConditions.push({
          vendedores: {
            some: { vendedorId: vendedorIdUsuario },
          },
        });
      } else {
        andConditions.push({ id: { equals: 'NO_RESULTS' } });
      }
    }

    const where: Prisma.ComisionWhereInput = {};
    if (andConditions.length > 0) {
      where.AND = andConditions;
    }

    // Para depuración: imprimir las condiciones 'where'
    // console.log('Condiciones de búsqueda:', JSON.stringify(where, null, 2));

    try {
      // Realizar la consulta con el conteo total de elementos
      const [commissions, totalItems] = await this.prisma.$transaction([
        this.prisma.comision.findMany({
          where,
          skip,
          take,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            codigoComision: true,
            fechaInicio: true,
            fechaFin: true,
            inscripciones: {
              select: {
                estado: true,
              },
            },
            curso: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
            formulario: {
              select: {
                id: true,
                title: true,
                nombre: true,
              },
            },
            vendedores: {
              where: vendedorIdUsuario
                ? { vendedorId: vendedorIdUsuario }
                : undefined,
              select: {
                linkReferido: true,
              },
            },
          },
        }),
        this.prisma.comision.count({ where }),
      ]);

      // Mapear resultados incluyendo el linkReferido
      const processedCommissions = commissions.map(
        ({ inscripciones, vendedores, ...commission }) => {
          const totalInscripciones = inscripciones.length;
          const cantidadInscritos = inscripciones.filter(
            (i) => i.estado === 'Parcial' || i.estado === 'Completo',
          ).length;
          const cantidadPreinscritos = totalInscripciones - cantidadInscritos;

          const estado = this.calculateCommissionStatus(
            commission.fechaInicio,
            commission.fechaFin,
          );

          // Obtener el linkReferido si existe
          const linkReferido =
            vendedores.length > 0 ? vendedores[0].linkReferido : undefined;

          return {
            ...commission,
            totalInscripciones,
            cantidadPreinscritos,
            cantidadInscritos,
            estado,
            linkReferido, // Añadir el linkReferido a la respuesta
          };
        },
      );

      return {
        items: processedCommissions,
        totalItems,
        currentPage: page || 1,
        totalPages: Math.ceil(totalItems / take),
        hasNextPage: skip + take < totalItems,
        hasPreviousPage: skip > 0,
      };
    } catch (error) {
      this.handleDatabaseError(error);
    }
  }

  // Método para obtener el ID de vendedor si el usuario tiene el rol de vendedor o profesorvendedor
  private async getVendedorIdIfApplicable(
    user: UserInterface,
  ): Promise<string | null> {
    if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
      const vendedor = await this.prisma.vendedor.findUnique({
        where: { usuarioId: user.id },
        select: { id: true },
      });
      return vendedor?.id || null;
    }
    return null; // Si el usuario no es vendedor ni profesorvendedor, no necesita un ID de vendedor
  }

  async findOne(id: string): Promise<CommissionWithStatus> {
    const comision = await this.prisma.comision.findUnique({
      where: { id },
      select: this.selectCommissionFields(),
    });

    if (!comision) {
      throw new NotFoundException(`Comisión con ID ${id} no encontrada.`);
    }

    return this.formatCommissionResponse({
      ...comision,
      estado: this.calculateCommissionStatus(
        comision.fechaInicio,
        comision.fechaFin,
      ),
    });
  }

  async update(
    id: string,
    updateComisionDto: UpdateCommissionDto,
  ): Promise<CommissionWithStatus> {
    const { horarios, profesores, vendedores, links, ...comisionData } =
      updateComisionDto;

    const updateData: Prisma.ComisionUpdateInput = {
      ...comisionData,
    };
    // console.log('data pre', updateComisionDto);

    // Manejo de los horarios
    if (horarios !== undefined) {
      if (horarios.length === 0) {
        // console.log('Eliminando todos los horarios existentes');
        updateData.horarios = {
          deleteMany: {},
        };
      } else {
        // console.log('Actualizando horarios con nuevos datos');
        updateData.horarios = {
          deleteMany: {},
          create: horarios.map((horario) => ({
            day: horario.day,
            startTime: horario.startTime,
            endTime: horario.endTime,
          })),
        };
      }
    }

    // Manejo de los profesores
    if (profesores !== undefined) {
      const profesorRecords = await this.prisma.profesor.findMany({
        where: { usuarioId: { in: profesores } },
        select: { id: true },
      });
      updateData.profesores = {
        deleteMany: {},
        create: profesorRecords.map((profesor) => ({
          profesor: { connect: { id: profesor.id } },
        })),
      };
    }

    // Manejo de los vendedores
    if (vendedores !== undefined) {
      const vendedorRecords = await this.prisma.vendedor.findMany({
        where: { usuarioId: { in: vendedores } },
        select: { id: true },
      });
      updateData.vendedores = {
        deleteMany: {},
        create: vendedorRecords.map((vendedor) => ({
          vendedor: { connect: { id: vendedor.id } },
        })),
      };
    }

    // Manejo de los links
    if (links !== undefined) {
      updateData.links = {
        deleteMany: {},
        create: links.map((link) => ({
          titulo: link.titulo,
          url: link.url,
        })),
      };
    }

    try {
      const updatedCommission = await this.prisma.comision.update({
        where: { id },
        data: updateData,
        select: this.selectCommissionFields(),
      });
      // console.log('data post', updatedCommission);
      return this.formatCommissionResponse({
        ...updatedCommission,
        estado: this.calculateCommissionStatus(
          updatedCommission.fechaInicio,
          updatedCommission.fechaFin,
        ),
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Error de Prisma conocido:', error.code, error.message);
      } else if (error instanceof Prisma.PrismaClientValidationError) {
        console.error(
          'Error de validación en la consulta de Prisma:',
          error.message,
        );
      } else if (error instanceof Prisma.PrismaClientUnknownRequestError) {
        console.error('Error desconocido de Prisma:', error.message);
      } else {
        console.error('Error inesperado:', error);
      }
      throw new Error(
        `Error al actualizar la Comisión con ID ${id}: ${error.message}`,
      );
    }
  }

  async deleteCommission(
    commissionID: string,
    permanent = false,
  ): Promise<Comision> {
    try {
      if (permanent) {
        return await this.prisma.comision.delete({
          where: { id: commissionID },
        });
      } else {
        return await this.prisma.comision.update({
          where: { id: commissionID },
          data: { isActive: false },
        });
      }
    } catch (error) {
      this.handleDatabaseError(
        error,
        `Comisión con ID ${commissionID} no encontrada.`,
      );
    }
  }

  // Método para encontrar comisión y formulario por linkReferido
  async findByLinkReferido(linkReferido: string) {
    try {
      const reference = await this.prisma.asignacionVendedor.findUnique({
        where: { linkReferido },
        include: {
          comision: {
            include: {
              curso: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                  modalidad: true,
                  descripcion: true,
                },
              },
              formulario: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      if (!reference) {
        throw new NotFoundException(
          'No se encontró un vendedor con el link proporcionado.',
        );
      }

      if (!reference.comision) {
        throw new NotFoundException('La comisión no se encontró.');
      }

      if (!reference.comision.formulario) {
        throw new NotFoundException(
          'El formulario asociado a esta comisión no se encontró.',
        );
      }

      return reference;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        throw new InternalServerErrorException(
          'Error inesperado al buscar la comisión y el formulario asociados al link de referido.',
          error,
        );
      }
    }
  }

  // Método para calcular el estado de la comisión en base a las fechas
  private calculateCommissionStatus(
    fechaInicio: string | Date,
    fechaFin: string | Date,
  ): string {
    const start = dayjs(fechaInicio);
    const end = dayjs(fechaFin);

    if (!start.isValid() || !end.isValid()) {
      return 'Fecha inválida';
    }

    const today = dayjs();

    if (today.isBefore(start)) {
      return 'Próxima';
    } else if (today.isAfter(end)) {
      return 'Finalizada';
    } else {
      return 'En curso';
    }
  }

  // Función para incluir las relaciones necesarias
  private includeCommissionRelations() {
    return {
      curso: {
        select: {
          id: true,
          nombre: true,
          codigo: true,
        },
      },
      horarios: {
        select: {
          day: true,
          startTime: true,
          endTime: true,
        },
      },
      profesores: {
        include: {
          profesor: {
            select: {
              usuario: {
                select: {
                  nombre: true,
                  apellido: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    };
  }

  // Manejo centralizado de errores
  private handleDatabaseError(error: any, notFoundMessage?: string): never {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFoundException(
          notFoundMessage || 'Recurso no encontrado.',
        );
      }
      if (error.code === 'P2002') {
        throw new InternalServerErrorException(
          'Conflicto con los datos proporcionados (violación de unicidad).',
        );
      }
    }
    throw new InternalServerErrorException(
      'Ocurrió un error inesperado en la base de datos.',
    );
  }

  private selectCommissionFields() {
    return {
      id: true,
      codigoComision: true,
      fechaInicio: true,
      fechaFin: true,
      clases: true,
      modalidad: true,
      pais: true,
      provincia: true,
      ubicacion: true,
      cupo: true,
      classroomLinks: true,
      whatsappLinks: true,
      infoLinks: true,
      isActive: true,
      cargaHoraria: true,
      curso: {
        select: {
          id: true,
          nombre: true,
          codigo: true,
        },
      },
      horarios: {
        select: {
          day: true,
          startTime: true,
          endTime: true,
        },
      },
      profesores: {
        select: {
          profesor: {
            select: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  email: true,
                  dni: true,
                },
              },
            },
          },
        },
      },
      vendedores: {
        select: {
          vendedor: {
            select: {
              usuario: {
                select: {
                  id: true,
                  nombre: true,
                  apellido: true,
                  email: true,
                  dni: true,
                },
              },
            },
          },
        },
      },
      links: {
        select: {
          id: true,
          titulo: true,
          url: true,
        },
      },
    };
  }

  private formatCommissionResponse(commission: any) {
    return {
      ...commission,
      profesores: commission.profesores.map(({ profesor }) => ({
        id: profesor.usuario.id,
        nombre: profesor.usuario.nombre,
        apellido: profesor.usuario.apellido,
        email: profesor.usuario.email,
        dni: profesor.usuario.dni,
      })),
      vendedores: commission.vendedores.map(({ vendedor }) => ({
        id: vendedor.usuario.id,
        nombre: vendedor.usuario.nombre,
        apellido: vendedor.usuario.apellido,
        email: vendedor.usuario.email,
        dni: vendedor.usuario.dni,
      })),
    };
  }
}
