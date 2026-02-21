import Image from "next/image"
import Link from "next/link"
import { MapPin, Code2, Server } from "lucide-react"
import { footerCities, footerSystems, footerServices } from "@/lib/footer-data"

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-slate-900">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="relative h-10 w-40 opacity-90 hover:opacity-100 transition-opacity">
              <Image src="/logo-netlab.png" alt="Netlab Logo" fill sizes="160px" className="object-contain" />
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
              {footerSystems.map((system) => (
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
              {footerServices.map((service) => (
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
              {footerCities.map((city) => (
                <span key={city} className="text-xs text-slate-500 font-mono">
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* SEO Text */}
        <div className="border-t border-slate-900 pt-8 mt-8">
          <div className="prose prose-sm prose-invert max-w-none">
            <p className="text-xs text-slate-500 leading-relaxed font-mono">
              <span className="text-slate-400">Netlab Consulting</span> es líder en{" "}
              <strong className="text-slate-400">implementación de Odoo</strong>,{" "}
              <strong className="text-slate-400">software para inventarios</strong>,{" "}
              <strong className="text-slate-400">sistemas de ventas</strong> y{" "}
              <strong className="text-slate-400">ERP para PyMEs</strong> en México. Ofrecemos{" "}
              <strong className="text-slate-400">desarrollo de software en Guadalajara</strong>,{" "}
              <strong className="text-slate-400">software para empresas en Monterrey</strong>,{" "}
              <strong className="text-slate-400">sistemas empresariales en Ciudad de México</strong> y soluciones para
              todo el país. Especializados en{" "}
              <strong className="text-slate-400">punto de venta para restaurantes</strong>,{" "}
              <strong className="text-slate-400">control de inventarios para retail</strong>,{" "}
              <strong className="text-slate-400">CRM para ventas</strong> y{" "}
              <strong className="text-slate-400">automatización de procesos</strong>. Atendemos comercios,
              manufactureras, distribuidoras, farmacias, restaurantes y todo tipo de negocios que necesiten{" "}
              <strong className="text-slate-400">digitalización empresarial</strong>.
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
