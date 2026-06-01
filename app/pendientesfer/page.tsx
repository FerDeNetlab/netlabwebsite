'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function PendientesferPage() {
  const [form, setForm] = useState({
    nombre: '',
    empresa: '',
    asunto: '',
    descripcion: '',
    fecha_deseada: '',
    hora_deseada: '',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/pendientes/externos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fecha_deseada: form.fecha_deseada
            ? form.hora_deseada
              ? form.fecha_deseada + 'T' + form.hora_deseada + ':00'
              : form.fecha_deseada
            : '',
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Error al enviar')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-mono text-white mb-2">Pendiente enviado</h2>
          <p className="text-zinc-400 font-mono text-sm">Fer recibio tu mensaje y lo revisara pronto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-start px-4 py-10">
      {/* Header */}
      <div className="mb-8 text-center">
        <Image
          src="/logo-netlab.png"
          alt="Netlab"
          width={140}
          height={40}
          className="mx-auto mb-4 object-contain"
          priority
        />
        <h1 className="text-xl font-mono text-white">Enviar pendiente a Fer</h1>
        <p className="text-zinc-400 font-mono text-sm mt-1">
          Deja aqui los pendientes que necesitas que el Fer te ayude a resolver.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-4"
      >
        {/* Nombre */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Tu nombre <span className="text-green-500">*</span>
          </label>
          <input
            type="text"
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ana Garcia"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Empresa */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Empresa</label>
          <input
            type="text"
            name="empresa"
            value={form.empresa}
            onChange={handleChange}
            placeholder="Netlab, Grupo AQ, etc."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Asunto */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">
            Asunto <span className="text-green-500">*</span>
          </label>
          <input
            type="text"
            name="asunto"
            required
            value={form.asunto}
            onChange={handleChange}
            placeholder="Resumen del pendiente"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Descripcion */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Descripcion</label>
          <textarea
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Detalles adicionales..."
            rows={4}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors resize-none"
          />
        </div>

        {/* Fecha y hora deseada */}
        <div>
          <label className="block text-xs font-mono text-zinc-400 mb-1">Fecha y hora deseada</label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="date"
              name="fecha_deseada"
              value={form.fecha_deseada}
              onChange={handleChange}
              className="flex-1 min-w-0 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
            <input
              type="time"
              name="hora_deseada"
              value={form.hora_deseada}
              onChange={handleChange}
              className="sm:w-32 min-w-0 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 font-mono text-xs">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-mono font-semibold py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Enviando...' : 'Enviar pendiente'}
        </button>
      </form>
    </div>
  )
}
