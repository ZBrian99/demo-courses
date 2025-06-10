import {
  IsString,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsOptional,
  IsUUID,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';

class OptionDto {
  @IsString()
  text: string;

  @IsNumber()
  order: number;

  @IsOptional()
  @IsString()
  value?: string;
}

export class QuestionDto {
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
  options?: OptionDto[]; // Para CHECKBOX, SELECCION, DESPLEGABLE y DESPLEGABLE_MULTIPLE
}

export class StageDto {
  @IsString()
  title: string;

  @IsNumber()
  order: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];
}

export class CreateFormularioDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  descripcion: string;

  // @IsOptional()
  // @IsBoolean()
  // isActive?: boolean = true;

  @IsOptional()
  @IsUUID() // Agregamos el commissionId para vincular una comisión opcionalmente
  commissionId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StageDto)
  stages: StageDto[];
}
