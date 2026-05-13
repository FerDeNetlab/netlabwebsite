-- Tabla para guardar nóminas por quincena
-- Ejecutar en Neon antes de usar el módulo de quincenas en /admin/rh/bbva

CREATE TABLE IF NOT EXISTS rh_nominas (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quincena    VARCHAR(20) NOT NULL UNIQUE,  -- formato: '2026-05-1' o '2026-05-2'
  total       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  empleados   JSONB NOT NULL DEFAULT '[]',  -- [{ id, nombre, tarjeta, rfc, importe }]
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);
