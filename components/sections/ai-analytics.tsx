import Link from "next/link"
import { Brain, ArrowRight, Sparkles } from "lucide-react"
import { casosIA } from "@/lib/seo-data"

export function AIAnalyticsSection() {
  return (
    <section id="netlab-ia" className="py-20 px-4 border-t border-slate-900">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado compacto */}
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-green-500" />
          <span className="text-xs font-mono text-green-500 uppercase tracking-widest">Nuevo · Netlab IA</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 text-balance">
          Ahora también tenemos <span className="text-green-500">inteligencia artificial</span> para analizar tus datos en Odoo
        </h2>
        <p className="text-slate-400 max-w-2xl mb-10 text-pretty">
          Conectamos IA a tu ERP para convertir los datos que ya guardas en Odoo en decisiones: tendencias,
          predicciones y alertas en lenguaje claro, sin que tengas que armar un solo reporte.
        </p>

        {/* Grid de casos de uso — enlaces indexables con keywords */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {casosIA.map((caso) => (
            <Link
              key={caso.slug}
              href={`/odoo-ia/${caso.slug}`}
              className="group flex flex-col gap-2 p-4 rounded-lg border border-slate-800 bg-slate-900/30 hover:border-green-500/40 hover:bg-slate-900/60 transition-all"
            >
              <Brain className="w-5 h-5 text-green-500/80" />
              <span className="font-mono text-sm text-slate-200 group-hover:text-green-400 transition-colors leading-snug">
                {caso.nombre}
              </span>
              <span className="text-xs text-slate-500 leading-snug">{caso.descripcion}</span>
            </Link>
          ))}
        </div>

        <div className="mt-8">
          <Link
            href="/agendar"
            className="inline-flex items-center gap-2 font-mono text-sm font-bold text-black bg-green-500 hover:bg-green-400 transition-all rounded-sm px-5 py-3"
          >
            Quiero analizar mis datos con IA
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
