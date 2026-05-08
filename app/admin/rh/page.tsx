'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { Plus, Mail, Phone, Briefcase, Search, ArrowLeft, UserCog } from 'lucide-react'

interface Empleado {
    id: string
    nombre: string
    puesto: string | null
    departamento: string | null
    email: string | null
    telefono: string | null
    activo: boolean
}

export default function RHPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [empleados, setEmpleados] = useState<Empleado[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [showInactivos, setShowInactivos] = useState(false)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    useEffect(() => {
        if (status !== 'authenticated') return
        const load = async () => {
            try {
                const r = await fetch('/api/rh/empleados')
                if (r.ok) setEmpleados(await r.json())
            } catch (e) {
                console.error('[rh] load:', e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [status])

    const filtered = empleados.filter(e => {
        if (!showInactivos && !e.activo) return false
        if (!searchTerm) return true
        const t = searchTerm.toLowerCase()
        return (
            e.nombre?.toLowerCase().includes(t) ||
            e.puesto?.toLowerCase().includes(t) ||
            e.departamento?.toLowerCase().includes(t) ||
            e.email?.toLowerCase().includes(t)
        )
    })

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-primary font-mono">Cargando...</div>
            </div>
        )
    }
    if (!session?.user) return null

    const activos = empleados.filter(e => e.activo).length

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16">
                <TerminalFrame title="root@netlab:~/rh">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between border-b border-green-500/20 pb-4">
                            <div>
                                <Button onClick={() => router.push('/admin')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                    <ArrowLeft className="h-4 w-4" /> Dashboard
                                </Button>
                                <h1 className="text-3xl font-mono text-green-400 mb-2 flex items-center gap-3">
                                    <UserCog className="h-8 w-8" /> Recursos Humanos
                                </h1>
                                <p className="text-gray-400 font-mono text-sm">
                                    {activos} activo{activos !== 1 ? 's' : ''} · {empleados.length} total
                                </p>
                            </div>
                            <Button
                                onClick={() => router.push('/admin/rh/nuevo')}
                                className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2"
                            >
                                <Plus className="h-4 w-4" /> Nuevo Empleado
                            </Button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, puesto, departamento o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50"
                                />
                            </div>
                            <label className="flex items-center gap-2 font-mono text-sm text-gray-300 px-3 py-2 bg-zinc-900 border border-green-500/20 rounded cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={showInactivos}
                                    onChange={(e) => setShowInactivos(e.target.checked)}
                                    className="accent-green-500"
                                />
                                Mostrar inactivos
                            </label>
                        </div>

                        {filtered.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-400 font-mono mb-4">
                                    {searchTerm ? `No se encontraron empleados para "${searchTerm}"` : 'No hay empleados registrados'}
                                </p>
                                {!searchTerm && (
                                    <Button onClick={() => router.push('/admin/rh/nuevo')} className="bg-green-600 hover:bg-green-700 text-white font-mono">
                                        Crear primer empleado
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filtered.map(e => (
                                    <div
                                        key={e.id}
                                        onClick={() => router.push(`/admin/rh/${e.id}`)}
                                        className={`bg-zinc-900/50 border rounded-lg p-6 hover:border-green-500/40 transition-colors cursor-pointer ${e.activo ? 'border-green-500/20' : 'border-zinc-700 opacity-60'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-mono text-green-400">{e.nombre}</h3>
                                            {!e.activo && (
                                                <span className="text-[10px] font-mono px-2 py-0.5 bg-zinc-800 text-gray-400 rounded">BAJA</span>
                                            )}
                                        </div>
                                        <div className="space-y-2 text-sm font-mono text-gray-400">
                                            {e.puesto && (
                                                <div className="flex items-center gap-2">
                                                    <Briefcase className="h-4 w-4" />
                                                    <span className="truncate">{e.puesto}{e.departamento ? ` · ${e.departamento}` : ''}</span>
                                                </div>
                                            )}
                                            {e.email && (
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    <span className="truncate">{e.email}</span>
                                                </div>
                                            )}
                                            {e.telefono && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-4 w-4" />
                                                    <span>{e.telefono}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </TerminalFrame>
            </div>
        </div>
    )
}
