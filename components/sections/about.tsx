import { CommandPrompt } from "../ui/command-prompt"

export function AboutSection() {
  return (
    <section className="py-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-4xl">
        <CommandPrompt
          command="describir-netlab"
          output={
            <div className="mt-6 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white">
                Somos consultores de negocio, no solo implementadores de software.
              </h2>
              <p className="text-lg text-slate-400 leading-relaxed font-mono">
                En Netlab conectamos tu plan comercial con Odoo. Primero definimos tu embudo de ventas, métricas y
                responsabilidades del equipo; después configuramos Odoo para que todo ese plan viva en un solo sistema.
              </p>
            </div>
          }
        />
      </div>
    </section>
  )
}
