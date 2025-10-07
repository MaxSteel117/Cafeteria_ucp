// API para estadísticas del usuario
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Obtener total de pedidos del usuario
    const [totalPedidosResult] = await pool.execute("SELECT COUNT(*) as total FROM pedidos WHERE id_usuario = ?", [
      decoded.userId,
    ])
    const totalPedidos = (totalPedidosResult as any[])[0].total

    // Obtener total gastado (excluyendo pedidos cancelados)
    const [totalGastadoResult] = await pool.execute(
      'SELECT COALESCE(SUM(total), 0) as total FROM pedidos WHERE id_usuario = ? AND estado != "cancelado"',
      [decoded.userId],
    )
    const totalGastado = (totalGastadoResult as any[])[0].total

    // Obtener producto favorito (más pedido)
    const [productoFavoritoResult] = await pool.execute(
      `SELECT pr.nombre, COUNT(*) as cantidad 
       FROM pedidos p 
       JOIN productos pr ON p.id_producto = pr.id 
       WHERE p.id_usuario = ? AND p.estado != "cancelado"
       GROUP BY p.id_producto 
       ORDER BY cantidad DESC 
       LIMIT 1`,
      [decoded.userId],
    )
    const productoFavorito =
      (productoFavoritoResult as any[]).length > 0 ? (productoFavoritoResult as any[])[0].nombre : ""

    // Obtener fecha del último pedido
    const [ultimoPedidoResult] = await pool.execute(
      "SELECT fecha_pedido FROM pedidos WHERE id_usuario = ? ORDER BY fecha_pedido DESC LIMIT 1",
      [decoded.userId],
    )
    const ultimoPedido = (ultimoPedidoResult as any[]).length > 0 ? (ultimoPedidoResult as any[])[0].fecha_pedido : ""

    return NextResponse.json({
      totalPedidos,
      totalGastado: Number.parseFloat(totalGastado),
      productoFavorito,
      ultimoPedido,
    })
  } catch (error) {
    console.error("Error al obtener estadísticas del usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
