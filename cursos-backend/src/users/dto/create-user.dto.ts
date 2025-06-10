import {
  IsString,
  IsOptional,
  IsEmail,
  IsEnum,
  MinLength,
} from 'class-validator';
import { Role } from 'src/common/enums/enums';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  profileImage?: string;

  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido: string;

  @IsOptional()
  @IsString()
  tipoDni?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsEmail({}, { message: 'El email debe ser válido.' })
  email: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  pais?: string;

  @IsOptional()
  @IsString()
  provincia?: string;

  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  profesion?: string;

  @IsOptional()
  @IsString()
  resume?: string;

  @IsOptional()
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsEnum(Role, { message: 'El rol debe ser uno de los valores permitidos.' })
  rol: Role;
}
