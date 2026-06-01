'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckSquare2,
  Square,
  Trash2,
  CalendarPlus,
  ChevronDown,
  ChevronUp,
  Plus,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  Clock,
  Users,
  Link2,
  SlidersHorizontal,
} from 'lucide-react'

// ── Types ─────────────────────────────────────────────────────────────────────

interface Todo {
  id: string
  titulo: string
  categoria: string
  prioridad: string
  estado: string
  fecha_limite: string | null
  descripcion: string | null
  created_at: string
}

interface Externo {
  id: string
  nombre: string
  empresa: string | null
  asunto: string
  descripcion: string | null
  fecha_deseada: string | null
  estado: string
  notas_director: string | null
  created_at: string
}

const CATEGORIAS = ['Personal', 'Empresa', 'Reunion', 'Llamada', 'Seguimiento', 'Otro']
const PRIORIDADES = ['alta', 'normal', 'baja']
const ESTADOS_EXTERNO = ['nuevo', 'visto', 'agendado', 'completado']

const prioridadBorder: Record<string, string> = {
  alta: 'border-l-red-500',
  normal: 'border-l-amber-500',
  baja: 'border-l-zinc-600',
}
const prioridadBadge: Record<string, string> = {
  alta: 'bg-red-500/15 text-red-400',
  normal: 'bg-amber-500/15 text-amber-400',
  baja: 'bg-zinc-800 text-zinc-500',
}
const estadoBadge: Record<string, string> = {
  nuevo: 'bg-blue-500/15 text-blue-400',
  visto: 'bg-yellow-500/15 text-yellow-400',
  agendado: 'bg-purple-500/15 text-purple-400',
  completado: 'bg-green-500/15 text-green-400',
}
const estadoBtn: Record<string, string> = {
  nuevo: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
  visto: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/40',
  agendado: 'bg-purple-500/20 text-purple-400 border-purple-500/40',
  completado: 'bg-green-500/20 text-green-400 border-green-500/40',
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.trim().split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('')
}

function fmtDate(dateStr: string, withYear = false) {
  const d = new Date(dateStr.includes('T') ? dateStr : dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    ...(withYear ? { year: 'numeric' } : {}),
  })
}

// ── TodoCard ──────────────────────────────────────────────────────────────────

