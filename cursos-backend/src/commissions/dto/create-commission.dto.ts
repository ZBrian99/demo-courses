import {
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  ValidateNested,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class HorarioDto {
  @IsString()
  day: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;
}

class LinkDto {
  @IsString()
  titulo: string;

  @IsString()
  url: string;
}

export class CreateCommissionDto {
  @IsOptional()
  @IsString()
  codigoComision?: string;

  @IsString()
  fechaInicio: string;

  @IsString()
  fechaFin: string;

  @IsOptional()
  @IsString()
  clases?: string;

  @IsOptional()
  @IsString()
  modalidad?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  ubicacion?: string;

  @IsOptional()
  @IsString()
  cupo?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  profesores?: string[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  vendedores?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classroomLinks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  whatsappLinks?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  infoLinks?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LinkDto)
  links?: LinkDto[];

  @IsUUID()
  cursoId: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HorarioDto)
  horarios?: HorarioDto[];

  @IsOptional()
  @IsString()
  cargaHoraria?: string;
}
