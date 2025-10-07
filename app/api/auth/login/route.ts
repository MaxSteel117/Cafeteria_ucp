// API para inicio de sesión
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { verifyPassword, generateToken } from "@/lib/auth"
import type { Usuario } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { correo, contraseña } = await request.json()

    // Validar datos requeridos
    if (!correo || !contraseña) {
      return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar usuario por correo
    const [users] = await pool.execute("SELECT * FROM usuarios WHERE correo = ? AND activo = TRUE", [correo])

    const userArray = users as Usuario[]
    if (userArray.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const user = userArray[0]

    // Verificar contraseña
    const isValidPassword = await verifyPassword(contraseña, user.contraseña)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Generar token JWT
    const token = generateToken(user.id, user.rol)

    // Crear respuesta con cookie
    const response = NextResponse.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        nombre: user.nombre,
        correo: user.correo,
        rol: user.rol,
      },
    })

    // Establecer cookie con el token
    response.cookies.set("auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 días
    })

    return response
  } catch (error) {
    console.error("Error en login:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
