import { Controller, Get, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Role } from 'src/common/enums/enums';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get('create-admin')
  async createAdmin() {
    const result = await this.seedService.createAdminUser();
    return {
      message: result,
    };
  }

  @Post('staff')
  @Auth(Role.ADMIN)
  async seedStaff() {
    return this.seedService.generateStaff();
  }

  @Post('students')
  @Auth(Role.ADMIN)
  async seedStudents() {
    return this.seedService.generateStudents();
  }
}
