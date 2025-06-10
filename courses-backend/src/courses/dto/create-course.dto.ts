import {
  IsOptional,
  IsString,
  IsInt,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class CreateCourseDto {
  @IsOptional()
  @IsString()
  codigo?: string;

  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
  nombre: string;

  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  })
  @MaxLength(300, {
    message: 'La descripción no puede tener más de 300 caracteres.',
  })
  descripcion?: string;

  @IsOptional()
  @IsInt()
  horas?: number;

  @IsOptional()
  @IsString()
  imagenPortada?: string;

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  cursosRequeridos?: string[];
}
