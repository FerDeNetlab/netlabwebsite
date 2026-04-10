"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Loader } from "lucide-react"

interface BookingFormProps {
  onSuccess?: () => void
}

export function BookingForm({ onSuccess }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    empresa: "",
    usuarios: "1",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Validar email básico
      if (!formData.email.includes("@")) {
        setError("Email inválido")
        setIsLoading(false)
        return
      }

      // Guardar en BD
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Error al guardar")
      }

      // Redirigir a Cal.com después de 500ms
      setTimeout(() => {
        window.location.href = "https://cal.com/ferdenetlab"
      }, 500)

      if (onSuccess) onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
      setIsLoading(false)
    }
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Nombre */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1.5">Tu nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          required
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-sm text-white font-mono text-sm focus:border-green-500 focus:outline-none transition-colors placeholder:text-slate-600"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1.5">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@empresa.com"
          required
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-sm text-white font-mono text-sm focus:border-green-500 focus:outline-none transition-colors placeholder:text-slate-600"
        />
      </div>

      {/* Empresa */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1.5">Empresa (opcional)</label>
        <input
          type="text"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          placeholder="Nombre de tu empresa"
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-sm text-white font-mono text-sm focus:border-green-500 focus:outline-none transition-colors placeholder:text-slate-600"
        />
      </div>

      {/* Usuarios */}
      <div>
        <label className="block text-xs font-mono text-slate-400 mb-1.5">¿Cuántos usuarios?</label>
        <select
          name="usuarios"
          value={formData.usuarios}
          onChange={handleChange}
          className="w-full px-3 py-2 bg-slate-900/50 border border-slate-700 rounded-sm text-white font-mono text-sm focus:border-green-500 focus:outline-none transition-colors"
        >
          <option value="1">1-5 usuarios</option>
          <option value="10">5-10 usuarios</option>
          <option value="25">10-25 usuarios</option>
          <option value="50">25-50 usuarios</option>
          <option value="100">50-100 usuarios</option>
          <option value="100+">100+ usuarios</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="p-2 bg-red-500/10 border border-red-500/50 rounded-sm text-red-400 text-xs font-mono">
          {error}
        </div>
      )}

      {/* CTA */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 font-mono font-bold text-black bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-sm"
      >
        {isLoading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            Agendar consulta
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p className="text-xs text-slate-500 font-mono text-center">
        Te redirigiremos a nuestro calendario para confirmar la fecha
      </p>
    </motion.form>
  )
}
