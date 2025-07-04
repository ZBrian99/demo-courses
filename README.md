# Sistema de Gestión de Cursos

Sistema completo para la gestión de inscripciones, cursos, comisiones, formularios personalizados, links de referido, alumnos y personal.


Puedes ver una versión funcional del sistema en: [Demo Cursos](https://demo-courses.up.railway.app)

## ✨ Características Principales

- Gestión completa de cursos y comisiones
- Formularios personalizables con múltiples tipos de preguntas
- Sistema de inscripciones y seguimiento de alumnos
- Gestión de vendedores y links de referido
- Generación de reportes en Excel
- Sistema de roles y permisos
- Interfaz responsiva y adaptativa

## 🛠️ Tecnologías Utilizadas

### Frontend
- React
- Redux Toolkit & RTK Query
- Material UI
- TypeScript
- Zod & React Hook Form
- Day.js

### Backend
- NestJS
- Prisma
- PostgreSQL
- TypeScript
- JWT & Bcrypt
- ExcelJS
- Day.js

## 📁 Estructura del Proyecto

```
├── courses-frontend/     # Aplicación React
├── courses-backend/      # API NestJS
└── README.md             # Este archivo
```

## 🚀 Inicio Rápido

1. Clona el repositorio
```bash
git clone https://github.com/ZBrian99/demo-courses.git
```

2. Configura el backend
```bash
cd courses-backend
npm install
npm run start:dev
```

3. Configura el frontend
```bash
cd courses-frontend
npm install
npm run dev
```

## 📝 Documentación

Para más detalles sobre cada parte del sistema, consulta los READMEs específicos:
- [Documentación del Backend](./courses-backend/README.md)
- [Documentación del Frontend](./courses-frontend/README.md)



