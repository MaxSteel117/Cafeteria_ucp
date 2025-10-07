// API para gestión de productos
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get("categoria")

    let query = "SELECT * FROM productos WHERE disponible = TRUE"
    const params: any[] = []

    if (categoria) {
      query += " AND categoria = ?"
      params.push(categoria)
    }

    query += " ORDER BY categoria, nombre"

    const [productos] = await pool.execute(query, params)

    return NextResponse.json(productos)
  } catch (error) {
    console.error("Error al obtener productos:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nombre, descripcion, precio, categoria, imagen } = await request.json()

    // Validar datos requeridos
    if (!nombre || !precio || !categoria) {
      return NextResponse.json({ error: "Nombre, precio y categoría son requeridos" }, { status: 400 })
    }

    // Insertar nuevo producto
    const [result] = await pool.execute(
      "INSERT INTO productos (nombre, descripcion, precio, categoria, imagen) VALUES (?, ?, ?, ?, ?)",
      [nombre, descripcion, precio, categoria, imagen],
    )

    return NextResponse.json(
      { message: "Producto creado exitosamente", productId: (result as any).insertId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al crear producto:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
