"use client"

import { useState, useEffect, useMemo } from "react" // Importa useMemo
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Coffee, Clock, CheckCircle, XCircle, Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Interface para los datos que vienen de la API
interface PedidoFromApi {
  pedido_id: number;
  usuario_nombre: string;
  producto_nombre: string;
  producto_imagen: string;
  cantidad: number;
  precio_unitario: number;
  notas?: string;
  estado: "pendiente" | "listo" | "entregado" | "cancelado";
  total: number;
  fecha_pedido: string;
  fecha_actualizacion: string;
}

// ✅ NUEVA INTERFACE: para agrupar los pedidos
interface PedidoAgrupado {
  id: number;
  usuario_nombre: string;
  estado: "pendiente" | "listo" | "entregado" | "cancelado";
  total: number;
  fecha_pedido: string;
  fecha_actualizacion: string;
  productos: {
    nombre: string;
    cantidad: number;
    precio_unitario: number;
    imagen: string;
  }[];
  notas?: string;
}

const statusConfig = {
  pendiente: { label: "Pendiente", icon: Clock, variant: "secondary" as const },
  listo: { label: "Listo", icon: CheckCircle, variant: "default" as const },
  entregado: { label: "Entregado", icon: Package, variant: "outline" as const },
  cancelado: { label: "Cancelado", icon: XCircle, variant: "destructive" as const },
};

export default function MisPedidosPage() {
  const [pedidosApi, setPedidosApi] = useState<PedidoFromApi[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState<string>("todos")
  const router = useRouter()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const authResponse = await fetch("/api/auth/me");
        if (!authResponse.ok) {
          router.push("/login");
          return;
        }
        await fetchPedidos();
      } catch (err) {
        setError("Error de conexión");
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const fetchPedidos = async (currentFilter = filter) => {
    setLoading(true);
    try {
      const url = currentFilter !== "todos" ? `/api/pedidos?estado=${currentFilter}` : "/api/pedidos";
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setPedidosApi(data);
        setError("");
      } else {
        setError("Error al cargar los pedidos");
      }
    } catch (error) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  };
  
  // ✅ LÓGICA DE AGRUPACIÓN
  const pedidosAgrupados = useMemo(() => {
    const grupos: Record<number, PedidoAgrupado> = {};

    pedidosApi.forEach((item) => {
      if (!grupos[item.pedido_id]) {
        grupos[item.pedido_id] = {
          id: item.pedido_id,
          usuario_nombre: item.usuario_nombre,
          estado: item.estado,
          total: item.total,
          fecha_pedido: item.fecha_pedido,
          fecha_actualizacion: item.fecha_actualizacion,
          productos: [],
          notas: item.notas,
        };
      }
      grupos[item.pedido_id].productos.push({
        nombre: item.producto_nombre,
        cantidad: item.cantidad,
        precio_unitario: item.precio_unitario,
        imagen: item.producto_imagen,
      });
    });

    return Object.values(grupos);
  }, [pedidosApi]);
  
  const handleFilterChange = (newFilter: string) => {
      setFilter(newFilter);
      fetchPedidos(newFilter);
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };
  
  // ✅ CÁLCULOS CORREGIDOS
  const totalGastado = useMemo(() => {
      return pedidosAgrupados.reduce((sum, pedido) => sum + parseFloat(pedido.total as any || 0), 0);
  }, [pedidosAgrupados]);

  if (loading) {
    return <div className="text-center py-20">Cargando pedidos...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4 mr-2" />Volver</Button></Link>
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

        {error && <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>}
        
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-primary">{pedidosAgrupados.length}</div><div className="text-sm text-muted-foreground">Total Pedidos</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-green-600">{pedidosAgrupados.filter(p => p.estado === 'entregado').length}</div><div className="text-sm text-muted-foreground">Entregados</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-yellow-600">{pedidosAgrupados.filter(p => p.estado === 'pendiente').length}</div><div className="text-sm text-muted-foreground">Pendientes</div></CardContent></Card>
          <Card><CardContent className="p-4"><div className="text-2xl font-bold text-primary">${totalGastado.toFixed(2)}</div><div className="text-sm text-muted-foreground">Total Gastado</div></CardContent></Card>
        </div>

        {/* Filter */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Historial de Pedidos</h2>
          <Select value={filter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Filtrar" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="pendiente">Pendientes</SelectItem>
              <SelectItem value="listo">Listos</SelectItem>
              <SelectItem value="entregado">Entregados</SelectItem>
              <SelectItem value="cancelado">Cancelados</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {pedidosAgrupados.length === 0 ? (
          <Card><CardContent className="p-8 text-center"><Coffee className="h-12 w-12 mx-auto mb-4 text-muted-foreground" /><h3 className="text-lg font-semibold">No tienes pedidos</h3><p className="text-muted-foreground mb-4">No se encontraron pedidos con el filtro seleccionado.</p><Link href="/#menu"><Button>Ver Menú</Button></Link></CardContent></Card>
        ) : (
          <div className="space-y-4">
            {pedidosAgrupados.map((pedido) => {
              const StatusIcon = statusConfig[pedido.estado].icon;
              return (
                <Card key={pedido.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">Pedido #{pedido.id}</CardTitle>
                        <CardDescription>{formatDate(pedido.fecha_pedido)}</CardDescription>
                      </div>
                      <Badge variant={statusConfig[pedido.estado].variant}><StatusIcon className="h-3 w-3 mr-1" />{statusConfig[pedido.estado].label}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {/* ✅ Muestra la lista de productos */}
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2">Productos</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm">
                        {pedido.productos.map(prod => (
                          <li key={prod.nombre}>
                           {prod.cantidad} x {prod.nombre} (${parseFloat(prod.precio_unitario as any || 0).toFixed(2)} c/u)
                          </li>
                        ))}
                      </ul>
                    </div>
                    {pedido.notas && <p className="text-sm mb-4"><strong>Notas:</strong> {pedido.notas}</p>}
                    <div className="text-lg font-bold text-primary mt-2 text-right">
                      <strong>Total: ${parseFloat(pedido.total as any || 0).toFixed(2)}</strong>
                    </div>
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