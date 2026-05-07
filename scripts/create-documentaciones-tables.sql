-- ============================================================================
-- Módulo de Documentaciones — esquema completo
-- Proyectos -> Categorías (módulos Odoo) -> Flujos -> Pasos (capturas)
-- ============================================================================

-- 1. Proyectos de documentación
CREATE TABLE IF NOT EXISTS doc_proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(120) NOT NULL UNIQUE,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  public_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_proyectos_token ON doc_proyectos(public_token);
CREATE INDEX IF NOT EXISTS idx_doc_proyectos_cliente ON doc_proyectos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_doc_proyectos_slug ON doc_proyectos(slug);

-- 2. Categorías (módulos Odoo: cobranza, facturación, crm, etc.)
CREATE TABLE IF NOT EXISTS doc_categorias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID NOT NULL REFERENCES doc_proyectos(id) ON DELETE CASCADE,
  nombre VARCHAR(150) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  modulo_odoo VARCHAR(80),
  icono VARCHAR(60) DEFAULT 'Folder',
  color VARCHAR(40) DEFAULT 'green',
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (proyecto_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_doc_categorias_proyecto ON doc_categorias(proyecto_id);

-- 3. Flujos dentro de cada categoría
CREATE TABLE IF NOT EXISTS doc_flujos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria_id UUID NOT NULL REFERENCES doc_categorias(id) ON DELETE CASCADE,
  nombre VARCHAR(200) NOT NULL,
  slug VARCHAR(200) NOT NULL,
  descripcion TEXT,
  proposito TEXT,
  accion_principal VARCHAR(255),
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (categoria_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_doc_flujos_categoria ON doc_flujos(categoria_id);

-- 4. Pasos (capturas) de cada flujo
CREATE TABLE IF NOT EXISTS doc_pasos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flujo_id UUID NOT NULL REFERENCES doc_flujos(id) ON DELETE CASCADE,
  orden INT NOT NULL DEFAULT 0,
  imagen_url TEXT NOT NULL,
  titulo VARCHAR(200),
  accion VARCHAR(255),
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_pasos_flujo ON doc_pasos(flujo_id);

-- ============================================================================
-- Trigger genérico para mantener updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION doc_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_doc_proyectos_updated ON doc_proyectos;
CREATE TRIGGER trg_doc_proyectos_updated BEFORE UPDATE ON doc_proyectos
  FOR EACH ROW EXECUTE FUNCTION doc_set_updated_at();

DROP TRIGGER IF EXISTS trg_doc_categorias_updated ON doc_categorias;
CREATE TRIGGER trg_doc_categorias_updated BEFORE UPDATE ON doc_categorias
  FOR EACH ROW EXECUTE FUNCTION doc_set_updated_at();

DROP TRIGGER IF EXISTS trg_doc_flujos_updated ON doc_flujos;
CREATE TRIGGER trg_doc_flujos_updated BEFORE UPDATE ON doc_flujos
  FOR EACH ROW EXECUTE FUNCTION doc_set_updated_at();

DROP TRIGGER IF EXISTS trg_doc_pasos_updated ON doc_pasos;
CREATE TRIGGER trg_doc_pasos_updated BEFORE UPDATE ON doc_pasos
  FOR EACH ROW EXECUTE FUNCTION doc_set_updated_at();
