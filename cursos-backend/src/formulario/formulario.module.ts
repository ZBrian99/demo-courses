import { Module } from '@nestjs/common';
import { FormularioService } from './formulario.service';
import { FormularioController } from './formulario.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { PermissionsModule } from 'src/permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  controllers: [FormularioController],
  providers: [FormularioService],
  exports: [FormularioService],
})
export class FormularioModule {}
