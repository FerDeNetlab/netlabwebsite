-- Crear tabla de productos/servicios
CREATE TABLE IF NOT EXISTS productos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  categoria VARCHAR(100),
  unidad VARCHAR(50) DEFAULT 'pieza',
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de items de cotización
CREATE TABLE IF NOT EXISTS cotizacion_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id UUID REFERENCES cotizaciones(id) ON DELETE CASCADE,
  producto_id UUID REFERENCES productos(id),
  descripcion TEXT,
  cantidad DECIMAL(10, 2) NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  descuento DECIMAL(5, 2) DEFAULT 0,
  subtotal DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_productos_activo ON productos(activo);
CREATE INDEX IF NOT EXISTS idx_cotizacion_items_cotizacion ON cotizacion_items(cotizacion_id);
