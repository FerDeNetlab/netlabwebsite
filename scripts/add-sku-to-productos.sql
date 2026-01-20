-- Agregar campo SKU/código para vincular con CVA
ALTER TABLE productos ADD COLUMN IF NOT EXISTS sku VARCHAR(100);
ALTER TABLE productos ADD COLUMN IF NOT EXISTS proveedor VARCHAR(50) DEFAULT 'CVA';
ALTER TABLE productos ADD COLUMN IF NOT EXISTS ultima_actualizacion_precio TIMESTAMP WITH TIME ZONE;

-- Crear índice único para evitar duplicados por SKU
CREATE UNIQUE INDEX IF NOT EXISTS idx_productos_sku_proveedor ON productos(sku, proveedor) WHERE sku IS NOT NULL;
