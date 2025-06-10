import {
  IsOptional,
  IsString,
  IsBoolean,
  IsInt,
  IsArray,
  IsUUID,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  codigo?: string;

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

  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(50, { message: 'El nombre no puede tener más de 50 caracteres.' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @MinLength(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  })
  @MaxLength(200, {
    message: 'La descripción no puede tener más de 200 caracteres.',
  })
  descripcion?: string;

  @IsOptional()
  @IsBoolean({ message: 'isActive debe ser un valor booleano (true o false).' })
  isActive?: boolean;
}
