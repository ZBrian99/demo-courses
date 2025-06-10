// src/dto/generate-referal-link.dto.ts
import { IsOptional, IsString, IsUUID } from 'class-validator';

export class GenerateReferalLinkDto {
  @IsUUID()
  comisionId: string;

  @IsOptional()
  @IsString()
  customLink?: string;
}
