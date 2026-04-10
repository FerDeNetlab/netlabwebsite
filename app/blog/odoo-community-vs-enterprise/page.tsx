import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, ArrowRight, CheckCircle2, XCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Odoo Community vs Enterprise: ¿Cuál conviene para tu PyME? | Netlab",
  description:
    "Comparativa completa entre Odoo Community Edition y Enterprise. Diferencias en costos, módulos y funciones. Para 10 usuarios en 5 años, Community ahorra más de $420,000 MXN en licencias.",
  alternates: {
    canonical: "https://www.netlab.mx/blog/odoo-community-vs-enterprise",
  },
  openGraph: {
    title: "Odoo Community vs Enterprise: ¿Cuál conviene para tu PyME en México?",
    description:
      "Ahorra más de $420,000 MXN. Comparativa completa de módulos, costos y funciones entre Odoo CE y Enterprise para PyMEs mexicanas.",
    type: "article",
    publishedTime: "2026-04-10",
    authors: ["Netlab Consulting"],
    tags: ["Odoo", "ERP", "PyMEs México", "Odoo Community", "Odoo Enterprise"],
  },
}

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: "Odoo Community vs Enterprise: ¿cuál conviene para tu PyME en México?",
  description:
    "Comparativa completa entre Odoo Community Edition y Enterprise. Diferencias en costos, módulos y funciones para PyMEs mexicanas.",
  datePublished: "2026-04-10",
  dateModified: "2026-04-10",
  author: {
    "@type": "Organization",
    name: "Netlab Consulting",
    url: "https://www.netlab.mx",
  },
  publisher: {
    "@type": "Organization",
    name: "Netlab Consulting",
    logo: {
      "@type": "ImageObject",
      url: "https://www.netlab.mx/logo-netlab.png",
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.netlab.mx/blog/odoo-community-vs-enterprise",
  },
  keywords:
    "odoo community vs enterprise, odoo community edition México, diferencia odoo community enterprise, odoo gratis, implementar odoo sin licencias",
  articleBody:
    "Odoo Community Edition es la versión gratuita de Odoo. No tiene costo de licencia anual. Enterprise cuesta aproximadamente $7,000 MXN por usuario al año. Para 10 usuarios en 5 años, Enterprise suma más de $420,000 MXN solo en licencias. Community incluye ventas, CRM, inventarios, POS, facturación CFDI y contabilidad — suficiente para la mayoría de PyMEs mexicanas.",
  inLanguage: "es-MX",
}

const comparisonRows = [
  { feature: "Costo de licencia", community: "$0 de por vida", enterprise: "~$7,000 MXN/usuario/año", advantage: "community" },
  { feature: "Código abierto", community: "Sí (LGPL)", enterprise: "No (propietario)", advantage: "community" },
  { feature: "Ventas y cotizaciones", community: "✓ Incluido", enterprise: "✓ Incluido", advantage: "tie" },
  { feature: "CRM", community: "✓ Incluido", enterprise: "✓ Incluido", advantage: "tie" },
  { feature: "Inventarios", community: "✓ Incluido", enterprise: "✓ Incluido", advantage: "tie" },
  { feature: "Facturación CFDI 4.0", community: "✓ Con módulo PAC", enterprise: "✓ Incluido", advantage: "tie" },
  { feature: "Punto de Venta POS", community: "✓ Incluido", enterprise: "✓ Incluido", advantage: "tie" },
  { feature: "Contabilidad completa", community: "Básica", enterprise: "Completa", advantage: "enterprise" },
  { feature: "App móvil oficial", community: "Limitada", enterprise: "Completa", advantage: "enterprise" },
  { feature: "Soporte oficial Odoo", community: "❌ Comunidad", enterprise: "✓ Soporte pagado", advantage: "enterprise" },
  { feature: "Actualizaciones", community: "Manual", enterprise: "Automático (con costo)", advantage: "tie" },
  { feature: "Personalización", community: "Total (open source)", enterprise: "Limitada por contrato", advantage: "community" },
]

