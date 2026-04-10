"use client"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Terminal, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BookingForm } from "@/components/booking-form"

const planLabels: Record<string, { name: string; price: string; color: string }> = {
  starter: { name: "STARTER", price: "$40,000 MXN", color: "text-green-400" },
  growth: { name: "GROWTH", price: "$90,000 MXN", color: "text-purple-400" },
  enterprise: { name: "ENTERPRISE", price: "A consultar", color: "text-cyan-400" },
}

export function AgendarClient() {
  const searchParams = useSearchParams()
  const plan = searchParams.get("plan") ?? undefined
  const planInfo = plan ? planLabels[plan] : null

  return (
    <main className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center px-4 py-16">
      {/* Back link */}
      <div className="w-full max-w-lg mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-green-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Volver al inicio
        </Link>
      </div>

      <motion.div
        className="w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Terminal header */}
        <div className="border border-slate-800 bg-[#050505] rounded-sm overflow-hidden">
          {/* Window bar */}
          <div className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900/50 border-b border-slate-800">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs font-mono text-slate-500">netlab@consulting: ~/agendar</span>
          </div>

          <div className="p-6 md:p-8 space-y-6">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="p-3 bg-green-500/10 rounded-full">
                <Terminal className="w-8 h-8 text-green-500" />
              </div>
            </div>

            {/* Prompt line */}
            <div className="font-mono text-xs text-green-500">
              root@netlab:~/agendar# diagnostic.py --start
            </div>

            {/* Plan badge (if coming from pricing) */}
            {planInfo && (
              <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-sm">
                <span className="text-slate-500 font-mono text-xs">Plan seleccionado:</span>
                <span className={`font-mono text-xs font-bold ${planInfo.color}`}>{planInfo.name}</span>
                <span className="text-slate-500 font-mono text-xs ml-auto">{planInfo.price}</span>
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white font-mono">
                Diagnóstico gratuito
              </h1>
              <p className="text-sm text-slate-400 font-mono leading-relaxed">
                Cuéntanos sobre tu empresa y agendamos una llamada para ver cómo Odoo CE puede ayudarte.
              </p>
            </div>

            {/* Form */}
            <BookingForm plan={plan} />

            {/* Footer note */}
            <div className="pt-2 text-xs text-slate-600 font-mono text-center border-t border-slate-800">
              Tus datos se guardan de forma segura y no serán compartidos.
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
