// API para estadísticas del dashboard de administración
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación y rol de admin
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.rol !== "admin") {
      return NextResponse.json({ error: "Acceso denegado" }, { status: 403 })
    }

    // Obtener estadísticas
    const [totalPedidosResult] = await pool.execute("SELECT COUNT(*) as total FROM pedidos")
    const totalPedidos = (totalPedidosResult as any[])[0].total

    const [pedidosPendientesResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM pedidos WHERE estado = "pendiente"',
    )
    const pedidosPendientes = (pedidosPendientesResult as any[])[0].total

    const [pedidosListosResult] = await pool.execute('SELECT COUNT(*) as total FROM pedidos WHERE estado = "listo"')
    const pedidosListos = (pedidosListosResult as any[])[0].total

    const [pedidosEntregadosResult] = await pool.execute(
      'SELECT COUNT(*) as total FROM pedidos WHERE estado = "entregado"',
    )
    const pedidosEntregados = (pedidosEntregadosResult as any[])[0].total

    // Ventas de hoy
    const [ventasHoyResult] = await pool.execute(
      'SELECT COALESCE(SUM(total), 0) as ventas FROM pedidos WHERE DATE(fecha_pedido) = CURDATE() AND estado != "cancelado"',
    )
    const ventasHoy = (ventasHoyResult as any[])[0].ventas

    // Total de usuarios
    const [totalUsuariosResult] = await pool.execute("SELECT COUNT(*) as total FROM usuarios WHERE activo = TRUE")
    const totalUsuarios = (totalUsuariosResult as any[])[0].total

    return NextResponse.json({
      totalPedidos,
      pedidosPendientes,
      pedidosListos,
      pedidosEntregados,
      ventasHoy: Number.parseFloat(ventasHoy),
      totalUsuarios,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
