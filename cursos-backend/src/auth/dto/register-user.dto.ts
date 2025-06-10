import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsEmail({}, { message: 'El correo electrónico debe ser válido.' })
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @IsNotEmpty({ message: 'La contraseña no debe estar vacía.' })
  @Transform(({ value }) => value.trim())
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  password: string;

  @IsNotEmpty({ message: 'El nombre no debe estar vacío.' })
  @Transform(({ value }) => value.trim())
  nombre: string;
}
