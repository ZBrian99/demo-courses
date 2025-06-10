import { IsString, IsDateString, IsNotEmpty } from 'class-validator';

export class GetEnrollmentReportDto {
  @IsString()
  @IsNotEmpty()
  comisionId: string;

  @IsDateString()
  @IsNotEmpty()
  fechaInicio: string;

  @IsDateString()
  @IsNotEmpty()
  fechaFin: string;
}
