-- ============================================================================
-- SAF Migration (Fase 1 + Fase 2 + Fase 3)
-- Sistema Administrativo Financiero — esquema completo
-- ============================================================================
-- Cambios:
--   FASE 1: archivos en Vercel Blob (facturas + gastos), tipo_ingreso ya existe
--   FASE 2: bolsa_destino en facturas, bolsa_origen + tipo_gasto en gastos,
--           expansión de aportes_capital (préstamos, origen, uso)
--   FASE 3: telegram_chats, recordatorios_enviados (auditoría de avisos)
-- ============================================================================

-- =====================================================
-- FASE 1: Archivos
-- =====================================================
ALTER TABLE IF EXISTS facturas
  ADD COLUMN IF NOT EXISTS archivo_url TEXT,
  ADD COLUMN IF NOT EXISTS archivo_tipo VARCHAR(80);

COMMENT ON COLUMN facturas.archivo_url IS 'URL del PDF en Vercel Blob (sustituye archivo_data)';

ALTER TABLE IF EXISTS gastos
  ADD COLUMN IF NOT EXISTS archivo_url TEXT,
  ADD COLUMN IF NOT EXISTS archivo_nombre VARCHAR(255),
  ADD COLUMN IF NOT EXISTS archivo_tipo VARCHAR(80);

COMMENT ON COLUMN gastos.archivo_url IS 'URL del comprobante (PDF/imagen) en Vercel Blob';

-- =====================================================
-- FASE 2: Bolsas + tipo_gasto
-- =====================================================
ALTER TABLE IF EXISTS facturas
  ADD COLUMN IF NOT EXISTS bolsa_destino VARCHAR(50);

COMMENT ON COLUMN facturas.bolsa_destino IS 'Bolsa a la que se asigna el ingreso cobrado: operacion_base, operacion_variable, crecimiento, reserva';

ALTER TABLE IF EXISTS gastos
  ADD COLUMN IF NOT EXISTS bolsa_origen VARCHAR(50),
  ADD COLUMN IF NOT EXISTS tipo_gasto VARCHAR(50);

COMMENT ON COLUMN gastos.bolsa_origen IS 'Bolsa de la que sale el gasto: operacion_base, operacion_variable, crecimiento, reserva';
COMMENT ON COLUMN gastos.tipo_gasto IS 'Clasificación SAF: estructural | variable | estrategico';

-- Backfill: gastos recurrentes/sueldos -> estructural; resto -> variable
UPDATE gastos SET tipo_gasto = CASE
    WHEN recurrente = true OR subtipo = 'sueldo' THEN 'estructural'
    ELSE 'variable'
  END
  WHERE tipo_gasto IS NULL;

-- Backfill: bolsa_origen segun tipo_gasto
UPDATE gastos SET bolsa_origen = CASE
    WHEN tipo_gasto = 'estructural' THEN 'operacion_base'
    WHEN tipo_gasto = 'estrategico' THEN 'crecimiento'
    ELSE 'operacion_variable'
  END
  WHERE bolsa_origen IS NULL;

-- Backfill: bolsa_destino en facturas segun tipo_ingreso (Opción A: 100% automático)
UPDATE facturas SET bolsa_destino = CASE
    WHEN tipo_ingreso = 'fijo' THEN 'operacion_base'
    WHEN tipo_ingreso = 'run_rate' THEN 'operacion_variable'
    ELSE 'crecimiento'
  END
  WHERE bolsa_destino IS NULL;

-- =====================================================
-- FASE 2: Aportes / Capital expandido
-- =====================================================
ALTER TABLE IF EXISTS aportes_capital
  ADD COLUMN IF NOT EXISTS tipo VARCHAR(20) DEFAULT 'aporte',
  ADD COLUMN IF NOT EXISTS origen VARCHAR(20) DEFAULT 'socio',
  ADD COLUMN IF NOT EXISTS uso_recurso TEXT,
  ADD COLUMN IF NOT EXISTS tasa_interes DECIMAL(6, 3),
  ADD COLUMN IF NOT EXISTS fecha_devolucion DATE,
  ADD COLUMN IF NOT EXISTS estado VARCHAR(20) DEFAULT 'activo';

COMMENT ON COLUMN aportes_capital.tipo IS 'aporte (capital social, no devolver) | prestamo (deuda con devolución)';
COMMENT ON COLUMN aportes_capital.origen IS 'socio | externo';
COMMENT ON COLUMN aportes_capital.uso_recurso IS 'Para qué se va a usar el dinero (descripción)';
COMMENT ON COLUMN aportes_capital.tasa_interes IS 'Tasa de interés anual (solo préstamos)';
COMMENT ON COLUMN aportes_capital.estado IS 'activo | devuelto (préstamos liquidados)';

-- =====================================================
-- FASE 3: Telegram + Recordatorios
-- =====================================================
CREATE TABLE IF NOT EXISTS telegram_chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email VARCHAR(255),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  chat_id VARCHAR(100) NOT NULL,
  username VARCHAR(100),
  nombre VARCHAR(150),
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(chat_id)
);

CREATE INDEX IF NOT EXISTS idx_telegram_chats_email ON telegram_chats(user_email);
CREATE INDEX IF NOT EXISTS idx_telegram_chats_cliente ON telegram_chats(cliente_id);

COMMENT ON TABLE telegram_chats IS 'Vincula un usuario interno (Netlab) o cliente con su chat_id de Telegram';

CREATE TABLE IF NOT EXISTS recordatorios_enviados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
  gasto_id UUID REFERENCES gastos(id) ON DELETE CASCADE,
  tipo_evento VARCHAR(50) NOT NULL, -- 'vencimiento_proximo', 'vencida', 'gasto_proximo'
  canal VARCHAR(20) NOT NULL, -- 'email' | 'telegram'
  destinatario VARCHAR(255) NOT NULL,
  enviado_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  ok BOOLEAN DEFAULT true,
  error TEXT,
  UNIQUE(factura_id, tipo_evento, canal, destinatario, enviado_at)
);

CREATE INDEX IF NOT EXISTS idx_recordatorios_factura ON recordatorios_enviados(factura_id);
CREATE INDEX IF NOT EXISTS idx_recordatorios_gasto ON recordatorios_enviados(gasto_id);
CREATE INDEX IF NOT EXISTS idx_recordatorios_fecha ON recordatorios_enviados(enviado_at DESC);

COMMENT ON TABLE recordatorios_enviados IS 'Auditoría de cada recordatorio enviado (para no duplicar y para reportes)';

-- =====================================================
-- FASE 1: Configuración por factura para recordatorios
-- =====================================================
ALTER TABLE IF EXISTS facturas
  ADD COLUMN IF NOT EXISTS recordatorios_activos BOOLEAN DEFAULT true;

ALTER TABLE IF EXISTS gastos
  ADD COLUMN IF NOT EXISTS recordatorios_activos BOOLEAN DEFAULT true;

-- =====================================================
-- Índices para alertas de vencimiento
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_facturas_fecha_vencimiento
  ON facturas(fecha_vencimiento)
  WHERE estado IN ('pendiente', 'parcial', 'vencida');

CREATE INDEX IF NOT EXISTS idx_gastos_fecha_vencimiento
  ON gastos(fecha_vencimiento)
  WHERE estado = 'pendiente';
