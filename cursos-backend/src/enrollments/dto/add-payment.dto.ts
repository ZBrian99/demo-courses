// enrollments/dto/add-payment.dto.ts
import { IsString, IsOptional, IsDateString, IsBoolean } from 'class-validator';

export class AddPaymentDto {
  @IsString()
  monto: string; // monto en formato string

  @IsString()
  metodoPago: string; // metodoPago

  @IsString()
  tipoPago: string; // tipoPago

  @IsString()
  moneda: string; // moneda

  @IsOptional()
  @IsDateString()
  fechaPago?: string; // fechaPago

  @IsOptional()
  @IsString()
  observaciones?: string; // observaciones

  @IsOptional()
  @IsBoolean()
  cuentaPropia?: boolean;
}
