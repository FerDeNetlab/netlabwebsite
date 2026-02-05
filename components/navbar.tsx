import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "#servicios", label: "Servicios" },
    { href: "#sistemas", label: "Sistemas para negocios" },
    { href: "#proceso", label: "Proceso" },
    { href: "#casos", label: "Casos de éxito" },
    { href: "#faq", label: "FAQ" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0c0c0c]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0c0c0c]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-mono group">
          <div className="relative h-8 w-32">
            <Image src="/logo-netlab.png" alt="Netlab Logo" fill className="object-contain object-left" priority />
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-slate-400 hover:text-green-400 transition-colors">
              {link.label}
            </Link>
          ))}
          <Link
            href="#contacto"
            className="px-4 py-2 bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-600/20 hover:text-green-300 transition-all rounded-sm"
          >
            Agenda tu diagnóstico
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-800 bg-[#0c0c0c] animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-green-400 transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contacto"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-600/20 hover:text-green-300 transition-all rounded-sm text-center"
            >
              Agenda tu diagnóstico
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}

export default Navbar
