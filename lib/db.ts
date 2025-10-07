// Configuración de base de datos para Cafetería UCP
import mysql from "mysql2/promise"

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "cafeteria_ucp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Crear pool de conexiones
const pool = mysql.createPool(dbConfig)

export async function testConnection() {
  try {
    const connection = await pool.getConnection()
    console.log("[v0] ✅ Conexión a MySQL exitosa")
    console.log(`[v0] 📊 Base de datos: ${dbConfig.database}`)
    console.log(`[v0] 🖥️  Host: ${dbConfig.host}`)
    connection.release()
    return true
  } catch (error) {
    console.error("[v0] ❌ Error al conectar con MySQL:", error)
    console.error("[v0] 🔧 Verifica las variables de entorno en .env.local:")
    console.error("   - DB_HOST")
    console.error("   - DB_USER")
    console.error("   - DB_PASSWORD")
    console.error("   - DB_NAME")
    return false
  }
}

if (process.env.NODE_ENV !== "production") {
  testConnection()
}

export default pool

// Tipos TypeScript para las entidades
export interface Usuario {
  id: number
  nombre: string
  correo: string
  contraseña: string
  rol: "estudiante" | "profesor" | "admin"
  fecha_registro: Date
  activo: boolean
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: "bebidas" | "comidas" | "postres"
  imagen: string
  disponible: boolean
  fecha_creacion: Date
}

export interface Pedido {
  id: number
  id_usuario: number
  id_producto: number
  cantidad: number
  notas?: string
  estado: "pendiente" | "listo" | "entregado" | "cancelado"
  total: number
  fecha_pedido: Date
  fecha_actualizacion: Date
}
