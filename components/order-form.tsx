"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Producto {
  id: number
  nombre: string
  precio: number
}

export default function OrderForm() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    producto: "",
    cantidad: "1",
    notas: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await fetch("/api/productos")
      if (response.ok) {
        const data = await response.json()
        setProductos(data)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      // Check if user is authenticated
      const authResponse = await fetch("/api/auth/me")

      if (!authResponse.ok) {
        setError("Debes iniciar sesión para realizar un pedido")
        setLoading(false)
        return
      }

      const response = await fetch("/api/pedidos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_producto: Number.parseInt(formData.producto),
          cantidad: Number.parseInt(formData.cantidad),
          notas: formData.notas,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess("¡Pedido realizado exitosamente!")
        setFormData({
          nombre: "",
          email: "",
          producto: "",
          cantidad: "1",
          notas: "",
        })
      } else {
        setError(data.error || "Error al realizar el pedido")
      }
    } catch (error) {
      setError("Error de conexión. Intenta nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const selectedProducto = productos.find((p) => p.id === Number.parseInt(formData.producto))
  const total = selectedProducto ? selectedProducto.precio * Number.parseInt(formData.cantidad || "1") : 0

  return (
    <section id="pedidos" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Pedidos en Línea</h2>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Realiza tu Pedido</CardTitle>
              <CardDescription>Inicia sesión y completa el formulario para realizar tu pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {success && (
                  <Alert>
                    <AlertDescription>{success}</AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="producto">Selecciona tu Producto</Label>
                  <Select value={formData.producto} onValueChange={(value) => handleSelectChange("producto", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Elige un producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((producto) => (
                        <SelectItem key={producto.id} value={producto.id.toString()}>
                        
{producto.nombre} - ${Number(producto.precio).toFixed(2)} 
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="cantidad">Cantidad</Label>
                  <Select value={formData.cantidad} onValueChange={(value) => handleSelectChange("cantidad", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Cantidad" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="notas">Notas Especiales (Opcional)</Label>
                  <Textarea
                    id="notas"
                    name="notas"
                    placeholder="Alguna preferencia o alergia..."
                    value={formData.notas}
                    onChange={handleChange}
                  />
                </div>

                {total > 0 && (
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total a pagar:</span>
                      <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                    </div>
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={loading || !formData.producto}>
                  {loading ? "Procesando..." : "Realizar Pedido"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
