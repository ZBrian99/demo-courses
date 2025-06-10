import { Role } from '../enums/enums';

export interface UserInterface {
  id: string;
  email: string;
  nombre: string;
  rol: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
