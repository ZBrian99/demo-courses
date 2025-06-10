import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { PermissionsService } from 'src/permissions/permissions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { FindCoursesDto } from './dto/find-course.dto';
import { Prisma } from '@prisma/client';
import { Role } from 'src/common/enums/enums';

@Injectable()
export class CoursesService {
  constructor(
    private prisma: PrismaService,
    private permissionsService: PermissionsService,
  ) {}

  async findAllCourses(query: FindCoursesDto, user: UserInterface) {
    const { limit = 20, page = 1, status = 'active' } = query;
    const skip = (page - 1) * limit;

    try {
      const whereCondition = this.createWhereCondition(user, undefined, status);

      // Ejecutar las consultas en paralelo para mejor rendimiento
      const [courses, totalItems] = await this.prisma.$transaction([
        this.prisma.curso.findMany({
          where: whereCondition,
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            cursosRequeridos: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
            comisiones: {
              select: {
                id: true,
              },
            },
          },
        }),
        this.prisma.curso.count({ where: whereCondition }),
      ]);

      if (courses.length === 0) {
        throw new NotFoundException(
          'No se encontraron cursos con los criterios especificados.',
        );
      }

      return {
        items: courses,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
        hasPreviousPage: skip > 0,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener los cursos');
    }
  }

  async findCourseById(courseId: string, user: UserInterface) {
    // const select = this.permissionsService.getViewableFields(
    //   user.rol,
    //   'Course',
    // );

    const whereCondition = this.createWhereCondition(
      user,
      courseId,
      user.rol === 'ADMIN' ? 'both' : 'active',
    );

    const course = await this.prisma.curso.findUnique({
      where: whereCondition,
      // select,
      include: {
        cursosRequeridos: {
          select: {
            id: true,
            nombre: true,
            codigo: true,
          },
        },
      },
    });
    if (!course) {
      throw new NotFoundException(`Curso con ID ${courseId} no encontrado`);
    }

    return course;
  }

  async createCourse(createCourseDto: CreateCourseDto) {
    const { cursosRequeridos, ...cursoData } = createCourseDto;

    return await this.prisma.curso.create({
      data: {
        ...cursoData,
        cursosRequeridos: cursosRequeridos
          ? {
              connect: cursosRequeridos.map((id) => ({ id })),
            }
          : undefined,
      },
    });
  }

  async updateCourse(
    courseId: string,
    user: UserInterface,
    updateCourseDto: UpdateCourseDto,
  ) {
    // const filteredData = this.permissionsService.validateEditableFields(
    //   user.rol,
    //   'Course',
    //   data,
    // );
    // const whereCondition = this.createWhereCondition(user, courseId);
    const { cursosRequeridos, ...cursoData } = updateCourseDto;
    try {
      const course = await this.prisma.curso.update({
        where: { id: courseId },
        data: {
          ...cursoData,
          cursosRequeridos: {
            set: [],
            ...(cursosRequeridos
              ? {
                  connect: cursosRequeridos.map((id) => ({ id })),
                }
              : {}),
          },
        },
        include: {
          cursosRequeridos: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
      });

      return course;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Curso con ID ${courseId} no encontrado`);
        }
      }
      throw new BadRequestException('Error al actualizar el curso');
    }
  }

  async deleteCourse(courseId: string, permanent = false) {
    try {
      if (permanent) {
        return await this.prisma.curso.delete({ where: { id: courseId } });
      } else {
        return await this.prisma.curso.update({
          where: { id: courseId },
          data: { isActive: false },
        });
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`Curso con ID ${courseId} no encontrado.`);
      }
      throw new InternalServerErrorException(
        'Ocurrió un error inesperado al intentar eliminar el curso.',
      );
    }
  }

  private createWhereCondition(
    user: UserInterface,
    courseId?: string,
    status: string = 'active',
  ) {
    const whereCondition: any = {};

    if (courseId) {
      whereCondition.id = courseId;
    }

    if (user.rol === Role.ADMIN) {
      if (status === 'active') {
        whereCondition.isActive = true;
      } else if (status === 'inactive') {
        whereCondition.isActive = false;
      }
    } else {
      whereCondition.isActive = true;

      //   if (user.rol === Role.PROFESOR) {
      //     whereCondition.AsignacionProfesor = {
      //       some: { profesorId: user.id },
      //     };
      //   } else if (user.rol === Role.VENDEDOR) {
      //     whereCondition.AsignacionVendedor = {
      //       some: { vendedorId: user.id },
      //     };
      //   }
    }

    return whereCondition;
  }
}
