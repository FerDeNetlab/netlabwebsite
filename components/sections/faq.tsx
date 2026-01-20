import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CommandPrompt } from "../ui/command-prompt"

export function FaqSection() {
  return (
    <section id="faq" className="py-20 bg-[#0c0c0c]">
      <div className="container mx-auto px-4 max-w-3xl">
        <CommandPrompt command="help" />
        <h2 className="text-3xl md:text-4xl font-bold text-white mt-6 mb-8">Preguntas frecuentes</h2>

        <div className="mt-8">
          <Accordion type="single" collapsible className="w-full font-mono space-y-2">
            <AccordionItem value="item-1" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Qué ERP para negocios recomiendan?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Recomendamos Odoo como ERP para PyMEs porque es completo, flexible y escalable. Incluye sistema de
                ventas, CRM, control de inventarios, punto de venta, facturación y más módulos en un solo sistema para
                negocio.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Cuánto cuesta implementar Odoo?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                El costo de implementación Odoo varía según módulos y personalización. Para PyMEs, una implementación
                básica (ventas, inventarios, facturación) va desde $50,000 MXN. Agenda un diagnóstico gratuito para una
                cotización exacta.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Dan capacitación a mi equipo?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Absolutamente. La consultoría de negocios incluye entrenamiento a usuarios y administradores. Parte
                fundamental de la implementación Odoo es que tu equipo adopte el sistema en el día a día.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Tienen oficinas en Guadalajara y otras ciudades?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Nuestra oficina principal está en Guadalajara, pero atendemos empresas en toda la República Mexicana
                incluyendo Ciudad de México, Monterrey, Querétaro, Puebla y más ciudades. Ofrecemos reuniones
                presenciales y remotas.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿El sistema funciona en la nube o local?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Ofrecemos ambas opciones: Odoo en la nube (acceso desde cualquier lugar) o instalación local (en tus
                servidores). Para PyMEs recomendamos la nube por seguridad, actualizaciones automáticas y menor costo de
                infraestructura.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Qué industrias atienden?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Tenemos experiencia en Retail, Manufactura, Farmacéutica, Alimentos y Bebidas, Logística, Construcción,
                Automotriz y más. Cada implementación se adapta a los procesos específicos de tu industria y
                cumplimiento regulatorio.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded">
          <p className="text-purple-400 font-mono text-sm italic">
            {">"} Si tienes otra pregunta, la resolvemos en la sesión de diagnóstico.
          </p>
        </div>
      </div>
    </section>
  )
}
