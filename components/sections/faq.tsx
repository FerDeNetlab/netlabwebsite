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
                ¿Qué es Odoo Community Edition?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Odoo Community Edition es la versión gratuita y de código abierto del ERP Odoo. Incluye módulos de
                ventas, CRM, inventarios, punto de venta y facturación electrónica. A diferencia de Odoo Enterprise,
                no tiene costo de licencia anual — lo que representa un ahorro de más de <span className="text-green-400">$420,000 MXN en 5 años</span> para 10 usuarios.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Cuánto cuesta implementar Odoo Community en México?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                La implementación parte desde <span className="text-green-400">$40,000 MXN</span> para 10 usuarios (plan Starter).
                El plan Growth para 25 usuarios cuesta $90,000 MXN. Incluye instalación, configuración, migración de
                datos, capacitación del equipo y soporte post-lanzamiento. La licencia de Odoo Community es $0.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Cuál es la diferencia entre Odoo Community y Enterprise?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Odoo Community Edition es <span className="text-green-400">gratuito y de código abierto</span>. Odoo Enterprise
                cuesta ~$7,000 MXN por usuario al año — para 10 usuarios en 5 años son más de $420,000 MXN solo en
                licencias. Community incluye todas las funciones esenciales para PyMEs: ventas, CRM, inventarios, POS,
                facturación CFDI y contabilidad.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Cuánto tiempo tarda una implementación?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Una implementación básica (ventas, inventarios, facturación) tarda entre <span className="text-green-400">4 y 8 semanas</span>.
                Incluye análisis de procesos, configuración, migración de datos y capacitación. Implementaciones con
                manufactura o integraciones externas pueden tomar hasta 3 meses.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Dan capacitación a mi equipo?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Sí. Toda implementación incluye capacitación para usuarios y administradores. Enseñamos a tu equipo a
                usar Odoo en sus procesos diarios: cotizaciones, pedidos, inventario, facturación. Entregamos manuales
                personalizados adaptados a tu empresa.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿El sistema funciona en la nube o en mis servidores?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Ambas opciones. Odoo Community en la nube parte desde <span className="text-green-400">$500 MXN/mes</span> con
                acceso desde cualquier dispositivo. También instalamos en servidores locales si tienes infraestructura
                propia. Para PyMEs recomendamos la nube por menor costo y mantenimiento.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-7" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Qué industrias atienden?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Implementamos Odoo Community en Retail, Manufactura, Alimentos y Bebidas, Farmacéutica, Logística,
                Construcción, Automotriz y Servicios. Cada implementación se adapta a los procesos y regulaciones
                de la industria.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-8" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Tienen soporte después de la implementación?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Sí. El plan Starter incluye 30 días de soporte post-lanzamiento; Growth incluye 60 días. Después
                ofrecemos planes de mantenimiento mensual con soporte técnico, actualizaciones de módulos y consultoría
                continua.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-9" className="border border-slate-800 px-4 bg-[#111] rounded">
              <AccordionTrigger className="text-slate-200 hover:text-green-400 hover:no-underline">
                ¿Dónde están ubicados? ¿Atienden fuera de Guadalajara?
              </AccordionTrigger>
              <AccordionContent className="text-slate-400 border-t border-slate-800 pt-4">
                Nuestra oficina principal está en <span className="text-green-400">Guadalajara, Jalisco</span>. Atendemos
                empresas en toda la República: CDMX, Monterrey, Querétaro, Puebla, León, Tijuana, Mérida y más.
                Las implementaciones se hacen de forma remota o presencial según el proyecto.
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
