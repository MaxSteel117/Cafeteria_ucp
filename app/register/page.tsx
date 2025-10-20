"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Coffee, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    contraseña: "",
    confirmarContraseña: "",
    rol: "estudiante",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Reemplaza tu función handleSubmit completa con esta
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Validar que las contraseñas coincidan
    if (formData.contraseña !== formData.confirmarContraseña) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    // Validar longitud de contraseña
    if (formData.contraseña.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          correo: formData.correo,
          password: formData.contraseña,
          userType: formData.rol,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirigir al login después del registro exitoso
        router.push("/login?message=Registro exitoso. Ahora puedes iniciar sesión.")
      } else {
        // Leer el mensaje de error que devuelve tu API
        setError(data.message || "Error al registrarse") 
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRolChange = (value: string) => {
    setFormData({
      ...formData,
      rol: value,
    })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Coffee className="h-8 w-8" />
            <span className="text-2xl font-bold">Cafetería UCP</span>
          </Link>
        </div>

        <Card className="shadow-lg border-2 border-primary/20 bg-card rounded-xl">
          <CardHeader className="text-center space-y-1">
  <CardTitle className="text-2xl mb-0">Crear Cuenta</CardTitle>
  <CardDescription className="text-sm text-muted-foreground mt-0">
    Únete a la comunidad UCP para realizar pedidos
  </CardDescription>
</CardHeader>

          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
  {error && (
    <Alert variant="destructive">
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}

  {/* Grupo del Nombre */}
  <div className="space-y-2">
    <Label htmlFor="nombre">Nombre Completo</Label>
    <Input
      id="nombre"
      name="nombre"
      type="text"
      placeholder="Tu nombre completo"
      value={formData.nombre}
      onChange={handleChange}
      required
    />
  </div>

  {/* Grupo del Correo */}
  <div className="space-y-2">
    <Label htmlFor="correo">Correo Electrónico</Label>
    <Input
      id="correo"
      name="correo"
      type="email"
      placeholder="tu@ucp.edu.co"
      value={formData.correo}
      onChange={handleChange}
      required
    />
  </div>

  {/* Grupo del Tipo de Usuario */}
  <div className="space-y-2">
    <Label htmlFor="rol">Tipo de Usuario</Label>
    <Select value={formData.rol} onValueChange={handleRolChange}>
      <SelectTrigger>
        <SelectValue placeholder="Selecciona tu rol" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="estudiante">Estudiante</SelectItem>
        <SelectItem value="profesor">Profesor</SelectItem>
        <SelectItem value="admin">Administrador</SelectItem>
      </SelectContent>
    </Select>
  </div>

  {/* Grupo de la Contraseña */}
  <div className="space-y-2">
    <Label htmlFor="contraseña">Contraseña</Label>
    <div className="relative">
      <Input
        id="contraseña"
        name="contraseña"
        type={showPassword ? "text" : "password"}
        placeholder="Mínimo 6 caracteres"
        value={formData.contraseña}
        onChange={handleChange}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>

  {/* Grupo de Confirmar Contraseña */}
  <div className="space-y-2">
    <Label htmlFor="confirmarContraseña">Confirmar Contraseña</Label>
    <div className="relative">
      <Input
        id="confirmarContraseña"
        name="confirmarContraseña"
        type={showConfirmPassword ? "text" : "password"}
        placeholder="Repite tu contraseña"
        value={formData.confirmarContraseña}
        onChange={handleChange}
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      >
        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  </div>

  <Button type="submit" className="w-full" disabled={loading}>
    {loading ? "Creando cuenta..." : "Crear Cuenta"}
  </Button>
</form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
              <Link href="/login" className="text-primary hover:underline font-medium">
                Inicia sesión aquí
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}