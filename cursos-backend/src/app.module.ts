import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { PermissionsModule } from './permissions/permissions.module';
import { CoursesModule } from './courses/courses.module';
import { CommissionModule } from './commissions/commission.module';
import { FormularioModule } from './formulario/formulario.module';
import { SeedModule } from './seed/seed.module';
import { ResponsesModule } from './responses/responses.module';
import { EnrollmentModule } from './enrollments/enrollment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    PrismaModule,
    AuthModule,
    PermissionsModule,
    CoursesModule,
    CommissionModule,
    EnrollmentModule,
    SeedModule,
    FormularioModule,
    ResponsesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
