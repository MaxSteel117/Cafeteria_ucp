"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Coffee, Clock, CheckCircle, XCircle, Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

const statusConfig = {
  pendiente: {
    label: "Pendiente",
    icon: Clock,
    color: "bg-yellow-500",
    variant: "secondary" as const,
  },
  listo: {
    label: "Listo",
    icon: CheckCircle,
    color: "bg-green-500",
    variant: "default" as const,
  },
  entregado: {
    label: "Entregado",
    icon: Package,
    color: "bg-blue-500",
    variant: "outline" as const,
  },
  cancelado: {
    label: "Cancelado",
    icon: XCircle,
    color: "bg-red-500",
    variant: "destructive" as const,
  },
}

export default function MisPedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<string>("todos")
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchPedidos()
  }, [])

  const checkAuthAndFetchPedidos = async () => {
    try {
      // Verificar autenticación
      const authResponse = await fetch("/api/auth/me")
      if (!authResponse.ok) {
        router.push("/login")
        return
      }

      // Obtener pedidos
      await fetchPedidos()
    } catch (error) {
      setError("Error de conexión")
      setLoading(false)
    }
  }

  const fetchPedidos = async () => {
    try {
      const url = filter !== "todos" ? `/api/pedidos?estado=${filter}` : "/api/pedidos"
      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        setPedidos(data)
      } else {
        setError("Error al cargar los pedidos")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!loading) {
      fetchPedidos()
    }
  }, [filter])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getTotalPedidos = () => {
    return pedidos.reduce((total, pedido) => total + pedido.total, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando pedidos...</div>
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
              <h1 className="text-3xl font-bold">Mis Pedidos</h1>
              <p className="text-muted-foreground">Historial y estado de tus pedidos</p>
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

        {/* Filters and Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{pedidos.length}</div>
              <div className="text-sm text-muted-foreground">Total Pedidos</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {pedidos.filter((p) => p.estado === "entregado").length}
              </div>
              <div className="text-sm text-muted-foreground">Entregados</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {pedidos.filter((p) => p.estado === "pendiente").length}
              </div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">${getTotalPedidos().toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">Total Gastado</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Historial de Pedidos</h2>
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

        {/* Orders List */}
        {pedidos.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No tienes pedidos</h3>
              <p className="text-muted-foreground mb-4">
                {filter === "todos" ? "Aún no has realizado ningún pedido" : `No tienes pedidos con estado "${filter}"`}
              </p>
              <Link href="/#menu">
                <Button>Ver Menú</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => {
              const StatusIcon = statusConfig[pedido.estado].icon

              return (
                <Card key={pedido.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Pedido #{pedido.id}</CardTitle>
                        <CardDescription>{formatDate(pedido.fecha_pedido)}</CardDescription>
                      </div>
                      <Badge variant={statusConfig[pedido.estado].variant}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig[pedido.estado].label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Detalles del Producto</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Producto:</strong> {pedido.producto_nombre}
                          </div>
                          <div>
                            <strong>Cantidad:</strong> {pedido.cantidad}
                          </div>
                          <div>
                            <strong>Precio unitario:</strong> ${pedido.producto_precio.toFixed(2)}
                          </div>
                          {pedido.notas && (
                            <div>
                              <strong>Notas:</strong> {pedido.notas}
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Información del Pedido</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <strong>Estado:</strong> {statusConfig[pedido.estado].label}
                          </div>
                          <div>
                            <strong>Última actualización:</strong> {formatDate(pedido.fecha_actualizacion)}
                          </div>
                          <div className="text-lg font-bold text-primary mt-2">
                            <strong>Total: ${pedido.total.toFixed(2)}</strong>
                          </div>
                        </div>
                      </div>
                    </div>

                    {pedido.estado === "listo" && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center text-green-800">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          <span className="font-semibold">¡Tu pedido está listo para recoger!</span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Dirígete al mostrador de la cafetería para recoger tu pedido.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
