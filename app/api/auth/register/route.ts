// app/api/auth/register/route.ts
import { type NextRequest, NextResponse } from "next/server"
import pool from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { sendEmail } from "@/lib/email" // El color gris desaparecerá cuando se use

export async function POST(request: NextRequest) {
  try {
    // 1. RECIBIR DATOS
    const { nombre, correo, password, userType = "estudiante" } = await request.json()

    // ... (Validaciones de nombre, correo, password) ...
    
    if (!nombre || !correo || !password) { 
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(correo)) {
      return NextResponse.json({ error: "Formato de correo inválido" }, { status: 400 })
    }

    if (password.length < 6) { 
      return NextResponse.json({ error: "La contraseña debe tener al menos 6 caracteres" }, { status: 400 })
    }

    // Verificar si el usuario ya existe
    const [existingUsers] = await pool.execute("SELECT id FROM usuarios WHERE correo = ?", [correo])

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "El correo ya está registrado" }, { status: 409 })
    }

    // 2. ENCRIPTACIÓN
    const hashedPassword = await hashPassword(password)

    // 3. INSERCIÓN EN LA DB
    const [result] = await pool.execute("INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES (?, ?, ?, ?)", [
      nombre,
      correo,
      hashedPassword,
      userType, 
    ])

    // 🚨 LLAMADA A LA FUNCIÓN DE ENVÍO DE CORREO 📧
    const emailContent = `
        <h1>¡Bienvenido a Cafetería UCP, ${nombre}!</h1>
        <p>Tu cuenta ha sido creada exitosamente. Ya puedes ingresar y realizar pedidos.</p>
        <p>Tu usuario es: <b>${correo}</b></p>
    `;
    
    await sendEmail({
        to: correo,
        subject: '✅ Registro Exitoso en Cafetería UCP',
        html: emailContent,
    });

    // 4. Devolver respuesta exitosa
    return NextResponse.json(
      { message: "Usuario registrado exitosamente. Correo de bienvenida enviado.", userId: (result as any).insertId },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error en registro:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}