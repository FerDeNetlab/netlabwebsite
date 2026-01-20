'use client'

import React from "react"

import { useState, useEffect } from 'react'
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { Building2, Calendar, DollarSign, Mail, Phone, Plus, TrendingUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TerminalFrame } from '@/components/ui/terminal-frame'

interface Cliente {
  id: string
  nombre: string
  email: string
  telefono: string
  empresa: string
}

interface Oportunidad {
  id: string
  nombre: string
  etapa: string
  valor: number
  fecha_cierre_estimada: string
  probabilidad: number
  descripcion: string
  cliente_id: string
  cliente_nombre: string
  cliente_email: string
  cliente_telefono: string
  cliente_empresa: string
}

const etapas = [
  { id: 'prospecto', nombre: 'Prospecto', color: 'blue' },
  { id: 'calificacion', nombre: 'Calificación', color: 'yellow' },
  { id: 'propuesta', nombre: 'Propuesta', color: 'purple' },
  { id: 'negociacion', nombre: 'Negociación', color: 'orange' },
  { id: 'ganado', nombre: 'Ganado', color: 'green' },
  { id: 'perdido', nombre: 'Perdido', color: 'red' },
]

export function CRMKanban() {
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showNewForm, setShowNewForm] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    fetchOportunidades()
    fetchClientes()
  }, [])

  const fetchOportunidades = async () => {
    try {
      const response = await fetch('/api/oportunidades')
      if (response.ok) {
        const data = await response.json()
        setOportunidades(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching oportunidades:', error)
    }
  }

  const fetchClientes = async () => {
    try {
      const response = await fetch('/api/clientes')
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error('[v0] Error fetching clientes:', error)
    }
  }

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      setActiveId(null)
      return
    }

    const oportunidadId = active.id as string
    const nuevaEtapa = over.id as string

    // Actualizar localmente
    setOportunidades(prev =>
      prev.map(op =>
        op.id === oportunidadId ? { ...op, etapa: nuevaEtapa } : op
      )
    )

    // Actualizar en la BD
    try {
      await fetch(`/api/oportunidades/${oportunidadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ etapa: nuevaEtapa }),
      })
    } catch (error) {
      console.error('[v0] Error updating etapa:', error)
      // Revertir cambio local si falla
      fetchOportunidades()
    }

    setActiveId(null)
  }

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      purple: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
      orange: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
      green: 'bg-green-500/10 border-green-500/30 text-green-400',
      red: 'bg-red-500/10 border-red-500/30 text-red-400',
    }
    return colors[color as keyof typeof colors] || colors.blue
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-mono text-green-400 mb-2">CRM - Pipeline de Ventas</h1>
          <p className="text-gray-400 font-mono text-sm">
            Gestiona tus oportunidades de negocio
          </p>
        </div>
        <Button
          onClick={() => setShowNewForm(true)}
          className="font-mono bg-green-600 hover:bg-green-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nueva Oportunidad
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {etapas.map(etapa => (
            <KanbanColumn
              key={etapa.id}
              etapa={etapa}
              oportunidades={oportunidades.filter(op => op.etapa === etapa.id)}
              colorClasses={getColorClasses(etapa.color)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeId ? (
            <OportunidadCard
              oportunidad={oportunidades.find(op => op.id === activeId)!}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {showNewForm && (
        <NewOportunidadForm
          clientes={clientes}
          onClose={() => setShowNewForm(false)}
          onSuccess={() => {
            fetchOportunidades()
            setShowNewForm(false)
          }}
        />
      )}
    </div>
  )
}

function KanbanColumn({ etapa, oportunidades, colorClasses }: any) {
  const { useDroppable } = require('@dnd-kit/core')
  const { setNodeRef } = useDroppable({ id: etapa.id })

  const totalValor = oportunidades.reduce((sum: number, op: Oportunidad) => sum + op.valor, 0)

  return (
    <div className="flex flex-col">
      <div className={`${colorClasses} border rounded-lg p-3 mb-3`}>
        <div className="font-mono text-sm font-bold">{etapa.nombre}</div>
        <div className="text-xs mt-1">
          {oportunidades.length} ops · ${(totalValor / 1000).toFixed(0)}K
        </div>
      </div>
      
      <div
        ref={setNodeRef}
        className="flex-1 space-y-3 min-h-[500px] bg-zinc-900/30 rounded-lg p-2"
      >
        {oportunidades.map((oportunidad: Oportunidad) => (
          <DraggableOportunidad key={oportunidad.id} oportunidad={oportunidad} />
        ))}
      </div>
    </div>
  )
}

function DraggableOportunidad({ oportunidad }: { oportunidad: Oportunidad }) {
  const { useDraggable } = require('@dnd-kit/core')
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: oportunidad.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <OportunidadCard oportunidad={oportunidad} />
    </div>
  )
}

function OportunidadCard({ oportunidad, isDragging }: { oportunidad: Oportunidad; isDragging?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-zinc-800/50 border border-gray-700 rounded-lg p-4 cursor-grab active:cursor-grabbing ${
        isDragging ? 'opacity-50' : 'hover:border-green-500/50'
      }`}
    >
      <h3 className="font-mono text-green-400 text-sm font-bold mb-2">
        {oportunidad.nombre}
      </h3>

      <div className="space-y-2 text-xs text-gray-400 font-mono">
        <div className="flex items-center gap-2">
          <Building2 className="h-3 w-3" />
          <span>{oportunidad.cliente_empresa || oportunidad.cliente_nombre}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <DollarSign className="h-3 w-3" />
          <span className="text-green-400">${oportunidad.valor.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-2">
          <TrendingUp className="h-3 w-3" />
          <span>{oportunidad.probabilidad}% probabilidad</span>
        </div>

        {oportunidad.fecha_cierre_estimada && (
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{new Date(oportunidad.fecha_cierre_estimada).toLocaleDateString()}</span>
          </div>
        )}

        <div className="pt-2 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3" />
            <span className="text-xs truncate">{oportunidad.cliente_email}</span>
          </div>
          {oportunidad.cliente_telefono && (
            <div className="flex items-center gap-2 mt-1">
              <Phone className="h-3 w-3" />
              <span>{oportunidad.cliente_telefono}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

function NewOportunidadForm({ clientes, onClose, onSuccess }: any) {
  const [formData, setFormData] = useState({
    nombre: '',
    cliente_id: '',
    valor: '',
    fecha_cierre_estimada: '',
    probabilidad: '50',
    etapa: 'prospecto',
    descripcion: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/oportunidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          valor: parseFloat(formData.valor),
          probabilidad: parseInt(formData.probabilidad),
        }),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (error) {
      console.error('[v0] Error creating oportunidad:', error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <TerminalFrame className="w-full max-w-2xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-mono text-green-400">Nueva Oportunidad</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Nombre de la Oportunidad *
              </label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full bg-zinc-900 border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Cliente *
              </label>
              <select
                required
                value={formData.cliente_id}
                onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                className="w-full bg-zinc-900 border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
              >
                <option value="">Selecciona un cliente</option>
                {clientes.map((cliente: Cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.empresa || cliente.nombre} - {cliente.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Valor ($) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  className="w-full bg-zinc-900 border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-mono text-gray-400 mb-2">
                  Probabilidad (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probabilidad}
                  onChange={(e) => setFormData({ ...formData, probabilidad: e.target.value })}
                  className="w-full bg-zinc-900 border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Fecha de Cierre Estimada
              </label>
              <input
                type="date"
                value={formData.fecha_cierre_estimada}
                onChange={(e) => setFormData({ ...formData, fecha_cierre_estimada: e.target.value })}
                className="w-full bg-zinc-900 border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                rows={3}
                className="w-full bg-zinc-900 border border-gray-700 rounded px-4 py-2 text-white font-mono focus:border-green-500 focus:outline-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 font-mono bg-green-600 hover:bg-green-700">
                Crear Oportunidad
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 font-mono bg-zinc-700 hover:bg-zinc-600"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </TerminalFrame>
    </div>
  )
}
