-- ============================================================================
-- SAT Descarga Masiva — tabla de seguimiento de solicitudes
-- ============================================================================
CREATE TABLE IF NOT EXISTS sat_solicitudes (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_solicitud_sat     VARCHAR(100),          -- UUID de solicitud del SAT
  tipo                 CHAR(1) NOT NULL,      -- E=Emitidas R=Recibidas
  fecha_inicio         DATE NOT NULL,
  fecha_fin            DATE NOT NULL,
  estado_sat           INTEGER DEFAULT 1,
  -- 1=Aceptada 2=EnProceso 3=Terminada 4=Error 5=Rechazada(cuota) 6=Vencida
  num_cfdis            INTEGER DEFAULT 0,     -- cuántos CFDIs reporta el SAT
  paquetes_total       INTEGER DEFAULT 0,
  paquetes_importados  INTEGER DEFAULT 0,
  mensaje              TEXT,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sat_solicitudes_estado ON sat_solicitudes(estado_sat);
CREATE INDEX IF NOT EXISTS idx_sat_solicitudes_fecha  ON sat_solicitudes(created_at DESC);

COMMENT ON TABLE sat_solicitudes IS 'Seguimiento de solicitudes al web service de Descarga Masiva del SAT';
COMMENT ON COLUMN sat_solicitudes.estado_sat IS '1=Aceptada 2=EnProceso 3=Terminada 4=Error 5=Rechazada 6=Vencida';
