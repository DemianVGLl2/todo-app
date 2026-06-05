# Todo App — Mini Proyecto Full Stack

Proyecto de prueba desarrollado para familiarizarse con el stack NestJS + Prisma ORM + PostgreSQL + Angular. Consiste en una aplicación de lista de tareas (To Do List) con operaciones CRUD completas: crear, leer, actualizar y eliminar tareas.

---

## Stack utilizado

| Capa | Tecnología | Descripción |
|------|-----------|-------------|
| Base de datos | PostgreSQL | Motor de base de datos relacional, instalado localmente |
| ORM | Prisma v5 | Mapeo objeto-relacional, manejo de esquema y migraciones |
| Backend | NestJS | Framework de Node.js para la API REST |
| Frontend | Angular 19 | Framework para la interfaz de usuario |

---

## Estructura del repositorio

```
todo-app/
├── backend/         → API REST (NestJS + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       → Definición del modelo de datos
│   │   └── migrations/         → Historial de migraciones aplicadas
│   ├── src/
│   │   ├── tasks/
│   │   │   ├── tasks.controller.ts   → Define los endpoints HTTP
│   │   │   ├── tasks.service.ts      → Lógica de negocio y consultas a DB
│   │   │   └── tasks.module.ts       → Módulo que agrupa todo lo de tasks
│   │   ├── prisma.service.ts         → Servicio de conexión a PostgreSQL
│   │   └── main.ts                   → Punto de entrada, habilita CORS
│   └── .env                    → Variables de entorno (NO incluido en el repo)
└── frontend/        → Interfaz de usuario (Angular)
    └── src/app/
        ├── app.ts              → Componente principal con la lógica del UI
        ├── app.html            → Plantilla HTML de la lista de tareas
        ├── app.css             → Estilos del componente
        ├── tasks.ts            → Servicio que consume la API REST
        └── app.config.ts       → Configuración de providers de Angular
```

---

## Modelo de datos

La aplicación tiene un único modelo `Task` definido en `prisma/schema.prisma`:

```prisma
model Task {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  completed   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## API REST — Endpoints disponibles

Base URL: `http://localhost:3000`

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/tasks` | Obtener todas las tareas |
| GET | `/tasks/:id` | Obtener una tarea por ID |
| POST | `/tasks` | Crear una nueva tarea |
| PATCH | `/tasks/:id` | Actualizar una tarea (título, descripción o estado) |
| DELETE | `/tasks/:id` | Eliminar una tarea |

Ejemplo de body para POST `/tasks`:
```json
{
  "title": "Mi tarea",
  "description": "Descripción opcional"
}
```

---

## Notas importantes sobre la base de datos

La base de datos **no está incluida en el repositorio** — PostgreSQL corre localmente en cada máquina. Para levantar el proyecto es necesario:

1. Tener PostgreSQL instalado y corriendo
2. Crear manualmente la base de datos `todo_db`
3. Crear el archivo `backend/.env` con las credenciales locales (ver sección de configuración abajo)
4. Ejecutar las migraciones para que Prisma cree la tabla `Task`

El archivo `.env` está excluido del repo por seguridad (contiene la contraseña de la base de datos). El repositorio incluye un archivo `.env.example` como referencia.

---

## Configuración y ejecución local

### Requisitos previos

- Node.js v18 o superior
- npm
- PostgreSQL instalado y corriendo
- NestJS CLI: `npm install -g @nestjs/cli`
- Angular CLI: `npm install -g @angular/cli`

### 1. Clonar el repositorio

```bash
git clone https://github.com/DemianVGLl2/todo-app.git
cd todo-app
```

### 2. Configurar la base de datos

Abre pgAdmin (o cualquier cliente de PostgreSQL) y crea la base de datos:

```sql
CREATE DATABASE todo_db;
```

### 3. Configurar el backend

```bash
cd backend
npm install
```

Crea el archivo `.env` dentro de `backend/` con tus credenciales:

```env
DATABASE_URL="postgresql://postgres:TU_PASSWORD@localhost:5432/todo_db"
```

Aplica las migraciones para crear la tabla en la base de datos:

```bash
npx prisma migrate deploy
```

Levanta el servidor:

```bash
npm run start:dev
```

El backend queda disponible en `http://localhost:3000`.

### 4. Configurar el frontend

Abre una terminal nueva (deja el backend corriendo) y ejecuta:

```bash
cd frontend
npm install
ng serve -o
```

La aplicación se abre automáticamente en `http://localhost:4200`.

---

## Decisiones técnicas y ajustes realizados durante el desarrollo

Durante el desarrollo se presentaron algunas situaciones que vale la pena documentar:

**Prisma 7 → downgrade a Prisma 5**
La versión más reciente de Prisma (v7) genera el cliente como ESM puro, lo cual es incompatible con NestJS que corre en CommonJS. Se hizo downgrade a Prisma v5 que es estable y compatible sin configuración adicional. También se eliminó el archivo `prisma.config.ts` que Prisma 7 genera automáticamente y que causaba conflictos.

**tsconfig.json — cambio de módulo**
NestJS se creó con `"module": "nodenext"` por defecto, lo cual causaba errores de compatibilidad con el cliente de Prisma. Se cambió a `"module": "commonjs"` y `"moduleResolution": "node"`, y se eliminó la opción `resolvePackageJsonExports` que solo es válida con `nodenext`.

**CORS en el backend**
Angular corre en `localhost:4200` y NestJS en `localhost:3000`. Sin configuración de CORS el navegador bloquea las peticiones. Se habilitó en `main.ts`:
```typescript
app.enableCors({ origin: 'http://localhost:4200' });
```

**Detección de cambios en Angular**
Angular 19 con `provideBrowserGlobalErrorListeners()` presentó un comportamiento donde los event listeners se duplicaban en listas, causando que cada botón disparara dos peticiones HTTP. Se resolvió eliminando ese provider y usando `ChangeDetectorRef` para forzar la detección de cambios después de cada operación asíncrona.