export default function OdooCEvsEnterprisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className="min-h-screen bg-[#0c0c0c] py-12">
        <article className="container mx-auto px-4 max-w-3xl">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-green-400 transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Blog
          </Link>

          {/* Header */}
          <header className="mb-10">
            <div className="flex flex-wrap gap-2 mb-4">
              {["Odoo", "Community Edition", "ERP", "Costos"].map((tag) => (
                <span key={tag} className="text-xs font-mono px-2 py-0.5 bg-green-500/10 text-green-400 rounded-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white font-mono leading-tight mb-4">
              Odoo Community vs Enterprise: ¿cuál conviene para tu PyME en México?
            </h1>
            <div className="flex items-center gap-5 text-xs font-mono text-slate-500 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> 10 de abril de 2026
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> 8 min lectura
              </span>
              <span>Por <span className="text-slate-400">Netlab Consulting</span></span>
            </div>
            {/* TL;DR */}
            <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-sm">
              <p className="text-xs font-mono text-green-400 mb-1">{">"} Resumen rápido</p>
              <p className="text-sm font-mono text-slate-300 leading-relaxed">
                Para la mayoría de las PyMEs mexicanas, <strong className="text-white">Odoo Community Edition es la mejor opción</strong>.
                Tiene $0 de licencias, incluye todos los módulos esenciales y con una buena implementación cubre el 95% de las necesidades.
                Enterprise solo convierte si necesitas soporte oficial de Odoo o módulos muy específicos como RRHH avanzado.
              </p>
            </div>
          </header>

          {/* Content */}
          <div className="prose prose-invert prose-sm max-w-none font-mono space-y-8">

            <section>
              <h2 className="text-xl font-bold text-white mb-3">¿Qué es Odoo Community Edition?</h2>
              <p className="text-slate-400 leading-relaxed">
                Odoo Community Edition (CE) es la versión <strong className="text-slate-300">gratuita y de código abierto</strong> del
                ERP Odoo, publicada bajo licencia LGPL. Cualquier empresa puede descargarlo, instalarlo y usarlo sin pagar
                ninguna licencia anual ni por usuario.
              </p>
              <p className="text-slate-400 leading-relaxed mt-3">
                Incluye los módulos más importantes para PyMEs: ventas, CRM, control de inventarios, punto de venta,
                facturación electrónica CFDI 4.0 y contabilidad básica. Es el mismo núcleo que usa Enterprise —
                la diferencia está en módulos avanzados y el soporte oficial.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">¿Cuánto cuesta Odoo Enterprise vs Community?</h2>
              <p className="text-slate-400 leading-relaxed">
                Este es el punto más importante. Odoo Enterprise tiene un costo de <strong className="text-slate-300">aproximadamente $7,000 MXN por usuario al año</strong>.
                Aquí el impacto real a 5 años:
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-2 pr-4 text-slate-400 font-bold">Usuarios</th>
                      <th className="text-right py-2 px-4 text-green-400 font-bold">Community (5 años)</th>
                      <th className="text-right py-2 pl-4 text-red-400 font-bold">Enterprise (5 años)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {[
                      { users: "5 usuarios", ce: "$0", ent: "$175,000 MXN" },
                      { users: "10 usuarios", ce: "$0", ent: "$350,000 MXN" },
                      { users: "25 usuarios", ce: "$0", ent: "$875,000 MXN" },
                      { users: "50 usuarios", ce: "$0", ent: "$1,750,000 MXN" },
                    ].map((row) => (
                      <tr key={row.users}>
                        <td className="py-2 pr-4 text-slate-300">{row.users}</td>
                        <td className="py-2 px-4 text-right text-green-400 font-bold">{row.ce}</td>
                        <td className="py-2 pl-4 text-right text-red-400">{row.ent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-slate-500 text-xs mt-2">* Licencias solamente. No incluye implementación ni hosting.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-4">Comparativa completa: Community vs Enterprise</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-2 pr-4 text-slate-400 font-bold">Característica</th>
                      <th className="text-center py-2 px-3 text-green-400 font-bold">Community</th>
                      <th className="text-center py-2 pl-3 text-slate-400 font-bold">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {comparisonRows.map((row) => (
                      <tr key={row.feature}>
                        <td className="py-2.5 pr-4 text-slate-300">{row.feature}</td>
                        <td className={`py-2.5 px-3 text-center ${row.advantage === "community" ? "text-green-400 font-bold" : "text-slate-400"}`}>
                          {row.community}
                        </td>
                        <td className={`py-2.5 pl-3 text-center ${row.advantage === "enterprise" ? "text-purple-400 font-bold" : "text-slate-400"}`}>
                          {row.enterprise}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">¿Cuándo elegir Odoo Community Edition?</h2>
              <p className="text-slate-400 leading-relaxed mb-3">
                Community es la opción correcta si tu empresa:
              </p>
              <ul className="space-y-2">
                {[
                  "Tiene entre 5 y 100 usuarios",
                  "Necesita ventas, CRM, inventarios, POS o facturación CFDI",
                  "Quiere control total sobre el sistema (código abierto)",
                  "Prefiere invertir en implementación y no en licencias anuales",
                  "Opera en retail, manufactura, distribución, alimentos o servicios",
                  "Trabaja con un partner de implementación certificado (como Netlab)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">¿Cuándo tiene sentido Enterprise?</h2>
              <p className="text-slate-400 leading-relaxed mb-3">
                Enterprise tiene ventaja en casos muy específicos:
              </p>
              <ul className="space-y-2">
                {[
                  "Requieres soporte técnico directo de Odoo S.A.",
                  "Necesitas el módulo de RRHH completo con nómina avanzada",
                  "Tu empresa tiene más de 200 usuarios con alta concurrencia",
                  "Necesitas la app móvil oficial con todas las funciones",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">¿Qué módulos incluye Odoo Community para México?</h2>
              <p className="text-slate-400 leading-relaxed mb-4">
                Odoo Community Edition con la localización mexicana incluye:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Ventas y cotizaciones",
                  "CRM y seguimiento de oportunidades",
                  "Control de inventarios multi-almacén",
                  "Punto de Venta (POS)",
                  "Facturación electrónica CFDI 4.0",
                  "Contabilidad básica con IVA/IEPS",
                  "Compras y proveedores",
                  "Manufactura ligera (MRP)",
                  "E-commerce básico",
                  "Sitio web corporativo",
                  "Proyectos y tareas",
                  "Helpdesk básico",
                ].map((mod) => (
                  <div key={mod} className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/40 px-3 py-2 rounded-sm">
                    <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                    {mod}
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">Conclusión: Community Edition gana para PyMEs</h2>
              <p className="text-slate-400 leading-relaxed">
                Para el 95% de las PyMEs mexicanas, <strong className="text-slate-300">Odoo Community Edition es la decisión correcta</strong>.
                El ahorro en licencias — hasta $1.75 millones de pesos para 50 usuarios en 5 años — puede reinvertirse
                en una implementación de calidad, capacitación del equipo y mejoras al sistema.
              </p>
              <p className="text-slate-400 leading-relaxed mt-3">
                La clave no está en elegir Enterprise para tener "más funciones" — está en tener
                <strong className="text-slate-300"> un buen partner de implementación</strong> que configure Odoo CE
                correctamente para tus procesos específicos.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 p-6 border border-green-500/20 bg-green-500/5 rounded-sm">
            <p className="text-xs font-mono text-green-400 mb-2">{">"} ¿Listo para implementar?</p>
            <h3 className="text-lg font-bold text-white font-mono mb-2">
              Implementamos Odoo Community para tu empresa desde $40,000 MXN
            </h3>
            <p className="text-sm text-slate-400 font-mono mb-4">
              Sin licencias anuales. Con capacitación de tu equipo y soporte post-lanzamiento.
            </p>
            <Link
              href="/agendar"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-400 text-black font-mono font-bold text-sm transition-all rounded-sm"
            >
              Agendar diagnóstico gratis
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Back to blog */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-xs font-mono text-slate-500 hover:text-green-400 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Ver todos los artículos
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}
