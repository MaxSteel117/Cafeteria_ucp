// API para gestión de pedidos
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

    const { searchParams } = new URL(request.url)
    const estado = searchParams.get("estado")

    let query = `
      SELECT p.*, u.nombre as usuario_nombre, pr.nombre as producto_nombre, pr.precio as producto_precio
      FROM pedidos p
      JOIN usuarios u ON p.id_usuario = u.id
      JOIN productos pr ON p.id_producto = pr.id
    `
    const params: any[] = []

    // Si no es admin, solo mostrar pedidos del usuario
    if (decoded.rol !== "admin") {
      query += " WHERE p.id_usuario = ?"
      params.push(decoded.userId)
    }

    if (estado) {
      query += decoded.rol === "admin" ? " WHERE p.estado = ?" : " AND p.estado = ?"
      params.push(estado)
    }

    query += " ORDER BY p.fecha_pedido DESC"

    const [pedidos] = await pool.execute(query, params)

    return NextResponse.json(pedidos)
  } catch (error) {
    console.error("Error al obtener pedidos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
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

    const { id_producto, cantidad, notas } = await request.json()

    // Validar datos requeridos
    if (!id_producto || !cantidad) {
      return NextResponse.json({ error: "Producto y cantidad son requeridos" }, { status: 400 })
    }

    // Obtener precio del producto
    const [productos] = await pool.execute("SELECT precio FROM productos WHERE id = ? AND disponible = TRUE", [
      id_producto,
    ])

    const productArray = productos as any[]
    if (productArray.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado o no disponible" }, { status: 404 })
    }

    const precio = productArray[0].precio
    const total = precio * cantidad

    // Crear pedido
    const [result] = await pool.execute(
      "INSERT INTO pedidos (id_usuario, id_producto, cantidad, notas, total) VALUES (?, ?, ?, ?, ?)",
      [decoded.userId, id_producto, cantidad, notas, total],
    )

    return NextResponse.json(
      { message: "Pedido creado exitosamente", pedidoId: (result as any).insertId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear pedido:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
