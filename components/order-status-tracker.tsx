"use client"

import { useState } from "react"
import { Clock, CheckCircle, Package, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface OrderStatusTrackerProps {
  pedidoId: number
  estadoActual: "pendiente" | "listo" | "entregado" | "cancelado"
  onStatusUpdate?: (nuevoEstado: string) => void
  isAdmin?: boolean
}

const statusSteps = [
  {
    key: "pendiente",
    label: "Pedido Recibido",
    description: "Tu pedido ha sido recibido y está siendo preparado",
    icon: Clock,
    color: "text-yellow-600",
  },
  {
    key: "listo",
    label: "Listo para Recoger",
    description: "Tu pedido está listo, puedes pasar a recogerlo",
    icon: CheckCircle,
    color: "text-green-600",
  },
  {
    key: "entregado",
    label: "Entregado",
    description: "Pedido entregado exitosamente",
    icon: Package,
    color: "text-blue-600",
  },
]

export default function OrderStatusTracker({
  pedidoId,
  estadoActual,
  onStatusUpdate,
  isAdmin = false,
}: OrderStatusTrackerProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const updateStatus = async (nuevoEstado: string) => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/pedidos/${pedidoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado }),
      })

      if (response.ok) {
        onStatusUpdate?.(nuevoEstado)
      } else {
        const data = await response.json()
        setError(data.error || "Error al actualizar estado")
      }
    } catch (error) {
      setError("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const getStepStatus = (stepKey: string) => {
    const currentIndex = statusSteps.findIndex((step) => step.key === estadoActual)
    const stepIndex = statusSteps.findIndex((step) => step.key === stepKey)

    if (estadoActual === "cancelado") {
      return "cancelled"
    }

    if (stepIndex <= currentIndex) {
      return "completed"
    }

    return "pending"
  }

  if (estadoActual === "cancelado") {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-center text-red-800">
          <XCircle className="h-5 w-5 mr-2" />
          <span className="font-semibold">Pedido Cancelado</span>
        </div>
        <p className="text-sm text-red-700 mt-1">Este pedido ha sido cancelado.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {statusSteps.map((step, index) => {
          const status = getStepStatus(step.key)
          const Icon = step.icon

          return (
            <div key={step.key} className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  status === "completed"
                    ? "bg-green-100 text-green-600"
                    : status === "pending"
                      ? "bg-gray-100 text-gray-400"
                      : "bg-red-100 text-red-600"
                }`}
              >
                <Icon className="h-4 w-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium ${status === "completed" ? "text-green-800" : "text-gray-600"}`}>
                    {step.label}
                  </h4>

                  {status === "completed" && (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      Completado
                    </Badge>
                  )}
                </div>

                <p className="text-sm text-gray-500 mt-1">{step.description}</p>

                {isAdmin &&
                  status === "pending" &&
                  index === statusSteps.findIndex((s) => s.key === estadoActual) + 1 && (
                    <Button size="sm" className="mt-2" onClick={() => updateStatus(step.key)} disabled={loading}>
                      {loading ? "Actualizando..." : `Marcar como ${step.label}`}
                    </Button>
                  )}
              </div>
            </div>
          )
        })}
      </div>

      {isAdmin && (
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-2">Acciones de Administrador</h4>
          <div className="flex space-x-2">
            {estadoActual !== "cancelado" && (
              <Button variant="destructive" size="sm" onClick={() => updateStatus("cancelado")} disabled={loading}>
                Cancelar Pedido
              </Button>
            )}

            {estadoActual === "listo" && (
              <Button size="sm" onClick={() => updateStatus("entregado")} disabled={loading}>
                Marcar como Entregado
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
