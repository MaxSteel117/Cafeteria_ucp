// Utilidades de autenticación
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "cafeteria-ucp-secret-key"

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: number, rol: string): string {
  return jwt.sign({ userId, rol }, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token: string): { userId: number; rol: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; rol: string }
  } catch {
    return null
  }
}
