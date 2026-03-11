"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle2, Zap, Shield, Server, Globe, BarChart3, Gift, Clock, ShoppingCart, Cpu, Tag, Timer, Lock } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"
import Image from "next/image"

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: false })
  useEffect(() => {
    const tick = () => {
      const now = new Date().getTime()
      const diff = targetDate.getTime() - now
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }); return }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
        expired: false,
      })
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [targetDate])
  return timeLeft
}

export default function CssalesClient() {
  const deadline = new Date('2026-03-15T23:59:59-06:00')
  const countdown = useCountdown(deadline)

  useEffect(() => { window.scrollTo(0, 0) }, [])

  const fmt = (n: number) => `$${n.toLocaleString('es-MX')}`

  return (
    <main className="min-h-screen bg-[#0c0c0c]">
      <Navbar />

      {/* ═══ HERO ═══ */}
      <section className="relative pt-10 pb-20 md:pt-16 overflow-hidden">
        <div className="container px-4 mx-auto max-w-6xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
              <div className="font-mono space-y-8">
                <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                  <span className="text-green-500 font-bold">netlab@cssales:~$</span>
                  <span className="text-slate-100">generar-propuesta</span>
                  <span className="text-purple-400">--odoo</span>
                  <span className="text-blue-400">--ecommerce</span>
                  <span className="text-orange-400">--oferta-exclusiva</span>
                  <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                  <div className="flex items-center gap-4 mb-6">
                    <Image src="/logo-netlab.png" alt="Netlab Logo" width={120} height={40} className="h-10 w-auto" />
                    <span className="text-2xl text-slate-500">×</span>
                    <div className="text-2xl font-bold text-orange-400 tracking-wider">CSSALES</div>
                  </div>

                  <motion.h1
                    className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  >
                    Transformación digital <span className="text-orange-400">completa</span> para tu negocio
                  </motion.h1>

                  <motion.p
                    className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
                  >
                    ERP + CRM con Odoo · Sitio web optimizado para IT · Sitio web para juguetes.
                    Todo integrado, asesorado y listo para vender online.
                  </motion.p>

                  {/* COUNTDOWN */}
                  <motion.div
                    className="pt-6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
                  >
                    {!countdown.expired ? (
                      <div className="inline-block">
                        <div className="flex items-center gap-2 mb-3">
                          <Timer className="w-4 h-4 text-red-400" />
                          <span className="font-mono text-sm text-red-400 font-bold uppercase tracking-wider">Oferta válida hasta el 15 de marzo</span>
                        </div>
                        <div className="flex gap-3">
                          {[
                            { val: countdown.days, label: 'Días' },
                            { val: countdown.hours, label: 'Hrs' },
                            { val: countdown.minutes, label: 'Min' },
                            { val: countdown.seconds, label: 'Seg' },
                          ].map(({ val, label }) => (
                            <div key={label} className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-center min-w-[70px]">
                              <div className="text-2xl md:text-3xl font-bold font-mono text-red-400">{String(val).padStart(2, '0')}</div>
                              <div className="text-[10px] font-mono text-red-400/60 uppercase tracking-wider">{label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded font-mono text-red-400">
                        ⚠ Esta oferta ha expirado. Contáctanos para nuevas opciones.
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    className="mt-8 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8 }}
                  >
                    <p>{">"} Analizando necesidades de CSsales... [OK]</p>
                    <p>{">"} Configurando Odoo ERP + CRM... [OK]</p>
                    <p>{">"} Generando sitios web con Next.js... [OK]</p>
                    <p>{">"} Preparando oferta exclusiva... [<span className="text-green-400">READY</span>]</p>
                  </motion.div>
                </div>
              </div>
            </TerminalFrame>
          </motion.div>
        </div>

        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
      </section>

      {/* ═══ CONTEXTO CSSALES ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat cssales-perfil.txt</span>
              </div>

              <div className="space-y-6 text-slate-300 leading-relaxed">
                <p className="text-xl font-semibold text-white">
                  CSsales es una empresa con dos verticales de negocio en México
                </p>

                <div className="grid md:grid-cols-2 gap-8 mt-8">
                  <div className="p-6 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Cpu className="w-8 h-8 text-blue-400" />
                      <h3 className="font-semibold text-blue-400 text-lg">Vertical IT</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Venta de hardware de TI: servidores, equipo de cómputo, networking, 
                      almacenamiento y soluciones empresariales para el mercado mexicano.
                    </p>
                  </div>

                  <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <Gift className="w-8 h-8 text-orange-400" />
                      <h3 className="font-semibold text-orange-400 text-lg">Vertical Juguetes</h3>
                    </div>
                    <p className="text-sm text-slate-400">
                      Comercialización de juguetes y peluches, con un catálogo diverso 
                      enfocado en la distribución y venta directa al público.
                    </p>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-orange-500 rounded">
                  <p className="text-slate-300">
                    <span className="text-orange-400 font-semibold">El reto:</span> Administrar dos líneas de negocio 
                    completamente distintas desde un solo sistema, con presencia digital optimizada para ambas, 
                    listas para vender y crecer con campañas de marketing digital.
                  </p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ SOLUCIÓN COMPLETA — 3 Pilares ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">La Solución Completa</h2>
            <p className="text-slate-400 text-lg">Tres pilares tecnológicos, una sola estrategia integrada</p>
          </div>

          <div className="space-y-8">
            {/* Pilar 1: Odoo */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-400/10 border-2 border-purple-400 flex items-center justify-center text-purple-400 font-bold text-xl">1</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Odoo ERP + CRM</h3>
                    <p className="text-purple-400 font-mono text-sm">Sistema central de administración</p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Un ERP <span className="text-purple-400 font-semibold">potente y profesional</span> que centraliza toda tu operación: 
                  inventarios, facturación, contabilidad, compras y ventas. Incluye un <span className="text-green-400 font-semibold">CRM totalmente gratis</span> con 
                  funcionalidades comerciales adaptadas específicamente a tu negocio.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-purple-400 font-semibold mb-3">Módulos incluidos:</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {['Gestión de inventarios multi-almacén', 'Facturación electrónica (CFDI 4.0)', 'Control de compras y proveedores', 'Contabilidad integrada', 'CRM con pipeline personalizado (GRATIS)', 'Punto de venta (POS)', 'Reportes y dashboards ejecutivos'].map(item => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-purple-500/5 border border-purple-500/20 rounded">
                    <Shield className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="text-purple-400 font-semibold mb-2">¿Por qué Odoo?</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Sistema ERP #1 en el mundo open source. Usado por +12 millones de usuarios. 
                      Modular, escalable y adaptable a cualquier industria. Tu inversión crece contigo.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Pilar 2: Sitio IT */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-400/10 border-2 border-blue-400 flex items-center justify-center text-blue-400 font-bold text-xl">2</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Sitio Web — CSsales IT</h3>
                    <p className="text-blue-400 font-mono text-sm">E-commerce de hardware de TI</p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Un sitio web <span className="text-blue-400 font-semibold">de alto rendimiento</span> construido con Next.js y desplegado en Vercel, 
                  conectado directamente a tu catálogo de Odoo vía API. Tus productos siempre sincronizados, sin doble captura.
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: Globe, title: 'Next.js + Vercel', desc: 'Velocidad extrema, SEO nativo, SSR/SSG', color: 'blue' },
                    { icon: BarChart3, title: 'Analytics + GTM', desc: 'Google Analytics 4 y Tag Manager preconfigurados', color: 'blue' },
                    { icon: Server, title: 'API de Odoo', desc: 'Productos sincronizados en tiempo real', color: 'blue' },
                  ].map(item => (
                    <div key={item.title} className="p-4 bg-blue-500/5 border border-blue-500/20 rounded">
                      <item.icon className="w-6 h-6 text-blue-400 mb-2" />
                      <h4 className="text-blue-400 font-semibold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  ))}
                </div>

                <div>
                  <h4 className="text-blue-400 font-semibold mb-3">Stack tecnológico:</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Next.js 14+', 'React Server Components', 'Vercel Edge', 'Google Analytics 4', 'Google Tag Manager', 'API REST Odoo', 'SEO Optimizado', 'Responsive Design', 'SSL/HTTPS', 'CDN Global'].map(tag => (
                      <span key={tag} className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-xs font-mono text-blue-400">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </TerminalFrame>

            {/* Pilar 3: Sitio Juguetes */}
            <TerminalFrame>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-400/10 border-2 border-orange-400 flex items-center justify-center text-orange-400 font-bold text-xl">3</div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Sitio Web — Juguetes & Peluches</h3>
                    <p className="text-orange-400 font-mono text-sm">E-commerce lúdico y atractivo</p>
                  </div>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  El mismo poder tecnológico aplicado a tu vertical de juguetes. 
                  Un sitio con identidad propia, <span className="text-orange-400 font-semibold">diseñado para cautivar</span> y convertir,
                  conectado al mismo Odoo para administrar todo desde un solo lugar.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-orange-400 font-semibold mb-3">Mismas especificaciones premium:</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      {[
                        'Misma arquitectura Next.js + Vercel',
                        'Google Analytics 4 + Tag Manager',
                        'Catálogo conectado a Odoo vía API',
                        'Diseño visual adaptado a juguetes',
                        'Listo para campañas de Meta Ads y Google Ads',
                        'Optimizado para conversión móvil',
                      ].map(item => (
                        <li key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-6 bg-orange-500/5 border border-orange-500/20 rounded">
                    <Gift className="w-8 h-8 text-orange-400 mb-3" />
                    <h4 className="text-orange-400 font-semibold mb-2">Un Odoo, dos sitios</h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Administras ambos catálogos desde el mismo Odoo. Un producto lo cargas una vez 
                      y aparece en el sitio correspondiente. Cero duplicidad, máxima eficiencia.
                    </p>
                  </div>
                </div>
              </div>
            </TerminalFrame>
          </div>
        </div>
      </section>

      {/* ═══ TODO LO QUE INCLUYE ═══ */}
      <section className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <TerminalFrame>
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                <span className="text-lg">$</span>
                <span className="text-lg">cat aditamentos-tecnicos.txt</span>
              </div>

              <h2 className="text-3xl font-bold text-white">Todo lo que incluye tu proyecto</h2>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: Server, title: 'Infraestructura', items: ['Hosting en Vercel (edge global)', 'Dominio configurado con SSL', 'CDN automático worldwide', 'Uptime 99.99%', 'Deploy automático con Git'], color: 'green' },
                  { icon: BarChart3, title: 'Marketing Digital', items: ['Google Analytics 4 integrado', 'Google Tag Manager configurado', 'Pixels listos para Meta Ads', 'SEO técnico optimizado', 'Sitemap y robots.txt'], color: 'blue' },
                  { icon: Shield, title: 'Soporte & Capacitación', items: ['Capacitación completa del sistema', 'Asesoría en la implementación', 'Soporte técnico post-lanzamiento', 'Documentación de uso', 'Acompañamiento operativo'], color: 'purple' },
                ].map(section => (
                  <div key={section.title} className="p-6 bg-slate-900/50 border border-slate-800 rounded-lg">
                    <section.icon className={`w-8 h-8 text-${section.color}-400 mb-4`} />
                    <h3 className={`font-semibold text-${section.color}-400 text-lg mb-4`}>{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map(item => (
                        <li key={item} className="flex items-start gap-2 text-sm text-slate-400">
                          <CheckCircle2 className={`w-4 h-4 text-${section.color}-400 mt-0.5 flex-shrink-0`} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-green-500/5 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-6 h-6 text-green-400" />
                  <h4 className="text-green-400 font-semibold text-lg">100% asesorado y capacitado por Netlab</h4>
                </div>
                <p className="text-slate-400 leading-relaxed">
                  No te entregamos un sistema y te dejamos solo. Cada módulo es implementado, configurado y asesorado por nuestro equipo.
                  Te capacitamos para que tu equipo domine las herramientas desde el día uno. Somos tu socio tecnológico, no solo un proveedor.
                </p>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      {/* ═══ INVERSIÓN — Precios con descuento ═══ */}
      <section id="inversion" className="py-20 border-t border-slate-800">
        <div className="container px-4 mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Inversión del Proyecto</h2>
            <p className="text-slate-400 text-lg">Precio especial exclusivo para CSsales</p>
          </div>

          {/* Precio regular vs oferta */}
          <TerminalFrame className="border-red-500/30 mb-8">
            <div className="text-center py-6 space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Tag className="w-5 h-5 text-red-400" />
                <span className="font-mono text-sm text-red-400 font-bold uppercase tracking-wider">Precio regular de Netlab</span>
              </div>
              
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-mono">Odoo ERP + CRM</div>
                  <div className="text-2xl font-bold text-slate-500 line-through">{fmt(100000)}</div>
                </div>
                <span className="text-slate-600 text-2xl">+</span>
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-mono">Sitio Web IT</div>
                  <div className="text-2xl font-bold text-slate-500 line-through">{fmt(50000)}</div>
                </div>
                <span className="text-slate-600 text-2xl">+</span>
                <div className="text-center">
                  <div className="text-sm text-slate-500 font-mono">Sitio Web Juguetes</div>
                  <div className="text-2xl font-bold text-slate-500 line-through">{fmt(50000)}</div>
                </div>
                <span className="text-slate-600 text-2xl">=</span>
                <div className="text-center">
                  <div className="text-sm text-red-400 font-mono">Total regular</div>
                  <div className="text-3xl font-bold text-red-400 line-through">{fmt(200000)}</div>
                </div>
              </div>
            </div>
          </TerminalFrame>

          {/* Oferta especial */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Odoo */}
            <TerminalFrame className="border-purple-500/30">
              <div className="text-center space-y-4 py-4">
                <Server className="w-10 h-10 text-purple-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Odoo ERP + CRM</h3>
                <p className="text-sm text-slate-400">Sistema central de administración con CRM incluido</p>
                <div className="py-4">
                  <div className="text-sm text-slate-500 line-through">{fmt(100000)}</div>
                  <div className="text-4xl font-bold text-purple-400">{fmt(20000)}</div>
                  <div className="text-xs text-slate-500 mt-1">Precio neto con IVA incluido</div>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>✓ Implementación completa</p>
                  <p>✓ CRM personalizado <span className="text-green-400 font-bold">GRATIS</span></p>
                  <p>✓ Capacitación incluida</p>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 bg-purple-500/10 border border-purple-500/30 rounded-full text-xs font-mono text-purple-400 font-bold">80% de descuento</span>
                </div>
              </div>
            </TerminalFrame>

            {/* Sitio IT */}
            <TerminalFrame className="border-blue-500/30">
              <div className="text-center space-y-4 py-4">
                <Globe className="w-10 h-10 text-blue-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Sitio Web IT</h3>
                <p className="text-sm text-slate-400">E-commerce de hardware conectado a Odoo</p>
                <div className="py-4">
                  <div className="text-sm text-slate-500 line-through">{fmt(50000)}</div>
                  <div className="text-4xl font-bold text-blue-400">{fmt(20000)}</div>
                  <div className="text-xs text-slate-500 mt-1">Precio neto con IVA incluido</div>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>✓ Next.js + Vercel</p>
                  <p>✓ GA4 + Tag Manager</p>
                  <p>✓ SEO optimizado</p>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs font-mono text-blue-400 font-bold">60% de descuento</span>
                </div>
              </div>
            </TerminalFrame>

            {/* Sitio Juguetes — PROMO */}
            <TerminalFrame className="border-orange-500/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-orange-500 text-black text-[10px] font-mono font-bold px-3 py-1 rounded-bl-lg">
                🎁 PROMO
              </div>
              <div className="text-center space-y-4 py-4">
                <Gift className="w-10 h-10 text-orange-400 mx-auto" />
                <h3 className="text-xl font-bold text-white">Sitio Web Juguetes</h3>
                <p className="text-sm text-slate-400">E-commerce de juguetes y peluches</p>
                <div className="py-4">
                  <div className="text-sm text-slate-500 line-through">{fmt(50000)}</div>
                  <div className="text-4xl font-bold text-orange-400">{fmt(13800)}</div>
                  <div className="text-xs text-slate-500 mt-1">Precio neto con IVA incluido</div>
                </div>
                <div className="space-y-1 text-xs text-slate-400">
                  <p>✓ Misma tecnología premium</p>
                  <p>✓ Diseño adaptado a juguetes</p>
                  <p>✓ Listo para campañas</p>
                </div>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full text-xs font-mono text-orange-400 font-bold">72% de descuento</span>
                </div>
              </div>
            </TerminalFrame>
          </div>

          {/* Total + CTA combined */}
          <TerminalFrame className="border-green-500/30 mt-8">
            <div className="text-center py-8 space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-green-400" />
                <span className="font-mono text-lg text-green-400 font-bold">INVERSIÓN TOTAL DEL PROYECTO</span>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <div className="text-3xl font-bold text-slate-500 line-through">{fmt(200000)}</div>
                <ArrowRight className="w-6 h-6 text-green-400" />
                <div className="text-5xl md:text-6xl font-bold text-green-400">{fmt(53800)}</div>
              </div>
              
              <p className="text-sm text-slate-400">Precio neto · IVA incluido · Todo el proyecto completo</p>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="inline-block px-6 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-lg font-mono text-green-400 font-bold">
                  Ahorras {fmt(146200)} MXN
                </span>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-800 my-8 pt-8">
                <div className="flex items-center justify-center gap-3 text-green-500 font-mono mb-6">
                  <span className="text-lg">root@netlab:~/cssales#</span>
                  <span className="text-lg">asegurar-oferta</span>
                  <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                </div>

                <Lock className="w-12 h-12 text-green-400 mx-auto mb-4" />

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Asegura esta oferta con solo <span className="text-green-400">{fmt(5000)}</span>
                </h2>

                <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-6">
                  Con un depósito de <span className="text-green-400 font-bold">{fmt(5000)} MXN</span> congelas el precio de la oferta durante un mes completo.
                  El resto se acuerda en un plan de pagos conforme avanza la implementación.
                </p>

                <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-6">
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg text-center">
                    <Lock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-400 font-semibold">Precio congelado</p>
                    <p className="text-xs text-slate-500">30 días garantizados</p>
                  </div>
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg text-center">
                    <Shield className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-400 font-semibold">Sin compromiso</p>
                    <p className="text-xs text-slate-500">Flexible y sin presión</p>
                  </div>
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg text-center">
                    <Clock className="w-6 h-6 text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-green-400 font-semibold">Inicio inmediato</p>
                    <p className="text-xs text-slate-500">Arrancamos al confirmar</p>
                  </div>
                </div>

                {/* Countdown reminder */}
                {!countdown.expired && (
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg inline-block mb-6">
                    <div className="flex items-center gap-3">
                      <Timer className="w-5 h-5 text-red-400" />
                      <span className="font-mono text-sm text-red-400">
                        Quedan <span className="font-bold">{countdown.days}d {countdown.hours}h {countdown.minutes}m</span> para aprovechar esta oferta
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-2 space-y-4">
                  <a
                    href="https://wa.me/526671944763?text=Hola%2C%20me%20interesa%20la%20propuesta%20de%20CSsales%20×%20Netlab.%20Quiero%20asegurar%20la%20oferta."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative inline-flex items-center justify-center px-10 py-4 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm text-lg"
                  >
                    <span className="mr-2">Asegurar oferta por {fmt(5000)}</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </a>

                  <p className="text-sm text-slate-500 font-mono">O escríbenos: contacto@netlab.mx</p>
                </div>
              </div>
            </div>
          </TerminalFrame>
        </div>
      </section>

      <Footer />
    </main>
  )
}
