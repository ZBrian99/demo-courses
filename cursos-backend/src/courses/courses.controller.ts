import {
  Controller,
  Param,
  Body,
  Patch,
  Post,
  Get,
  Query,
  Delete,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Role } from 'src/common/enums/enums';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { FindCoursesDto } from './dto/find-course.dto';

@Controller('courses')
@Auth()
export class CoursesController {
  constructor(private coursesService: CoursesService) {}

  @Get()
  @Roles(Role.ADMIN, Role.PROFESOR, Role.VENDEDOR, Role.FINANZAS, Role.ALUMNO)
  async findAllCourses(
    @Query() query: FindCoursesDto,
    @User() user: UserInterface,
  ) {
    return this.coursesService.findAllCourses(query, user);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESOR, Role.VENDEDOR, Role.FINANZAS, Role.ALUMNO)
  async findCourseById(
    @Param('id') courseId: string,
    @User() user: UserInterface,
  ) {
    return this.coursesService.findCourseById(courseId, user);
  }

  @Post()
  @Roles(Role.ADMIN)
  async createCourse(@Body() data: CreateCourseDto) {
    return this.coursesService.createCourse(data);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.PROFESOR, Role.VENDEDOR, Role.FINANZAS)
  async updateCourse(
    @Param('id') courseId: string,
    @Body() data: UpdateCourseDto,
    @User() user: UserInterface,
  ) {
    return this.coursesService.updateCourse(courseId, user, data);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  async deleteCourse(
    @Param('id') courseId: string,
    @Query() query: { permanent?: boolean },
  ) {
    return this.coursesService.deleteCourse(courseId, query.permanent);
  }
}
