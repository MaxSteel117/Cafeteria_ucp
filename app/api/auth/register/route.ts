// API para registro de usuarios
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { hashPassword } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { nombre, correo, contraseña, rol = "estudiante" } = await request.json()

    // Validar datos requeridos
    if (!nombre || !correo || !contraseña) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: "Formato de correo inválido" }, { status: 400 })
    }

    // Validar contraseña segura
    if (contraseña.length < 6) {
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.execute("SELECT id FROM usuarios WHERE correo = ?", [correo])

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 })
    }

    // Encriptar contraseña
    const hashedPassword = await hashPassword(contraseña)

    // Insertar nuevo usuario
    const [result] = await pool.execute("INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)", [
      nombre,
      correo,
      hashedPassword,
      rol,
    ])

    return NextResponse.json(
      { message: "Usuario registrado exitosamente", userId: (result as any).insertId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
