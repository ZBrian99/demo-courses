import { Role } from 'src/common/enums/enums';

export const permissions = {
  Profile: {
    view: {
      [Role.USUARIO]: ['id', 'nombre', 'email'],
      [Role.ALUMNO]: ['id', 'nombre', 'email'],
      [Role.VENDEDOR]: ['id', 'nombre', 'email'],
      [Role.ASISTENTE]: ['id', 'nombre', 'email', 'rol'],
      [Role.PROFESOR]: ['id', 'nombre', 'email', 'rol'],
      [Role.ORGANIZADOR]: ['id', 'nombre', 'email', 'rol'],
      [Role.FINANZAS]: ['id', 'nombre', 'email', 'rol'],
      [Role.ADMIN]: 'ALL',
    },
    edit: {
      [Role.USUARIO]: ['nombre', 'email', 'password'],
      [Role.ALUMNO]: ['nombre', 'email', 'password'],
      [Role.VENDEDOR]: ['nombre', 'email', 'password'],
      [Role.ASISTENTE]: ['nombre', 'email'],
      [Role.PROFESOR]: ['nombre', 'email'],
      [Role.ORGANIZADOR]: ['nombre', 'email'],
      [Role.FINANZAS]: ['nombre', 'email'],
      [Role.ADMIN]: 'ALL',
    },
  },

  User: {
    view: {
      [Role.VENDEDOR]: ['id', 'nombre', 'email'],
      [Role.ASISTENTE]: ['id', 'nombre', 'email', 'rol'],
      [Role.PROFESOR]: ['id', 'nombre', 'email', 'rol'],
      [Role.ORGANIZADOR]: ['id', 'nombre', 'email', 'rol'],
      [Role.FINANZAS]: ['id', 'nombre', 'email', 'rol'],
      [Role.ADMIN]: 'ALL',
    },
    edit: {
      [Role.VENDEDOR]: ['nombre', 'email'],
      [Role.ASISTENTE]: ['nombre', 'email'],
      [Role.PROFESOR]: ['nombre', 'email'],
      [Role.ORGANIZADOR]: ['nombre', 'email'],
      [Role.FINANZAS]: ['nombre', 'email'],
      [Role.ADMIN]: 'ALL',
    },
    validValues: {
      [Role.PROFESOR]: {
        nombre: ['Hola', 'adios', 'advanced'],
      },
    },
  },

  Course: {
    view: {
      [Role.USUARIO]: ['nombre', 'descripcion'],
      [Role.ALUMNO]: ['nombre', 'descripcion'],
      [Role.VENDEDOR]: ['nombre'],
      [Role.ASISTENTE]: ['nombre', 'descripcion'],
      [Role.PROFESOR]: ['id', 'nombre', 'descripcion'],
      [Role.ORGANIZADOR]: ['nombre', 'descripcion'],
      [Role.FINANZAS]: ['nombre'],
      [Role.ADMIN]: 'ALL',
    },
    edit: {
      [Role.PROFESOR]: ['descripcion'],
      [Role.ORGANIZADOR]: ['nombre', 'descripcion'],
      [Role.ADMIN]: 'ALL',
    },
    validValues: {},
  },

  // Ejemplo de nuevo modelo
  // Enrollment: {
  //   view: {
  //     [Role.ALUMNO]: ['courseId', 'enrollmentDate', 'status'],
  //     [Role.PROFESOR]: ['courseId', 'enrollmentDate', 'status'],
  //     [Role.ORGANIZADOR]: ['courseId', 'enrollmentDate', 'status'],
  //     [Role.FINANZAS]: ['courseId', 'enrollmentDate'],
  //     [Role.ADMIN]: 'ALL',
  //   },
  //   edit: {
  //     [Role.ALUMNO]: ['status'],
  //     [Role.PROFESOR]: ['progress'],
  //     [Role.FINANZAS]: ['price'],
  //     [Role.ADMIN]: 'ALL',
  //   },
  //   validValues: {
  //     [Role.ALUMNO]: {
  //       status: ['enrolled'],
  //     },
  //     [Role.PROFESOR]: {
  //       progress: [0, 25, 50, 75, 100],
  //     },
  //   },
  // },
};
