export const servicios = [
  { slug: "software-ventas", nombre: "Software de Ventas", descripcion: "Sistema de ventas y cotizaciones" },
  { slug: "software-crm", nombre: "Software CRM", descripcion: "Gestión de relaciones con clientes" },
  {
    slug: "software-inventarios",
    nombre: "Software de Inventarios",
    descripcion: "Control de inventario en tiempo real",
  },
  { slug: "software-pos", nombre: "Software POS", descripcion: "Punto de venta para retail" },
  { slug: "software-facturacion", nombre: "Software de Facturación", descripcion: "Facturación electrónica CFDI 4.0" },
  { slug: "software-erp", nombre: "Software ERP", descripcion: "Sistema integral empresarial" },
  { slug: "software-ecommerce", nombre: "Software E-commerce", descripcion: "Tienda en línea profesional" },
  { slug: "sistema-automatizacion", nombre: "Sistema de Automatización", descripcion: "Automatización de procesos" },
  { slug: "desarrollo-software", nombre: "Desarrollo de Software", descripcion: "Software a medida para empresas" },
  { slug: "soluciones-hardware", nombre: "Soluciones de Hardware", descripcion: "Infraestructura y servidores" },
] as const

export const ciudades = [
  { slug: "guadalajara", nombre: "Guadalajara", estado: "Jalisco" },
  { slug: "ciudad-de-mexico", nombre: "Ciudad de México", estado: "CDMX" },
  { slug: "monterrey", nombre: "Monterrey", estado: "Nuevo León" },
  { slug: "queretaro", nombre: "Querétaro", estado: "Querétaro" },
  { slug: "puebla", nombre: "Puebla", estado: "Puebla" },
  { slug: "leon", nombre: "León", estado: "Guanajuato" },
  { slug: "tijuana", nombre: "Tijuana", estado: "Baja California" },
  { slug: "merida", nombre: "Mérida", estado: "Yucatán" },
  { slug: "aguascalientes", nombre: "Aguascalientes", estado: "Aguascalientes" },
  { slug: "cancun", nombre: "Cancún", estado: "Quintana Roo" },
  { slug: "culiacan", nombre: "Culiacán", estado: "Sinaloa" },
] as const

export const industrias = [
  { slug: "retail", nombre: "Retail", descripcion: "Soluciones para comercio al por menor" },
  { slug: "manufactura", nombre: "Manufactura", descripcion: "Sistemas para producción industrial" },
  { slug: "farmaceutica", nombre: "Farmacéutica", descripcion: "Software con regulaciones sanitarias" },
  { slug: "alimentos", nombre: "Alimentos y Bebidas", descripcion: "Gestión para industria alimentaria" },
  { slug: "automotriz", nombre: "Automotriz", descripcion: "Soluciones para sector automotriz" },
  { slug: "logistica", nombre: "Logística", descripcion: "Sistemas de gestión logística" },
  { slug: "construccion", nombre: "Construcción", descripcion: "Software para constructoras" },
  { slug: "tecnologia", nombre: "Tecnología", descripcion: "Soluciones para empresas tech" },
  { slug: "salud", nombre: "Salud", descripcion: "Sistemas para sector salud" },
  { slug: "educacion", nombre: "Educación", descripcion: "Software educativo" },
] as const

export type Servicio = (typeof servicios)[number]
export type Ciudad = (typeof ciudades)[number]
export type Industria = (typeof industrias)[number]
