import { CommandPrompt } from "../ui/command-prompt"

export function BenefitsSection() {
  const benefits = [
    "Visibilidad total de tu embudo de ventas en un solo lugar.",
    "Automatizaciones que recuerdan tareas a tu equipo.",
    "Reportes claros para tomar decisiones reales.",
    "Menos horas buscando información, más tiempo vendiendo.",
  ]

  return (
    <section className="py-20 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-4xl">
        <CommandPrompt command="ver-beneficios" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-8">Lo que ganas al trabajar con Netlab</h2>

        <div className="mt-8 grid gap-4">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-center space-x-3 p-3 rounded hover:bg-slate-900/50 transition-colors border border-transparent hover:border-slate-800"
            >
              <span className="text-purple-500 font-mono text-xs">[OK]</span>
              <p className="text-slate-300 font-mono">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
