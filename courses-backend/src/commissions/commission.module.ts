import { Module } from '@nestjs/common';
import { CommissionController } from './commission.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CommissionsService } from './commission.service';

@Module({
  imports: [PrismaModule],
  controllers: [CommissionController],
  providers: [CommissionsService],
  exports: [CommissionsService],
})
export class CommissionModule {}
