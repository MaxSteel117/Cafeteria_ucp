"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Coffee,
  Users,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Plus,
  Search,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Pedido {
  id: number
  usuario_nombre: string
  producto_nombre: string
  producto_precio: number
  cantidad: number
  notas?: string
  estado: "pendiente" | "listo" | "entregado" | "cancelado"
  total: number
  fecha_pedido: string
  fecha_actualizacion: string
}

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: "bebidas" | "comidas" | "postres"
  imagen: string
  disponible: boolean
}

interface DashboardStats {
  totalPedidos: number
  pedidosPendientes: number
  pedidosListos: number
  pedidosEntregados: number
  ventasHoy: number
  totalUsuarios: number
}

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    variant: "secondary" as const,
    color: "text-yellow-600",
  },
  listo: {
    label: "Listo",
    icon: CheckCircle,
    variant: "default" as const,
    color: "text-green-600",
  },
  entregado: {
    label: "Entregado",
    icon: Package,
    variant: "outline" as const,
    color: "text-blue-600",
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    variant: "destructive" as const,
    color: "text-red-600",
  },
}

export default function AdminDashboard() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPedidos: 0,
    pedidosPendientes: 0,
    pedidosListos: 0,
    pedidosEntregados: 0,
    ventasHoy: 0,
    totalUsuarios: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<string>("todos")
  const [searchTerm, setSearchTerm] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAdminAndFetchData()
  }, [])

  const checkAdminAndFetchData = async () => {
    try {
      // Verificar autenticación y rol de admin
      const authResponse = await fetch("/api/auth/me")
      if (!authResponse.ok) {
        router.push("/login")
        return
      }

      const userData = await authResponse.json()
      if (userData.user.rol !== "admin") {
        router.push("/")
        return
      }

      // Cargar datos del dashboard
      await Promise.all([fetchPedidos(), fetchProductos(), fetchStats()])
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const fetchPedidos = async () => {
    try {
      const response = await fetch("/api/pedidos")
      if (response.ok) {
        const data = await response.json()
        setPedidos(data)
      }
    } catch (error) {
      console.error("Error fetching pedidos:", error)
    }
  }

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos")
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error("Error fetching productos:", error)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats")
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const updateOrderStatus = async (pedidoId: number, nuevoEstado: string) => {
    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (response.ok) {
        // Actualizar la lista de pedidos
        setPedidos(
          pedidos.map((pedido) =>
            pedido.id === pedidoId
              ? { ...pedido, estado: nuevoEstado as any, fecha_actualizacion: new Date().toISOString() }
              : pedido,
          ),
        )
        // Actualizar estadísticas
        fetchStats()
      } else {
        setError("Error al actualizar el estado del pedido")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const toggleProductAvailability = async (productId: number, disponible: boolean) => {
    try {
      const response = await fetch(`/api/productos/${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ disponible }),
      })

      if (response.ok) {
        setProductos(productos.map((producto) => (producto.id === productId ? { ...producto, disponible } : producto)))
      } else {
        setError("Error al actualizar el producto")
      }
    } catch (error) {
      setError("Error de conexión")
    }
  }

  const filteredPedidos = pedidos.filter((pedido) => {
    const matchesFilter = filter === "todos" || pedido.estado === filter
    const matchesSearch =
      searchTerm === "" ||
      pedido.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.producto_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.id.toString().includes(searchTerm)

    return matchesFilter && matchesSearch
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando panel de administración...</div>
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
              <h1 className="text-3xl font-bold">Panel de Administración</h1>
              <p className="text-muted-foreground">Gestión de la Cafetería UCP</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-semibold">Admin Dashboard</span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Pedidos</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalPedidos}</div>
              <p className="text-xs text-muted-foreground">Todos los pedidos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pedidosPendientes}</div>
              <p className="text-xs text-muted-foreground">Requieren atención</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pedidos Listos</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.pedidosListos}</div>
              <p className="text-xs text-muted-foreground">Para recoger</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.ventasHoy.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Ingresos del día</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pedidos" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pedidos">Gestión de Pedidos</TabsTrigger>
            <TabsTrigger value="productos">Gestión de Productos</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          </TabsList>

          {/* Orders Management */}
          <TabsContent value="pedidos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Pedidos Recientes</CardTitle>
                    <CardDescription>Gestiona el estado de los pedidos</CardDescription>
                  </div>
                  <div className="flex space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar pedidos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 w-64"
                      />
                    </div>
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los pedidos</SelectItem>
                        <SelectItem value="pendiente">Pendientes</SelectItem>
                        <SelectItem value="listo">Listos</SelectItem>
                        <SelectItem value="entregado">Entregados</SelectItem>
                        <SelectItem value="cancelado">Cancelados</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Producto</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPedidos.map((pedido) => {
                      const StatusIcon = statusConfig[pedido.estado].icon

                      return (
                        <TableRow key={pedido.id}>
                          <TableCell className="font-medium">#{pedido.id}</TableCell>
                          <TableCell>{pedido.usuario_nombre}</TableCell>
                          <TableCell>{pedido.producto_nombre}</TableCell>
                          <TableCell>{pedido.cantidad}</TableCell>
                          <TableCell>${pedido.total.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant={statusConfig[pedido.estado].variant}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig[pedido.estado].label}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(pedido.fecha_pedido)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {pedido.estado === "pendiente" && (
                                <Button size="sm" onClick={() => updateOrderStatus(pedido.id, "listo")}>
                                  Marcar Listo
                                </Button>
                              )}
                              {pedido.estado === "listo" && (
                                <Button size="sm" onClick={() => updateOrderStatus(pedido.id, "entregado")}>
                                  Entregar
                                </Button>
                              )}
                              {pedido.estado !== "cancelado" && pedido.estado !== "entregado" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => updateOrderStatus(pedido.id, "cancelado")}
                                >
                                  Cancelar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {filteredPedidos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron pedidos con los filtros aplicados
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Management */}
          <TabsContent value="productos" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gestión de Productos</CardTitle>
                    <CardDescription>Administra el menú de la cafetería</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Agregar Producto
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Producto</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productos.map((producto) => (
                      <TableRow key={producto.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{producto.nombre}</div>
                            <div className="text-sm text-muted-foreground">{producto.descripcion}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{producto.categoria}</TableCell>
                        <TableCell>${producto.precio.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={producto.disponible ? "default" : "secondary"}>
                            {producto.disponible ? "Disponible" : "No disponible"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleProductAvailability(producto.id, !producto.disponible)}
                            >
                              {producto.disponible ? "Deshabilitar" : "Habilitar"}
                            </Button>
                            <Button size="sm" variant="outline">
                              Editar
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="usuarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>Administra los usuarios del sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Gestión de usuarios disponible próximamente</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
