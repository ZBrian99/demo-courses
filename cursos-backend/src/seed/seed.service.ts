import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/common/enums/enums';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  private generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateRandomNumber(length: number): string {
    return Math.floor(Math.random() * Math.pow(10, length))
      .toString()
      .padStart(length, '0');
  }

  private generateRandomDate(start: Date, end: Date): Date {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime()),
    );
  }

  private async generateBasicUserData(index: number, role: Role) {
    const nombre = `${role}_${this.generateRandomString(5)}`;
    const apellido = this.generateRandomString(8);
    const dni = this.generateRandomNumber(8);

    const hashedPassword = await bcrypt.hash('Test1234!', 10);

    return {
      nombre,
      apellido,
      email: `${nombre.toLowerCase()}.${apellido.toLowerCase()}${index}@test.com`,
      password: hashedPassword,
      telefono: `+54911${this.generateRandomNumber(8)}`,
      pais: 'Argentina',
      provincia: 'Buenos Aires',
      ciudad: 'CABA',
      tipoDni: 'DNI',
      dni,
      rol: role,
      fechaNacimiento: this.generateRandomDate(
        new Date('1960-01-01'),
        new Date('2000-12-31'),
      ),
      isActive: true,
    };
  }

  async generateStaff() {
    console.log('Iniciando generación de personal...');
    const staffDistribution = [
      { role: Role.VENDEDOR, count: 30 },
      { role: Role.PROFESOR, count: 40 },
      { role: Role.PROFESORVENDEDOR, count: 10 },
      { role: Role.ADMIN, count: 10 },
      { role: Role.FINANZAS, count: 10 },
    ];

    const createdUsers = [];

    try {
      for (const { role, count } of staffDistribution) {
        console.log(`Generando ${count} usuarios con rol ${role}...`);

        for (let i = 0; i < count; i++) {
          const userData = await this.generateBasicUserData(i, role);

          const user = await this.prisma.usuario.create({
            data: {
              ...userData,
              profesor:
                role === Role.PROFESOR ||
                role === Role.ADMIN ||
                role === Role.PROFESORVENDEDOR
                  ? { create: {} }
                  : undefined,
              vendedor:
                role === Role.VENDEDOR ||
                role === Role.ADMIN ||
                role === Role.PROFESORVENDEDOR
                  ? { create: {} }
                  : undefined,
              finanzas:
                role === Role.FINANZAS || role === Role.ADMIN
                  ? { create: {} }
                  : undefined,
              admin: role === Role.ADMIN ? { create: {} } : undefined,
            },
            select: {
              id: true,
              email: true,
              rol: true,
            },
          });

          createdUsers.push(user);
          console.log(
            `Usuario ${i + 1}/${count} creado: ${user.email} - ${user.rol}`,
          );
        }
      }

      return {
        message: `Se generaron ${createdUsers.length} usuarios de personal exitosamente`,
        totalUsers: createdUsers.length,
        usersByRole: staffDistribution.map(({ role, count }) => ({
          role,
          count,
        })),
        users: createdUsers,
      };
    } catch (error) {
      console.error('Error generando usuarios:', error);
      throw error;
    }
  }

  async generateStudents() {
    console.log('Iniciando generación de alumnos...');
    const students = [];
    const TOTAL_STUDENTS = 100;

    try {
      for (let i = 0; i < TOTAL_STUDENTS; i++) {
        const studentData = await this.generateBasicUserData(i, Role.ALUMNO);

        const student = await this.prisma.usuario.create({
          data: {
            ...studentData,
            alumno: { create: {} },
          },
          select: {
            id: true,
            email: true,
            rol: true,
          },
        });

        students.push(student);
        console.log(
          `Alumno ${i + 1}/${TOTAL_STUDENTS} creado: ${student.email}`,
        );
      }

      return {
        message: `Se generaron ${students.length} alumnos exitosamente`,
        totalStudents: students.length,
        students,
      };
    } catch (error) {
      console.error('Error generando alumnos:', error);
      throw error;
    }
  }

  async createAdminUser() {
    try {
      const adminExists = await this.prisma.usuario.findFirst({
        where: { rol: Role.ADMIN },
      });

      if (adminExists) {
        return 'Ya existe un usuario administrador';
      }

      const hashedPassword = await bcrypt.hash('admin123', 10);

      const adminData = {
        nombre: 'Administrador',
        apellido: 'Sistema',
        email: 'admin@admin.com',
        password: hashedPassword,
        telefono: '5491123456789',
        pais: 'Argentina',
        provincia: 'Buenos Aires',
        ciudad: 'CABA',
        tipoDni: 'DNI',
        dni: '00000000',
        rol: Role.ADMIN,
        isActive: true,
      };

      await this.prisma.usuario.create({
        data: {
          ...adminData,
          alumno: { create: {} },
          profesor: { create: {} },
          vendedor: { create: {} },
          finanzas: { create: {} },
          admin: { create: {} },
        },
      });

      return 'Usuario administrador creado exitosamente';
    } catch (error) {
      console.error('Error creando admin:', error);
      throw error;
    }
  }
}
