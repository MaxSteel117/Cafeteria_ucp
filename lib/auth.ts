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
// lib/auth.ts (Añade esto al final del archivo)
import { type NextRequest } from 'next/server';

interface JwtPayload {
    userId: number;
    rol: string;
}

// Función para obtener el ID de usuario del token JWT en la petición HTTP (Necesaria para /mis-pedidos)
export function getUserIdFromToken(request: NextRequest): number | null {
    const authHeader = request.headers.get('authorization');
    
    // Verifica si el encabezado Authorization existe y empieza con 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    // Extrae el token (quita "Bearer ")
    const token = authHeader.split(' ')[1];

    try {
        // Usa la función verifyToken que ya definiste
        const decoded = verifyToken(token);
        
        // Devuelve el ID de usuario
        return decoded ? decoded.userId : null;

    } catch (error) {
        // Si el token es inválido o ha expirado
        console.error("Token de autenticación inválido:", error);
        return null;
    }
}
