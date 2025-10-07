// API para obtener información del usuario autenticado
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyToken } from "@/lib/auth"
import type { Usuario } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    // Verificar token de autenticación
    const token = request.cookies.get("auth-token")?.value
    if (!token) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    // Obtener información del usuario
    const [users] = await pool.execute(
      "SELECT id, nombre, correo, rol, fecha_registro FROM usuarios WHERE id = ? AND activo = TRUE",
      [decoded.userId],
    )

    const userArray = users as Usuario[]
    if (userArray.length === 0) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
    }

    const user = userArray[0]

    return NextResponse.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
        fecha_registro: user.fecha_registro,
      },
    })
  } catch (error) {
    console.error("Error al obtener usuario:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
