# Cafetería UCP - Sistema de Gestión

Sistema web completo para la gestión de la cafetería universitaria UCP, desarrollado con Next.js, React y MySQL.

## Características

- 🔐 Sistema de autenticación con roles (estudiante, profesor, admin)
- 🍽️ Catálogo dinámico de productos con categorías
- 🛒 Carrito de compras y sistema de pedidos
- 📊 Panel de administración con estadísticas
- 👤 Perfiles de usuario con historial de pedidos
- 📱 Diseño responsive y moderno

## Requisitos Previos

- Node.js 18.x o superior
- MySQL Server 5.7 o superior
- npm o yarn

## Instalación Rápida

### 1. Instalar dependencias
\`\`\`bash
npm install
\`\`\`

### 2. Configurar variables de entorno
El archivo `.env.local` ya está configurado. Si tu MySQL tiene contraseña, actualiza:
\`\`\`env
DB_PASSWORD=tu_contraseña_mysql
\`\`\`

### 3. Crear base de datos
Ejecuta los scripts SQL en MySQL:
\`\`\`bash
mysql -u root -p < scripts/01-create-database-schema.sql
mysql -u root -p < scripts/02-seed-initial-data.sql
\`\`\`

### 4. Probar conexión
\`\`\`bash
npm run db:test
\`\`\`

### 5. Iniciar servidor
\`\`\`bash
npm run dev
\`\`\`

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Usuarios de Prueba

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@ucp.edu.co | admin123 | Administrador |
| estudiante@ucp.edu.co | estudiante123 | Estudiante |
| profesor@ucp.edu.co | profesor123 | Profesor |

## Estructura del Proyecto

\`\`\`
cafeteria-ucp/
├── app/                    # Páginas y rutas de Next.js
│   ├── api/               # API Routes (backend)
│   ├── admin/             # Panel de administración
│   ├── login/             # Página de inicio de sesión
│   ├── register/          # Página de registro
│   ├── profile/           # Perfil de usuario
│   └── mis-pedidos/       # Historial de pedidos
├── components/            # Componentes React reutilizables
│   ├── ui/               # Componentes de UI (shadcn)
│   ├── auth-header.tsx   # Header con autenticación
│   ├── menu-catalog.tsx  # Catálogo de productos
│   └── order-form.tsx    # Formulario de pedidos
├── lib/                   # Utilidades y configuración
│   ├── db.ts             # Conexión a MySQL
│   └── auth.ts           # Utilidades de autenticación
├── scripts/               # Scripts SQL y de utilidad
│   ├── 01-create-database-schema.sql
│   ├── 02-seed-initial-data.sql
│   └── test-db-connection.ts
├── public/                # Archivos estáticos (imágenes)
└── docs/                  # Documentación
    └── DATABASE_SETUP.md
\`\`\`

## Comandos Disponibles

\`\`\`bash
npm run dev        # Iniciar servidor de desarrollo
npm run build      # Compilar para producción
npm start          # Ejecutar versión de producción
npm run lint       # Verificar código
npm run db:test    # Probar conexión a base de datos
\`\`\`

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/productos` - Listar productos
- `POST /api/productos` - Crear producto (admin)
- `PUT /api/productos/[id]` - Actualizar producto (admin)

### Pedidos
- `GET /api/pedidos` - Listar pedidos del usuario
- `POST /api/pedidos` - Crear nuevo pedido
- `PUT /api/pedidos/[id]` - Actualizar estado (admin)

### Administración
- `GET /api/admin/stats` - Estadísticas del sistema (admin)

### Health Check
- `GET /api/health` - Verificar estado del servidor y base de datos

## Documentación Adicional

- [Configuración de Base de Datos](docs/DATABASE_SETUP.md)

## Tecnologías Utilizadas

- **Frontend:** Next.js 14, React 19, TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Backend:** Next.js API Routes, Node.js
- **Base de Datos:** MySQL con mysql2
- **Autenticación:** JWT, bcryptjs
- **Validación:** Zod, React Hook Form

## Solución de Problemas

### Error de conexión a MySQL
\`\`\`bash
# Verificar que MySQL esté corriendo
sudo service mysql status

# Probar conexión
npm run db:test
\`\`\`

### Puerto 3000 ocupado
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Problemas con dependencias
\`\`\`bash
rm -rf node_modules package-lock.json
npm install
\`\`\`

## Licencia

Este proyecto fue desarrollado para la Universidad Católica de Pereira (UCP).
