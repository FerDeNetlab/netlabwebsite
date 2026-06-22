-- ============================================================================
-- Módulo de Tickets (Ticketera) — esquema completo
-- Ticketeras (por cliente) -> Tickets (issues) -> Comentarios (hilo)
-- Espejo del patrón de documentaciones: public_token + is_public para
-- compartir un portal al cliente sin login.
-- ============================================================================

-- 1. Ticketeras (un espacio de soporte por cliente/proyecto)
CREATE TABLE IF NOT EXISTS ticket_proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  public_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  ticket_seq INT NOT NULL DEFAULT 0,   -- contador atómico para folios TK-0001
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ticket_proyectos_token ON ticket_proyectos(public_token);
CREATE INDEX IF NOT EXISTS idx_ticket_proyectos_cliente ON ticket_proyectos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_ticket_proyectos_slug ON ticket_proyectos(slug);

-- 2. Tickets (issues levantados por el cliente)
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES ticket_proyectos(id) ON DELETE CASCADE,
  folio VARCHAR(20) NOT NULL,              -- p. ej. TK-0001 (único por ticketera)
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT NOT NULL,
  urgencia VARCHAR(20) NOT NULL DEFAULT 'media',  -- baja | media | alta | critica
  estado VARCHAR(20) NOT NULL DEFAULT 'nuevo',    -- nuevo | en_progreso | resuelto | cerrado
  categoria VARCHAR(80),                   -- opcional (bug, solicitud, duda, etc.)
  solicitante_nombre VARCHAR(150),
  solicitante_email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (proyecto_id, folio)
);

CREATE INDEX IF NOT EXISTS idx_tickets_proyecto ON tickets(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tickets_estado ON tickets(estado);

-- 3. Comentarios (hilo de conversación Netlab <-> cliente)
CREATE TABLE IF NOT EXISTS ticket_comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES tickets(id) ON DELETE CASCADE,
  autor_tipo VARCHAR(20) NOT NULL DEFAULT 'cliente',  -- cliente | netlab
  autor_nombre VARCHAR(150),
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_ticket_comentarios_ticket ON ticket_comentarios(ticket_id);

-- ============================================================================
-- Trigger updated_at (reutiliza/define la función genérica)
-- ============================================================================
CREATE OR REPLACE FUNCTION ticket_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_ticket_proyectos_updated ON ticket_proyectos;
CREATE TRIGGER trg_ticket_proyectos_updated BEFORE UPDATE ON ticket_proyectos
  FOR EACH ROW EXECUTE FUNCTION ticket_set_updated_at();

DROP TRIGGER IF EXISTS trg_tickets_updated ON tickets;
CREATE TRIGGER trg_tickets_updated BEFORE UPDATE ON tickets
  FOR EACH ROW EXECUTE FUNCTION ticket_set_updated_at();
