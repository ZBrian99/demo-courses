// enrollments/dto/create-enrollment.dto.ts
import { IsUUID, IsOptional } from 'class-validator';

export class CreateEnrollmentDto {
  @IsUUID()
  alumnoId: string; // alumnoId

  @IsUUID()
  comisionId: string; // comisionId

  @IsOptional()
  @IsUUID()
  vendedorId?: string; // vendedorId
}
