// src/Responses/Responses.module.ts
import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ResponsesController } from './responses.controller';
import { ResponsesService } from './responses.service';

@Module({
  controllers: [ResponsesController],
  providers: [ResponsesService, PrismaService],
})
export class ResponsesModule {}
