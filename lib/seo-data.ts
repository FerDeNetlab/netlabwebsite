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

// Casos de uso de Netlab IA — análisis de datos sobre Odoo.
// Cada caso genera una página indexable en /odoo-ia/[slug].
export const casosIA = [
  {
    slug: "analisis-ventas-ia",
    nombre: "Análisis de Ventas con IA",
    titulo: "Análisis de Ventas con Inteligencia Artificial en Odoo",
    descripcion: "Descubre tendencias, productos estrella y caídas de ventas antes que la competencia.",
    problema: "Los reportes de ventas de Odoo te dicen qué pasó, pero no por qué ni qué viene. Revisar tablas a mano se vuelve imposible cuando crecen los datos.",
    solucion: "Nuestra IA lee tus órdenes de venta en Odoo y te entrega, en lenguaje natural, las tendencias por producto, cliente y temporada, además de alertas de variaciones inesperadas.",
    keyword: "análisis de ventas con IA",
    sistema: "ventas",
  },
  {
    slug: "prediccion-demanda-ia",
    nombre: "Predicción de Demanda de Inventario con IA",
    titulo: "Predicción de Demanda de Inventario con IA en Odoo",
    descripcion: "Anticipa cuánto vas a vender y evita quiebres de stock o sobreinventario.",
    problema: "Comprar de más inmoviliza tu capital; comprar de menos te deja sin producto. El histórico de Odoo tiene la respuesta, pero nadie tiene tiempo de analizarlo.",
    solucion: "La IA proyecta la demanda por SKU usando tu historial de movimientos de inventario en Odoo, considerando estacionalidad y tendencia, para que compres lo justo.",
    keyword: "predicción de demanda con IA",
    sistema: "inventarios",
  },
  {
    slug: "pronostico-flujo-caja-ia",
    nombre: "Pronóstico de Flujo de Caja con IA",
    titulo: "Pronóstico de Flujo de Caja con Inteligencia Artificial",
    descripcion: "Sabe con semanas de anticipación si tendrás problemas de liquidez.",
    problema: "El flujo de caja se revisa cuando ya es tarde. Cuentas por cobrar y por pagar viven en Odoo, pero proyectarlas a futuro es manual y propenso a errores.",
    solucion: "Conectamos la IA a tus facturas y gastos en Odoo para proyectar entradas y salidas, estimar tu saldo futuro y avisarte antes de que falte efectivo.",
    keyword: "pronóstico de flujo de caja con IA",
    sistema: "erp",
  },
  {
    slug: "deteccion-anomalias-finanzas-ia",
    nombre: "Detección de Anomalías Financieras con IA",
    titulo: "Detección de Anomalías y Fraude Financiero con IA en Odoo",
    descripcion: "Identifica gastos extraños, duplicados y movimientos fuera de patrón.",
    problema: "Un cargo duplicado, un gasto inflado o un movimiento atípico se pierden entre cientos de asientos contables en Odoo.",
    solucion: "La IA revisa tus movimientos contables y financieros buscando patrones anómalos y te marca lo que requiere tu atención antes de que se vuelva un problema.",
    keyword: "detección de anomalías financieras con IA",
    sistema: "erp",
  },
  {
    slug: "segmentacion-clientes-ia",
    nombre: "Segmentación de Clientes con IA",
    titulo: "Segmentación de Clientes en CRM con Inteligencia Artificial",
    descripcion: "Agrupa clientes por comportamiento real para vender más y mejor.",
    problema: "Tratar a todos los clientes igual desperdicia esfuerzo. Los datos de tu CRM de Odoo esconden segmentos valiosos que no ves a simple vista.",
    solucion: "La IA analiza la actividad de tus clientes en el CRM de Odoo y los agrupa por valor, frecuencia y riesgo de fuga, para que enfoques tus campañas donde rinden.",
    keyword: "segmentación de clientes con IA",
    sistema: "crm",
  },
  {
    slug: "reportes-automaticos-ia",
    nombre: "Reportes Automáticos con IA",
    titulo: "Reportes Ejecutivos Automáticos con IA desde Odoo",
    descripcion: "Recibe un resumen claro de tu negocio sin armar una sola tabla.",
    problema: "Armar el reporte semanal o mensual consume horas de copiar, pegar y graficar datos de Odoo.",
    solucion: "La IA genera automáticamente reportes ejecutivos en lenguaje natural con tus KPIs de Odoo y te los entrega listos para tomar decisiones.",
    keyword: "reportes automáticos con IA",
    sistema: "erp",
  },
  {
    slug: "rentabilidad-productos-ia",
    nombre: "Análisis de Rentabilidad por Producto con IA",
    titulo: "Análisis de Rentabilidad por Producto con IA en Odoo",
    descripcion: "Sabe qué productos realmente ganan dinero y cuáles te lo quitan.",
    problema: "Vender mucho no es ganar. El margen real por producto, descontando costos y descuentos, está enterrado en los datos de Odoo.",
    solucion: "La IA cruza ventas, costos y descuentos de Odoo para mostrarte la rentabilidad real de cada producto y recomendarte dónde subir precio o dejar de vender.",
    keyword: "análisis de rentabilidad de productos con IA",
    sistema: "ventas",
  },
  {
    slug: "alertas-kpi-ia",
    nombre: "Alertas Inteligentes de KPIs con IA",
    titulo: "Alertas Inteligentes de KPIs de Negocio con IA",
    descripcion: "Que el sistema te avise cuando algo importante cambia, no tú revisando.",
    problema: "Para enterarte de un problema tienes que entrar a Odoo y revisar. Cuando lo notas, ya llevas días perdiendo.",
    solucion: "La IA vigila tus indicadores clave en Odoo y te avisa por correo o Telegram en cuanto un KPI se sale de lo normal, con el contexto para actuar.",
    keyword: "alertas inteligentes de KPIs con IA",
    sistema: "erp",
  },
] as const

export type Servicio = (typeof servicios)[number]
export type Ciudad = (typeof ciudades)[number]
export type Industria = (typeof industrias)[number]
export type CasoIA = (typeof casosIA)[number]
