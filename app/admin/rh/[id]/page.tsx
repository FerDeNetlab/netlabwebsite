'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save, Upload, FileText, Trash2, ExternalLink, AlertTriangle } from 'lucide-react'

const inputCls = 'w-full px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50'
const labelCls = 'block text-xs font-mono text-gray-400 mb-1'

interface Documento {
    id: string
    nombre: string
    tipo: string
    url: string
    size_bytes: number
    mime_type: string
    uploaded_at: string
}

interface Empleado {
    id: string
    nombre: string
    curp: string | null
    rfc: string | null
    nss: string | null
    telefono: string | null
    email: string | null
    puesto: string | null
    departamento: string | null
    fecha_ingreso: string | null
    fecha_nacimiento: string | null
    salario_mensual: string | number | null
    tipo_contrato: string | null
    estado_civil: string | null
    direccion: string | null
    contacto_emergencia_nombre: string | null
    contacto_emergencia_telefono: string | null
    contacto_emergencia_relacion: string | null
    banco: string | null
    numero_tarjeta: string | null
    sucursal_bbva: string | null
    notas: string | null
    activo: boolean
    fecha_baja: string | null
    motivo_baja: string | null
    documentos: Documento[]
}

const TIPOS_DOC = [
    { value: 'contrato', label: 'Contrato' },
    { value: 'ine', label: 'INE / Identificación' },
    { value: 'curp', label: 'CURP' },
    { value: 'rfc', label: 'Constancia RFC' },
    { value: 'nss', label: 'Alta IMSS / NSS' },
    { value: 'comprobante_domicilio', label: 'Comprobante de domicilio' },
    { value: 'acta_nacimiento', label: 'Acta de nacimiento' },
    { value: 'titulo', label: 'Título / cédula' },
    { value: 'otro', label: 'Otro' },
]

function toDateInput(v: string | null): string {
    if (!v) return ''
    return v.slice(0, 10)
}

