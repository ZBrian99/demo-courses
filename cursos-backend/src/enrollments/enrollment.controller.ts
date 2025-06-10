// enrollments/enrollment.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Res,
} from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { EnrollmentFilterDto } from './dto/enrollment-filter.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { User } from '../common/decorators/user.decorator';
import { UserInterface } from '../common/interfaces/user.interface';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/enums';
import { UpdateEnrollmentStatusDto } from './dto/update-enrollment.dto';
import { AddObservationDto } from './dto/AddObservationDto';
import { GetEnrollmentReportDto } from './dto/get-enrollment-report.dto';
import { Response } from 'express';

@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Get()
  @Auth(
    Role.ADMIN,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.PROFESOR,
    Role.FINANZAS,
  )
  async findAll(
    @Query() filterDto: EnrollmentFilterDto,
    @User() user: UserInterface,
  ) {
    return this.enrollmentService.findAll(filterDto, user);
  }

  @Get(':id')
  @Auth(
    Role.ADMIN,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.PROFESOR,
    Role.FINANZAS,
  )
  async findOne(@Param('id') id: string, @User() user: UserInterface) {
    return this.enrollmentService.findOne(id, user);
  }

  @Post()
  @Auth(Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR)
  async create(
    @Body() createEnrollmentDto: CreateEnrollmentDto,
    @User() user: UserInterface,
  ) {
    return this.enrollmentService.create(createEnrollmentDto, user);
  }

  // @Patch(':id')
  // @Auth(Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR)
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  // ) {
  //   return this.enrollmentService.update(id, updateEnrollmentDto);
  // }
  @Patch(':id/status')
  @Auth(Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateEnrollmentStatusDto,
    @User() user: UserInterface,
  ) {
    return this.enrollmentService.updateStatus(id, updateStatusDto, user);
  }

  // Método para obtener los pagos de una inscripción
  @Get(':id/payments')
  @Auth(Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR)
  async getPayments(@Param('id') id: string, @User() user: UserInterface) {
    return this.enrollmentService.getPayments(id, user);
  }

  // Método para agregar un nuevo pago a una inscripción
  @Post(':id/payments')
  @Auth(Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR)
  async addPayment(
    @Param('id') id: string,
    @Body() addPaymentDto: AddPaymentDto,
    @User() user: UserInterface,
  ) {
    return this.enrollmentService.addPayment(id, addPaymentDto, user);
  }

  @Post(':id/observations')
  @Auth(Role.ADMIN, Role.FINANZAS, Role.VENDEDOR, Role.PROFESORVENDEDOR)
  async addObservation(
    @Param('id') id: string,
    @Body() addObservationDto: AddObservationDto,
    @User() user: UserInterface,
  ) {
    return this.enrollmentService.addObservation(id, addObservationDto, user);
  }

  @Post('report')
  @Auth(Role.ADMIN, Role.FINANZAS)
  async generateReport(
    @Body() reportDto: GetEnrollmentReportDto,
    @User() user: UserInterface,
    @Res() res: Response,
  ) {
    const { buffer, fileName } =
      await this.enrollmentService.generateEnrollmentReport(reportDto, user);

    const encodedFileName = encodeURIComponent(fileName);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${fileName}"; filename*=UTF-8''${encodedFileName}`,
      'Access-Control-Expose-Headers': 'Content-Disposition',
    });

    res.send(buffer);
  }
}
