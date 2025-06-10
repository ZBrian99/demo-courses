import { IsOptional, IsBoolean } from 'class-validator';

export class DeleteFormularioDto {
  @IsOptional()
  @IsBoolean()
  permanent?: boolean;
}
