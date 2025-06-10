import { IsOptional, IsInt, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class FindCommissionWithEnrollmentsDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser mayor o igual a 1' })
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El número de página debe ser un número entero' })
  @Min(1, { message: 'El número de página debe ser mayor o igual a 1' })
  page?: number;

  @IsOptional()
  @IsString()
  status?: 'Próxima' | 'En curso' | 'Finalizada';

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  courseId?: string;

  @IsOptional()
  @IsString()
  fechaInicio?: string;

  @IsOptional()
  @IsString()
  fechaFin?: string;
}
