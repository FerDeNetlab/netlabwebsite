"use client"
import { motion } from "framer-motion"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/sections/footer"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import {
  Rocket,
  Target,
  Users,
  TrendingUp,
  Microscope,
  Award,
  Globe,
  Zap,
  BarChart3,
  ShieldCheck,
  ExternalLink,
  Cpu,
  ChevronRight,
  Terminal,
  Search
} from "lucide-react"

export default function EdgarCV() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  }

  return (
    <main className="min-h-screen bg-[#0c0c0c] text-slate-300 font-mono selection:bg-[#22c55e] selection:text-black">
      <Navbar />

      {/* Grid Background */}
      <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame borderColor="purple" title="edgar@netlab:~/cv">
            <div className="space-y-12">
              {/* Header Info */}
              <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Photo Placeholder */}
                <div className="relative shrink-0">
                  <div className="w-48 h-64 md:w-56 md:h-72 border-2 border-slate-800 bg-[#050505] rounded-sm overflow-hidden flex flex-col items-center justify-center group">
                    <div className="absolute top-2 left-2 flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500/50" />
                      <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                      <div className="w-2 h-2 rounded-full bg-green-500/50" />
                    </div>
                    <Users size={40} className="text-slate-700 mb-2 group-hover:text-purple-400 transition-colors" />
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest">[ USER_IMAGE_STUB ]</span>
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-purple-500/30 group-hover:bg-purple-500 transition-colors" />
                  </div>
                  <div className="mt-4 flex flex-col items-center md:items-start gap-2">
                    <span className="text-xs text-green-500 font-bold bg-green-500/10 px-2 py-0.5 border border-green-500/20">LOC: MÉXICO</span>
                    <span className="text-[10px] text-slate-500 uppercase">STATUS: SYSTEM_ACTIVE</span>
                  </div>
                </div>

                {/* Text Info */}
                <div className="flex-1 space-y-6">
                  <div className="space-y-2 text-center md:text-left">
                    <div className="flex items-center gap-2 text-sm text-green-500 mb-1 justify-center md:justify-start">
                      <Terminal size={14} /> <span>root@cv_manager:~# whoami</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tighter leading-none">
                      EDGAR <span className="text-purple-400">CERVANTES</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-400 font-medium">
                      Estratega en Marketing, Ventas y Posicionamiento de Marca
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#111111] border border-slate-800 p-3 rounded-sm">
                      <div className="text-[10px] text-purple-400 uppercase mb-1 flex items-center gap-2">
                        <Cpu size={12} /> Specialization
                      </div>
                      <div className="text-sm text-slate-300">Ingeniero Mecatrónico</div>
                    </div>
                    <div className="bg-[#111111] border border-slate-800 p-3 rounded-sm">
                      <div className="text-[10px] text-green-400 uppercase mb-1 flex items-center gap-2">
                        <Zap size={12} /> Focus
                      </div>
                      <div className="text-sm text-slate-300">Automatización y Crecimiento</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 justify-center md:justify-start">
                    {["Google Ads", "Consultoría", "Lanzamientos", "Capacitación"].map((tag) => (
                      <span key={tag} className="text-[10px] bg-slate-900 border border-slate-800 px-2 py-1 text-slate-500 rounded-sm">
                        {tag}.module
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Professional Profile */}
              <section className="space-y-4 border-l-2 border-slate-800 pl-6 py-2 ml-1">
                <div className="flex items-center gap-3 text-sm text-purple-400 font-bold mb-4 uppercase">
                  <ChevronRight size={16} /> Perfil Profesional
                </div>
                <div className="space-y-4 text-slate-400 leading-relaxed text-sm md:text-base max-w-3xl">
                  <p>
                    <span className="text-white">// EXEC_SUMMARY</span>: Ingeniero Mecatrónico con especialidad en automatización y robótica, con más de <span className="text-green-500">13 años de experiencia</span> en marketing, ventas y posicionamiento de marca.
                  </p>
                  <p>
                    Especialista en planeación estratégica y capacitación de equipos comerciales. Experiencia comprobada en reestructuración de empresas y crecimiento sostenido en ventas sin necesidad de incrementar personal.
                  </p>
                  <p className="text-xs text-slate-500 italic">
                    {">"} Industries: Inmobiliario, Consumo, Entretenimiento, Alimentos, Medios Digitales y Retail.
                  </p>
                </div>
              </section>

              {/* Areas of Expertise */}
              <section className="space-y-6">
                <div className="flex items-center gap-3 text-sm text-green-500 font-bold uppercase">
                  <Target size={16} /> Áreas de Especialidad
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    "Google Ads & High Performance",
                    "Planeación y Ejecución Comercial",
                    "Automatización de Ventas",
                    "Capacitación de Equipos",
                    "Crecimiento Orgánico/Pagado",
                    "Lanzamiento de Marcas",
                  ].map((skill, i) => (
                    <div key={i} className="bg-[#0a0a0a] border border-slate-800 p-4 rounded-sm hover:border-green-500/50 transition-colors flex items-center gap-3 group">
                      <div className="w-1.5 h-1.5 bg-green-500 group-hover:animate-pulse" />
                      <span className="text-xs text-slate-300 font-bold">{skill}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Success Cases */}
              <section className="space-y-8 pt-8">
                <div className="flex items-center gap-3 text-sm text-purple-400 font-bold uppercase">
                  <TrendingUp size={16} /> Casos de Éxito / Performance
                </div>

                <div className="space-y-6">
                  {/* Grid of cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SuccessCard
                      title="DIRC Inmobiliaria"
                      metrics="32 -> 338 unidades/año"
                      description="Crecimiento exponencial en 3 años mediante automatización y reestructuración sin aumento de personal."
                      status="SUCCESS"
                    />
                    <SuccessCard
                      title="MM Inmobiliaria"
                      metrics="100+ Ventas / 10 meses"
                      description="Lanzamiento desde cero: identidad, capacitación y estrategia comercial integral."
                      status="DONE"
                    />
                    <SuccessCard
                      title="Grupo Clasificado"
                      metrics="30K -> 23M visitas/mes"
                      description="Estrategia de posicionamiento orgánico masivo y difusión de marca en 3 años."
                      status="COMPLETED"
                    />
                    <SuccessCard
                      title="ECAPRO"
                      metrics="Sales > Walmart/Liverpool"
                      description="Laboratorio estratégico propio superando a grandes retail con la marca MSI."
                      status="ACTIVE"
                    />
                  </div>

                  {/* Horizontal small items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-white font-bold block">Tijera Dorada</span>
                        <span className="text-slate-500 mt-1 block tracking-tight text-[10px]">RESCATE_SISTEMA: RECUPERACIÓN TOTAL</span>
                      </div>
                      <ShieldCheck size={18} className="text-green-500" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-sm flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-white font-bold block">Home Roll Sushi</span>
                        <span className="text-slate-500 mt-1 block tracking-tight text-[10px]">ROI_FAST: RECUPERACIÓN PRIMER MES</span>
                      </div>
                      <Zap size={18} className="text-purple-400" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Artists / Google Ads */}
              <section className="bg-slate-900/40 border border-slate-800 p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-xs text-slate-500 font-bold uppercase">
                  <Search size={14} /> Gestión de Campañas Google Ads
                </div>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-300">
                  {["Grupo Firme", "Larry Hernández", "Tony Aguirre", "Edgardo Núñez", "Octavio Cuadras"].map((artist) => (
                    <div key={artist} className="flex items-center gap-2">
                      <span className="text-purple-500 opacity-50">#</span> {artist}
                    </div>
                  ))}
                </div>
              </section>

              {/* Conferences & Relations */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="text-xs text-purple-400 font-bold uppercase flex items-center gap-2">
                    <Award size={14} /> Participación Pública
                  </div>
                  <div className="bg-slate-900/20 border-l-2 border-purple-500 p-4">
                    <h4 className="text-white text-sm font-bold mb-1 italic">Hotel Camino Real, CDMX</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">
                      Conferencista para empresarios compartiendo herramientas estratégicas.
                    </p>
                    <div className="text-[10px] text-slate-500">
                      Panelistas: Kavak, Alejando Kasuga (Kaizen), A. Saracho.
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-xs text-green-400 font-bold uppercase flex items-center gap-2">
                    <Globe size={14} /> Conexiones Globales
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {["TikTok", "YouTube", "Spotify"].map((plat) => (
                      <div key={plat} className="flex items-center justify-between p-2 border border-slate-800 bg-[#050505] rounded-sm text-xs">
                        <span className="text-slate-300">{plat}.api</span>
                        <span className="text-green-500/50 font-bold">CONNECTED</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Final Status */}
              <div className="pt-12 border-t border-slate-800 text-center">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-block text-[10px] text-purple-400 mb-8 border border-purple-500/20 px-3 py-1 bg-purple-500/5"
                >
                  SYSTEM_CALL: AGENDAR_CONSULTORÍA_ESTRATÉGICA
                </motion.div>

                <div className="flex flex-col items-center gap-6">
                  <a
                    href="mailto:contacto@netlab.mx"
                    className="group relative inline-flex items-center justify-center px-12 py-4 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 rounded-sm w-full md:w-auto"
                  >
                    <span className="mr-2 uppercase">Iniciar Proceso Comercial</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </a>
                  <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em]">Netlab Consulting // Edgar Cervantes Profile // Ver 1.0.42</p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

function SuccessCard({ title, metrics, description, status }: { title: string, metrics: string, description: string, status: string }) {
  return (
    <div className="border border-slate-800 bg-[#050505] p-5 rounded-sm relative group overflow-hidden">
      <div className="absolute top-2 right-2 flex items-center gap-2">
        <span className="text-[8px] text-slate-600">STATE:</span>
        <span className="text-[8px] text-green-500 font-black tracking-widest">{status}</span>
      </div>
      <div className="text-[10px] text-purple-400 font-bold mb-2 uppercase">{metrics}</div>
      <h3 className="text-white text-lg font-bold mb-3 tracking-tighter">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed font-mono">
        {description}
      </p>
      <div className="mt-4 h-0.5 w-full bg-slate-900">
        <div className="h-full bg-purple-500 w-1/3 group-hover:w-full transition-all duration-700" />
      </div>
    </div>
  )
}
