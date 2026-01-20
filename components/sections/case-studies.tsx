import { CommandPrompt } from "../ui/command-prompt"
import { TerminalFrame } from "../ui/terminal-frame"

export function CaseStudiesSection() {
  const cases = [
    {
      quote:
        "Implementamos servidores SAN para almacenamiento de datos críticos y gestión centralizada de videos CCTV de múltiples ubicaciones. La infraestructura ahora es escalable y confiable.",
      company: "Laboratorios Pisa",
      timestamp: "2024-08-12 10:23:45",
      icon: "🏭",
    },
    {
      quote:
        "Odoo completo para producción implementado con enfoque en velocidad y control de procesos. Logramos optimizar tiempos de producción y tener visibilidad total del flujo de trabajo.",
      company: "Calcas para maquinaria",
      timestamp: "2024-09-28 14:17:33",
      icon: "⚙️",
    },
    {
      quote:
        "Sistema Odoo de inventarios complejos cumpliendo con todas las regulaciones gubernamentales del sector farmacéutico. Control total de lotes, caducidades y trazabilidad regulatoria.",
      company: "Mexarpharma",
      timestamp: "2024-11-05 09:41:18",
      icon: "💊",
    },
  ]

  return (
    <section id="casos" className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-5xl">
        <CommandPrompt command="tail -n 3 casos_exito.log" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-8">Casos de éxito</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {cases.map((item, i) => (
            <TerminalFrame
              key={i}
              title={`${item.company.toLowerCase().replace(/\s+/g, "_")}.log`}
              borderColor="gray"
              className="bg-[#111]"
            >
              <div className="font-mono text-xs space-y-3">
                <div className="text-slate-600">[{item.timestamp}] SUCCESS:</div>
                <p className="text-slate-300 text-sm leading-relaxed">"{item.quote}"</p>
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-green-500 font-bold">{item.company}</div>
                </div>
              </div>
            </TerminalFrame>
          ))}
        </div>
      </div>
    </section>
  )
}
