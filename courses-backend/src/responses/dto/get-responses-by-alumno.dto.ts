import { IsOptional, IsString } from 'class-validator';

export class GetResponsesByAlumnoDto {
  @IsString()
  usuarioId: string;

  @IsOptional()
  @IsString()
  comisionId?: string;

  @IsOptional()
  @IsString()
  inscripcionId?: string;

  @IsOptional()
  @IsString()
  formularioId?: string;

  @IsOptional()
  @IsString()
  cursoId?: string;

  @IsOptional()
  @IsString()
  vendedorId?: string;

  @IsOptional()
  @IsString()
  linkReferido?: string;
}
