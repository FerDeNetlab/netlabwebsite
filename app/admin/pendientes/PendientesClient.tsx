'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckSquare,
  Square,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Plus,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

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

const prioridadColor: Record<string, string> = {
  alta: 'text-red-400 border-red-500/30',
  normal: 'text-green-400 border-green-500/30',
  baja: 'text-zinc-400 border-zinc-600',
}

const estadoExternoColor: Record<string, string> = {
  nuevo: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  visto: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  agendado: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  completado: 'bg-green-500/20 text-green-400 border-green-500/30',
}

// ─── TodoCard ────────────────────────────────────────────────────────────────

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
  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${done ? 'border-zinc-800 opacity-60' : 'border-zinc-700 bg-zinc-900/50'}`}>
      <button
        onClick={() => onToggle(todo.id, done ? 'pendiente' : 'completado')}
        className="mt-0.5 text-zinc-400 hover:text-green-400 transition-colors flex-shrink-0"
      >
        {done ? <CheckSquare className="w-4 h-4 text-green-400" /> : <Square className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <p className={`font-mono text-sm ${done ? 'line-through text-zinc-500' : 'text-white'}`}>
          {todo.titulo}
        </p>
        <div className="flex flex-wrap gap-2 mt-1">
          <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${prioridadColor[todo.prioridad] ?? 'text-zinc-400 border-zinc-600'}`}>
            {todo.prioridad}
          </span>
          <span className="text-xs font-mono text-zinc-500">{todo.categoria}</span>
          {todo.fecha_limite && (
            <span className="text-xs font-mono text-zinc-500">
              {new Date(todo.fecha_limite).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
            </span>
          )}
        </div>
        {todo.descripcion && (
          <p className="text-xs font-mono text-zinc-500 mt-1 line-clamp-2">{todo.descripcion}</p>
        )}
      </div>

      <div className="flex gap-1 flex-shrink-0">
        {todo.fecha_limite && (
          <button
            onClick={() => onSendIcs(todo)}
            title="Agregar al calendario"
            className="p-1.5 text-zinc-500 hover:text-blue-400 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

// ─── ExternoCard ─────────────────────────────────────────────────────────────

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

  const saveNotas = async () => {
    setSaving(true)
    await onUpdate(ext.id, { notas_director: notas })
    setSaving(false)
  }

  return (
    <div className={`rounded-lg border ${ext.estado === 'nuevo' ? 'border-blue-500/30' : 'border-zinc-700'} bg-zinc-900/50`}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-3 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-mono text-sm text-white truncate">{ext.asunto}</p>
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${estadoExternoColor[ext.estado] ?? ''}`}>
              {ext.estado}
            </span>
          </div>
          <p className="text-xs font-mono text-zinc-500 mt-0.5">
            {ext.nombre}{ext.empresa ? ' · ' + ext.empresa : ''}
          </p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-zinc-500 flex-shrink-0 ml-2" /> : <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0 ml-2" />}
      </button>

      {open && (
        <div className="px-3 pb-3 space-y-3 border-t border-zinc-800 pt-3">
          {ext.descripcion && (
            <p className="text-sm font-mono text-zinc-400">{ext.descripcion}</p>
          )}
          {ext.fecha_deseada && (
            <p className="text-xs font-mono text-zinc-500">
              Fecha deseada: {new Date(ext.fecha_deseada + 'T12:00:00').toLocaleDateString('es-MX', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          )}

          {/* Estado buttons */}
          <div className="flex flex-wrap gap-1.5">
            {ESTADOS_EXTERNO.map((e) => (
              <button
                key={e}
                onClick={() => onUpdate(ext.id, { estado: e })}
                className={`text-xs font-mono px-2 py-1 rounded border transition-colors ${ext.estado === e ? estadoExternoColor[e] : 'border-zinc-700 text-zinc-500 hover:border-zinc-500'}`}
              >
                {e}
              </button>
            ))}
          </div>

          {/* Notas */}
          <div>
            <label className="block text-xs font-mono text-zinc-500 mb-1">Notas del director</label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              placeholder="Notas internas..."
              rows={2}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-green-500 transition-colors resize-none"
            />
            <button
              onClick={saveNotas}
              disabled={saving}
              className="mt-1 text-xs font-mono text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar notas'}
            </button>
          </div>

          {/* Calendario */}
          {ext.fecha_deseada && (
            <button
              onClick={() => onSendIcs(ext)}
              className="flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 transition-colors"
            >
              <Calendar className="w-3.5 h-3.5" />
              Enviar .ics al email
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PendientesClient() {
  const [tab, setTab] = useState<'mis' | 'otros'>('mis')
  const [todos, setTodos] = useState<Todo[]>([])
  const [externos, setExternos] = useState<Externo[]>([])
  const [loading, setLoading] = useState(true)
  const [showCompletados, setShowCompletados] = useState(false)
  const [copied, setCopied] = useState(false)

  // Quick-add form
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
    await fetch(`/api/pendientes/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado }),
    })
    await fetchTodos()
  }

  const deleteTodo = async (id: string) => {
    await fetch(`/api/pendientes/todos/${id}`, { method: 'DELETE' })
    await fetchTodos()
  }

  const updateExterno = async (id: string, data: Partial<Externo>) => {
    await fetch(`/api/pendientes/externos/${id}`, {
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
      body: JSON.stringify({
        id: todo.id,
        titulo: todo.titulo,
        descripcion: todo.descripcion ?? '',
        fecha: todo.fecha_limite,
      }),
    })
    if (res.ok) alert('Revisa tu email, el archivo .ics fue enviado.')
    else alert('Error al enviar el .ics')
  }

  const sendIcsFromExterno = async (ext: Externo) => {
    if (!ext.fecha_deseada) return
    const res = await fetch('/api/pendientes/ics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: ext.id,
        titulo: ext.asunto,
        descripcion: (ext.descripcion ?? '') + (ext.nombre ? ` (de ${ext.nombre}${ext.empresa ? ', ' + ext.empresa : ''})` : ''),
        fecha: ext.fecha_deseada,
      }),
    })
    if (res.ok) alert('Revisa tu email, el archivo .ics fue enviado.')
    else alert('Error al enviar el .ics')
  }

  const copyLink = async () => {
    await navigator.clipboard.writeText('https://netlab.mx/pendientesfer')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const activeTodos = todos.filter((t) => t.estado !== 'completado')
  const completedTodos = todos.filter((t) => t.estado === 'completado')
  const nuevosCount = externos.filter((e) => e.estado === 'nuevo').length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-1 bg-zinc-900 rounded-lg p-1 w-fit">
        <button
          onClick={() => setTab('mis')}
          className={`px-4 py-1.5 rounded font-mono text-sm transition-colors ${tab === 'mis' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          Mis pendientes ({activeTodos.length})
        </button>
        <button
          onClick={() => setTab('otros')}
          className={`px-4 py-1.5 rounded font-mono text-sm transition-colors relative ${tab === 'otros' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'}`}
        >
          De otros ({externos.length})
          {nuevosCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full text-[10px] text-white flex items-center justify-center">
              {nuevosCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Tab: Mis Pendientes ── */}
      {tab === 'mis' && (
        <div className="space-y-4">
          {/* Quick-add */}
          <form onSubmit={addTodo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="Nueva tarea..."
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white font-mono text-sm focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowExpand((s) => !s)}
                className="p-2 border border-zinc-700 rounded-lg text-zinc-400 hover:text-white transition-colors"
                title="Opciones"
              >
                {showExpand ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <button
                type="submit"
                disabled={adding || !newTodo.trim()}
                className="p-2 bg-green-500 hover:bg-green-400 disabled:opacity-50 text-black rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showExpand && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-mono text-zinc-500 mb-1 block">Categoria</label>
                    <select
                      value={newCategoria}
                      onChange={(e) => setNewCategoria(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white font-mono text-xs focus:outline-none"
                    >
                      {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-mono text-zinc-500 mb-1 block">Prioridad</label>
                    <select
                      value={newPrioridad}
                      onChange={(e) => setNewPrioridad(e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white font-mono text-xs focus:outline-none"
                    >
                      {PRIORIDADES.map((p) => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-500 mb-1 block">Fecha limite</label>
                  <input
                    type="date"
                    value={newFecha}
                    onChange={(e) => setNewFecha(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white font-mono text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono text-zinc-500 mb-1 block">Descripcion</label>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Notas adicionales..."
                    rows={2}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white font-mono text-xs focus:outline-none resize-none"
                  />
                </div>
              </div>
            )}
          </form>

          {/* Active todos */}
          <div className="space-y-2">
            {activeTodos.length === 0 && (
              <p className="text-zinc-500 font-mono text-sm text-center py-8">Sin pendientes activos</p>
            )}
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

          {/* Completados */}
          {completedTodos.length > 0 && (
            <div>
              <button
                onClick={() => setShowCompletados((s) => !s)}
                className="flex items-center gap-2 text-xs font-mono text-zinc-500 hover:text-zinc-300 transition-colors"
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

      {/* ── Tab: De Otros ── */}
      {tab === 'otros' && (
        <div className="space-y-4">
          {/* Share link */}
          <div className="flex items-center gap-3 p-3 bg-zinc-900 border border-zinc-700 rounded-lg">
            <a
              href="/pendientesfer"
              target="_blank"
              className="flex-1 font-mono text-sm text-green-400 hover:underline truncate"
            >
              netlab.mx/pendientesfer
            </a>
            <a href="/pendientesfer" target="_blank" className="text-zinc-500 hover:text-white transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
            <button onClick={copyLink} className="text-zinc-500 hover:text-white transition-colors">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {/* Externos list */}
          <div className="space-y-2">
            {externos.length === 0 && (
              <p className="text-zinc-500 font-mono text-sm text-center py-8">Sin pendientes de otros</p>
            )}
            {externos.map((e) => (
              <ExternoCard
                key={e.id}
                ext={e}
                onUpdate={updateExterno}
                onSendIcs={sendIcsFromExterno}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
