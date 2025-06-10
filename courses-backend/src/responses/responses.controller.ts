// src/respuestas/respuestas.controller.ts
import { Controller, Get, Query } from '@nestjs/common';
import { GetResponsesByAlumnoDto } from './dto/get-responses-by-alumno.dto';
import { ResponsesService } from './responses.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/enums';

@Controller('responses')
@Auth()
export class ResponsesController {
  constructor(private respuestasService: ResponsesService) {}

  // Endpoint para obtener respuestas filtradas
  @Get('filtered')
  @Roles(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async obtenerRespuestasFiltradas(@Query() filtros: GetResponsesByAlumnoDto) {
    return await this.respuestasService.obtenerRespuestasFiltradas(filtros);
  }

  @Get('enrollment')
  @Roles(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async obtenerRespuestasPorInscripcion(
    @Query('inscripcionId') inscripcionId: string,
    @User() user: UserInterface,
  ) {
    return await this.respuestasService.obtenerRespuestasPorInscripcion(
      inscripcionId,
      user,
    );
  }
  // Endpoint para obtener todas las respuestas de un alumno
  @Get()
  @Roles(
    Role.ADMIN,
    // Role.PROFESOR,
    // Role.VENDEDOR,
    // Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async obtenerTodasLasRespuestas(@Query('usuarioId') usuarioId: string) {
    return await this.respuestasService.obtenerTodasLasRespuestas(usuarioId);
  }
}
