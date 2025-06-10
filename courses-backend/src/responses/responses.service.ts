// src/respuestas/respuestas.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetResponsesByAlumnoDto } from './dto/get-responses-by-alumno.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { Role } from 'src/common/enums/enums';

@Injectable()
export class ResponsesService {
  constructor(private prisma: PrismaService) {}

  // Obtener ID del alumno a partir del ID de usuario
  async obtenerAlumnoId(usuarioId: string): Promise<string> {
    const alumno = await this.prisma.alumno.findUnique({
      where: { usuarioId },
      select: { id: true },
    });
    if (!alumno) {
      throw new NotFoundException(
        `Alumno con usuarioId ${usuarioId} no encontrado.`,
      );
    }
    return alumno.id;
  }

  // Obtener respuestas por filtros opcionales
  async obtenerRespuestasFiltradas(filtros: GetResponsesByAlumnoDto) {
    const alumnoId = await this.obtenerAlumnoId(filtros.usuarioId);

    const respuestas = await this.prisma.respuesta.findMany({
      where: {
        inscripcion: {
          alumnoId,
          comisionId: filtros.comisionId,
          vendedorId: filtros.vendedorId,
          comision: {
            formularioId: filtros.formularioId,
            cursoId: filtros.cursoId,
            vendedores: filtros.linkReferido
              ? { some: { linkReferido: filtros.linkReferido } }
              : undefined,
          },
        },
      },
      include: {
        pregunta: {
          include: {
            options: true,
          },
        },
        opciones: {
          include: {
            opcion: true,
          },
        },
      },
    });

    return respuestas.map((respuesta) => ({
      preguntaId: respuesta.questionId,
      tipoPregunta: respuesta.type,
      textoPregunta: respuesta.pregunta.text,
      opciones: respuesta.pregunta.options,
      respuesta: respuesta.textValue,
      opcionesSeleccionadas: respuesta.opciones.map((opcion) => ({
        opcionId: opcion.opcionId,
        textoOpcion: opcion.opcion.text,
      })),
    }));
  }

  // Obtener todas las respuestas de un alumno en todas sus inscripciones
  async obtenerTodasLasRespuestas(usuarioId: string) {
    const alumnoId = await this.obtenerAlumnoId(usuarioId);

    const respuestas = await this.prisma.respuesta.findMany({
      where: {
        inscripcion: {
          alumnoId,
        },
      },
      include: {
        pregunta: {
          include: {
            options: true,
          },
        },
        opciones: {
          include: {
            opcion: true,
          },
        },
      },
    });

    return respuestas.map((respuesta) => ({
      preguntaId: respuesta.questionId,
      tipoPregunta: respuesta.type,
      textoPregunta: respuesta.pregunta.text,
      opciones: respuesta.pregunta.options,
      respuesta: respuesta.textValue,
      opcionesSeleccionadas: respuesta.opciones.map((opcion) => ({
        opcionId: opcion.opcionId,
        textoOpcion: opcion.opcion.text,
      })),
    }));
  }

