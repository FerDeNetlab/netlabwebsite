-- ============================================================================
-- Módulo de Recursos Humanos (RH)
-- Empleados + documentos (PDFs / imágenes en Vercel Blob)
-- ============================================================================

CREATE TABLE IF NOT EXISTS rh_empleados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(200) NOT NULL,
  curp VARCHAR(18) UNIQUE,
  rfc VARCHAR(13),
  nss VARCHAR(20),                -- Número de Seguridad Social
  telefono VARCHAR(30),
  email VARCHAR(150),
  puesto VARCHAR(120),
  departamento VARCHAR(120),
  fecha_ingreso DATE,
  fecha_nacimiento DATE,
  salario_mensual NUMERIC(12, 2),
  tipo_contrato VARCHAR(60),      -- "Indefinido" | "Determinado" | "Honorarios" | "Practicas"
  estado_civil VARCHAR(40),
  direccion TEXT,
  contacto_emergencia_nombre VARCHAR(200),
  contacto_emergencia_telefono VARCHAR(30),
  contacto_emergencia_relacion VARCHAR(80),
  banco VARCHAR(80),
  clabe VARCHAR(20),
  foto_url TEXT,
  notas TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  fecha_baja DATE,
  motivo_baja TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rh_empleados_activo ON rh_empleados(activo);
CREATE INDEX IF NOT EXISTS idx_rh_empleados_curp ON rh_empleados(curp);
CREATE INDEX IF NOT EXISTS idx_rh_empleados_departamento ON rh_empleados(departamento);

-- Documentos asociados a cada empleado (contratos, INE, comprobantes, etc.)
CREATE TABLE IF NOT EXISTS rh_empleado_documentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empleado_id UUID NOT NULL REFERENCES rh_empleados(id) ON DELETE CASCADE,
  nombre VARCHAR(200) NOT NULL,    -- Etiqueta visible: "Contrato 2026", "INE", etc.
  tipo VARCHAR(60),                -- "contrato" | "ine" | "curp" | "rfc" | "comprobante_domicilio" | "otro"
  url TEXT NOT NULL,
  size_bytes BIGINT,
  mime_type VARCHAR(120),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rh_documentos_empleado ON rh_empleado_documentos(empleado_id);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION rh_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_rh_empleados_updated ON rh_empleados;
CREATE TRIGGER trg_rh_empleados_updated BEFORE UPDATE ON rh_empleados
  FOR EACH ROW EXECUTE FUNCTION rh_set_updated_at();
