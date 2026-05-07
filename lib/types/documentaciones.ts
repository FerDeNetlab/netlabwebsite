export interface DocProyecto {
  id: string
  slug: string
  nombre: string
  descripcion: string | null
  cliente_id: string | null
  public_token: string
  is_public: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface DocCategoria {
  id: string
  proyecto_id: string
  nombre: string
  slug: string
  modulo_odoo: string | null
  icono: string
  color: string
  orden: number
  created_at: string
  updated_at: string
}

export interface DocFlujo {
  id: string
  categoria_id: string
  nombre: string
  slug: string
  descripcion: string | null
  proposito: string | null
  accion_principal: string | null
  orden: number
  created_at: string
  updated_at: string
}

export interface DocPaso {
  id: string
  flujo_id: string
  orden: number
  imagen_url: string
  titulo: string | null
  accion: string | null
  descripcion: string | null
  created_at: string
  updated_at: string
}

export interface DocFlujoConPasos extends DocFlujo {
  pasos: DocPaso[]
}

export interface DocCategoriaConFlujos extends DocCategoria {
  flujos: DocFlujoConPasos[]
}

export interface DocProyectoCompleto extends DocProyecto {
  categorias: DocCategoriaConFlujos[]
}

export const DOC_COLORES = [
  'green',
  'cyan',
  'purple',
  'yellow',
  'emerald',
  'blue',
  'pink',
  'orange',
] as const

export type DocColor = (typeof DOC_COLORES)[number]

// Mapeo de color -> clases Tailwind (whitelist para evitar purge)
export const DOC_COLOR_CLASES: Record<DocColor, { text: string; bg: string; border: string; borderHover: string }> = {
  green: { text: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-500/20', borderHover: 'hover:border-green-500/40' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-400/10', border: 'border-cyan-500/20', borderHover: 'hover:border-cyan-500/40' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-500/20', borderHover: 'hover:border-purple-500/40' },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-500/20', borderHover: 'hover:border-yellow-500/40' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-500/20', borderHover: 'hover:border-emerald-500/40' },
  blue: { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-500/20', borderHover: 'hover:border-blue-500/40' },
  pink: { text: 'text-pink-400', bg: 'bg-pink-400/10', border: 'border-pink-500/20', borderHover: 'hover:border-pink-500/40' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-500/20', borderHover: 'hover:border-orange-500/40' },
}
