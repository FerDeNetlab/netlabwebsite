import { CommandPrompt } from "../ui/command-prompt"

export function SocialProofSection() {
  return (
    <section id="casos" className="py-20 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-4xl">
        <CommandPrompt command="tail -n 3 casos_exito.log" />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="p-6 border border-slate-800 bg-[#0f1016] rounded font-mono">
            <div className="text-xs text-slate-500 mb-2">2024-10-12 09:42:15 [INFO]</div>
            <p className="text-slate-300 text-sm mb-4">
              "Migramos de Excel a Odoo con un embudo claro y ahora sabemos cuántas oportunidades hay en cada etapa."
            </p>
            <div className="text-green-500 text-sm font-bold">-- Empresa Industrial</div>
          </div>

          <div className="p-6 border border-slate-800 bg-[#0f1016] rounded font-mono">
            <div className="text-xs text-slate-500 mb-2">2024-11-05 14:20:01 [INFO]</div>
            <p className="text-slate-300 text-sm mb-4">
              "Estandarizamos el trabajo de los vendedores y ahora todos siguen el mismo proceso en Odoo."
            </p>
            <div className="text-green-500 text-sm font-bold">-- Distribuidora Nacional</div>
          </div>
        </div>
      </div>
    </section>
  )
}
