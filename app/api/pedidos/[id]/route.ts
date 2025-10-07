// API para actualizar estado de pedidos individuales
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { estado } = await request.json()
    const pedidoId = params.id

    // Validar estado
    const estadosValidos = ["pendiente", "listo", "entregado", "cancelado"]
    if (!estadosValidos.includes(estado)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 })
    }

    // Verificar que el pedido existe
    const [pedidos] = await pool.execute("SELECT * FROM pedidos WHERE id = ?", [pedidoId])

    const pedidoArray = pedidos as any[]
    if (pedidoArray.length === 0) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    const pedido = pedidoArray[0]

    // Solo el admin o el dueño del pedido pueden actualizar
    if (decoded.rol !== "admin" && decoded.userId !== pedido.id_usuario) {
      return NextResponse.json({ error: "No tienes permisos para actualizar este pedido" }, { status: 403 })
    }

    // Actualizar estado del pedido
    await pool.execute("UPDATE pedidos SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?", [
      estado,
      pedidoId,
    ])

    return NextResponse.json({
      message: "Estado del pedido actualizado exitosamente",
      pedidoId,
      nuevoEstado: estado,
    })
  } catch (error) {
    console.error("Error al actualizar pedido:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    const pedidoId = params.id

    // Obtener detalles del pedido
    const [pedidos] = await pool.execute(
      `SELECT p.*, u.nombre as usuario_nombre, pr.nombre as producto_nombre, pr.precio as producto_precio
       FROM pedidos p
       JOIN usuarios u ON p.id_usuario = u.id
       JOIN productos pr ON p.id_producto = pr.id
       WHERE p.id = ?`,
      [pedidoId],
    )

    const pedidoArray = pedidos as any[]
    if (pedidoArray.length === 0) {
      return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 })
    }

    const pedido = pedidoArray[0]

    // Solo el admin o el dueño del pedido pueden ver los detalles
    if (decoded.rol !== "admin" && decoded.userId !== pedido.id_usuario) {
      return NextResponse.json({ error: "No tienes permisos para ver este pedido" }, { status: 403 })
    }

    return NextResponse.json(pedido)
  } catch (error) {
    console.error("Error al obtener pedido:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