function TodoCard({
  todo,
  onToggle,
  onDelete,
  onSendIcs,
}: {
  todo: Todo
  onToggle: (id: string, estado: string) => void
  onDelete: (id: string) => void
  onSendIcs: (todo: Todo) => void
}) {
  const done = todo.estado === 'completado'
  const vencido =
    !done && todo.fecha_limite && new Date(todo.fecha_limite) < new Date()

  return (
    <div
      className={[
        'flex items-start gap-3 px-4 py-3.5 rounded-xl border-l-4 border border-zinc-800 transition-all',
        done ? 'opacity-50 border-l-zinc-700' : prioridadBorder[todo.prioridad] ?? 'border-l-zinc-600',
        done ? 'bg-transparent' : 'bg-zinc-900/60',
      ].join(' ')}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id, done ? 'pendiente' : 'completado')}
        className={[
          'mt-0.5 flex-shrink-0 transition-colors',
          done ? 'text-green-400' : 'text-zinc-600 hover:text-amber-400',
        ].join(' ')}
      >
        {done ? (
          <CheckSquare2 className="w-5 h-5" />
        ) : (
          <Square className="w-5 h-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={[
            'font-mono text-sm leading-snug',
            done ? 'line-through text-zinc-500' : 'text-white',
          ].join(' ')}
        >
          {todo.titulo}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          {/* Prioridad badge */}
          <span
            className={`inline-flex items-center text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md ${prioridadBadge[todo.prioridad] ?? 'bg-zinc-800 text-zinc-500'}`}
          >
            {todo.prioridad === 'alta' && <AlertCircle className="w-2.5 h-2.5 mr-1" />}
            {todo.prioridad}
          </span>

          {/* Categoria */}
          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-800/60 px-1.5 py-0.5 rounded-md">
            {todo.categoria}
          </span>

          {/* Fecha */}
          {todo.fecha_limite && (
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded-md ${vencido ? 'bg-red-500/15 text-red-400' : 'bg-zinc-800/60 text-zinc-500'}`}
            >
              <Clock className="w-2.5 h-2.5" />
              {fmtDate(todo.fecha_limite)}
            </span>
          )}
        </div>

        {todo.descripcion && (
          <p className="text-[11px] font-mono text-zinc-600 mt-1.5 leading-relaxed line-clamp-2">
            {todo.descripcion}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 flex-shrink-0">
        {todo.fecha_limite && !done && (
          <button
            onClick={() => onSendIcs(todo)}
            title="Agregar al calendario"
            className="p-1.5 rounded-lg text-zinc-600 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 rounded-lg text-zinc-700 hover:text-red-400 hover:bg-red-400/10 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

// ── ExternoCard ───────────────────────────────────────────────────────────────

function ExternoCard({
  ext,
  onUpdate,
  onSendIcs,
}: {
  ext: Externo
  onUpdate: (id: string, data: Partial<Externo>) => Promise<void>
  onSendIcs: (ext: Externo) => void
}) {
  const [open, setOpen] = useState(ext.estado === 'nuevo')
  const [notas, setNotas] = useState(ext.notas_director ?? '')
  const [saving, setSaving] = useState(false)
  const [horaIcs, setHoraIcs] = useState(() => {
    if (ext.fecha_deseada && ext.fecha_deseada.includes('T')) {
      return ext.fecha_deseada.slice(11, 16)
    }
    return '10:00'
  })

  const saveNotas = async () => {
    setSaving(true)
    await onUpdate(ext.id, { notas_director: notas })
    setSaving(false)
  }

  return (
    <div
      className={`rounded-xl border transition-all ${ext.estado === 'nuevo' ? 'border-blue-500/30 bg-blue-500/5' : 'border-zinc-800 bg-zinc-900/40'}`}
    >
      {/* Header */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-mono font-bold text-zinc-300">
            {initials(ext.nombre)}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-mono text-sm text-white leading-snug truncate">{ext.asunto}</p>
            <span
              className={`flex-shrink-0 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded-md ${estadoBadge[ext.estado] ?? 'bg-zinc-800 text-zinc-500'}`}
            >
              {ext.estado}
            </span>
          </div>
          <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
            {ext.nombre}
            {ext.empresa && <span className="text-zinc-600"> · {ext.empresa}</span>}
          </p>
        </div>

        {open ? (
          <ChevronUp className="w-4 h-4 text-zinc-600 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-600 flex-shrink-0" />
        )}
      </button>

      {/* Body */}
      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-zinc-800/60">
          <div className="pt-3 space-y-1">
            {ext.descripcion && (
              <p className="text-sm font-mono text-zinc-400 leading-relaxed">{ext.descripcion}</p>
            )}
            {ext.fecha_deseada && (
              <p className="text-xs font-mono text-zinc-600 flex items-center gap-1.5 mt-1">
                <Clock className="w-3 h-3" />
                Fecha deseada: {fmtDate(ext.fecha_deseada, true)}
              </p>
            )}
          </div>

          {/* Estado */}
          <div>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Marcar como</p>
            <div className="flex flex-wrap gap-1.5">
              {ESTADOS_EXTERNO.map((e) => (
                <button
                  key={e}
                  onClick={() => onUpdate(ext.id, { estado: e })}
                  className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all ${
                    ext.estado === e
                      ? estadoBtn[e]
                      : 'border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* Notas */}
          <div>
            <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Notas internas</p>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Solo visible para ti..."
              rows={2}
              className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500/60 transition-colors resize-none"
            />
            <button
              onClick={saveNotas}
              disabled={saving}
              className="mt-1.5 text-xs font-mono text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-40"
            >
              {saving ? 'Guardando...' : 'Guardar notas'}
            </button>
          </div>

          {/* ICS */}
          {(ext.fecha_deseada || true) && (
            <div>
              <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-2">Agregar al calendario</p>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  defaultValue={ext.fecha_deseada ? ext.fecha_deseada.slice(0, 10) : ''}
                  onChange={(e) => {
                    const dateVal = e.target.value
                    ;(e.target as HTMLInputElement & { _fecha: string })._fecha = dateVal
                  }}
                  id={'fecha-ics-' + ext.id}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500/50 w-36"
                />
                <input
                  type="time"
                  value={horaIcs}
                  onChange={(e) => setHoraIcs(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-lg px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-blue-500/50 w-28"
                />
                <button
                  onClick={() => {
                    const dateInput = document.getElementById('fecha-ics-' + ext.id) as HTMLInputElement | null
                    const dateVal = dateInput?.value || ext.fecha_deseada?.slice(0, 10) || ''
                    if (!dateVal) { alert('Selecciona una fecha'); return }
                    onSendIcs({ ...ext, fecha_deseada: dateVal + 'T' + horaIcs + ':00' })
                  }}
                  className="flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                >
                  <CalendarPlus className="w-3.5 h-3.5" />
                  Enviar .ics
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function PendientesClient() {
  const router = useRouter()
  const [tab, setTab] = useState<'mis' | 'otros'>('mis')
  const [todos, setTodos] = useState<Todo[]>([])
  const [externos, setExternos] = useState<Externo[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompletados, setShowCompletados] = useState(false)
  const [copied, setCopied] = useState(false)

  const [newTodo, setNewTodo] = useState('')
  const [showExpand, setShowExpand] = useState(false)
  const [newCategoria, setNewCategoria] = useState('Personal')
  const [newPrioridad, setNewPrioridad] = useState('normal')
  const [newFecha, setNewFecha] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [adding, setAdding] = useState(false)

  const fetchTodos = useCallback(async () => {
    const res = await fetch('/api/pendientes/todos')
    if (res.ok) setTodos(await res.json())
  }, [])

  const fetchExternos = useCallback(async () => {
    const res = await fetch('/api/pendientes/externos')
    if (res.ok) setExternos(await res.json())
  }, [])

  useEffect(() => {
    Promise.all([fetchTodos(), fetchExternos()]).finally(() => setLoading(false))
  }, [fetchTodos, fetchExternos])

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTodo.trim()) return
    setAdding(true)
    const res = await fetch('/api/pendientes/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titulo: newTodo.trim(),
        categoria: newCategoria,
        prioridad: newPrioridad,
        fecha_limite: newFecha || null,
        descripcion: newDesc || null,
      }),
    })
    if (res.ok) {
      setNewTodo('')
      setNewDesc('')
      setNewFecha('')
      setShowExpand(false)
      await fetchTodos()
    }
    setAdding(false)
  }

  const toggleTodo = async (id: string, estado: string) => {
    await fetch('/api/pendientes/todos/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    await fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    await fetch('/api/pendientes/todos/' + id, { method: 'DELETE' })
    await fetchTodos()
  }

  const updateExterno = async (id: string, data: Partial<Externo>) => {
    await fetch('/api/pendientes/externos/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    await fetchExternos()
  }

  const sendIcsFromTodo = async (todo: Todo) => {
    if (!todo.fecha_limite) return
    const res = await fetch('/api/pendientes/ics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: todo.id, titulo: todo.titulo, descripcion: todo.descripcion ?? '', fecha: todo.fecha_limite }),
    })
    alert(res.ok ? 'Revisa tu email, el .ics fue enviado.' : 'Error al enviar el .ics')
  }

  const sendIcsFromExterno = async (ext: Externo) => {
    if (!ext.fecha_deseada) return
    const desc = (ext.descripcion ?? '') + (ext.nombre ? ' (de ' + ext.nombre + (ext.empresa ? ', ' + ext.empresa : '') + ')' : '')
    const res = await fetch('/api/pendientes/ics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: ext.id, titulo: ext.asunto, descripcion: desc, fecha: ext.fecha_deseada }),
    })
    alert(res.ok ? 'Revisa tu email, el .ics fue enviado.' : 'Error al enviar el .ics')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText('https://netlab.mx/pendientesfer')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeTodos = todos.filter((t) => t.estado !== 'completado')
  const completedTodos = todos.filter((t) => t.estado === 'completado')
  const nuevosCount = externos.filter((e) => e.estado === 'nuevo').length

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0a0a0a]" style={{ paddingBottom: 'max(32px, env(safe-area-inset-bottom))' }}>

      {/* Header */}
      <div
        className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-zinc-800"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
      >
        <div className="max-w-2xl mx-auto px-4 flex items-center gap-3">
          <button
            onClick={() => router.push('/admin')}
            className="p-2 -ml-2 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-bold font-mono text-white leading-none">Pendientes</h1>
          </div>
          {loading && (
            <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-5">

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-xl">
          <button
            onClick={() => setTab('mis')}
            className={`flex-1 py-2 rounded-lg font-mono text-sm font-medium transition-all ${
              tab === 'mis'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Mis pendientes
            {activeTodos.length > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === 'mis' ? 'bg-amber-500/30 text-amber-300' : 'bg-zinc-800 text-zinc-500'}`}>
                {activeTodos.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setTab('otros')}
            className={`flex-1 py-2 rounded-lg font-mono text-sm font-medium transition-all relative ${
              tab === 'otros'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            De otros
            {externos.length > 0 && (
              <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${
                nuevosCount > 0
                  ? 'bg-blue-500/30 text-blue-300'
                  : tab === 'otros' ? 'bg-amber-500/30 text-amber-300' : 'bg-zinc-800 text-zinc-500'
              }`}>
                {externos.length}
              </span>
            )}
          </button>
        </div>

        {/* ── Tab: Mis pendientes ─────────────────────────────────────────── */}
        {tab === 'mis' && (
          <div className="space-y-4">

            {/* Quick-add */}
            <form onSubmit={addTodo} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="Agregar tarea..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 focus:border-amber-500/60 rounded-xl px-4 py-2.5 text-white font-mono text-sm focus:outline-none transition-colors placeholder:text-zinc-600"
                />
                <button
                  type="button"
                  onClick={() => setShowExpand((s) => !s)}
                  title="Opciones"
                  className={`p-2.5 rounded-xl border transition-all ${showExpand ? 'border-amber-500/40 bg-amber-500/10 text-amber-400' : 'border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600'}`}
                >
                  <SlidersHorizontal className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={adding || !newTodo.trim()}
                  className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-black rounded-xl transition-all"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {showExpand && (
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Categoria</p>
                      <select
                        value={newCategoria}
                        onChange={(e) => setNewCategoria(e.target.value)}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50"
                      >
                        {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Prioridad</p>
                      <div className="flex gap-1.5">
                        {PRIORIDADES.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setNewPrioridad(p)}
                            className={`flex-1 py-1.5 rounded-lg text-[10px] font-mono font-medium border transition-all ${
                              newPrioridad === p ? prioridadBadge[p] + ' border-current/30' : 'border-zinc-700 text-zinc-500'
                            }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Fecha y hora limite</p>
                    <input
                      type="datetime-local"
                      value={newFecha}
                      onChange={(e) => setNewFecha(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-1.5">Nota</p>
                    <textarea
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      placeholder="Notas adicionales..."
                      rows={2}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-2.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-500/50 resize-none"
                    />
                  </div>
                </div>
              )}
            </form>

            {/* Active list */}
            {activeTodos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <CheckSquare2 className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-zinc-600 font-mono text-sm">Sin pendientes activos</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTodos.map((t) => (
                  <TodoCard
                    key={t.id}
                    todo={t}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onSendIcs={sendIcsFromTodo}
                  />
                ))}
              </div>
            )}

            {/* Completados */}
            {completedTodos.length > 0 && (
              <div>
                <button
                  onClick={() => setShowCompletados((s) => !s)}
                  className="flex items-center gap-2 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors py-1"
                >
                  {showCompletados ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  Completados ({completedTodos.length})
                </button>
                {showCompletados && (
                  <div className="mt-2 space-y-2">
                    {completedTodos.map((t) => (
                      <TodoCard
                        key={t.id}
                        todo={t}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onSendIcs={sendIcsFromTodo}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: De otros ──────────────────────────────────────────────── */}
        {tab === 'otros' && (
          <div className="space-y-4">

            {/* Share link */}
            <div className="flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="p-2 rounded-lg bg-green-500/10 flex-shrink-0">
                <Link2 className="w-4 h-4 text-green-400" />
              </div>
              <a
                href="/pendientesfer"
                target="_blank"
                className="flex-1 font-mono text-sm text-green-400 hover:text-green-300 transition-colors truncate"
              >
                netlab.mx/pendientesfer
              </a>
              <a
                href="/pendientesfer"
                target="_blank"
                className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={copyLink}
                className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Nuevos badge */}
            {nuevosCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <p className="text-xs font-mono text-blue-400">
                  {nuevosCount} {nuevosCount === 1 ? 'pendiente nuevo sin revisar' : 'pendientes nuevos sin revisar'}
                </p>
              </div>
            )}

            {/* List agrupada por estado */}
            {externos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                  <Users className="w-6 h-6 text-zinc-700" />
                </div>
                <p className="text-zinc-600 font-mono text-sm">Nadie ha enviado pendientes</p>
                <p className="text-zinc-700 font-mono text-xs">Comparte el link de arriba</p>
              </div>
            ) : (
              <div className="space-y-6">
                {(
                  [
                    { key: 'nuevo',     label: 'Nuevos',     dot: 'bg-blue-500' },
                    { key: 'visto',     label: 'Vistos',     dot: 'bg-yellow-500' },
                    { key: 'agendado',  label: 'Agendados',  dot: 'bg-purple-500' },
                    { key: 'completado',label: 'Completados',dot: 'bg-green-500' },
                  ] as const
                ).map(({ key, label, dot }) => {
                  const grupo = externos.filter((e) => e.estado === key)
                  if (!grupo.length) return null
                  return (
                    <div key={key}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2 h-2 rounded-full ${dot}`} />
                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                          {label} ({grupo.length})
                        </p>
                        <div className="flex-1 h-px bg-zinc-800" />
                      </div>
                      <div className="space-y-2">
                        {grupo.map((e) => (
                          <ExternoCard
                            key={e.id}
                            ext={e}
                            onUpdate={updateExterno}
                            onSendIcs={sendIcsFromExterno}
                          />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
