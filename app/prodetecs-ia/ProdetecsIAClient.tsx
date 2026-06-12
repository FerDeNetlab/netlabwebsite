import Link from "next/link"

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
})

const base = 3700
const iva = Math.round(base * 0.16)
const total = base + iva

export default function ProdetecsIAClient() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <section className="border-b border-zinc-800 bg-[radial-gradient(circle_at_top_right,rgba(250,204,21,0.08),transparent_40%),radial-gradient(circle_at_top_left,rgba(34,197,94,0.08),transparent_35%)]">
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400">Propuesta comercial Netlab</p>
          <h1 className="mt-3 text-3xl font-semibold leading-tight text-zinc-100 md:text-5xl">
            Prodetecs ya tiene Odoo Enterprise.
            <span className="block text-amber-400">Ahora necesita inteligencia accionable en tiempo real.</span>
          </h1>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-zinc-300 md:text-base">
            Propuesta para Prodetecs: implementar y operar una capa de analitica inteligente sobre su Odoo Enterprise,
            con chatbot conectado a la API de Claude (Sonnet 4.7), dashboards directivos y componentes generativos
            para tablas, graficos y archivos listos para analisis ejecutivo.
          </p>

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-xs text-zinc-400">
            <p>{">"} Analizando brecha entre datos disponibles y visibilidad directiva... [OK]</p>
            <p>{">"} Conectando Odoo Enterprise con capa IA de analitica en vivo... [OK]</p>
            <p>{">"} Plataforma inicial + mejora continua mensual... [READY]</p>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-800">
        <div className="mx-auto grid max-w-5xl gap-6 px-4 py-12 md:grid-cols-2 md:py-14">
          <article className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Contexto actual</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-100">El problema no es Odoo. Es la capa de analitica.</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              <li>- Odoo Enterprise esta en operacion, pero no entrega los dashboards que Direccion requiere.</li>
              <li>- Las metricas clave no estan en un formato conversacional y accionable para toma de decisiones rapida.</li>
              <li>- El negocio necesita visibilidad de datos en tiempo real, no reporteo manual tardio.</li>
            </ul>
          </article>

          <article className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-400">Solucion Netlab</p>
            <h2 className="mt-2 text-xl font-semibold text-zinc-100">Prodetecs IA Analytics Layer</h2>
            <ul className="mt-4 space-y-2 text-sm text-zinc-200">
              <li>- Chatbot IA conectado a Odoo Enterprise via API.</li>
              <li>- Motor de respuesta con Claude Sonnet 4.7.</li>
              <li>- Generative components para tablas, graficos y archivos.</li>
              <li>- Dashboards generales conectados a datos en tiempo real.</li>
              <li>- Evolucion mensual segun nuevas preguntas del negocio.</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Alcance mensual</p>
              <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Que incluye el servicio</h2>
            </div>
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-2 font-mono text-xs text-green-400">
              Tokens de IA incluidos
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {[
              "Plataforma inicial entregada y operativa.",
              "Ajustes sobre dashboards y visualizaciones segun necesidad de Direccion.",
              "Cambios iterativos en analisis y componentes generativos.",
              "Mantenimiento y mejora continua de la capa IA.",
              "Soporte funcional sobre la solucion implementada.",
              "Sin costo adicional por consumo de tokens dentro del esquema acordado.",
            ].map((item) => (
              <div key={item} className="rounded-lg border border-zinc-800 bg-zinc-900/30 px-4 py-3 text-sm text-zinc-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="precios" className="border-b border-zinc-800">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-14">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-500">Inversion</p>
          <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Propuesta con cotizacion anexa</h2>
          <p className="mt-3 max-w-3xl text-sm text-zinc-400">Servicio mensual recurrente para Prodetecs, con IVA desglosado y condiciones comerciales.</p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">Mensual sin IVA</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">{money.format(base)}</p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-zinc-500">IVA 16%</p>
              <p className="mt-2 text-3xl font-semibold text-zinc-100">{money.format(iva)}</p>
            </div>
            <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-amber-300">Total mensual con IVA</p>
              <p className="mt-2 text-3xl font-semibold text-amber-200">{money.format(total)}</p>
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-900/30 p-5">
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-zinc-500">Anexo A · Condiciones</p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              <li>- Modalidad: servicio mensual recurrente.</li>
              <li>- Facturacion: mensual anticipada.</li>
              <li>- Vigencia de propuesta: 15 dias naturales.</li>
              <li>- Moneda: pesos mexicanos (MXN).</li>
              <li>- Licencias Odoo Enterprise: ya contratadas por Prodetecs (fuera de este monto).</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contacto">
        <div className="mx-auto max-w-5xl px-4 py-12 md:py-14">
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-zinc-900 p-6 md:p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-amber-300">Siguientes pasos</p>
            <h2 className="mt-2 text-2xl font-semibold text-zinc-100">Del si a la operacion continua</h2>
            <ol className="mt-4 grid gap-2 text-sm text-zinc-200 md:grid-cols-2">
              <li>1. Aprobacion de propuesta por Prodetecs.</li>
              <li>2. Confirmacion formal por correo o WhatsApp.</li>
              <li>3. Emision de factura mensual.</li>
              <li>4. Inicio de ciclo de mejoras sobre dashboard y analitica IA.</li>
            </ol>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="https://wa.me/523333521742?text=Hola%20Fer%2C%20soy%20de%20Prodetecs%20y%20quiero%20avanzar%20con%20la%20propuesta%20de%20IA%20sobre%20Odoo%20Enterprise"
                className="inline-flex items-center rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-black transition-colors hover:bg-amber-300"
              >
                Confirmar por WhatsApp
              </Link>
              <Link
                href="mailto:fer@netlab.mx?subject=Prodetecs%20-%20Aprobacion%20propuesta%20IA"
                className="inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-200 transition-colors hover:border-zinc-500"
              >
                Confirmar por correo
              </Link>
            </div>

            <p className="mt-6 text-xs text-zinc-500">Propuesta valida por 15 dias naturales. HARDNETLABS S.A. DE C.V. - Netlab Consulting.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
