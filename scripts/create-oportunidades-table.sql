-- Crear tabla de oportunidades para el CRM
CREATE TABLE IF NOT EXISTS oportunidades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  valor NUMERIC(15, 2) NOT NULL DEFAULT 0,
  fecha_cierre_estimada DATE,
  probabilidad INTEGER DEFAULT 50 CHECK (probabilidad >= 0 AND probabilidad <= 100),
  etapa VARCHAR(50) NOT NULL DEFAULT 'prospecto',
  descripcion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_oportunidades_cliente_id ON oportunidades(cliente_id);
CREATE INDEX IF NOT EXISTS idx_oportunidades_etapa ON oportunidades(etapa);
CREATE INDEX IF NOT EXISTS idx_oportunidades_fecha_cierre ON oportunidades(fecha_cierre_estimada);

-- Comentarios para documentar la tabla
COMMENT ON TABLE oportunidades IS 'Tabla para gestionar oportunidades de ventas en el CRM';
COMMENT ON COLUMN oportunidades.etapa IS 'Etapas: prospecto, calificacion, propuesta, negociacion, ganado, perdido';
COMMENT ON COLUMN oportunidades.probabilidad IS 'Probabilidad de cierre entre 0 y 100';
