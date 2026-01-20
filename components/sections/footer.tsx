import Image from "next/image"
import Link from "next/link"
import { MapPin, Code2, Server } from "lucide-react"

export function Footer() {
  const cities = [
    "Guadalajara",
    "Ciudad de México",
    "Monterrey",
    "Querétaro",
    "Puebla",
    "León",
    "Tijuana",
    "Mérida",
    "Culiacán",
  ]

  const systems = [
    { name: "Sistema de Ventas", href: "/sistemas/ventas" },
    { name: "CRM para Negocios", href: "/sistemas/crm" },
    { name: "Control de Inventarios", href: "/sistemas/inventarios" },
    { name: "Punto de Venta POS", href: "/sistemas/pos" },
    { name: "Sistema ERP", href: "/sistemas/erp" },
    { name: "E-commerce", href: "/sistemas/ecommerce" },
  ]

  const services = [
    { name: "Implementación Odoo", href: "/#servicios" },
    { name: "Desarrollo Enterprise", href: "/desarrollo-enterprise" },
    { name: "Soluciones Hardware", href: "/soluciones-hardware" },
    { name: "Automatización", href: "/sistemas/automatizacion" },
  ]

  return (
    <footer className="bg-[#050505] border-t border-slate-900">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="relative h-10 w-40 opacity-90 hover:opacity-100 transition-opacity">
              <Image src="/logo-netlab.png" alt="Netlab Logo" fill className="object-contain" />
            </div>
            <p className="text-sm text-slate-500 font-mono leading-relaxed">
              Software para negocios que funciona. Implementación Odoo, ERP y sistemas empresariales en México.
            </p>
          </div>

          {/* Sistemas */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Code2 className="w-4 h-4 text-green-500" />
              <h3 className="text-white font-mono font-bold text-sm">Sistemas para Negocios</h3>
            </div>
            <ul className="space-y-2">
              {systems.map((system) => (
                <li key={system.href}>
                  <Link
                    href={system.href}
                    className="text-xs text-slate-500 hover:text-green-500 transition-colors font-mono"
                  >
                    {system.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Server className="w-4 h-4 text-green-500" />
              <h3 className="text-white font-mono font-bold text-sm">Servicios</h3>
            </div>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="text-xs text-slate-500 hover:text-green-500 transition-colors font-mono"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Locations */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-green-500" />
              <h3 className="text-white font-mono font-bold text-sm">Cobertura en México</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {cities.map((city) => (
                <span key={city} className="text-xs text-slate-500 font-mono">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Text - Hidden but indexed */}
        <div className="border-t border-slate-900 pt-8 mt-8">
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-xs text-slate-700 leading-relaxed font-mono">
              <span className="text-slate-600">Netlab Consulting</span> es líder en{" "}
              <strong className="text-slate-600">implementación de Odoo</strong>,{" "}
              <strong className="text-slate-600">software para inventarios</strong>,{" "}
              <strong className="text-slate-600">sistemas de ventas</strong> y{" "}
              <strong className="text-slate-600">ERP para PyMEs</strong> en México. Ofrecemos{" "}
              <strong className="text-slate-600">desarrollo de software en Guadalajara</strong>,{" "}
              <strong className="text-slate-600">software para empresas en Monterrey</strong>,{" "}
              <strong className="text-slate-600">sistemas empresariales en Ciudad de México</strong> y soluciones para
              todo el país. Especializados en{" "}
              <strong className="text-slate-600">punto de venta para restaurantes</strong>,{" "}
              <strong className="text-slate-600">control de inventarios para retail</strong>,{" "}
              <strong className="text-slate-600">CRM para ventas</strong> y{" "}
              <strong className="text-slate-600">automatización de procesos</strong>. Atendemos comercios,
              manufactureras, distribuidoras, farmacias, restaurantes y todo tipo de negocios que necesiten{" "}
              <strong className="text-slate-600">digitalización empresarial</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-slate-900 py-6 text-center">
        <p className="text-slate-600 font-mono text-xs">
          © {new Date().getFullYear()} Netlab Consulting. System ready.
        </p>
      </div>
    </footer>
  )
}
