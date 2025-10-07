"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import OrderStatusTracker from "@/components/order-status-tracker"

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

export default function PedidoDetailPage({ params }: { params: { id: string } }) {
  const [pedido, setPedido] = useState<Pedido | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndFetchPedido()
  }, [])

  const checkAuthAndFetchPedido = async () => {
    try {
      // Verificar autenticación
      const authResponse = await fetch("/api/auth/me")
      if (!authResponse.ok) {
        router.push("/login")
        return
      }

      const userData = await authResponse.json()
      setUser(userData.user)

      // Obtener detalles del pedido
      const response = await fetch(`/api/pedidos/${params.id}`)

      if (response.ok) {
        const data = await response.json()
        setPedido(data)
      } else {
        setError("Error al cargar el pedido")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = (nuevoEstado: string) => {
    if (pedido) {
      setPedido({
        ...pedido,
        estado: nuevoEstado as any,
        fecha_actualizacion: new Date().toISOString(),
      })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Cargando pedido...</div>
        </div>
      </div>
    )
  }

  if (error || !pedido) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertDescription>{error || "Pedido no encontrado"}</AlertDescription>
          </Alert>
          <Link href="/mis-pedidos" className="mt-4 inline-block">
            <Button variant="outline">Volver a Mis Pedidos</Button>
          </Link>
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
            <Link href="/mis-pedidos">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Mis Pedidos
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Pedido #{pedido.id}</h1>
              <p className="text-muted-foreground">Realizado el {formatDate(pedido.fecha_pedido)}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-primary" />
            <span className="font-semibold">Cafetería UCP</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Pedido</CardTitle>
              <CardDescription>Información completa de tu pedido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Producto</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <div className="font-medium">{pedido.producto_nombre}</div>
                  <div className="text-sm text-muted-foreground">
                    Cantidad: {pedido.cantidad} × ${pedido.producto_precio.toFixed(2)}
                  </div>
                </div>
              </div>

              {pedido.notas && (
                <div>
                  <h4 className="font-semibold mb-2">Notas Especiales</h4>
                  <div className="bg-muted p-3 rounded-lg text-sm">{pedido.notas}</div>
                </div>
              )}

              <div>
                <h4 className="font-semibold mb-2">Resumen de Pago</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${(pedido.producto_precio * pedido.cantidad).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Total:</span>
                    <span className="text-primary">${pedido.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Información Adicional</h4>
                <div className="text-sm space-y-1">
                  <div>
                    <strong>Cliente:</strong> {pedido.usuario_nombre}
                  </div>
                  <div>
                    <strong>Fecha del pedido:</strong> {formatDate(pedido.fecha_pedido)}
                  </div>
                  <div>
                    <strong>Última actualización:</strong> {formatDate(pedido.fecha_actualizacion)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Status */}
          <Card>
            <CardHeader>
              <CardTitle>Estado del Pedido</CardTitle>
              <CardDescription>Seguimiento en tiempo real de tu pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderStatusTracker
                pedidoId={pedido.id}
                estadoActual={pedido.estado}
                onStatusUpdate={handleStatusUpdate}
                isAdmin={user?.rol === "admin"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
