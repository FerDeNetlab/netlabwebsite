-- Agregar constraint único para SKU si no existe
-- Esto es necesario para el UPSERT (ON CONFLICT)
ALTER TABLE productos
ADD CONSTRAINT productos_sku_key UNIQUE (sku);
