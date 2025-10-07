import { Coffee, MapPin, Clock, Phone, Mail, Instagram, Facebook, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthHeader from "@/components/auth-header"
import MenuCatalog from "@/components/menu-catalog"
import OrderForm from "@/components/order-form"
import Image from "next/image"

export default function CafeteriaUCP() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AuthHeader />

      {/* Banner Promocional */}
      <div className="bg-secondary text-secondary-foreground py-3 text-center">
        <p className="font-semibold">🎓 ¡Descuento del 10% para estudiantes UCP! Presenta tu carnet</p>
      </div>

      {/* Hero Section */}
      <section
        id="inicio"
        className="relative h-96 flex items-center justify-center text-center text-primary-foreground overflow-hidden"
      >
        <Image
          src="/modern-university-cafeteria-interior-with-students.jpg"
          alt="Cafetería UCP Interior"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70 z-[1]" />
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h2 className="text-4xl md:text-6xl font-bold mb-4 text-balance">Bienvenidos a Cafetería UCP</h2>
          <p className="text-xl mb-8 text-pretty">
            El lugar perfecto para estudiantes. Café de calidad, comida fresca y un ambiente ideal para estudiar.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
            Ver Menú
          </Button>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">Nuestro Menú</h2>
          <MenuCatalog />
        </div>
      </section>

      {/* Pedidos Section */}
      <section id="pedidos" className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pedidos en Línea</h2>
          <div className="max-w-2xl mx-auto">
            <OrderForm />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-card-foreground">Contacto</h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-primary">Información de Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-secondary" />
                  <span>Campus Universidad Católica de Pereira, Bloque A</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-secondary" />
                  <span>Lunes a Viernes: 7:00 AM - 8:00 PM</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-secondary" />
                  <span>+57 (6) 313-7300 ext. 1234</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-secondary" />
                  <span>cafeteria@ucp.edu.co</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-primary">Síguenos en Redes Sociales</h4>
                <div className="flex space-x-4">
                  <Button variant="outline" size="icon">
                    <Instagram className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Facebook className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-6 text-primary">Ubicación</h3>
              <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Mapa de Google Maps</p>
                  <p className="text-sm">Campus UCP - Cafetería</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Coffee className="h-6 w-6" />
                <h3 className="text-xl font-bold">Cafetería UCP</h3>
              </div>
              <p className="text-sm opacity-90">
                El mejor café y comida para la comunidad universitaria. Calidad, frescura y precios especiales para
                estudiantes.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#menu" className="hover:text-secondary transition-colors">
                    Menú
                  </a>
                </li>
                <li>
                  <a href="#pedidos" className="hover:text-secondary transition-colors">
                    Pedidos en Línea
                  </a>
                </li>
                <li>
                  <a href="#contacto" className="hover:text-secondary transition-colors">
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-secondary transition-colors">
                    Promociones
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Horarios</h4>
              <ul className="space-y-2 text-sm">
                <li>Lunes - Viernes: 7:00 AM - 8:00 PM</li>
                <li>Sábados: 8:00 AM - 6:00 PM</li>
                <li>Domingos: Cerrado</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm opacity-90">
            <p>&copy; 2024 Cafetería UCP. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
