import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { PermissionsService } from 'src/permissions/permissions.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { FindUsersDto } from './dto/find-users.dto';
import { Role } from 'src/common/enums/enums';
import dayjs from 'dayjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private permissionsService: PermissionsService,
  ) {}

  async findMyProfile(user: UserInterface) {
    // const select = this.permissionsService.getViewableFields(
    //   user.rol,
    //   'Profile',
    // );

    // return await this.prisma.usuario.findUnique({
    //   where: { id: user.id },
    //   select,
    // });
    const profileData = await this.prisma.usuario.findUnique({
      where: { id: user.id },
      // select: {
      //   ...select,
      // },
    });

    if (!profileData) {
      throw new NotFoundException('Perfil no encontrado.');
    }

    return profileData;
  }

  async updateMyProfile(user: UserInterface, data: UpdateUserDto) {
    const filteredData = this.permissionsService.validateEditableFields(
      user.rol,
      'Profile',
      data,
    );
    try {
      if (data.password) {
        data.password = await bcrypt.hash(data.password, 10);
      }

      const updatedUser = await this.prisma.usuario.update({
        where: { id: user.id },
        data: filteredData,
      });

      return updatedUser;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El email ya está registrado.');
      }
      throw new InternalServerErrorException('Error al actualizar el usuario.');
    }
  }

  private async checkUserAccessToStudent(
    vendedorId: string,
    alumnoId: string,
  ): Promise<boolean> {
    const inscripcion = await this.prisma.inscripcion.findFirst({
      where: {
        alumnoId: alumnoId,
        vendedorId: vendedorId,
      },
    });
    return !!inscripcion;
  }

  private async getVendedorIdFromUser(
    prisma: Prisma.TransactionClient,
    userId: string,
  ): Promise<string> {
    const vendedor = await prisma.vendedor.findUnique({
      where: { usuarioId: userId },
      select: { id: true },
    });

    if (!vendedor) {
      throw new ForbiddenException(
        'No se encontró el perfil de vendedor asociado',
      );
    }
    return vendedor.id;
  }

  private buildUserWhereClause(
    query: FindUsersDto,
    user: UserInterface,
    vendedorId?: string,
  ): Prisma.UsuarioWhereInput {
    const { rol, search } = query;
    let whereClause: Prisma.UsuarioWhereInput = {};

    // Filtro por rol
    if (rol) {
      if (
        (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) &&
        rol !== Role.ALUMNO
      ) {
        throw new ForbiddenException(
          'Solo puedes buscar usuarios con rol de ALUMNO',
        );
      }
      whereClause.rol = rol;
    }

    // Si es vendedor o profesorvendedor, solo puede ver alumnos relacionados
    if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
      whereClause = {
        ...whereClause,
        rol: Role.ALUMNO,
        alumno: {
          inscripciones: {
            some: {
              vendedorId: vendedorId,
              isActive: true,
            },
          },
        },
      };
    }

    // Búsqueda por términos mejorada
    if (search) {
      const searchTerms = search.trim().split(/\s+/);
      whereClause.AND = searchTerms.map((term) => ({
        OR: [
          { nombre: { contains: term, mode: Prisma.QueryMode.insensitive } },
          { apellido: { contains: term, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: term, mode: Prisma.QueryMode.insensitive } },
          { dni: { contains: term, mode: Prisma.QueryMode.insensitive } },
          { telefono: { contains: term, mode: Prisma.QueryMode.insensitive } },
        ],
      }));
    }

    return whereClause;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAllStaff(query: FindUsersDto & PaginationDto, user: UserInterface) {
    try {
      const { page = 1, limit = 20, status } = query;
      const skip = (page - 1) * limit;

      const whereClause: Prisma.UsuarioWhereInput = {
        NOT: { rol: { in: [Role.ALUMNO, Role.ADMIN] } },
        ...(status === 'active' && { isActive: true }),
        ...(status === 'inactive' && { isActive: false }),
      };

      // Búsqueda
      if (query.search) {
        const searchTerms = query.search.trim().split(/\s+/);
        whereClause.AND = searchTerms.map((term) => ({
          OR: [
            { nombre: { contains: term, mode: Prisma.QueryMode.insensitive } },
            {
              apellido: { contains: term, mode: Prisma.QueryMode.insensitive },
            },
            { email: { contains: term, mode: Prisma.QueryMode.insensitive } },
            { dni: { contains: term, mode: Prisma.QueryMode.insensitive } },
            {
              telefono: { contains: term, mode: Prisma.QueryMode.insensitive },
            },
          ],
        }));
      }

      // Filtro por rol específico modificado para incluir PROFESORVENDEDOR
      if (query.rol && query.rol !== Role.ALUMNO) {
        if (query.rol === Role.PROFESOR) {
          // Si busca profesores, incluye también profesoresvendedores
          whereClause.OR = [
            { rol: Role.PROFESOR },
            { rol: Role.PROFESORVENDEDOR },
          ];
        } else if (query.rol === Role.VENDEDOR) {
          // Si busca vendedores, incluye también profesoresvendedores
          whereClause.OR = [
            { rol: Role.VENDEDOR },
            { rol: Role.PROFESORVENDEDOR },
          ];
        } else {
          // Para otros roles (incluyendo PROFESORVENDEDOR), búsqueda normal
          whereClause.rol = query.rol;
        }
      }

      const [users, totalItems] = await Promise.all([
        this.prisma.usuario.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            dni: true,
            rol: true,
            telefono: true,
            pais: true,
            provincia: true,
            ciudad: true,
            isActive: true,
            createdAt: true,
          },
        }),
        this.prisma.usuario.count({ where: whereClause }),
      ]);

      return {
        items: users,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
        hasPreviousPage: skip > 0,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los usuarios');
    }
  }

  async findAllStudents(
    query: FindUsersDto & PaginationDto,
    user: UserInterface,
  ) {
    try {
      const { page = 1, limit = 20, status } = query;
      const skip = (page - 1) * limit;

      let vendedorId: string | null = null;
      if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
        vendedorId = await this.prisma.vendedor
          .findUnique({
            where: { usuarioId: user.id },
            select: { id: true },
          })
          .then((v) => v?.id);

        if (!vendedorId) {
          throw new ForbiddenException(
            'No se encontró el perfil de vendedor asociado',
          );
        }
      }

      const whereClause: Prisma.UsuarioWhereInput = {
        rol: Role.ALUMNO,
        ...(status === 'active' && { isActive: true }),
        ...(status === 'inactive' &&
          (user.rol === Role.ADMIN || user.rol === Role.FINANZAS) && {
            isActive: false,
          }),
        // Restricción para vendedores
        ...(vendedorId && {
          alumno: {
            inscripciones: {
              some: {
                vendedorId,
                isActive: true,
              },
            },
          },
        }),
      };

      // Búsqueda
      if (query.search) {
        const searchTerms = query.search.trim().split(/\s+/);
        whereClause.AND = searchTerms.map((term) => ({
          OR: [
            { nombre: { contains: term, mode: Prisma.QueryMode.insensitive } },
            {
              apellido: { contains: term, mode: Prisma.QueryMode.insensitive },
            },
            { email: { contains: term, mode: Prisma.QueryMode.insensitive } },
            { dni: { contains: term, mode: Prisma.QueryMode.insensitive } },
            {
              telefono: { contains: term, mode: Prisma.QueryMode.insensitive },
            },
          ],
        }));
      }

      const [users, totalItems] = await Promise.all([
        this.prisma.usuario.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: [{ isActive: 'desc' }, { createdAt: 'desc' }],
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            dni: true,
            rol: true,
            telefono: true,
            pais: true,
            provincia: true,
            ciudad: true,
            isActive: true,
            createdAt: true,
            ...(vendedorId && {
              alumno: {
                select: {
                  id: true,
                  inscripciones: {
                    where: { vendedorId, isActive: true },
                    select: {
                      id: true,
                      estado: true,
                      createdAt: true,
                      comision: {
                        select: {
                          id: true,
                          codigoComision: true,
                          curso: { select: { nombre: true } },
                        },
                      },
                    },
                  },
                },
              },
            }),
          },
        }),
        this.prisma.usuario.count({ where: whereClause }),
      ]);

      return {
        items: users,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
        hasPreviousPage: skip > 0,
      };
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los alumnos');
    }
  }

  async findUserById(userId: string, user: UserInterface) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const isVendedor =
          user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR;

        let vendedorId: string | null = null;
        if (isVendedor) {
          const vendedor = await prisma.vendedor.findUnique({
            where: { usuarioId: user.id },
            select: { id: true },
          });

          if (!vendedor) {
            throw new ForbiddenException(
              'No se encontró el perfil de vendedor asociado',
            );
          }
          vendedorId = vendedor.id;
        }

        const userData = await prisma.usuario.findUnique({
          where: { id: userId },
          include: {
            alumno: isVendedor
              ? {
                  include: {
                    inscripciones: {
                      where: {
                        vendedorId,
                        isActive: true,
                      },
                      include: {
                        comision: {
                          select: {
                            id: true,
                            codigoComision: true,
                            curso: {
                              select: {
                                id: true,
                                nombre: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                }
              : {
                  include: {
                    inscripciones: true,
                  },
                },
            profesor: !isVendedor,
            vendedor: !isVendedor,
            finanzas: !isVendedor,
            admin: !isVendedor,
          },
        });

        if (!userData) {
          throw new NotFoundException(`Usuario no encontrado`);
        }

        // Verificaciones de permisos para vendedores
        if (isVendedor) {
          if (userData.rol !== Role.ALUMNO) {
            throw new ForbiddenException(
              'Solo puedes ver información de alumnos',
            );
          }

          const tieneAcceso = userData.alumno?.inscripciones?.some(
            (insc) => insc.vendedorId === vendedorId && insc.isActive,
          );

          if (!tieneAcceso) {
            throw new ForbiddenException(
              'No tienes permisos para ver este alumno',
            );
          }
        }

        return userData;
      });

      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el usuario');
    }
  }

  // Crear usuario con la relación al rol
  async createUser(data: CreateUserDto) {
    try {
      if (data.password) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        data.password = hashedPassword;
      }

      const userData: Prisma.UsuarioCreateInput = {
        ...data,
        fechaNacimiento: data.fechaNacimiento
          ? dayjs(data.fechaNacimiento, 'YYYY-MM-DD').toDate()
          : null,
        alumno:
          data.rol === 'ALUMNO' || data.rol === 'ADMIN'
            ? { create: {} }
            : undefined,
        profesor:
          data.rol === 'PROFESOR' ||
          data.rol === 'ADMIN' ||
          data.rol === 'PROFESORVENDEDOR'
            ? { create: {} }
            : undefined,
        vendedor:
          data.rol === 'VENDEDOR' ||
          data.rol === 'ADMIN' ||
          data.rol === 'PROFESORVENDEDOR'
            ? { create: {} }
            : undefined,
        finanzas:
          data.rol === 'FINANZAS' || data.rol === 'ADMIN'
            ? { create: {} }
            : undefined,
        admin: data.rol === 'ADMIN' ? { create: {} } : undefined,
      };

      return await this.prisma.usuario.create({
        data: userData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('El email ya está registrado.');
      }
      throw error;
    }
  }

  async updateUser(id: string, data: UpdateUserDto, user: UserInterface) {
    try {
      return await this.prisma.$transaction(async (prisma) => {
        // Si es vendedor, verificamos permisos
        if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
          const vendedor = await prisma.vendedor.findUnique({
            where: { usuarioId: user.id },
            select: { id: true },
          });

          if (!vendedor) {
            throw new ForbiddenException(
              'No se encontró el perfil de vendedor asociado',
            );
          }

          const targetUser = await prisma.usuario.findUnique({
            where: { id },
            include: {
              alumno: {
                include: {
                  inscripciones: {
                    where: {
                      vendedorId: vendedor.id,
                      isActive: true,
                    },
                    select: { id: true },
                  },
                },
              },
            },
          });

          if (!targetUser) {
            throw new NotFoundException('Usuario no encontrado');
          }

          if (targetUser.rol !== Role.ALUMNO) {
            throw new ForbiddenException(
              'Solo puedes actualizar datos de alumnos',
            );
          }

          if (!targetUser.alumno?.inscripciones?.length) {
            throw new ForbiddenException(
              'No tienes permisos para actualizar este alumno',
            );
          }

          // Filtrar campos permitidos
          const allowedFields = [
            'nombre',
            'apellido',
            'telefono',
            'pais',
            'provincia',
            'ciudad',
          ];
          data = Object.keys(data).reduce((acc, key) => {
            if (allowedFields.includes(key)) {
              acc[key] = data[key];
            }
            return acc;
          }, {});
        }

        // Encriptar contraseña si es necesario
        if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
        }

        return await prisma.usuario.update({
          where: { id },
          data,
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true,
            rol: true,
            isActive: true,
            updatedAt: true,
          },
        });
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException('Usuario no encontrado');
        }
        if (error.code === 'P2002') {
          throw new ConflictException('El email ya está registrado');
        }
      }

      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }

  // Eliminar usuario de manera lógica o permanente
  async deleteUser(userId: string, permanent = false, user: UserInterface) {
    try {
      // Solo Admin puede eliminar permanentemente
      if (permanent && user.rol !== Role.ADMIN) {
        throw new ForbiddenException(
          'Solo administradores pueden eliminar permanentemente',
        );
      }

      // Verificar si el usuario existe y obtener su rol
      const targetUser = await this.prisma.usuario.findUnique({
        where: { id: userId },
        select: { rol: true },
      });

      if (!targetUser) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
      }

      // Verificar permisos según rol
      if (user.rol !== Role.ADMIN && user.rol !== Role.FINANZAS) {
        throw new ForbiddenException(
          'No tienes permisos para eliminar usuarios',
        );
      }

      if (permanent) {
        return await this.prisma.usuario.delete({ where: { id: userId } });
      } else {
        return await this.prisma.usuario.update({
          where: { id: userId },
          data: { isActive: false },
        });
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
      }
      throw new InternalServerErrorException('Error al eliminar el usuario.');
    }
  }

  async findUserAuth(userId: string) {
    const user = await this.prisma.usuario.findUnique({
      where: {
        id: userId,
      },
    });
    return user;
  }

  async findUserByEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: { email },
    });
  }

  async findUserByDni(tipoDni: string, dni: string) {
    const user = await this.prisma.usuario.findUnique({
      where: { tipoDni, dni },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    delete user.password;

    return user;
  }

  async findUserByActiveEmail(email: string) {
    return this.prisma.usuario.findUnique({
      where: {
        email,
        isActive: true,
      },
    });
  }

  private createWhereCondition(
    user: UserInterface,
    userId?: string,
    status: string = 'active',
  ) {
    const whereCondition: any = {};

    if (userId) {
      whereCondition.id = userId;
    }

    if (user.rol === Role.ADMIN) {
      if (status === 'active') {
        whereCondition.isActive = true;
      } else if (status === 'inactive') {
        whereCondition.isActive = false;
      }
    } else {
      whereCondition.isActive = true;

      // if (user.rol === Role.PROFESOR) {
      //   whereCondition.profesoresAsignados = {
      //     some: { profesorId: 'user.id' },
      //   };
      // } else if (user.rol === Role.VENDEDOR) {
      //   whereCondition.vendedoresAsignados = {
      //     some: { vendedorId: user.id },
      //   };
      // }
    }

    return whereCondition;
  }
}
