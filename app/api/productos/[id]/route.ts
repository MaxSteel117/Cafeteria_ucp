// API para actualizar productos individuales
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
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

    const { disponible, nombre, descripcion, precio, categoria } = await request.json()
    const productId = params.id

    // Verificar que el producto existe
    const [productos] = await pool.execute("SELECT * FROM productos WHERE id = ?", [productId])

    const productArray = productos as any[]
    if (productArray.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    // Construir query de actualización dinámicamente
    const updates: string[] = []
    const values: any[] = []

    if (disponible !== undefined) {
      updates.push("disponible = ?")
      values.push(disponible)
    }

    if (nombre !== undefined) {
      updates.push("nombre = ?")
      values.push(nombre)
    }

    if (descripcion !== undefined) {
      updates.push("descripcion = ?")
      values.push(descripcion)
    }

    if (precio !== undefined) {
      updates.push("precio = ?")
      values.push(precio)
    }

    if (categoria !== undefined) {
      updates.push("categoria = ?")
      values.push(categoria)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: "No hay campos para actualizar" }, { status: 400 })
    }

    values.push(productId)

    // Actualizar producto
    await pool.execute(`UPDATE productos SET ${updates.join(", ")} WHERE id = ?`, values)

    return NextResponse.json({
      message: "Producto actualizado exitosamente",
      productId,
    })
  } catch (error) {
    console.error("Error al actualizar producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    // Obtener detalles del producto
    const [productos] = await pool.execute("SELECT * FROM productos WHERE id = ?", [productId])

    const productArray = productos as any[]
    if (productArray.length === 0) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 })
    }

    return NextResponse.json(productArray[0])
  } catch (error) {
    console.error("Error al obtener producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
