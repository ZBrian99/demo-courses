// enrollments/dto/enrollment-filter.dto.ts
import {
  IsOptional,
  IsUUID,
  IsDateString,
  IsInt,
  IsString,
  IsEnum,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoInscripcion } from '@prisma/client'; // Asegúrate de que la ruta de importación sea correcta

export class EnrollmentFilterDto {
  @IsOptional()
  @IsDateString()
  fechaInicio?: string; // fechaInicio

  @IsOptional()
  @IsDateString()
  fechaFin?: string; // fechaFin

  @IsOptional()
  @IsUUID()
  vendedorId?: string; // vendedorId

  @IsOptional()
  @IsUUID()
  alumnoId?: string; // alumnoId

  @IsOptional()
  @IsUUID()
  comisionId?: string; // comisionId

  @IsOptional()
  @IsEnum(EstadoInscripcion)
  status?: EstadoInscripcion; // Filtro por estado de inscripción

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number;
}
