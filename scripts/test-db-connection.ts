// Script para probar la conexión a la base de datos
import pool, { testConnection } from "../lib/db"

async function main() {
  console.log("🔍 Probando conexión a la base de datos MySQL...\n")

  const isConnected = await testConnection()

  if (isConnected) {
    try {
      // Probar consulta simple
      const [rows] = await pool.query("SELECT COUNT(*) as count FROM usuarios")
      console.log(`[v0] 👥 Usuarios en la base de datos: ${(rows as any)[0].count}`)

      const [productos] = await pool.query("SELECT COUNT(*) as count FROM productos")
      console.log(`[v0] 🍽️  Productos en el menú: ${(productos as any)[0].count}`)

      const [pedidos] = await pool.query("SELECT COUNT(*) as count FROM pedidos")
      console.log(`[v0] 📦 Pedidos registrados: ${(pedidos as any)[0].count}\n`)

      console.log("✅ Todas las pruebas pasaron correctamente")
    } catch (error) {
      console.error("\n❌ Error al consultar las tablas:", error)
      console.error("💡 Asegúrate de ejecutar los scripts SQL para crear las tablas:")
      console.error("   1. scripts/01-create-database-schema.sql")
      console.error("   2. scripts/02-seed-initial-data.sql")
    }
  } else {
    console.error("\n❌ No se pudo establecer conexión con la base de datos")
    process.exit(1)
  }

  await pool.end()
  process.exit(0)
}

main()
