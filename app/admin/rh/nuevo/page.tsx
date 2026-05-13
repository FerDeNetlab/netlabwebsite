'use client'

import React from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/navbar'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Save } from 'lucide-react'

const inputCls = 'w-full px-3 py-2 bg-zinc-900 border border-green-500/20 rounded font-mono text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50'
const labelCls = 'block text-xs font-mono text-gray-400 mb-1'

export default function NuevoEmpleadoPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        nombre: '',
        curp: '',
        rfc: '',
        nss: '',
        telefono: '',
        email: '',
        puesto: '',
        departamento: '',
        fecha_ingreso: '',
        fecha_nacimiento: '',
        salario_mensual: '',
        tipo_contrato: '',
        estado_civil: '',
        direccion: '',
        contacto_emergencia_nombre: '',
        contacto_emergencia_telefono: '',
        contacto_emergencia_relacion: '',
        banco: '',
        numero_tarjeta: '',
        notas: '',
    })

    useEffect(() => {
        if (status === 'unauthenticated') router.push('/admin/login')
    }, [status, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.nombre.trim()) {
            alert('El nombre es obligatorio')
            return
        }
        setLoading(true)
        try {
            const payload = {
                ...form,
                salario_mensual: form.salario_mensual ? Number(form.salario_mensual) : null,
            }
            const r = await fetch('/api/rh/empleados', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
            if (r.ok) {
                const data = await r.json()
                router.push(`/admin/rh/${data.id}`)
            } else {
                const err = await r.json().catch(() => ({}))
                alert(err.error || 'Error al crear empleado')
            }
        } catch (err) {
            console.error(err)
            alert('Error al crear empleado')
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading') {
        return <div className="min-h-screen bg-background flex items-center justify-center"><div className="text-primary font-mono">Cargando...</div></div>
    }
    if (!session?.user) return null

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl">
                <TerminalFrame title="root@netlab:~/rh/nuevo">
                    <div className="p-6 space-y-6">
                        <div className="flex items-center gap-4 border-b border-green-500/20 pb-4">
                            <Button onClick={() => router.back()} variant="outline" size="sm" className="font-mono gap-2 bg-transparent">
                                <ArrowLeft className="h-4 w-4" /> Volver
                            </Button>
                            <h1 className="text-3xl font-mono text-green-400">Nuevo Empleado</h1>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Section title="Datos personales">
                                <Field label="Nombre completo *" name="nombre" value={form.nombre} onChange={handleChange} required />
                                <Field label="CURP" name="curp" value={form.curp} onChange={handleChange} maxLength={18} placeholder="18 caracteres" />
                                <Field label="RFC" name="rfc" value={form.rfc} onChange={handleChange} maxLength={13} />
                                <Field label="NSS (Núm. Seguridad Social)" name="nss" value={form.nss} onChange={handleChange} />
                                <Field label="Fecha de nacimiento" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} />
                                <Select label="Estado civil" name="estado_civil" value={form.estado_civil} onChange={handleChange} options={['', 'Soltero/a', 'Casado/a', 'Unión libre', 'Divorciado/a', 'Viudo/a']} />
                            </Section>

                            <Section title="Contacto">
                                <Field label="Teléfono" name="telefono" value={form.telefono} onChange={handleChange} />
                                <Field label="Email" name="email" type="email" value={form.email} onChange={handleChange} />
                                <div className="md:col-span-2">
                                    <label className={labelCls}>Dirección</label>
                                    <textarea name="direccion" value={form.direccion} onChange={handleChange} rows={2} className={inputCls} />
                                </div>
                            </Section>

                            <Section title="Datos laborales">
                                <Field label="Puesto" name="puesto" value={form.puesto} onChange={handleChange} />
                                <Field label="Departamento" name="departamento" value={form.departamento} onChange={handleChange} />
                                <Field label="Fecha de ingreso" name="fecha_ingreso" type="date" value={form.fecha_ingreso} onChange={handleChange} />
                                <Select label="Tipo de contrato" name="tipo_contrato" value={form.tipo_contrato} onChange={handleChange} options={['', 'Indefinido', 'Determinado', 'Honorarios', 'Prácticas']} />
                                <Field label="Salario mensual (MXN)" name="salario_mensual" type="number" step="0.01" value={form.salario_mensual} onChange={handleChange} />
                            </Section>

                            <Section title="Datos bancarios">
                                <Field label="Banco" name="banco" value={form.banco} onChange={handleChange} />
                                <Field label="Número de Tarjeta" name="numero_tarjeta" value={form.numero_tarjeta} onChange={handleChange} maxLength={16} />
                            </Section>

                            <Section title="Contacto de emergencia">
                                <Field label="Nombre" name="contacto_emergencia_nombre" value={form.contacto_emergencia_nombre} onChange={handleChange} />
                                <Field label="Teléfono" name="contacto_emergencia_telefono" value={form.contacto_emergencia_telefono} onChange={handleChange} />
                                <Field label="Relación" name="contacto_emergencia_relacion" value={form.contacto_emergencia_relacion} onChange={handleChange} placeholder="Madre, esposo/a, hermano/a..." />
                            </Section>

                            <Section title="Notas">
                                <div className="md:col-span-2">
                                    <textarea name="notas" value={form.notas} onChange={handleChange} rows={3} className={inputCls} placeholder="Notas internas..." />
                                </div>
                            </Section>

                            <div className="flex justify-end gap-3 pt-4 border-t border-green-500/20">
                                <Button type="button" onClick={() => router.back()} variant="outline" className="font-mono bg-transparent">Cancelar</Button>
                                <Button type="submit" disabled={loading} className="bg-green-600 hover:bg-green-700 text-white font-mono gap-2">
                                    <Save className="h-4 w-4" /> {loading ? 'Guardando...' : 'Crear empleado'}
                                </Button>
                            </div>
                        </form>

                        <p className="text-xs font-mono text-gray-500 italic">
                            Tras crear el empleado podrás subir sus documentos (PDFs, INE, contrato, etc.) desde su ficha.
                        </p>
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
    label, name, value, onChange, type = 'text', required, maxLength, placeholder, step,
}: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    type?: string
    required?: boolean
    maxLength?: number
    placeholder?: string
    step?: string
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <input
                name={name}
                value={value}
                onChange={onChange}
                type={type}
                required={required}
                maxLength={maxLength}
                placeholder={placeholder}
                step={step}
                className={inputCls}
            />
        </div>
    )
}

function Select({
    label, name, value, onChange, options,
}: {
    label: string
    name: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: string[]
}) {
    return (
        <div>
            <label className={labelCls}>{label}</label>
            <select name={name} value={value} onChange={onChange} className={inputCls}>
                {options.map(o => (
                    <option key={o} value={o}>{o || '— Selecciona —'}</option>
                ))}
            </select>
        </div>
    )
}
