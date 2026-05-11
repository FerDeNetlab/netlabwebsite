-- ============================================================================
-- CFDIs / Facturas Fiscales del SAT — Netlab (RFC: HAR250221IT3)
-- ============================================================================
-- Tabla de staging para CFDIs descargados del portal SAT.
-- Permite conciliación entre XMLs fiscales y registros internos
-- (facturas en cuentas por cobrar y gastos).
-- ============================================================================

CREATE TABLE IF NOT EXISTS cfdis (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Datos del timbre fiscal (SAT)
  uuid_sat       UUID NOT NULL,                     -- Folio Fiscal único
  tipo_comprobante CHAR(1) NOT NULL,                -- I=Ingreso E=Egreso N=Nomina P=Pago T=Traslado
  fecha          TIMESTAMP,                         -- Fecha de emisión del CFDI
  fecha_timbrado TIMESTAMP,                         -- Fecha de timbrado por PAC

  -- Emisor / Receptor
  emisor_rfc     VARCHAR(20) NOT NULL,
  emisor_nombre  VARCHAR(300),
  receptor_rfc   VARCHAR(20) NOT NULL,
  receptor_nombre VARCHAR(300),

  -- Importes
  subtotal       DECIMAL(14,2) DEFAULT 0,
  total          DECIMAL(14,2) NOT NULL,
  moneda         VARCHAR(10) DEFAULT 'MXN',

  -- Clasificación automática
  -- 'emitida'  = Netlab es el emisor  (ingreso para Netlab)
  -- 'recibida' = Netlab es el receptor (egreso  para Netlab)
  -- 'otra'     = RFC de Netlab no aparece
  tipo_netlab    VARCHAR(20),

  -- Archivo XML en Vercel Blob
  xml_url        TEXT,
  xml_nombre     VARCHAR(255),

  -- Conciliación
  estado         VARCHAR(20) NOT NULL DEFAULT 'sin_asignar', -- sin_asignar | asignado
  factura_id     UUID REFERENCES facturas(id) ON DELETE SET NULL,
  gasto_id       UUID REFERENCES gastos(id)   ON DELETE SET NULL,

  created_at     TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

  UNIQUE(uuid_sat)
);

CREATE INDEX IF NOT EXISTS idx_cfdis_estado       ON cfdis(estado);
CREATE INDEX IF NOT EXISTS idx_cfdis_tipo_netlab  ON cfdis(tipo_netlab);
CREATE INDEX IF NOT EXISTS idx_cfdis_emisor_rfc   ON cfdis(emisor_rfc);
CREATE INDEX IF NOT EXISTS idx_cfdis_receptor_rfc ON cfdis(receptor_rfc);
CREATE INDEX IF NOT EXISTS idx_cfdis_factura      ON cfdis(factura_id);
CREATE INDEX IF NOT EXISTS idx_cfdis_gasto        ON cfdis(gasto_id);
CREATE INDEX IF NOT EXISTS idx_cfdis_fecha        ON cfdis(fecha DESC);

COMMENT ON TABLE cfdis IS 'CFDIs del SAT: facturas fiscales emitidas y recibidas por Netlab (RFC HAR250221IT3) para conciliación contable';
COMMENT ON COLUMN cfdis.uuid_sat IS 'Folio Fiscal (UUID) único del timbre del SAT — nunca se repite';
COMMENT ON COLUMN cfdis.tipo_netlab IS 'emitida: Netlab como emisor (A/R). recibida: Netlab como receptor (A/P)';
COMMENT ON COLUMN cfdis.estado IS 'sin_asignar: CFDI pendiente de conciliar. asignado: ya vinculado a factura o gasto';
