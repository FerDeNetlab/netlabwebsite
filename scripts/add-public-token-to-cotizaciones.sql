-- Agrega campo public_token a cotizaciones y lo rellena para todas las existentes
ALTER TABLE cotizaciones ADD COLUMN IF NOT EXISTS public_token UUID NOT NULL DEFAULT gen_random_uuid();

-- Para cotizaciones existentes sin token (si alguna)
UPDATE cotizaciones SET public_token = gen_random_uuid() WHERE public_token IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_cotizaciones_public_token ON cotizaciones(public_token);
