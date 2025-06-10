import {
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsUUID,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @IsOptional()
  @IsUUID()
  id?: string; // Solo es necesario para actualizar opciones existentes

  @IsString()
  text: string;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  value?: string;
}

class QuestionDto {
  @IsOptional()
  @IsUUID()
  id?: string; // Solo es necesario para actualizar preguntas existentes

  @IsString()
  text: string;

  @IsNumber()
  order: number;

  @IsString()
  type:
    | 'TEXTO_CORTO'
    | 'TEXTO_LARGO'
    | 'SELECCION'
    | 'CHECKBOX'
    | 'FECHA'
    | 'DESPLEGABLE'
    | 'DESPLEGABLE_MULTIPLE';

  @IsBoolean()
  isRequired: boolean;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  options?: OptionDto[]; // Opciones solo si es SELECCION o CHECKBOX
}

class StageDto {
  @IsOptional()
  @IsUUID()
  id?: string; // Solo es necesario para actualizar etapas existentes

  @IsNumber()
  order: number;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class UpdateFormularioDto {
  // @IsUUID()
  // id: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  @IsOptional()
  @IsUUID() // commissionId es opcional para la actualización
  commissionId?: string; // isActive?: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageDto)
  stages: StageDto[];
}
