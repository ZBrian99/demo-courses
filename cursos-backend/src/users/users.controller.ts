import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  Query,
  Delete,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/common/decorators/user.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/enums';
// import { Roles } from 'src/common/decorators/roles.decorator';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Auth()
  @Get('me')
  async getProfile(@User() user: UserInterface) {
    return this.usersService.findMyProfile(user);
  }

  @Auth()
  @Patch('me')
  async updateProfile(
    @User() user: UserInterface,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateMyProfile(user, updateUserDto);
  }

  @Get('staff')
  @Auth(Role.ADMIN, Role.FINANZAS)
  async findAllStaff(
    @Query() query: FindUsersDto,
    @User() user: UserInterface,
  ) {
    return this.usersService.findAllStaff(query, user);
  }

  @Get('students')
  @Auth(Role.ADMIN, Role.VENDEDOR, Role.PROFESORVENDEDOR, Role.FINANZAS)
  async findAllStudents(
    @Query() query: FindUsersDto,
    @User() user: UserInterface,
  ) {
    return this.usersService.findAllStudents(query, user);
  }

  @Get('search/dni')
  async findUserByDni(
    @Query('tipoDni') tipoDni: string,
    @Query('dni') dni: string,
  ) {
    return this.usersService.findUserByDni(tipoDni, dni);
  }

  @Post('register')
  async createStudent(@Body() data: CreateUserDto) {
    return this.usersService.createUser({ ...data, rol: Role.ALUMNO });
  }

  @Get(':id')
  @Auth(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async findUserById(@Param('id') userId: string, @User() user: UserInterface) {
    return this.usersService.findUserById(userId, user);
  }

  @Post()
  @Auth(Role.ADMIN)
  async createUser(@Body() data: CreateUserDto) {
    return this.usersService.createUser(data);
  }

  @Patch(':id')
  @Auth(
    Role.ADMIN,
    Role.PROFESOR,
    Role.VENDEDOR,
    Role.PROFESORVENDEDOR,
    Role.FINANZAS,
  )
  async updateUser(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
    @User() user: UserInterface,
  ) {
    return this.usersService.updateUser(userId, updateUserDto, user);
  }

  @Delete(':id')
  @Auth(Role.ADMIN)
  async deleteUser(
    @Param('id') userId: string,
    @Query() query: { permanent?: boolean },
    @User() user: UserInterface,
  ) {
    return this.usersService.deleteUser(userId, query.permanent, user);
  }
}
