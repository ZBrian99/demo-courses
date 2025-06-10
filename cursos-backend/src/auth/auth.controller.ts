import { Controller, Post, Body, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
// import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @Post('register')
  // async register(@Body() registerUserDto: RegisterUserDto) {
  //   return this.authService.register(registerUserDto);
  // }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Post('renew-token')
  @Auth()
  async renewToken(@Req() req: Request) {
    const oldToken = req.headers.authorization.split(' ')[1];
    return this.authService.renewToken(oldToken);
  }

  // async rewnewToken(@Body() loginUserDto: LoginUserDto) {
  //   return this.authService.renewToken(loginUserDto);
  // }
}
