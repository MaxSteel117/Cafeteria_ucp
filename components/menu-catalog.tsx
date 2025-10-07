"use client"

import { useState } from "react"
import { ShoppingCart, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Image from "next/image"

interface Producto {
  id: number
  nombre: string
  descripcion: string
  precio: number
  categoria: "bebidas" | "comidas" | "postres"
  imagen: string
  disponible: boolean
}

interface CartItem {
  producto: Producto
  cantidad: number
  notas?: string
}

const PRODUCTOS_ESTATICOS: Producto[] = [
  // Bebidas
  {
    id: 1,
    nombre: "Café Americano",
    descripcion: "Café negro recién preparado",
    precio: 3000,
    categoria: "bebidas",
    imagen: "/cappuccino-coffee-with-latte-art.jpg",
    disponible: true,
  },
  {
    id: 2,
    nombre: "Capuchino",
    descripcion: "Espresso con leche espumada y cacao",
    precio: 4500,
    categoria: "bebidas",
    imagen: "/cappuccino-coffee-with-latte-art.jpg",
    disponible: true,
  },
  {
    id: 3,
    nombre: "Moca",
    descripcion: "Café con chocolate y crema batida",
    precio: 5000,
    categoria: "bebidas",
    imagen: "/cappuccino-coffee-with-latte-art.jpg",
    disponible: true,
  },
  {
    id: 4,
    nombre: "Latte Frío",
    descripcion: "Café con leche servido con hielo",
    precio: 4800,
    categoria: "bebidas",
    imagen: "/iced-latte-coffee-with-ice-cubes.jpg",
    disponible: true,
  },
  {
    id: 5,
    nombre: "Smoothie de Frutas",
    descripcion: "Batido natural de frutas frescas",
    precio: 5500,
    categoria: "bebidas",
    imagen: "/fresh-fruit-smoothie-in-glass.jpg",
    disponible: true,
  },
  {
    id: 6,
    nombre: "Té Helado",
    descripcion: "Té negro con limón y hielo",
    precio: 3500,
    categoria: "bebidas",
    imagen: "/iced-latte-coffee-with-ice-cubes.jpg",
    disponible: true,
  },
  // Comidas
  {
    id: 7,
    nombre: "Sándwich Club",
    descripcion: "Triple sándwich con pollo, tocino y vegetales",
    precio: 8500,
    categoria: "comidas",
    imagen: "/gourmet-sandwich-with-fresh-ingredients.jpg",
    disponible: true,
  },
  {
    id: 8,
    nombre: "Ensalada César",
    descripcion: "Lechuga romana, crutones, parmesano y aderezo césar",
    precio: 7500,
    categoria: "comidas",
    imagen: "/fresh-salad-bowl-with-mixed-greens.jpg",
    disponible: true,
  },
  {
    id: 9,
    nombre: "Empanadas",
    descripcion: "3 empanadas de carne o pollo",
    precio: 6000,
    categoria: "comidas",
    imagen: "/crispy-empanadas-on-plate.jpg",
    disponible: true,
  },
  {
    id: 10,
    nombre: "Wrap Vegetariano",
    descripcion: "Tortilla integral con vegetales asados y hummus",
    precio: 7000,
    categoria: "comidas",
    imagen: "/gourmet-sandwich-with-fresh-ingredients.jpg",
    disponible: true,
  },
  {
    id: 11,
    nombre: "Bowl de Quinoa",
    descripcion: "Quinoa con vegetales, aguacate y proteína",
    precio: 9000,
    categoria: "comidas",
    imagen: "/fresh-salad-bowl-with-mixed-greens.jpg",
    disponible: true,
  },
  {
    id: 12,
    nombre: "Arepa Rellena",
    descripcion: "Arepa con queso, carne desmechada y aguacate",
    precio: 6500,
    categoria: "comidas",
    imagen: "/crispy-empanadas-on-plate.jpg",
    disponible: true,
  },
  // Postres
  {
    id: 13,
    nombre: "Brownie de Chocolate",
    descripcion: "Brownie casero con nueces",
    precio: 4000,
    categoria: "postres",
    imagen: "/chocolate-brownie-with-nuts.jpg",
    disponible: true,
  },
  {
    id: 14,
    nombre: "Cheesecake",
    descripcion: "Tarta de queso con frutos rojos",
    precio: 5500,
    categoria: "postres",
    imagen: "/chocolate-brownie-with-nuts.jpg",
    disponible: true,
  },
  {
    id: 15,
    nombre: "Tiramisú",
    descripcion: "Postre italiano con café y mascarpone",
    precio: 6000,
    categoria: "postres",
    imagen: "/chocolate-brownie-with-nuts.jpg",
    disponible: true,
  },
  {
    id: 16,
    nombre: "Galletas Artesanales",
    descripcion: "3 galletas de chocolate chip recién horneadas",
    precio: 3500,
    categoria: "postres",
    imagen: "/chocolate-brownie-with-nuts.jpg",
    disponible: true,
  },
  {
    id: 17,
    nombre: "Flan de Caramelo",
    descripcion: "Flan casero con caramelo líquido",
    precio: 4500,
    categoria: "postres",
    imagen: "/chocolate-brownie-with-nuts.jpg",
    disponible: true,
  },
  {
    id: 18,
    nombre: "Helado Artesanal",
    descripcion: "2 bolas de helado a elección",
    precio: 5000,
    categoria: "postres",
    imagen: "/chocolate-brownie-with-nuts.jpg",
    disponible: true,
  },
]

const categoryIcons = {
  bebidas: "☕",
  comidas: "🥪",
  postres: "🍰",
}

const categoryNames = {
  bebidas: "Bebidas",
  comidas: "Comidas Rápidas",
  postres: "Postres",
}

export default function MenuCatalog() {
  const [productos] = useState<Producto[]>(PRODUCTOS_ESTATICOS)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState("")

  const addToCart = (producto: Producto, cantidad: number, notas?: string) => {
    const existingItem = cart.find((item) => item.producto.id === producto.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + cantidad, notas: notas || item.notas }
            : item,
        ),
      )
    } else {
      setCart([...cart, { producto, cantidad, notas }])
    }
  }

  const removeFromCart = (productId: number) => {
    setCart(cart.filter((item) => item.producto.id !== productId))
  }

  const updateCartQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity === 0) {
      removeFromCart(productId)
    } else {
      setCart(cart.map((item) => (item.producto.id === productId ? { ...item, cantidad: newQuantity } : item)))
    }
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.producto.precio * item.cantidad, 0)
  }

  const handleOrderProduct = () => {
    if (!selectedProduct) return

    addToCart(selectedProduct, quantity, notes)
    setSelectedProduct(null)
    setQuantity(1)
    setNotes("")
  }

  const groupedProducts = productos.reduce(
    (acc, producto) => {
      if (!acc[producto.categoria]) {
        acc[producto.categoria] = []
      }
      acc[producto.categoria].push(producto)
      return acc
    },
    {} as Record<string, Producto[]>,
  )

  return (
    <section id="menu" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-card-foreground">Nuestro Menú</h2>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-lg px-4 py-2">
                <ShoppingCart className="h-4 w-4 mr-2" />
                {cart.length} productos - ${getTotalPrice().toLocaleString()}
              </Badge>
            </div>
          )}
        </div>

        {Object.entries(groupedProducts).map(([categoria, productos]) => (
          <div key={categoria} className="mb-12">
            <h3 className="text-2xl font-semibold mb-6 text-primary">
              {categoryIcons[categoria as keyof typeof categoryIcons]}{" "}
              {categoryNames[categoria as keyof typeof categoryNames]}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {productos.map((producto) => {
                const cartItem = cart.find((item) => item.producto.id === producto.id)

                return (
                  <Card key={producto.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="w-full h-48 bg-muted rounded-lg mb-4 relative overflow-hidden">
                        <Image
                          src={producto.imagen || "/placeholder.svg"}
                          alt={producto.nombre}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{producto.nombre}</CardTitle>
                          <CardDescription className="mt-2">{producto.descripcion}</CardDescription>
                        </div>
                        {!producto.disponible && <Badge variant="destructive">No disponible</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-2xl font-bold text-primary">${producto.precio.toLocaleString()}</span>
                      </div>

                      {cartItem ? (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(producto.id, cartItem.cantidad - 1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold">{cartItem.cantidad}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateCartQuantity(producto.id, cartItem.cantidad + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button variant="destructive" size="sm" onClick={() => removeFromCart(producto.id)}>
                            Quitar
                          </Button>
                        </div>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              className="w-full"
                              disabled={!producto.disponible}
                              onClick={() => setSelectedProduct(producto)}
                            >
                              Pedir
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Agregar al Pedido</DialogTitle>
                              <DialogDescription>
                                {selectedProduct?.nombre} - ${selectedProduct?.precio.toLocaleString()}
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              <div>
                                <Label>Cantidad</Label>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="font-semibold px-4">{quantity}</span>
                                  <Button size="sm" variant="outline" onClick={() => setQuantity(quantity + 1)}>
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="notes">Notas especiales (opcional)</Label>
                                <Textarea
                                  id="notes"
                                  placeholder="Alguna preferencia o alergia..."
                                  value={notes}
                                  onChange={(e) => setNotes(e.target.value)}
                                />
                              </div>

                              <div className="flex justify-between items-center pt-4 border-t">
                                <span className="font-semibold">
                                  Total: ${selectedProduct ? (selectedProduct.precio * quantity).toLocaleString() : "0"}
                                </span>
                                <Button onClick={handleOrderProduct}>Agregar al Pedido</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
