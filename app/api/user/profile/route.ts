// API para actualizar perfil de usuario
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function PATCH(request: NextRequest) {
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

    const { nombre, correo, rol } = await request.json()

    // Validar datos requeridos
    if (!nombre || !correo) {
      return NextResponse.json({ error: "Nombre y correo son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: "Formato de correo inválido" }, { status: 400 })
    }

    // Verificar si el correo ya existe (excepto el usuario actual)
    const [existingUsers] = await pool.execute("SELECT id FROM usuarios WHERE correo = ? AND id != ?", [
      correo,
      decoded.userId,
    ])

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "El correo ya está en uso por otro usuario" }, { status: 409 })
    }

    // Construir query de actualización
    const updates: string[] = []
    const values: any[] = []

    updates.push("nombre = ?")
    values.push(nombre)

    updates.push("correo = ?")
    values.push(correo)

    // Solo permitir cambio de rol si es admin
    if (rol && decoded.rol === "admin") {
      updates.push("rol = ?")
      values.push(rol)
    }

    values.push(decoded.userId)

    // Actualizar usuario
    await pool.execute(`UPDATE usuarios SET ${updates.join(", ")} WHERE id = ?`, values)

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
    })
  } catch (error) {
    console.error("Error al actualizar perfil:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
