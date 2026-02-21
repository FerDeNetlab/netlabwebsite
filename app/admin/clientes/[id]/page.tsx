'use client'

import React from "react"
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState, use } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/navbar'
import { ArrowLeft, Save, Trash2, Building2, Mail, Phone, MapPin, FileText, Edit3, X } from 'lucide-react'

interface Cliente {
    id: string
    nombre: string
    empresa: string
    email: string
    telefono: string
    ciudad: string
    estado: string
    direccion: string
    rfc: string
    notas: string
    activo: boolean
    created_at: string
    updated_at: string
}

export default function ClienteDetallePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const { data: session, status } = useSession()
    const router = useRouter()
    const [cliente, setCliente] = useState<Cliente | null>(null)
    const [loading, setLoading] = useState(true)
    const [editing, setEditing] = useState(false)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<Partial<Cliente>>({})

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/admin/login')
        }
    }, [status, router])

    useEffect(() => {
        const fetchCliente = async () => {
            try {
                const response = await fetch(`/api/clientes/${id}`)
                if (response.ok) {
                    const data = await response.json()
                    setCliente(data)
                    setFormData(data)
                } else {
                    alert('Cliente no encontrado')
                    router.push('/admin/clientes')
                }
            } catch (error) {
                console.error('[ERP] Error fetching cliente:', error)
            } finally {
                setLoading(false)
            }
        }

        if (status === 'authenticated') {
            fetchCliente()
        }
    }, [status, id, router])

    const handleSave = async () => {
        setSaving(true)
        try {
            const response = await fetch(`/api/clientes/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                const updated = await response.json()
                setCliente(updated)
                setEditing(false)
            } else {
                alert('Error al actualizar cliente')
            }
        } catch (error) {
            console.error('[ERP] Error updating cliente:', error)
            alert('Error al actualizar')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('¿Estás seguro de que deseas eliminar este cliente? Esta acción lo desactivará.')) {
            return
        }

        try {
            const response = await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
            if (response.ok) {
                router.push('/admin/clientes')
            } else {
                alert('Error al eliminar cliente')
            }
        } catch (error) {
            console.error('[ERP] Error deleting cliente:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary font-mono">Cargando...</div>
            </div>
        )
    }

    if (!cliente) return null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <TerminalFrame title={`root@netlab:~/clientes/${cliente.nombre.toLowerCase().replace(/\s+/g, '-')}`}>
                        <div className="p-6 space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                                <div>
                                    <Button
                                        onClick={() => router.push('/admin/clientes')}
                                        variant="ghost"
                                        className="font-mono gap-2 text-sm mb-2"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                        Volver a Clientes
                                    </Button>
                                    <h1 className="text-3xl font-mono text-green-400">
                                        {cliente.nombre}
                                    </h1>
                                    {cliente.empresa && (
                                        <p className="text-gray-400 font-mono text-sm mt-1 flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            {cliente.empresa}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {!editing ? (
                                        <>
                                            <Button
                                                onClick={() => setEditing(true)}
                                                variant="outline"
                                                className="font-mono gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10 bg-transparent"
                                            >
                                                <Edit3 className="h-4 w-4" />
                                                Editar
                                            </Button>
                                            <Button
                                                onClick={handleDelete}
                                                variant="outline"
                                                className="font-mono gap-2 border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Eliminar
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                onClick={handleSave}
                                                disabled={saving}
                                                className="font-mono gap-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <Save className="h-4 w-4" />
                                                {saving ? 'Guardando...' : 'Guardar'}
                                            </Button>
                                            <Button
                                                onClick={() => { setEditing(false); setFormData(cliente) }}
                                                variant="outline"
                                                className="font-mono gap-2 bg-transparent"
                                            >
                                                <X className="h-4 w-4" />
                                                Cancelar
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Info / Edit Form */}
                            {editing ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[
                                            { name: 'nombre', label: 'Nombre completo', required: true },
                                            { name: 'empresa', label: 'Empresa' },
                                            { name: 'email', label: 'Email', type: 'email' },
                                            { name: 'telefono', label: 'Teléfono', type: 'tel' },
                                            { name: 'ciudad', label: 'Ciudad' },
                                            { name: 'estado', label: 'Estado' },
                                            { name: 'rfc', label: 'RFC' },
                                        ].map(field => (
                                            <div key={field.name}>
                                                <label className="block text-sm font-mono text-gray-400 mb-2">
                                                    {field.label} {field.required && '*'}
                                                </label>
                                                <input
                                                    type={field.type || 'text'}
                                                    name={field.name}
                                                    value={(formData as Record<string, string>)[field.name] || ''}
                                                    onChange={handleChange}
                                                    required={field.required}
                                                    className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-mono text-gray-400 mb-2">Dirección</label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            value={formData.direccion || ''}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-mono text-gray-400 mb-2">Notas</label>
                                        <textarea
                                            name="notas"
                                            value={formData.notas || ''}
                                            onChange={handleChange}
                                            rows={4}
                                            className="w-full px-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Contact Info */}
                                    <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-6 space-y-4">
                                        <h2 className="text-lg font-mono text-green-400 mb-4">Información de Contacto</h2>

                                        <div className="flex items-center gap-3 text-sm font-mono">
                                            <Mail className="h-4 w-4 text-green-500 shrink-0" />
                                            <span className="text-gray-300">{cliente.email || '—'}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm font-mono">
                                            <Phone className="h-4 w-4 text-green-500 shrink-0" />
                                            <span className="text-gray-300">{cliente.telefono || '—'}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-sm font-mono">
                                            <MapPin className="h-4 w-4 text-green-500 shrink-0" />
                                            <span className="text-gray-300">
                                                {[cliente.direccion, cliente.ciudad, cliente.estado].filter(Boolean).join(', ') || '—'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Fiscal Info */}
                                    <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-6 space-y-4">
                                        <h2 className="text-lg font-mono text-green-400 mb-4">Datos Fiscales</h2>

                                        <div className="flex items-center gap-3 text-sm font-mono">
                                            <FileText className="h-4 w-4 text-green-500 shrink-0" />
                                            <div>
                                                <span className="text-gray-500">RFC: </span>
                                                <span className="text-gray-300">{cliente.rfc || '—'}</span>
                                            </div>
                                        </div>

                                        <div className="text-sm font-mono">
                                            <span className="text-gray-500">Creado: </span>
                                            <span className="text-gray-400">
                                                {new Date(cliente.created_at).toLocaleDateString('es-MX', {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </span>
                                        </div>

                                        <div className="text-sm font-mono">
                                            <span className="text-gray-500">Actualizado: </span>
                                            <span className="text-gray-400">
                                                {cliente.updated_at
                                                    ? new Date(cliente.updated_at).toLocaleDateString('es-MX', {
                                                        year: 'numeric', month: 'long', day: 'numeric'
                                                    })
                                                    : '—'
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    {cliente.notas && (
                                        <div className="md:col-span-2 bg-zinc-900/50 border border-gray-700 rounded-lg p-6">
                                            <h2 className="text-lg font-mono text-gray-400 mb-2">Notas</h2>
                                            <p className="text-sm font-mono text-gray-300 whitespace-pre-wrap">{cliente.notas}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </TerminalFrame>
                </motion.div>
            </div>
        </div>
    )
}
