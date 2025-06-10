import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FormularioService } from './formulario.service';
import { CreateFormularioDto } from './dto/create-formulario.dto';
import { UpdateFormularioDto } from './dto/update-formulario.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/enums';
import { SubmitFormularioDto } from './dto/create-form-response-dto';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { GenerateReferalLinkDto } from './dto/GenerateReferalLinkDto';
import { FindFormulariosDto } from './dto/find-formularios.dto';

@Controller('forms')
export class FormularioController {
  constructor(private readonly formularioService: FormularioService) {}

  @Post()
  @Auth(Role.ADMIN)
  async create(
    @Body() createFormularioDto: CreateFormularioDto,
    @User() user: UserInterface,
  ) {
    return this.formularioService.create(createFormularioDto, user);
  }

  @Get()
  @Auth(Role.ADMIN, Role.PROFESOR, Role.VENDEDOR, Role.FINANZAS)
  async findAll(
    @Query() query: FindFormulariosDto,
    @User() user: UserInterface,
  ) {
    return this.formularioService.findAll(query, user);
  }

  @Get(':id')
  // @Auth(Role.ADMIN, Role.PROFESOR, Role.VENDEDOR, Role.FINANZAS)
  async findOne(@Param('id') id: string, @User() user: UserInterface) {
    return this.formularioService.findOne(id, user);
  }

  @Post('submit/:linkReferido')
  async submitRespuestas(
    @Param('linkReferido') linkReferido: string,
    @Body() dto: SubmitFormularioDto,
  ) {
    return this.formularioService.submitRespuestas(linkReferido, dto);
  }

  @Post('referal-link')
  @Auth(Role.ADMIN, Role.VENDEDOR)
  async generateReferalLink(
    @User() user: UserInterface,
    @Body() generateReferalLinkDto: GenerateReferalLinkDto,
  ) {
    const { comisionId, customLink } = generateReferalLinkDto;

    return this.formularioService.generateReferalLink(
      user,
      comisionId,
      customLink,
    );
  }

  @Patch(':id')
  @Auth(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateFormularioDto: UpdateFormularioDto,
    @User() user: UserInterface,
  ) {
    return this.formularioService.update(id, updateFormularioDto, user);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async delete(
    @Param('id') formId: string,
    @Query() query: { permanent?: boolean },
  ) {
    return this.formularioService.delete(formId, query.permanent);
  }
}
