import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class LoginUserDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsString({ message: 'La contraseña debe ser un texto válido.' })
  @Transform(({ value }) => value.trim())
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;
}
