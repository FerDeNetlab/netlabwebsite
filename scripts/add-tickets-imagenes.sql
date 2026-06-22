-- Agrega soporte de capturas de pantalla a los tickets.
-- imagenes = arreglo JSON de URLs de Vercel Blob. Idempotente.
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS imagenes JSONB NOT NULL DEFAULT '[]'::jsonb;
