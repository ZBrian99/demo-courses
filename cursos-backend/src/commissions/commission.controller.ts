import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CommissionsService } from './commission.service';
import { CreateCommissionDto } from './dto/create-commission.dto';
import { UpdateCommissionDto } from './dto/update-commission.dto';
import { Role } from 'src/common/enums/enums';
import { Auth } from 'src/common/decorators/auth.decorator';
import { FindCommissionDto } from './dto/find-commission.dto';
import { FindCommissionWithEnrollmentsDto } from './dto/FindCommissionWithEnrollmentsDto';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';

@Controller('commissions')
export class CommissionController {
  constructor(private readonly commissionsService: CommissionsService) {}

  @Get('ref/:linkReferido') async findByLinkReferido(
    @Param('linkReferido') linkReferido: string,
  ) {
    return this.commissionsService.findByLinkReferido(linkReferido);
  }

  @Get()
  @Auth(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
    Role.ALUMNO,
  )
  async findAllCommission(@Query() query: FindCommissionDto) {
    return this.commissionsService.findAll(query);
  }

  @Get('enrollments')
  @Auth(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async findAllWithEnrollments(
    @Query() query: FindCommissionWithEnrollmentsDto,
    @User() user: UserInterface,
  ) {
    return this.commissionsService.findAllWithEnrollments(query, user);
  }

  @Get(':id')
  @Auth(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
    Role.ALUMNO,
  )
  async findOne(@Param('id') id: string) {
    return this.commissionsService.findOne(id);
  }

  @Post()
  @Auth(Role.ADMIN)
  async create(@Body() createCommissionDto: CreateCommissionDto) {
    // console.log('createCommissionDto controller', createCommissionDto);
    return this.commissionsService.create(createCommissionDto);
  }

  @Patch(':id')
  @Auth(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async update(
    @Param('id') id: string,
    @Body() updateCommissionDto: UpdateCommissionDto,
  ) {
    return this.commissionsService.update(id, updateCommissionDto);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async deleteCommission(
    @Param('id') commissionId: string,
    @Query() query: { permanent?: boolean },
  ) {
    // console.log(query);
    return this.commissionsService.deleteCommission(
      commissionId,
      query.permanent,
    );
  }
}
