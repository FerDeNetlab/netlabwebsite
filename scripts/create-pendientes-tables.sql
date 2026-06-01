-- Pendientes propios del director
CREATE TABLE IF NOT EXISTS director_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  categoria TEXT NOT NULL DEFAULT 'Personal'
    CHECK (categoria IN ('Personal','Empresa','Reunión','Llamada','Seguimiento','Otro')),
  prioridad TEXT NOT NULL DEFAULT 'normal'
    CHECK (prioridad IN ('alta','normal','baja')),
  estado TEXT NOT NULL DEFAULT 'pendiente'
    CHECK (estado IN ('pendiente','en_progreso','completado')),
  fecha_limite TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pendientes enviados por terceros via /pendientesfer
CREATE TABLE IF NOT EXISTS pendientes_externos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  empresa TEXT,
  asunto TEXT NOT NULL,
  descripcion TEXT,
  fecha_deseada DATE,
  estado TEXT NOT NULL DEFAULT 'nuevo'
    CHECK (estado IN ('nuevo','visto','agendado','completado')),
  notas_director TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_director_todos_estado ON director_todos(estado);
CREATE INDEX IF NOT EXISTS idx_pendientes_externos_estado ON pendientes_externos(estado);
CREATE INDEX IF NOT EXISTS idx_pendientes_externos_created ON pendientes_externos(created_at DESC);
