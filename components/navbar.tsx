import Link from "next/link"
import Image from "next/image"

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-[#0c0c0c]/80 backdrop-blur supports-[backdrop-filter]:bg-[#0c0c0c]/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 font-mono group">
          <div className="relative h-8 w-32">
            <Image src="/logo-netlab.png" alt="Netlab Logo" fill className="object-contain object-left" priority />
          </div>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-slate-400 hover:text-green-400 transition-colors">
            Inicio
          </Link>
          <Link href="#servicios" className="text-slate-400 hover:text-green-400 transition-colors">
            Servicios
          </Link>
          <Link href="#sistemas" className="text-slate-400 hover:text-green-400 transition-colors">
            Sistemas para negocios
          </Link>
          <Link href="#proceso" className="text-slate-400 hover:text-green-400 transition-colors">
            Proceso
          </Link>
          <Link href="#casos" className="text-slate-400 hover:text-green-400 transition-colors">
            Casos de éxito
          </Link>
          <Link href="#faq" className="text-slate-400 hover:text-green-400 transition-colors">
            FAQ
          </Link>
          <Link
            href="#contacto"
            className="px-4 py-2 bg-green-600/10 border border-green-500/50 text-green-400 hover:bg-green-600/20 hover:text-green-300 transition-all rounded-sm"
          >
            Agenda tu diagnóstico
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
