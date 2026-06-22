// Tipos compartidos del módulo de Tickets (ticketera)

export type Urgencia = 'baja' | 'media' | 'alta' | 'critica'
export type EstadoTicket = 'nuevo' | 'en_progreso' | 'resuelto' | 'cerrado'
export type AutorTipo = 'cliente' | 'netlab'

export const URGENCIAS: Urgencia[] = ['baja', 'media', 'alta', 'critica']
export const ESTADOS: EstadoTicket[] = ['nuevo', 'en_progreso', 'resuelto', 'cerrado']

export const URGENCIA_LABEL: Record<Urgencia, string> = {
    baja: 'Baja',
    media: 'Media',
    alta: 'Alta',
    critica: 'Crítica',
}

export const ESTADO_LABEL: Record<EstadoTicket, string> = {
    nuevo: 'Nuevo',
    en_progreso: 'En progreso',
    resuelto: 'Resuelto',
    cerrado: 'Cerrado',
}

export interface TicketProyecto {
    id: string
    slug: string
    nombre: string
    descripcion: string | null
    cliente_id: string | null
    public_token: string
    is_public: boolean
    created_at: string
    updated_at: string
    // campos derivados (joins/counts)
    cliente_empresa?: string | null
    cliente_nombre?: string | null
    total_tickets?: number
    abiertos?: number
}

export interface Ticket {
    id: string
    proyecto_id: string
    folio: string
    titulo: string
    descripcion: string
    urgencia: Urgencia
    estado: EstadoTicket
    categoria: string | null
    solicitante_nombre: string | null
    solicitante_email: string | null
    created_at: string
    updated_at: string
}

export interface TicketComentario {
    id: string
    ticket_id: string
    autor_tipo: AutorTipo
    autor_nombre: string | null
    mensaje: string
    created_at: string
}

export interface TicketConComentarios extends Ticket {
    comentarios: TicketComentario[]
}

export interface PortalPublico {
    id: string
    slug: string
    nombre: string
    descripcion: string | null
    is_public: boolean
    tickets: Ticket[]
}
