-- Netlab ERP Database Schema
-- Creado para gestión interna de proyectos, clientes y facturación

-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  email VARCHAR(255),
  telefono VARCHAR(50),
  rfc VARCHAR(13),
  direccion TEXT,
  ciudad VARCHAR(100),
  estado VARCHAR(100),
  notas TEXT,
  activo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Proyectos
CREATE TABLE IF NOT EXISTS proyectos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo VARCHAR(50), -- 'odoo', 'desarrollo-medida', 'hardware', 'consultoria'
  estado VARCHAR(50) DEFAULT 'prospecto', -- 'prospecto', 'cotizacion', 'activo', 'pausado', 'completado', 'cancelado'
  valor_total DECIMAL(10, 2),
  monto_pagado DECIMAL(10, 2) DEFAULT 0,
  fecha_inicio DATE,
  fecha_fin_estimada DATE,
  fecha_fin_real DATE,
  prioridad VARCHAR(20) DEFAULT 'media', -- 'baja', 'media', 'alta', 'urgente'
  responsable_id UUID REFERENCES neon_auth.user(id),
  notas TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Tareas
CREATE TABLE IF NOT EXISTS tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  titulo VARCHAR(255) NOT NULL,
  descripcion TEXT,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'en-progreso', 'revision', 'completada', 'bloqueada'
  prioridad VARCHAR(20) DEFAULT 'media',
  asignado_a UUID REFERENCES neon_auth.user(id),
  fecha_vencimiento DATE,
  horas_estimadas DECIMAL(5, 2),
  horas_reales DECIMAL(5, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Cotizaciones
CREATE TABLE IF NOT EXISTS cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES proyectos(id),
  numero_cotizacion VARCHAR(50) UNIQUE,
  concepto TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'enviada', -- 'borrador', 'enviada', 'aceptada', 'rechazada', 'expirada'
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  condiciones_pago TEXT,
  notas TEXT,
  created_by UUID REFERENCES neon_auth.user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS facturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE,
  proyecto_id UUID REFERENCES proyectos(id),
  numero_factura VARCHAR(50) UNIQUE,
  concepto TEXT NOT NULL,
  subtotal DECIMAL(10, 2) NOT NULL,
  iva DECIMAL(10, 2),
  total DECIMAL(10, 2) NOT NULL,
  estado VARCHAR(50) DEFAULT 'pendiente', -- 'pendiente', 'pagada', 'parcial', 'vencida', 'cancelada'
  fecha_emision DATE DEFAULT CURRENT_DATE,
  fecha_vencimiento DATE,
  fecha_pago DATE,
  metodo_pago VARCHAR(50),
  notas TEXT,
  created_by UUID REFERENCES neon_auth.user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Pagos
CREATE TABLE IF NOT EXISTS pagos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factura_id UUID REFERENCES facturas(id) ON DELETE CASCADE,
  monto DECIMAL(10, 2) NOT NULL,
  metodo_pago VARCHAR(50), -- 'transferencia', 'efectivo', 'tarjeta', 'cheque'
  referencia VARCHAR(100),
  fecha_pago DATE DEFAULT CURRENT_DATE,
  notas TEXT,
  registrado_por UUID REFERENCES neon_auth.user(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de Time Tracking
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  proyecto_id UUID REFERENCES proyectos(id) ON DELETE CASCADE,
  tarea_id UUID REFERENCES tareas(id) ON DELETE SET NULL,
  usuario_id UUID REFERENCES neon_auth.user(id),
  descripcion TEXT,
  horas DECIMAL(5, 2) NOT NULL,
  fecha DATE DEFAULT CURRENT_DATE,
  facturable BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_proyectos_cliente ON proyectos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_proyectos_estado ON proyectos(estado);
CREATE INDEX IF NOT EXISTS idx_tareas_proyecto ON tareas(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_tareas_asignado ON tareas(asignado_a);
CREATE INDEX IF NOT EXISTS idx_facturas_cliente ON facturas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_facturas_estado ON facturas(estado);
CREATE INDEX IF NOT EXISTS idx_pagos_factura ON pagos(factura_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_proyecto ON time_entries(proyecto_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_usuario ON time_entries(usuario_id);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proyectos_updated_at BEFORE UPDATE ON proyectos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tareas_updated_at BEFORE UPDATE ON tareas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cotizaciones_updated_at BEFORE UPDATE ON cotizaciones
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_facturas_updated_at BEFORE UPDATE ON facturas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
