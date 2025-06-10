import { Role } from '../enums/enums';

export interface JwtPayload {
  sub: string;
  rol: Role;
}
