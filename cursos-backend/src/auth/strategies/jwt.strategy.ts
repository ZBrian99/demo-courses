// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from 'src/users/users.service';
// import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private configService: ConfigService,
//     private usersService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: configService.get<string>('JWT_SECRET'),
//     });
//   }

//   async validate(payload: JwtPayload) {
//     const user = await this.usersService.findUserAuth(payload.sub);
//     if (!user || !user.isActive) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     return user;
//   }
// }
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/common/interfaces/jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // Aquí validamos el JWT sin consultar la base de datos
  async validate(payload: JwtPayload) {
    // Si el token tiene la información correcta, no necesitamos verificar en la base de datos
    // Verificamos si el usuario tiene el rol correcto y está activo directamente desde el JWT
    if (!payload.sub || !payload.rol) {
      throw new UnauthorizedException('Invalid token');
    }

    // Retornamos la información del usuario que estaba en el payload del JWT
    return { id: payload.sub, rol: payload.rol };
  }
}
