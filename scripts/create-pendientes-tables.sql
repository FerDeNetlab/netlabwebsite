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

-- Pendientes enviados por terceros vía /pendientesfer
CREATE TABLE IF NOT EXISTS pendientes_externos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  empresa TEXT,
  asunto TEXT NOT NULL,
  descripcion TEXT,
  fecha_deseada DATE,
  estado TEXT NOT NULL   estado TEXT NOT NULL   estado TEXT NOT NULL   estado TEXT NOT NULL   estado TEXT NOT NULL   estado T,  estado TEXT NOT NULL   estado TL   estado TEXT NOT NULL   estado TEXT NOTNOT   estado TEXT NOT NULL   estado TEXT NOT NULL  TS  estado TEXT NOT s_esta  estado TEXT NOTdos  estado TEXT NOT NULL   estado ISTS idx_dire  estado TEXT NOT NULL   estado TEXT NOT NULL   estado TEXT NOT NULL   estado TEXT NOT ntes  estado TEXT NOT NULL   estado TEXT os(est  estado TEXT NOT NULL   estado TEXT NOT NULL   ext  estado TEXT NOT NULL   estado Ts(created_at DESC);
