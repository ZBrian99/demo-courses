// enrollments/dto/update-enrollment-status.dto.ts
import { IsEnum } from 'class-validator';
import { EnrollmentStatus } from 'src/common/enums/enums';

export class UpdateEnrollmentStatusDto {
  @IsEnum(EnrollmentStatus, {
    message: 'El estado es inválido',
  })
  estado: EnrollmentStatus;
}
