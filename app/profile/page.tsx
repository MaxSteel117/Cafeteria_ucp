"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Coffee, Edit, Save, X, ArrowLeft, ShoppingBag, DollarSign, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Usuario {
  id: number
  nombre: string
  correo: string
  rol: "estudiante" | "profesor" | "admin"
  fecha_registro: string
  activo: boolean
}

interface UserStats {
  totalPedidos: number
  totalGastado: number
  productoFavorito: string
  ultimoPedido: string
}

interface PedidoResumen {
  id: number
  producto_nombre: string
  cantidad: number
  total: number
  estado: string
  fecha_pedido: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<Usuario | null>(null)
  const [stats, setStats] = useState<UserStats>({
    totalPedidos: 0,
    totalGastado: 0,
    productoFavorito: "",
    ultimoPedido: "",
  })
  const [recentOrders, setRecentOrders] = useState<PedidoResumen[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    rol: "estudiante" as const,
  })
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchProfile()
  }, [])

  const checkAuthAndFetchProfile = async () => {
    try {
      // Verificar autenticación
      const authResponse = await fetch("/api/auth/me")
      if (!authResponse.ok) {
        router.push("/login")
        return
      }

      const userData = await authResponse.json()
      setUser(userData.user)
      setFormData({
        nombre: userData.user.nombre,
        correo: userData.user.correo,
        rol: userData.user.rol,
      })

      // Cargar estadísticas y pedidos recientes
      await Promise.all([fetchUserStats(), fetchRecentOrders()])
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/user/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching user stats:", error)
    }
  }

  const fetchRecentOrders = async () => {
    try {
      const response = await fetch("/api/pedidos?limit=5")
      if (response.ok) {
        const data = await response.json()
        setRecentOrders(data)
      }
    } catch (error) {
      console.error("Error fetching recent orders:", error)
    }
  }

  const handleUpdateProfile = async () => {
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setUser({ ...user!, ...formData })
        setEditing(false)
        setSuccess("Perfil actualizado exitosamente")
      } else {
        setError(data.error || "Error al actualizar perfil")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      nombre: user!.nombre,
      correo: user!.correo,
      rol: user!.rol,
    })
    setEditing(false)
    setError("")
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
      rol: value as "estudiante" | "profesor" | "admin",
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRoleBadgeVariant = (rol: string) => {
    switch (rol) {
      case "admin":
        return "destructive"
      case "profesor":
        return "default"
      case "estudiante":
        return "secondary"
      default:
        return "outline"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando perfil...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>Error al cargar el perfil del usuario</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Mi Perfil</h1>
              <p className="text-muted-foreground">Gestiona tu información personal</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-semibold">Cafetería UCP</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="text-2xl">{getInitials(user.nombre)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.nombre}</CardTitle>
                <CardDescription>{user.correo}</CardDescription>
                <Badge variant={getRoleBadgeVariant(user.rol)} className="w-fit mx-auto mt-2">
                  {user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Miembro desde:</span>
                  <span>{formatDate(user.fecha_registro)}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <Badge variant={user.activo ? "default" : "secondary"}>{user.activo ? "Activo" : "Inactivo"}</Badge>
                </div>

                <Button className="w-full bg-transparent" variant="outline" onClick={() => setEditing(!editing)}>
                  <Edit className="h-4 w-4 mr-2" />
                  {editing ? "Cancelar Edición" : "Editar Perfil"}
                </Button>
              </CardContent>
            </Card>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Card>
                <CardContent className="p-4 text-center">
                  <ShoppingBag className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{stats.totalPedidos}</div>
                  <div className="text-sm text-muted-foreground">Pedidos</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">${stats.totalGastado.toFixed(2)}</div>
                  <div className="text-sm text-muted-foreground">Gastado</div>
                </CardContent>
              </Card>
            </div>

            {stats.productoFavorito && (
              <Card className="mt-4">
                <CardContent className="p-4 text-center">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-red-500" />
                  <div className="font-semibold">{stats.productoFavorito}</div>
                  <div className="text-sm text-muted-foreground">Producto Favorito</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="info" className="space-y-6">
              <TabsList>
                <TabsTrigger value="info">Información Personal</TabsTrigger>
                <TabsTrigger value="orders">Historial de Pedidos</TabsTrigger>
                <TabsTrigger value="settings">Configuración</TabsTrigger>
              </TabsList>

              {/* Personal Information */}
              <TabsContent value="info">
                <Card>
                  <CardHeader>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      {editing ? "Edita tu información personal" : "Tu información personal registrada"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {editing ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="nombre">Nombre Completo</Label>
                          <Input
                            id="nombre"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            placeholder="Tu nombre completo"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="correo">Correo Electrónico</Label>
                          <Input
                            id="correo"
                            name="correo"
                            type="email"
                            value={formData.correo}
                            onChange={handleChange}
                            placeholder="tu@email.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="rol">Tipo de Usuario</Label>
                          <Select value={formData.rol} onValueChange={handleRolChange}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="estudiante">Estudiante</SelectItem>
                              <SelectItem value="profesor">Profesor</SelectItem>
                              <SelectItem value="admin">Administrador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex space-x-2 pt-4">
                          <Button onClick={handleUpdateProfile}>
                            <Save className="h-4 w-4 mr-2" />
                            Guardar Cambios
                          </Button>
                          <Button variant="outline" onClick={handleCancelEdit}>
                            <X className="h-4 w-4 mr-2" />
                            Cancelar
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                          <div className="text-lg">{user.nombre}</div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Correo</Label>
                          <div className="text-lg">{user.correo}</div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Tipo de Usuario</Label>
                          <div className="text-lg capitalize">{user.rol}</div>
                        </div>

                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Fecha de Registro</Label>
                          <div className="text-lg">{formatDate(user.fecha_registro)}</div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Order History */}
              <TabsContent value="orders">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>Pedidos Recientes</CardTitle>
                        <CardDescription>Tus últimos 5 pedidos realizados</CardDescription>
                      </div>
                      <Link href="/mis-pedidos">
                        <Button variant="outline">Ver Todos</Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {recentOrders.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
                        <p>No has realizado pedidos aún</p>
                        <Link href="/#menu" className="mt-4 inline-block">
                          <Button>Ver Menú</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentOrders.map((pedido) => (
                          <div key={pedido.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <div className="font-medium">{pedido.producto_nombre}</div>
                              <div className="text-sm text-muted-foreground">
                                Cantidad: {pedido.cantidad} • {formatDate(pedido.fecha_pedido)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold">${parseFloat(pedido.total as any || 0).toFixed(2)}</div>
                              <Badge variant="outline" className="text-xs">
                                {pedido.estado}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Cuenta</CardTitle>
                    <CardDescription>Gestiona las preferencias de tu cuenta</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium mb-2">Notificaciones</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configuración de notificaciones disponible próximamente
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Privacidad</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Configuración de privacidad disponible próximamente
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-2">Cambiar Contraseña</h4>
                        <p className="text-sm text-muted-foreground mb-4">
                          Funcionalidad de cambio de contraseña disponible próximamente
                        </p>
                        <Button variant="outline" disabled>
                          Cambiar Contraseña
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
