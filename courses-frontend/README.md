# Frontend - Sistema de Gestión de Cursos

Aplicación web desarrollada con React para el sistema de gestión de cursos.

## 🛠️ Tecnologías

- React
- Redux Toolkit & RTK Query
- Material UI
- TypeScript
- Zod & React Hook Form
- Day.js

## 📁 Estructura del Proyecto

```
src/
├── app/          # Estado global (Redux)
├── assets/       # Assets
├── components/   # Componentes reutilizables
├── config/       # Configuración
├── features/     # Características principales
├── hooks/        # Custom hooks
├── layouts/      # Layouts de la aplicación
├── pages/        # Páginas principales
├── routes/       # Rutas de la aplicación
├── services/     # Servicios y APIs
├── styles/       # Estilos
├── types/        # Tipos TypeScript
└── utils/        # Utilidades
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

3. Inicia el servidor de desarrollo
```bash
npm run dev
```

## 📱 Características Principales

- Gestión de cursos y comisiones
- Formularios personalizables
- Sistema de inscripciones y pagos
- Gestión de usuarios y links de referido
- Generación de reportes en excel

## 🎨 UI/UX

- Diseño responsivo
- Tema personalizado con Material UI
- Formularios validados con Zod
- Feedback visual para acciones del usuario
- Navegación intuitiva

## 🔒 Variables de Entorno

```env
VITE_API_BASE_URL=http://localhost:4000/api
```
