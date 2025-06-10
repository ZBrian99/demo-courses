import { IsString, IsArray, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

class RespuestaOpcionDto {
  @IsString()
  opcionId: string;
}

export class RespuestaDto {
  @IsString()
  preguntaId: string;

  @IsOptional()
  @IsString()
  textValue?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaOpcionDto)
  opciones?: RespuestaOpcionDto[];
}

export class SubmitFormularioDto {
  @IsString()
  alumnoId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaDto)
  respuestas: RespuestaDto[];
}
