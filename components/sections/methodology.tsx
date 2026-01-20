import { CommandPrompt } from "../ui/command-prompt"

export function MethodologySection() {
  const steps = [
    {
      title: "Descubrimiento y diagnóstico",
      desc: "Entendemos tu negocio, procesos actuales y objetivos. Análisis de procesos y mejora de procesos.",
    },
    {
      title: "Diseño del embudo + Configuración ERP",
      desc: "Diseñamos tu embudo de ventas y proceso comercial. Configuramos Odoo como sistema administrativo completo.",
    },
    {
      title: "Implementación Odoo y capacitación",
      desc: "Configuramos el software para negocios, montamos automatización comercial y capacitamos a tu equipo.",
    },
    {
      title: "Acompañamiento y optimización",
      desc: "Consultoría de negocios continua: revisamos métricas y optimizamos el sistema para crecimiento empresarial.",
    },
  ]
  // </CHANGE>

  return (
    <section id="proceso" className="py-20 bg-[#0a0a0a] border-y border-slate-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <CommandPrompt command="mostrar-proceso" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-3">
          Nuestro proceso para implementar tu sistema de negocio
        </h2>
        <p className="text-lg text-slate-400 font-mono mb-8">
          Implementación Odoo, consultoría ERP y digitalización de negocios paso a paso.
        </p>
        {/* </CHANGE> */}

        <div className="mt-8 space-y-8 relative">
          <div className="absolute left-3 top-4 bottom-4 w-px bg-slate-800 md:left-4" />

          {steps.map((step, index) => (
            <div key={index} className="relative flex items-start pl-10 md:pl-12">
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 md:w-8 md:h-8 rounded bg-slate-900 border border-slate-700 text-green-500 font-mono text-sm md:text-base font-bold z-10">
                {index + 1}
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white font-mono">{step.title}</h4>
                <p className="text-slate-400 font-mono text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded">
          <p className="text-green-400 font-mono text-sm italic">
            {">"} El objetivo no es 'tener Odoo', es tener un proceso de ventas que funcione.
          </p>
        </div>
      </div>
    </section>
  )
}
