import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
// import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  // async register(registerUserDto: RegisterUserDto) {
  //   const { email, password, nombre } = registerUserDto;

  //   const newUser = await this.usersService.createUser({
  //     email,
  //     password,
  //     nombre,

  //   });

  //   return this.generateToken(newUser);
  // }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findUserByActiveEmail(email);
    if (!user) {
      throw new UnauthorizedException('User does not exist');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const token = this.generateToken(user);

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
      },
      token,
    };
  }

  //TODO crear una renovacion del token varificando el token y devolviendo uno nuevo

  // src/auth/auth.service.ts (Backend)
  async renewToken(oldToken: string) {
    try {
      // Verificar si el token es válido
      const payload = this.jwtService.verify(oldToken);
      const user = await this.usersService.findUserAuth(payload.sub);

      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }

      // Generar y devolver un nuevo token
      return {
        token: this.generateToken(user),
      };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, rol: user.rol };
    return this.jwtService.sign(payload);
  }
}
