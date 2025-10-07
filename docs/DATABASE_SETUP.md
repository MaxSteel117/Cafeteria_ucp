# Configuración de Base de Datos MySQL

## Requisitos Previos

- MySQL Server 5.7 o superior instalado
- Node.js 18.x o superior
- Acceso a MySQL (usuario root o con permisos de creación de bases de datos)

## Pasos de Configuración

### 1. Configurar Variables de Entorno

El archivo `.env.local` ya está configurado con los valores por defecto:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=cafeteria_ucp
JWT_SECRET=cafeteria_ucp_secret_key_2024_muy_segura
NEXT_PUBLIC_API_URL=http://localhost:3000
\`\`\`

**Importante:** Si tu MySQL tiene contraseña, actualiza `DB_PASSWORD` con tu contraseña.

### 2. Crear la Base de Datos y Tablas

Ejecuta los scripts SQL en orden:

#### Opción A: Desde MySQL Workbench o phpMyAdmin
1. Abre MySQL Workbench o phpMyAdmin
2. Ejecuta el archivo `scripts/01-create-database-schema.sql`
3. Ejecuta el archivo `scripts/02-seed-initial-data.sql`

#### Opción B: Desde la línea de comandos
\`\`\`bash
mysql -u root -p < scripts/01-create-database-schema.sql
mysql -u root -p < scripts/02-seed-initial-data.sql
\`\`\`

### 3. Probar la Conexión

Ejecuta el script de prueba:

\`\`\`bash
npx tsx scripts/test-db-connection.ts
\`\`\`

Deberías ver:
\`\`\`
✅ Conexión a MySQL exitosa
📊 Base de datos: cafeteria_ucp
🖥️  Host: localhost
👥 Usuarios en la base de datos: 3
🍽️  Productos en el menú: 18
📦 Pedidos registrados: 0
\`\`\`

### 4. Iniciar el Servidor

\`\`\`bash
npm run dev
\`\`\`

La conexión se probará automáticamente al iniciar. Verás en la consola:
\`\`\`
[v0] ✅ Conexión a MySQL exitosa
[v0] 📊 Base de datos: cafeteria_ucp
[v0] 🖥️  Host: localhost
\`\`\`

## Estructura de la Base de Datos

### Tabla: usuarios
- `id` - INT (Primary Key, Auto Increment)
- `nombre` - VARCHAR(100)
- `correo` - VARCHAR(100) UNIQUE
- `contraseña` - VARCHAR(255) (hasheada con bcrypt)
- `rol` - ENUM('estudiante', 'profesor', 'admin')
- `fecha_registro` - TIMESTAMP
- `activo` - BOOLEAN

### Tabla: productos
- `id` - INT (Primary Key, Auto Increment)
- `nombre` - VARCHAR(100)
- `descripcion` - TEXT
- `precio` - DECIMAL(10, 2)
- `categoria` - ENUM('bebidas', 'comidas', 'postres')
- `imagen` - VARCHAR(255)
- `disponible` - BOOLEAN
- `fecha_creacion` - TIMESTAMP

### Tabla: pedidos
- `id` - INT (Primary Key, Auto Increment)
- `id_usuario` - INT (Foreign Key → usuarios.id)
- `id_producto` - INT (Foreign Key → productos.id)
- `cantidad` - INT
- `notas` - TEXT
- `estado` - ENUM('pendiente', 'listo', 'entregado', 'cancelado')
- `total` - DECIMAL(10, 2)
- `fecha_pedido` - TIMESTAMP
- `fecha_actualizacion` - TIMESTAMP

## Usuarios de Prueba

Después de ejecutar el seed, tendrás estos usuarios:

| Correo | Contraseña | Rol |
|--------|-----------|-----|
| admin@ucp.edu.co | admin123 | admin |
| estudiante@ucp.edu.co | estudiante123 | estudiante |
| profesor@ucp.edu.co | profesor123 | profesor |

## Solución de Problemas

### Error: "Access denied for user"
- Verifica que `DB_USER` y `DB_PASSWORD` sean correctos en `.env.local`
- Asegúrate de que el usuario tenga permisos para crear bases de datos

### Error: "Unknown database 'cafeteria_ucp'"
- Ejecuta el script `01-create-database-schema.sql` primero

### Error: "Table doesn't exist"
- Asegúrate de haber ejecutado ambos scripts SQL en orden

### La conexión no se prueba al iniciar
- Verifica que estés en modo desarrollo (`npm run dev`)
- Revisa que las variables de entorno estén en `.env.local`

## Comandos Útiles

\`\`\`bash
# Probar conexión
npx tsx scripts/test-db-connection.ts

# Reiniciar base de datos (elimina todos los datos)
mysql -u root -p -e "DROP DATABASE IF EXISTS cafeteria_ucp;"
mysql -u root -p < scripts/01-create-database-schema.sql
mysql -u root -p < scripts/02-seed-initial-data.sql

# Ver logs de MySQL
# En Linux/Mac: tail -f /var/log/mysql/error.log
# En Windows: Ver en MySQL Workbench → Server → Server Logs
