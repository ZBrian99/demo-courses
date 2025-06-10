import {
  BadRequestException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { SubmitFormularioDto } from './dto/create-form-response-dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { v4 as uuid } from 'uuid';
import { FindFormulariosDto } from './dto/find-formularios.dto';

@Injectable()
export class FormularioService {
  constructor(private prisma: PrismaService) {}

  // Crear formulario
  async create(dto: CreateFormularioDto, user: UserInterface) {
    try {
      return this.prisma.formulario.create({
        data: {
          title: dto.title,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          isActive: true,
          comision: dto.commissionId
            ? { connect: { id: dto.commissionId } }
            : undefined,
          stages: {
            create: dto.stages.map((stage) => ({
              title: stage.title,
              order: stage.order,
              questions: {
                create: stage.questions.map((question) => ({
                  text: question.text,
                  order: question.order,
                  type: question.type,
                  isRequired: question.isRequired,
                  options: {
                    create: question.options?.map((option) => ({
                      text: option.text,
                      order: option.order,
                      value: option.value,
                    })),
                  },
                })),
              },
            })),
          },
        },
        include: {
          comision: {
            select: {
              id: true,
              codigoComision: true,
              modalidad: true,
              curso: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
              vendedores: {
                select: {
                  linkReferido: true,
                },
                where: { vendedor: { usuarioId: user.id } },
              },
            },
          },
          stages: {
            orderBy: { order: 'asc' },
            include: {
              questions: {
                orderBy: { order: 'asc' },
                include: {
                  options: {
                    orderBy: { order: 'asc' },
                  },
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('El título ya existe. Prueba con otro.');
      }
      throw error;
    }
  }

  async findAll(query: FindFormulariosDto, user: UserInterface) {
    const { limit = 20, page = 1 } = query;
    const skip = (page - 1) * limit;

    try {
      // Ejecutar las consultas en paralelo para mejor rendimiento
      const [formularios, totalItems] = await this.prisma.$transaction([
        this.prisma.formulario.findMany({
          skip,
          take: limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            comision: {
              select: {
                id: true,
                codigoComision: true,
                modalidad: true,
                curso: {
                  select: {
                    id: true,
                    nombre: true,
                    codigo: true,
                  },
                },
                vendedores: {
                  select: {
                    linkReferido: true,
                  },
                  where: { vendedor: { usuarioId: user.id } },
                },
              },
            },
            stages: {
              orderBy: { order: 'asc' },
              include: {
                questions: {
                  orderBy: { order: 'asc' },
                  include: {
                    options: {
                      orderBy: { order: 'asc' },
                    },
                  },
                },
              },
            },
          },
        }),
        this.prisma.formulario.count(),
      ]);

      return {
        items: formularios,
        totalItems,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        hasNextPage: skip + limit < totalItems,
        hasPreviousPage: skip > 0,
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        'Error al obtener los formularios',
      );
    }
  }

  async findOne(id: string, user: UserInterface) {
    const formulario = await this.prisma.formulario.findUnique({
      where: { id },
      include: {
        comision: {
          select: {
            id: true,
            codigoComision: true,
            fechaInicio: true,
            modalidad: true,
            curso: {
              select: {
                id: true,
                nombre: true,
                codigo: true,
              },
            },
            vendedores: {
              select: {
                linkReferido: true,
              },
              where:
                user && user.id
                  ? { vendedor: { usuarioId: user.id } }
                  : undefined,
            },
          },
        },
        stages: {
          orderBy: { order: 'asc' },
          include: {
            questions: {
              orderBy: { order: 'asc' },
              include: {
                options: {
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!formulario) {
      throw new NotFoundException(`Formulario with ID ${id} not found`);
    }

    return formulario;
  }

  async update(id: string, dto: UpdateFormularioDto, user: UserInterface) {
    // const existingForm = await this.prisma.formulario.findUnique({
    //   where: { id },
    // });

    // if (!existingForm) {
    //   throw new NotFoundException(`Formulario with ID ${id} not found`);
    // }
    try {
      return this.prisma.formulario.update({
        where: { id },
        data: {
          title: dto.title,
          nombre: dto.nombre,
          descripcion: dto.descripcion,
          comision: dto.commissionId
            ? { connect: { id: dto.commissionId } }
            : { disconnect: true },

          stages: {
            deleteMany: {
              id: {
                notIn: dto.stages.map((stage) => stage.id),
              },
            },
            upsert: dto.stages.map((stage) => ({
              where: {
                id: stage.id || '',
              },
              update: {
                title: stage.title,
                order: stage.order,
                questions: {
                  deleteMany: {
                    id: {
                      notIn: stage.questions.map((q) => q.id),
                    },
                  },
                  upsert: stage.questions.map((question) => ({
                    where: {
                      id: question.id || '',
                    },
                    update: {
                      text: question.text,
                      type: question.type,
                      isRequired: question.isRequired,
                      order: question.order,
                      options: {
                        deleteMany: {
                          id: {
                            notIn: question.options?.map((opt) => opt.id),
                          },
                        },
                        upsert:
                          question.options?.map((option) => ({
                            where: {
                              id: option.id || '', // Crear si no hay ID
                            },
                            update: {
                              text: option.text,
                              value: option.value || '',
                              order: option.order,
                            },
                            create: {
                              text: option.text,
                              value: option.value || '',
                              order: option.order,
                            },
                          })) || [],
                      },
                    },
                    create: {
                      text: question.text,
                      type: question.type,
                      isRequired: question.isRequired,
                      order: question.order,
                      options: {
                        create:
                          question.options?.map((option) => ({
                            text: option.text,
                            value: option.value || '',
                            order: option.order,
                          })) || [],
                      },
                    },
                  })),
                },
              },
              create: {
                title: stage.title,
                order: stage.order,
                questions: {
                  create: stage.questions.map((question) => ({
                    text: question.text,
                    type: question.type,
                    isRequired: question.isRequired,
                    order: question.order,
                    options: {
                      create:
                        question.options?.map((option) => ({
                          text: option.text,
                          value: option.value || '',
                          order: option.order,
                        })) || [],
                    },
                  })),
                },
              },
            })),
          },
        },
        include: {
          comision: {
            // Incluir la comisión en la respuesta
            select: {
              id: true,
              codigoComision: true, // Devolver también el código de la comisión
              modalidad: true,
              curso: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
              vendedores: {
                select: {
                  linkReferido: true,
                },
                where: { vendedor: { usuarioId: user.id } },
              },
            },
          },
          stages: {
            include: {
              questions: {
                include: {
                  options: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`Formulario con ID ${id} no encontrado`);
      }

      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new BadRequestException('El título ya existe. Prueba con otro.');
      }

      throw error;
    }
  }

  async delete(id: string, permanent = false) {
    const existingForm = await this.prisma.formulario.findUnique({
      where: { id },
    });

    if (!existingForm) {
      throw new NotFoundException(`Formulario with ID ${id} not found`);
    }

    if (permanent) {
      return this.prisma.formulario.delete({
        where: { id },
      });
    } else {
      return this.prisma.formulario.update({
        where: { id },
        data: { isActive: false },
      });
    }
  }

  private async validarAlumnoEInscripcion(
    alumnoId: string,
    comisionId: string,
  ) {
    // Buscar el alumno y sus inscripciones en una sola consulta
    const alumnoConInscripcion = await this.prisma.alumno.findUnique({
      where: { usuarioId: alumnoId },
      select: {
        id: true,
        inscripciones: {
          where: {
            comisionId: comisionId,
            isActive: true,
          },
        },
      },
    });

    if (!alumnoConInscripcion) {
      throw new NotFoundException(
        `No se encontró un alumno asociado al usuario ID ${alumnoId}`,
      );
    }

    if (alumnoConInscripcion.inscripciones.length > 0) {
      throw new BadRequestException(
        'El alumno ya está inscrito en esta comisión',
      );
    }

    return alumnoConInscripcion;
  }

  async submitRespuestas(linkReferido: string, dto: SubmitFormularioDto) {
    // Buscar la asignación del vendedor y validar
    const asignacionVendedor = await this.prisma.asignacionVendedor.findUnique({
      where: { linkReferido },
      include: { comision: true, vendedor: true },
    });

    if (!asignacionVendedor) {
      throw new NotFoundException(`Link de referido no válido`);
    }

    // Validar alumno e inscripción
    const alumno = await this.validarAlumnoEInscripcion(
      dto.alumnoId,
      asignacionVendedor.comisionId,
    );

    // Crear la inscripción
    const inscripcion = await this.prisma.inscripcion.create({
      data: {
        alumnoId: alumno.id,
        comisionId: asignacionVendedor.comisionId,
        vendedorId: asignacionVendedor.vendedorId,
      },
    });

    // Procesar las respuestas
    const respuestasPromises = dto.respuestas.map(async (respuesta) => {
      const pregunta = await this.prisma.pregunta.findUnique({
        where: { id: respuesta.preguntaId },
        select: { type: true, isRequired: true },
      });

      if (!pregunta) {
        throw new BadRequestException(
          `Pregunta con ID ${respuesta.preguntaId} no encontrada`,
        );
      }

      switch (pregunta.type) {
        case 'TEXTO_CORTO':
        case 'TEXTO_LARGO':
          if (pregunta.isRequired && !respuesta.textValue) {
            throw new BadRequestException(
              `La respuesta de tipo ${pregunta.type} es requerida.`,
            );
          }
          return this.prisma.respuesta.create({
            data: {
              questionId: respuesta.preguntaId,
              inscriptionId: inscripcion.id,
              textValue: respuesta.textValue || null,
              type: pregunta.type,
            },
          });

        case 'FECHA':
          if (pregunta.isRequired && !respuesta.textValue) {
            throw new BadRequestException('La fecha es requerida.');
          }
          // Validar que el texto sea una fecha válida
          if (respuesta.textValue && !this.isValidDate(respuesta.textValue)) {
            throw new BadRequestException('El formato de fecha no es válido.');
          }
          return this.prisma.respuesta.create({
            data: {
              questionId: respuesta.preguntaId,
              inscriptionId: inscripcion.id,
              textValue: respuesta.textValue || null,
              type: pregunta.type,
            },
          });

        case 'SELECCION':
        case 'DESPLEGABLE':
          if (
            pregunta.isRequired &&
            (!respuesta.opciones || respuesta.opciones.length !== 1)
          ) {
            throw new BadRequestException(
              `Debe seleccionar exactamente una opción para la pregunta de tipo ${pregunta.type}.`,
            );
          }

          if (!respuesta.opciones || respuesta.opciones.length === 0) {
            // Guardar la respuesta vacía si no es obligatoria
            return this.prisma.respuesta.create({
              data: {
                questionId: respuesta.preguntaId,
                inscriptionId: inscripcion.id,
                type: pregunta.type,
                opciones: {
                  create: [], // Respuesta vacía
                },
              },
            });
          }

          const opcionIds = respuesta.opciones.map((opcion) => opcion.opcionId);
          const opcionesValidas = await this.prisma.opcion.findMany({
            where: {
              id: { in: opcionIds },
              questionId: respuesta.preguntaId,
            },
            select: { id: true },
          });

          if (opcionesValidas.length !== opcionIds.length) {
            throw new BadRequestException(
              `Algunas opciones proporcionadas no son válidas para la pregunta ${respuesta.preguntaId}.`,
            );
          }

          return this.prisma.respuesta.create({
            data: {
              questionId: respuesta.preguntaId,
              inscriptionId: inscripcion.id,
              type: pregunta.type,
              opciones: {
                create: opcionesValidas.map((opcion) => ({
                  opcionId: opcion.id,
                })),
              },
            },
          });

        case 'CHECKBOX':
        case 'DESPLEGABLE_MULTIPLE':
          if (
            pregunta.isRequired &&
            (!respuesta.opciones || respuesta.opciones.length === 0)
          ) {
            throw new BadRequestException(
              `Debe seleccionar al menos una opción para la pregunta de tipo ${pregunta.type}.`,
            );
          }

          if (!respuesta.opciones || respuesta.opciones.length === 0) {
            // Guardar la respuesta vacía si no es obligatoria
            return this.prisma.respuesta.create({
              data: {
                questionId: respuesta.preguntaId,
                inscriptionId: inscripcion.id,
                type: pregunta.type,
                opciones: {
                  create: [], // Respuesta vacía
                },
              },
            });
          }

          const opcionIdsMultiple = respuesta.opciones.map(
            (opcion) => opcion.opcionId,
          );
          const opcionesValidasMultiple = await this.prisma.opcion.findMany({
            where: {
              id: { in: opcionIdsMultiple },
              questionId: respuesta.preguntaId,
            },
            select: { id: true },
          });

          if (opcionesValidasMultiple.length !== opcionIdsMultiple.length) {
            throw new BadRequestException(
              `Algunas opciones proporcionadas no son válidas para la pregunta ${respuesta.preguntaId}.`,
            );
          }

          return this.prisma.respuesta.create({
            data: {
              questionId: respuesta.preguntaId,
              inscriptionId: inscripcion.id,
              type: pregunta.type,
              opciones: {
                create: opcionesValidasMultiple.map((opcion) => ({
                  opcionId: opcion.id,
                })),
              },
            },
          });

        default:
          throw new BadRequestException(
            `Tipo de pregunta no soportado: ${pregunta.type}`,
          );
      }
    });

    await Promise.all(respuestasPromises);

    return { message: 'Respuestas guardadas correctamente' };
  }

  // Función auxiliar para validar fechas
  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  async generateReferalLink(
    user: UserInterface,
    comisionId: string,
    customLink?: string,
  ) {
    // Obtener el vendedorId a partir del userId
    const vendedor = await this.prisma.vendedor.findUnique({
      where: { usuarioId: user.id },
      select: { id: true },
    });

    if (!vendedor) {
      throw new BadRequestException(
        'No se encontró un vendedor asociado al usuario',
      );
    }

    const vendedorId = vendedor.id;

    // Verificar si ya existe un link de referido para esta combinación de vendedor y comisión
    const existingAsignacion = await this.prisma.asignacionVendedor.findUnique({
      where: {
        vendedorId_comisionId: {
          vendedorId,
          comisionId,
        },
      },
      select: {
        id: true,
        linkReferido: true,
        vendedorId: true,
        comisionId: true,
      },
    });

    // Si ya existe un link y no se envió uno nuevo, devolver el existente
    if (existingAsignacion && !customLink) {
      return existingAsignacion;
    }

    // Generar link de referido si se proporciona customLink o no existe asignación previa
    const linkReferido = customLink || uuid();

    // Crear o actualizar el link de referido y devolver el objeto completo
    const updatedAsignacion = await this.prisma.asignacionVendedor.upsert({
      where: {
        vendedorId_comisionId: {
          vendedorId,
          comisionId,
        },
      },
      update: {
        linkReferido, // Actualiza el link si ya existe y se envió customLink
      },
      create: {
        vendedorId,
        comisionId,
        linkReferido, // Crea el link si no existe
      },
      select: {
        id: true,
        linkReferido: true,
        vendedorId: true,
        comisionId: true,
      },
    });

    return updatedAsignacion; // Devuelve el objeto en la estructura de GetLinkRef
  }
}
