// API para cerrar sesión
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const response = NextResponse.json({ message: "Sesión cerrada exitosamente" })

    // Eliminar cookie de autenticación
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expira inmediatamente
    })

    return response
  } catch (error) {
    console.error("Error al cerrar sesión:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}
