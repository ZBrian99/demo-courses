import { IsOptional, IsString } from 'class-validator';

export class AddObservationDto {
  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsString()
  totalAcordado?: string;

  @IsOptional()
  @IsString()
  cantidadCuotas?: string;
}