function formatBytes(b: number): string {
    if (b < 1024) return `${b} B`
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`
    return `${(b / 1024 / 1024).toFixed(2)} MB`
}

export default function EmpleadoDetallePage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const params = useParams()
    const id = params?.id as string

    const [empleado, setEmpleado] = useState<Empleado | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [docNombre, setDocNombre] = useState('')
    const [docTipo, setDocTipo] = useState('contrato')
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    const load = async () => {
        try {
            const r = await fetch(`/api/rh/empleados/${id}`)
            if (r.ok) setEmpleado(await r.json())
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (status === 'authenticated' && id) load()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status, id])

    const handleField = (k: keyof Empleado) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        if (!empleado) return
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value
        setEmpleado({ ...empleado, [k]: value })
    }

    const handleSave = async () => {
        if (!empleado) return
        setSaving(true)
        try {
            const payload = {
                ...empleado,
                salario_mensual: empleado.salario_mensual ? Number(empleado.salario_mensual) : null,
            }
            const r = await fetch(`/api/rh/empleados/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (r.ok) {
                alert('Cambios guardados')
                load()
            } else {
                const err = await r.json().catch(() => ({}))
                alert(err.error || 'Error al guardar')
            }
        } finally {
            setSaving(false)
        }
    }

    const handleUpload = async (file: File) => {
        if (!file) return
        setUploading(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('nombre', docNombre || file.name)
            fd.append('tipo', docTipo)
            const r = await fetch(`/api/rh/empleados/${id}/documentos`, {
                method: 'POST',
                body: fd,
            })
            if (r.ok) {
                setDocNombre('')
                if (fileInputRef.current) fileInputRef.current.value = ''
                load()
            } else {
                const err = await r.json().catch(() => ({}))
                alert(err.error || 'Error al subir documento')
            }
        } finally {
            setUploading(false)
        }
    }

    const handleDeleteDoc = async (docId: string, nombre: string) => {
        if (!confirm(`¿Eliminar el documento "${nombre}"?`)) return
        try {
            const r = await fetch(`/api/rh/empleados/${id}/documentos/${docId}`, { method: 'DELETE' })
            if (r.ok) load()
            else alert('Error al eliminar')
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteEmpleado = async () => {
        if (!empleado) return
        if (!confirm(`¿Eliminar a ${empleado.nombre}? Esta acción no se puede deshacer y borrará también sus documentos.`)) return
        try {
            const r = await fetch(`/api/rh/empleados/${id}`, { method: 'DELETE' })
            if (r.ok) router.push('/admin/rh')
            else alert('Error al eliminar')
        } catch (e) {
            console.error(e)
        }
    }

    if (status === 'loading' || loading) {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>
    }
    if (!session?.user) return null
    if (!empleado) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 pt-24 pb-16">
                    <p className="text-red-400 font-mono">Empleado no encontrado</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-5xl">
                <TerminalFrame title={`root@netlab:~/rh/${empleado.nombre.toLowerCase().replace(/\s+/g, '_')}`}>
                    <div className="p-6 space-y-6">
                        <div className="flex items-center justify-between gap-4 border-b border-green-500/20 pb-4 flex-wrap">
                            <div>
                                <Button onClick={() => router.push('/admin/rh')} variant="ghost" className="font-mono gap-2 text-sm mb-2">
                                    <ArrowLeft className="h-4 w-4" /> Empleados
                                </Button>
                                <h1 className="text-3xl font-mono text-green-400 flex items-center gap-3">
                                    {empleado.nombre}
                                    {!empleado.activo && (
                                        <span className="text-xs font-mono px-2 py-1 bg-zinc-800 text-gray-400 rounded">BAJA</span>
                                    )}
                                </h1>
                                {empleado.puesto && (
                                    <p className="text-gray-400 font-mono text-sm mt-1">
                                        {empleado.puesto}{empleado.departamento ? ` · ${empleado.departamento}` : ''}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2">
                                    <Save className="h-4 w-4" /> {saving ? 'Guardando...' : 'Guardar cambios'}
                                </Button>
                            </div>
                        </div>

                        {/* Datos editables */}
                        <Section title="Datos personales">
                            <Field label="Nombre completo" value={empleado.nombre} onChange={handleField('nombre')} />
                            <Field label="CURP" value={empleado.curp || ''} onChange={handleField('curp')} maxLength={18} />
                            <Field label="RFC" value={empleado.rfc || ''} onChange={handleField('rfc')} maxLength={13} />
                            <Field label="NSS" value={empleado.nss || ''} onChange={handleField('nss')} />
                            <Field label="Fecha de nacimiento" type="date" value={toDateInput(empleado.fecha_nacimiento)} onChange={handleField('fecha_nacimiento')} />
                            <Select label="Estado civil" value={empleado.estado_civil || ''} onChange={handleField('estado_civil')} options={['', 'Soltero/a', 'Casado/a', 'Unión libre', 'Divorciado/a', 'Viudo/a']} />
                        </Section>

                        <Section title="Contacto">
                            <Field label="Teléfono" value={empleado.telefono || ''} onChange={handleField('telefono')} />
                            <Field label="Email" type="email" value={empleado.email || ''} onChange={handleField('email')} />
                            <div className="md:col-span-2">
                                <label className={labelCls}>Dirección</label>
                                <textarea value={empleado.direccion || ''} onChange={handleField('direccion')} rows={2} className={inputCls} />
                            </div>
                        </Section>

                        <Section title="Datos laborales">
                            <Field label="Puesto" value={empleado.puesto || ''} onChange={handleField('puesto')} />
                            <Field label="Departamento" value={empleado.departamento || ''} onChange={handleField('departamento')} />
                            <Field label="Fecha de ingreso" type="date" value={toDateInput(empleado.fecha_ingreso)} onChange={handleField('fecha_ingreso')} />
                            <Select label="Tipo de contrato" value={empleado.tipo_contrato || ''} onChange={handleField('tipo_contrato')} options={['', 'Indefinido', 'Determinado', 'Honorarios', 'Prácticas']} />
                            <Field label="Salario mensual (MXN)" type="number" step="0.01" value={String(empleado.salario_mensual || '')} onChange={handleField('salario_mensual')} />
                            <div className="flex items-end">
                                <label className="flex items-center gap-2 font-mono text-sm text-gray-300 px-3 py-2 bg-zinc-900 border border-green-500/20 rounded cursor-pointer w-full">
                                    <input
                                        type="checkbox"
                                        checked={empleado.activo}
                                        onChange={handleField('activo')}
                                        className="accent-green-500"
                                    />
                                    {empleado.activo ? 'Activo' : 'Dado de baja'}
                                </label>
                            </div>
                            {!empleado.activo && (
                                <>
                                    <Field label="Fecha de baja" type="date" value={toDateInput(empleado.fecha_baja)} onChange={handleField('fecha_baja')} />
                                    <div className="md:col-span-1">
                                        <label className={labelCls}>Motivo de baja</label>
                                        <input value={empleado.motivo_baja || ''} onChange={handleField('motivo_baja')} className={inputCls} />
                                    </div>
                                </>
                            )}
                        </Section>

                        <Section title="Datos bancarios">
                            <Field label="Banco" value={empleado.banco || ''} onChange={handleField('banco')} />
                            <Field label="Número de Tarjeta" value={empleado.numero_tarjeta || ''} onChange={handleField('numero_tarjeta')} maxLength={16} />
                            <Field label="Sucursal BBVA" value={empleado.sucursal_bbva || ''} onChange={handleField('sucursal_bbva')} maxLength={10} placeholder="Ej: 7116" />
                        </Section>

                        <Section title="Contacto de emergencia">
                            <Field label="Nombre" value={empleado.contacto_emergencia_nombre || ''} onChange={handleField('contacto_emergencia_nombre')} />
                            <Field label="Teléfono" value={empleado.contacto_emergencia_telefono || ''} onChange={handleField('contacto_emergencia_telefono')} />
                            <Field label="Relación" value={empleado.contacto_emergencia_relacion || ''} onChange={handleField('contacto_emergencia_relacion')} />
                        </Section>

                        <Section title="Notas">
                            <div className="md:col-span-2">
                                <textarea value={empleado.notas || ''} onChange={handleField('notas')} rows={3} className={inputCls} />
                            </div>
                        </Section>

                        {/* Documentos */}
                        <div className="border-t border-green-500/20 pt-6">
                            <h2 className="text-xl font-mono text-green-400 mb-4 flex items-center gap-2">
                                <FileText className="h-5 w-5" /> Documentos ({empleado.documentos.length})
                            </h2>

                            <div className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-4 mb-4">
                                <p className="text-xs font-mono text-gray-400 mb-3">
                                    Subir nuevo documento (PDF, PNG, JPG, WEBP — máx. 4 MB)
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                    <div>
                                        <label className={labelCls}>Etiqueta (opcional)</label>
                                        <input
                                            value={docNombre}
                                            onChange={(e) => setDocNombre(e.target.value)}
                                            placeholder="Ej: Contrato 2026"
                                            className={inputCls}
                                        />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Tipo</label>
                                        <select value={docTipo} onChange={(e) => setDocTipo(e.target.value)} className={inputCls}>
                                            {TIPOS_DOC.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/pdf,image/png,image/jpeg,image/webp"
                                    onChange={(e) => {
                                        const f = e.target.files?.[0]
                                        if (f) handleUpload(f)
                                    }}
                                    disabled={uploading}
                                    className="block w-full text-sm font-mono text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-600 file:text-white file:font-mono file:cursor-pointer hover:file:bg-green-700 disabled:opacity-50"
                                />
                                {uploading && <p className="text-xs font-mono text-yellow-400 mt-2 flex items-center gap-2"><Upload className="h-3 w-3 animate-pulse" /> Subiendo...</p>}
                            </div>

                            {empleado.documentos.length === 0 ? (
                                <p className="text-center text-gray-500 font-mono text-sm py-8">Sin documentos aún</p>
                            ) : (
                                <div className="space-y-2">
                                    {empleado.documentos.map(doc => (
                                        <div key={doc.id} className="flex items-center justify-between gap-3 bg-zinc-900/50 border border-green-500/20 rounded p-3 hover:border-green-500/40 transition-colors">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <FileText className="h-5 w-5 text-green-400 shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="font-mono text-sm text-white truncate">{doc.nombre}</p>
                                                    <p className="text-xs font-mono text-gray-500">
                                                        {TIPOS_DOC.find(t => t.value === doc.tipo)?.label || doc.tipo}
                                                        {' · '}{formatBytes(doc.size_bytes)}
                                                        {' · '}{new Date(doc.uploaded_at).toLocaleDateString('es-MX')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <a
                                                    href={doc.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded"
                                                    title="Abrir"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                                <button
                                                    onClick={() => handleDeleteDoc(doc.id, doc.nombre)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Zona peligrosa */}
                        <div className="border-t border-red-500/20 pt-6">
                            <h2 className="text-sm font-mono text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4" /> Zona peligrosa
                            </h2>
                            <Button
                                onClick={handleDeleteEmpleado}
                                variant="outline"
                                className="font-mono gap-2 border-red-500/40 text-red-400 hover:bg-red-500/10 hover:text-red-300 bg-transparent"
                            >
                                <Trash2 className="h-4 w-4" /> Eliminar empleado y todos sus documentos
                            </Button>
                            <p className="text-xs font-mono text-gray-500 mt-2">
                                Para conservar el historial preferimos marcar como &quot;Dado de baja&quot; en lugar de eliminar.
                            </p>
                        </div>
                    </div>
                </TerminalFrame>
            </div>
        </div>
    )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <h2 className="text-sm font-mono text-green-500 uppercase tracking-wider mb-3 border-b border-green-500/10 pb-1">{title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
        </div>
    )
}

function Field({
    label, value, onChange, type = 'text', maxLength, step, placeholder,
}: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    maxLength?: number
    step?: string
    placeholder?: string
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <input value={value} onChange={onChange} type={type} maxLength={maxLength} step={step} placeholder={placeholder} className={inputCls} />
        </div>
    )
}

function Select({
    label, value, onChange, options,
}: {
    label: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: string[]
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <select value={value} onChange={onChange} className={inputCls}>
                {options.map(o => <option key={o} value={o}>{o || '— Selecciona —'}</option>)}
            </select>
        </div>
    )
}
