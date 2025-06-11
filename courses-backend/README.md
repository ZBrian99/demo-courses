# Backend - Sistema de Gestión de Cursos

API REST desarrollada con NestJS para el sistema de gestión de cursos.

## 🛠️ Tecnologías

- NestJS
- Prisma
- PostgreSQL
- TypeScript
- JWT & Bcrypt
- ExcelJS
- Day.js

## 📁 Estructura del Proyecto

```
src/
├── auth/           # Autenticación y autorización
├── common/         # Utilidades y decoradores comunes
├── commissions/    # Gestión de comisiones
├── courses/        # Gestión de cursos
├── enrollments/    # Gestión de inscripciones
├── formulario/     # Gestión de formularios personalizados
├── permissions/    # Sistema de permisos
├── prisma/         # Configuración de Prisma
├── responses/      # Gestión de respuestas
├── users/          # Gestión de usuarios
└── seed/           # Datos iniciales
```

## 🚀 Instalación

1. Instala las dependencias
```bash
npm install
```

2. Configura las variables de entorno
```bash
cp .env.example .env
```

3. Ejecuta las migraciones de Prisma
```bash
npx prisma migrate dev
```

4. Inicia el servidor de desarrollo
```bash
npm run start:dev
```

## 📝 API Endpoints

### Autenticación
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovación de token

### Cursos
- `GET /courses` - Listar cursos
- `POST /courses` - Crear curso
- `GET /courses/:id` - Obtener curso
- `PUT /courses/:id` - Actualizar curso
- `DELETE /courses/:id` - Eliminar curso

### Comisiones
- `GET /commissions` - Listar comisiones
- `POST /commissions` - Crear comisión
- `GET /commissions/:id` - Obtener comisión
- `PUT /commissions/:id` - Actualizar comisión
- `DELETE /commissions/:id` - Eliminar comisión

### Inscripciones
- `GET /enrollments` - Listar inscripciones
- `POST /enrollments` - Crear inscripción
- `GET /enrollments/:id` - Obtener inscripción
- `PUT /enrollments/:id` - Actualizar inscripción
- `DELETE /enrollments/:id` - Eliminar inscripción

## 🔒 Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET="tu-secreto-jwt"
JWT_EXPIRATION="2d"
PORT=4000
```

## 📊 Base de Datos

El proyecto utiliza PostgreSQL como base de datos principal. El esquema está definido en el directorio `prisma/`.

Para generar el cliente de Prisma:
```bash
npx prisma generate
```