  async verificarAcceso(
    inscripcionId: string,
    user: UserInterface,
  ): Promise<void> {
    if (!user) {
      throw new Error('El usuario no está definido');
    }

    // Si es ADMIN o FINANZAS, tiene acceso completo
    if (user.rol === Role.ADMIN || user.rol === Role.FINANZAS) {
      return;
    }

    // Consulta base de la inscripción con las relaciones necesarias
    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: { id: inscripcionId },
      select: {
        vendedorId: true,
        comision: {
          select: {
            profesores: {
              select: {
                profesorId: true,
              },
            },
          },
        },
      },
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `No se encontró la inscripción con ID ${inscripcionId}.`,
      );
    }

    // Para roles que involucran vendedor (VENDEDOR y PROFESORVENDEDOR)
    if (user.rol === Role.VENDEDOR || user.rol === Role.PROFESORVENDEDOR) {
      const vendedor = await this.prisma.vendedor.findUnique({
        where: { usuarioId: user.id },
        select: { id: true },
      });

      if (vendedor && inscripcion.vendedorId === vendedor.id) {
        return; // Tiene acceso como vendedor
      }

      // Si es PROFESORVENDEDOR y no tiene acceso como vendedor, verificar acceso como profesor
      if (user.rol === Role.PROFESORVENDEDOR) {
        const profesor = await this.prisma.profesor.findUnique({
          where: { usuarioId: user.id },
          select: { id: true },
        });

        if (
          profesor &&
          inscripcion.comision.profesores.some(
            (asignacion) => asignacion.profesorId === profesor.id,
          )
        ) {
          return; // Tiene acceso como profesor
        }
      }

      throw new ForbiddenException('No tienes acceso a esta inscripción.');
    }

    // Para rol PROFESOR
    if (user.rol === Role.PROFESOR) {
      const profesor = await this.prisma.profesor.findUnique({
        where: { usuarioId: user.id },
        select: { id: true },
      });

      if (
        !profesor ||
        !inscripcion.comision.profesores.some(
          (asignacion) => asignacion.profesorId === profesor.id,
        )
      ) {
        throw new ForbiddenException('No tienes acceso a esta inscripción.');
      }
    }
  }

  async obtenerRespuestasPorInscripcion(
    inscripcionId: string,
    user: UserInterface,
  ) {
    await this.verificarAcceso(inscripcionId, user);

    const inscripcion = await this.prisma.inscripcion.findUnique({
      where: {
        id: inscripcionId,
      },
      select: {
        respuestas: {
          select: {
            questionId: true,
            type: true,
            textValue: true,
            opciones: {
              select: {
                opcion: {
                  select: {
                    id: true,
                    text: true,
                    order: true,
                    value: true,
                  },
                },
              },
            },
            pregunta: {
              select: {
                id: true,
                text: true,
                type: true,
                isRequired: true,
                order: true,
                etapa: {
                  select: {
                    id: true,
                    title: true,
                    order: true,
                  },
                },
                options: {
                  select: {
                    id: true,
                    text: true,
                    order: true,
                    value: true,
                  },
                  orderBy: {
                    order: 'asc',
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!inscripcion) {
      throw new NotFoundException(
        `No se encontraron datos para la inscripción con ID ${inscripcionId}.`,
      );
    }

    // Agrupar respuestas por etapas y ordenar por `order`
    const respuestasAgrupadas = inscripcion.respuestas.reduce(
      (acc, respuesta) => {
        const etapaId = respuesta.pregunta.etapa.id;
        if (!acc[etapaId]) {
          acc[etapaId] = {
            id: etapaId,
            title: respuesta.pregunta.etapa.title,
            order: respuesta.pregunta.etapa.order,
            preguntas: [],
          };
        }

        let valorRespuesta = respuesta.textValue;
        if (respuesta.type === 'FECHA' && respuesta.textValue) {
          // Asegurarse de que las fechas se formateen correctamente
          valorRespuesta = new Date(respuesta.textValue).toISOString();
        }

        acc[etapaId].preguntas.push({
          id: respuesta.pregunta.id,
          text: respuesta.pregunta.text,
          type: respuesta.pregunta.type,
          isRequired: respuesta.pregunta.isRequired,
          order: respuesta.pregunta.order,
          respuesta: {
            textValue: valorRespuesta,
            opcionesSeleccionadas: respuesta.opciones.map((opcion) => ({
              id: opcion.opcion.id,
              text: opcion.opcion.text,
              value: opcion.opcion.value,
            })),
          },
          opciones: respuesta.pregunta.options,
        });
        return acc;
      },
      {} as Record<string, any>,
    );

    // Convertir a un array y ordenar las etapas por `order`
    const etapasOrdenadas = Object.values(respuestasAgrupadas).sort(
      (a, b) => a.order - b.order,
    );

    // Ordenar preguntas dentro de cada etapa
    etapasOrdenadas.forEach((etapa) => {
      etapa.preguntas.sort((a, b) => a.order - b.order);
    });

    return etapasOrdenadas;
  }
}
