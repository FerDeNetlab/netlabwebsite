"use client"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
    ArrowRight,
    CheckCircle2,
    Target,
    Shield,
    Eye,
    Users,
    BarChart3,
    AlertTriangle,
    Lock,
    Unlock,
    Package,
    Store,
    TrendingUp,
    FileText,
    Zap,
    DollarSign,
    Percent,
    Clock,
    XCircle,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { TerminalFrame } from "@/components/ui/terminal-frame"
import { Footer } from "@/components/sections/footer"

// Componente de Calculadora de Rentabilidad
function ProfitabilityCalculator() {
    const [precio, setPrecio] = useState(350)
    const [margen, setMargen] = useState(40)

    // Constantes de Mercado Libre
    const COMISION_PREMIUM = 0.18 // 18%
    const ENVIO_PROMEDIO = 200 // MXN
    const FACTURACION_SUBSIDIO = 400000 // $400k MXN para subsidio envío
    const FULFILLMENT_PERCENT = 0.05 // 5%

    // Simulación de crecimiento de ventas en Mercado Libre (escenario optimista)
    const simularVentas = (mes: number): number => {
        // Meses 1-3: 4-20 unidades (cuenta nueva, sin reseñas)
        if (mes <= 3) return Math.floor(4 + (mes - 1) * 5) // 4, 9, 14
        // Meses 4-6: 20-50 unidades (primeras reseñas)
        if (mes <= 6) return Math.floor(20 + (mes - 3) * 10) // 20, 30, 40
        // Meses 7-12: 50-120 unidades (crecimiento moderado)
        if (mes <= 12) return Math.floor(50 + (mes - 6) * 12) // 50, 62, 74, 86, 98, 110
        // Meses 13-24: 120-250 unidades (cuenta establecida)
        if (mes <= 24) return Math.floor(120 + (mes - 12) * 11) // 120...252
        // Meses 25-48: 250-400 unidades (madurez)
        if (mes <= 48) return Math.floor(250 + (mes - 24) * 6) // 250...394
        // Meses 49-72: 400-500 unidades (estabilización)
        return Math.floor(400 + Math.min((mes - 48) * 4, 100)) // 400...500
    }

    // Función para calcular métricas por mes con facturación acumulada real
    const calcularMes = (mes: number, precioUnitario: number, margenBruto: number, facturacionPreviaAcumulada: number) => {
        const unidadesMes = simularVentas(mes)
        const facturacionMes = precioUnitario * unidadesMes
        const facturacionAcumulada = facturacionPreviaAcumulada + facturacionMes
        const tieneSubsidioEnvio = facturacionAcumulada >= FACTURACION_SUBSIDIO

        // ACOS disminuye con el tiempo (reputación y reseñas)
        let acos: number
        if (mes <= 3) acos = 0.55 // 55% primeros 3 meses
        else if (mes <= 6) acos = 0.45 // 45% meses 4-6
        else if (mes <= 12) acos = 0.30 // 30% meses 7-12
        else if (mes <= 18) acos = 0.20 // 20% meses 13-18
        else if (mes <= 36) acos = 0.15 // 15% meses 19-36
        else acos = 0.10 // 10% después de 3 años

        // Costo de envío (vendedor asume, con subsidio después de $400k)
        const costoEnvioPorUnidad = tieneSubsidioEnvio ? ENVIO_PROMEDIO * 0.5 : ENVIO_PROMEDIO

        // Cálculo de costos
        const ingresoBruto = facturacionMes
        const comision = ingresoBruto * COMISION_PREMIUM
        const publicidad = ingresoBruto * acos
        const envioTotal = costoEnvioPorUnidad * unidadesMes
        const fulfillment = ingresoBruto * FULFILLMENT_PERCENT
        const costoProducto = ingresoBruto * (1 - margenBruto / 100)

        const costoTotal = comision + publicidad + envioTotal + fulfillment + costoProducto
        const utilidad = ingresoBruto - costoTotal
        const margenNeto = ingresoBruto > 0 ? (utilidad / ingresoBruto) * 100 : 0

        const costoSobreVenta = ingresoBruto > 0 ? ((comision + publicidad + envioTotal + fulfillment) / ingresoBruto) * 100 : 0

        return {
            mes,
            unidades: unidadesMes,
            ingreso: ingresoBruto,
            comision,
            publicidad,
            envio: envioTotal,
            fulfillment,
            costoProducto,
            utilidad,
            margenNeto,
            acos: acos * 100,
            costoSobreVenta,
            facturacionAcumulada,
            tieneSubsidioEnvio,
        }
    }

    // Generar tabla de 72 meses (6 años) con puntos clave
    const mesesClave = [1, 2, 3, 6, 9, 12, 18, 24, 36, 48, 60, 72]

    // Calcular proyecciones secuencialmente para acumular facturación real
    const proyecciones: ReturnType<typeof calcularMes>[] = []
    let facturacionAcumulada = 0

    for (let i = 1; i <= 72; i++) {
        const resultado = calcularMes(i, precio, margen, facturacionAcumulada)
        facturacionAcumulada = resultado.facturacionAcumulada
        if (mesesClave.includes(i)) {
            proyecciones.push(resultado)
        }
    }

    // Calcular pérdidas acumuladas hasta break-even
    let perdidasAcumuladas = 0
    let mesBreakEven = 0
    let facAcum = 0
    for (let i = 1; i <= 72; i++) {
        const r = calcularMes(i, precio, margen, facAcum)
        facAcum = r.facturacionAcumulada
        if (r.utilidad < 0) {
            perdidasAcumuladas += r.utilidad
        }
        if (mesBreakEven === 0 && r.utilidad >= 0) {
            mesBreakEven = i
        }
    }

    const formatMoney = (n: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

    return (
        <TerminalFrame className="border-purple-500/30">
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-purple-400 font-mono mb-6">
                    <BarChart3 className="w-6 h-6" />
                    <span className="text-xl font-bold">Simulación de Rentabilidad: 6 Años en Mercado Libre</span>
                </div>

                <p className="text-slate-400 text-sm">
                    Esta simulación muestra cómo evoluciona una cuenta nueva en Mercado Libre, desde las primeras ventas hasta la madurez. El volumen de ventas aumenta conforme se acumulan reseñas y reputación.
                </p>

                {/* Disclaimer */}
                <div className="p-4 bg-yellow-500/10 border-l-4 border-yellow-500 rounded">
                    <p className="text-sm text-yellow-400 font-semibold mb-1">⚠️ Escenario Optimista - No Garantizado</p>
                    <p className="text-xs text-slate-400">
                        Esta simulación asume crecimiento constante, entregas a tiempo, y mejora gradual de reputación. En la realidad, muchas cuentas no logran este crecimiento, se estancan, o incluso decrecen por errores operativos, competencia, o cambios en el algoritmo de Mercado Libre.
                    </p>
                </div>

                {/* Inputs */}
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Precio por unidad (MXN)</label>
                        <input
                            type="number"
                            value={precio}
                            onChange={(e) => setPrecio(Number(e.target.value) || 0)}
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded text-white font-mono text-lg focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Margen bruto (%)</label>
                        <input
                            type="number"
                            value={margen}
                            onChange={(e) => setMargen(Number(e.target.value) || 0)}
                            className="w-full p-3 bg-slate-900 border border-slate-700 rounded text-white font-mono text-lg focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Modelo de crecimiento de ventas */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded mt-4">
                    <p className="text-xs text-slate-500 font-mono mb-2">
                        <span className="text-purple-400">Modelo de crecimiento simulado:</span>
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs text-slate-400">
                        <span>Mes 1-3: <span className="text-white">4-14 unidades</span></span>
                        <span>Mes 4-6: <span className="text-white">20-40 unidades</span></span>
                        <span>Mes 7-12: <span className="text-white">50-110 unidades</span></span>
                        <span>Mes 13-24: <span className="text-white">120-250 unidades</span></span>
                        <span>Mes 25-48: <span className="text-white">250-400 unidades</span></span>
                        <span>Mes 49-72: <span className="text-white">400-500 unidades</span></span>
                    </div>
                </div>

                {/* Parámetros de Meli */}
                <div className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                    <p className="text-xs text-slate-500 font-mono">
                        <span className="text-purple-400">Parámetros Mercado Libre:</span> Comisión Premium 18% | Envío $200 MXN (50% subsidio después de $400k) | Fulfillment ~5%
                    </p>
                </div>

                {/* Tabla de Proyección */}
                <div className="overflow-x-auto mt-6">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-700">
                                <th className="text-left py-3 px-2 text-slate-400 font-mono">Mes</th>
                                <th className="text-right py-3 px-2 text-slate-400 font-mono">Unidades</th>
                                <th className="text-right py-3 px-2 text-slate-400 font-mono">Ingreso</th>
                                <th className="text-right py-3 px-2 text-slate-400 font-mono">ACOS</th>
                                <th className="text-right py-3 px-2 text-slate-400 font-mono">Costo %</th>
                                <th className="text-right py-3 px-2 text-slate-400 font-mono">Utilidad</th>
                                <th className="text-right py-3 px-2 text-slate-400 font-mono">Margen</th>
                                <th className="text-center py-3 px-2 text-slate-400 font-mono">Subsidio</th>
                            </tr>
                        </thead>
                        <tbody>
                            {proyecciones.map((p) => (
                                <tr key={p.mes} className={`border-b border-slate-800 ${p.utilidad >= 0 ? '' : 'bg-red-500/5'}`}>
                                    <td className="py-3 px-2 text-white font-bold">
                                        {p.mes <= 12 ? `Mes ${p.mes}` : p.mes <= 24 ? `Año ${Math.ceil(p.mes / 12)} (${p.mes}m)` : `Año ${Math.ceil(p.mes / 12)}`}
                                    </td>
                                    <td className="py-3 px-2 text-right text-purple-400 font-semibold">{p.unidades}</td>
                                    <td className="py-3 px-2 text-right text-slate-300">{formatMoney(p.ingreso)}</td>
                                    <td className="py-3 px-2 text-right">
                                        <span className={p.acos > 30 ? 'text-red-400' : p.acos > 20 ? 'text-yellow-400' : 'text-green-400'}>
                                            {p.acos.toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className="py-3 px-2 text-right">
                                        <span className={p.costoSobreVenta > 50 ? 'text-red-400' : p.costoSobreVenta > 35 ? 'text-yellow-400' : 'text-green-400'}>
                                            {p.costoSobreVenta.toFixed(0)}%
                                        </span>
                                    </td>
                                    <td className={`py-3 px-2 text-right font-bold ${p.utilidad >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {formatMoney(p.utilidad)}
                                    </td>
                                    <td className={`py-3 px-2 text-right font-bold ${p.margenNeto >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                        {p.margenNeto.toFixed(1)}%
                                    </td>
                                    <td className="py-3 px-2 text-center">
                                        {p.tieneSubsidioEnvio ? (
                                            <span className="text-green-400 text-xs">✓</span>
                                        ) : (
                                            <span className="text-slate-500 text-xs">No</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Leyenda y notas */}
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded">
                        <p className="text-sm text-slate-300">
                            <span className="text-green-400 font-semibold">✓ Break-even estimado:</span> Mes {mesBreakEven > 0 ? mesBreakEven : 'N/A'} (cuando la utilidad mensual se vuelve positiva)
                        </p>
                    </div>
                    <div className="p-4 bg-purple-500/5 border border-purple-500/20 rounded">
                        <p className="text-sm text-slate-300">
                            <span className="text-purple-400 font-semibold">📊 Factores de mejora:</span> ACOS baja con reseñas. Envío se subsidia al superar $400k MXN facturados.
                        </p>
                    </div>
                </div>

                {/* Resumen */}
                <div className="p-6 bg-red-500/5 border-l-4 border-red-500 rounded mt-6">
                    <p className="text-lg text-white font-semibold mb-2">
                        Inversión estimada hasta rentabilidad:
                    </p>
                    <p className="text-slate-300">
                        Incluso en un <span className="text-yellow-400 font-bold">escenario optimista</span>, los primeros meses generan pérdidas acumuladas de aproximadamente{' '}
                        <span className="text-red-400 font-bold">
                            {formatMoney(perdidasAcumuladas)}
                        </span>{' '}
                        antes de alcanzar rentabilidad en el <span className="text-green-400 font-bold">mes {mesBreakEven}</span>.
                    </p>
                </div>

                {/* Segundo disclaimer */}
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                    <p className="text-xs text-slate-400">
                        <span className="text-red-400 font-semibold">Importante:</span> Esta proyección asume que TODO sale bien. En la práctica, problemas de inventario, devoluciones, suspensiones de cuenta, o simplemente falta de demanda pueden hacer que el break-even nunca llegue o se retrase significativamente. Muchas cuentas nuevas fracasan en los primeros 12 meses.
                    </p>
                </div>
            </div>
        </TerminalFrame>
    )
}


export default function MexarMeliClient() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <main className="min-h-screen bg-[#0c0c0c]">
            <Navbar />

            {/* Hero Section - SIN BRANDING NETLAB */}
            <section className="relative pt-10 pb-32 md:pt-16 overflow-hidden">
                <div className="container px-4 mx-auto max-w-6xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <TerminalFrame className="min-h-[500px] border-slate-800 bg-[#050505]">
                            <div className="font-mono space-y-8">
                                <div className="flex flex-wrap items-center gap-3 text-sm md:text-lg mb-8">
                                    <span className="text-green-500 font-bold">strategy@retail:~$</span>
                                    <span className="text-slate-100">analizar-modelo</span>
                                    <span className="text-purple-400">--concesion-digital</span>
                                    <span className="text-purple-400">--gobierno-marca</span>
                                    <span className="w-2.5 h-5 bg-green-500 animate-pulse inline-block align-middle ml-1" />
                                </div>

                                <div className="space-y-6 md:pl-6 border-l-2 border-slate-800 ml-1 md:ml-3 pl-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="text-3xl font-bold text-purple-400 tracking-wider">MEXAR PHARMA</div>
                                        <span className="text-2xl text-slate-500">/</span>
                                        <div className="text-2xl font-bold text-green-400 tracking-wider">Made4You</div>
                                    </div>

                                    <motion.h1
                                        className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                    >
                                        Modelo de <span className="text-purple-400">Concesión Digital Exclusiva</span> con{" "}
                                        <span className="text-green-400">Gobierno de Marca</span>
                                    </motion.h1>

                                    <motion.p
                                        className="text-lg md:text-xl text-slate-400 max-w-3xl leading-relaxed"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 1.5 }}
                                    >
                                        Análisis estratégico: por qué separar quién decide de quién ejecuta es la clave para escalar en retail digital sin perder el control del negocio.
                                    </motion.p>

                                    <motion.div
                                        className="pt-8 flex gap-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.2 }}
                                    >
                                        <a
                                            href="#costos"
                                            className="group relative inline-flex items-center justify-center px-8 py-3 font-mono font-bold text-black transition-all duration-200 bg-green-500 hover:bg-green-400 rounded-sm"
                                        >
                                            <span className="mr-2">Ver análisis de costos</span>
                                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </a>
                                        <a
                                            href="#contexto"
                                            className="inline-flex items-center justify-center px-8 py-3 font-mono font-medium text-slate-300 transition-all duration-200 bg-transparent border border-slate-700 hover:border-purple-500 hover:text-purple-400 rounded-sm"
                                        >
                                            Ver propuesta completa
                                        </a>
                                    </motion.div>

                                    <motion.div
                                        className="mt-12 p-4 bg-slate-900/50 border border-slate-800 rounded text-xs md:text-sm font-mono text-slate-500"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 2.8 }}
                                    >
                                        <p>{">"} Analizando costos reales de Mercado Libre... [OK]</p>
                                        <p>{">"} Calculando ACOS y TACOS proyectados... [OK]</p>
                                        <p>{">"} Evaluando modelo de concesión vs operación propia... [READY]</p>
                                    </motion.div>
                                </div>
                            </div>
                        </TerminalFrame>
                    </motion.div>
                </div>

                <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#0c0c0c]/80 to-[#0c0c0c]"></div>
            </section>

            {/* NUEVA SECCIÓN: Costos Reales de Mercado Libre */}
            <section id="costos" className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-white mb-4">La Realidad de los Costos en Mercado Libre</h2>
                        <p className="text-slate-400 text-lg">Por qué empezar desde cero NO es rentable</p>
                    </div>

                    <div className="space-y-8">
                        {/* Comisiones */}
                        <TerminalFrame>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                    <span className="text-lg">$</span>
                                    <span className="text-lg">cat comisiones-mercadolibre.txt</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Percent className="w-8 h-8 text-red-400" />
                                    Comisiones por Venta (2024-2025)
                                </h3>

                                <div className="grid md:grid-cols-3 gap-6 mt-6">
                                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                                        <h4 className="text-green-400 font-semibold mb-3">Publicación Gratuita</h4>
                                        <p className="text-3xl font-bold text-white mb-2">0%</p>
                                        <ul className="text-xs text-slate-400 space-y-1">
                                            <li>• Baja exposición</li>
                                            <li>• Máx 5-20 ventas/año</li>
                                            <li>• Duración 60 días</li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                                        <h4 className="text-purple-400 font-semibold mb-3">Publicación Clásica</h4>
                                        <p className="text-3xl font-bold text-white mb-2">9% - 18%</p>
                                        <ul className="text-xs text-slate-400 space-y-1">
                                            <li>• Mayor exposición</li>
                                            <li>• Varía por categoría</li>
                                            <li>• Sin MSI</li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded">
                                        <h4 className="text-red-400 font-semibold mb-3">Publicación Premium</h4>
                                        <p className="text-3xl font-bold text-red-400 mb-2">13% - 22%</p>
                                        <ul className="text-xs text-slate-400 space-y-1">
                                            <li>• Máxima exposición</li>
                                            <li>• Permite MSI</li>
                                            <li>• <span className="text-red-400">Obligatoria para competir</span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-4 bg-red-500/5 border-l-4 border-red-500 rounded mt-6">
                                    <p className="text-slate-300">
                                        <span className="text-red-400 font-semibold">⚠️ Costo fijo adicional:</span> Para productos menores a $299 MXN se cobra entre $25-$37 MXN extra por unidad vendida.
                                    </p>
                                </div>
                            </div>
                        </TerminalFrame>

                        {/* ACOS y TACOS */}
                        <TerminalFrame>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                    <span className="text-lg">$</span>
                                    <span className="text-lg">cat metricas-publicidad.txt</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <BarChart3 className="w-8 h-8 text-purple-400" />
                                    ACOS y TACOS: Las Métricas que Definen Rentabilidad
                                </h3>

                                <div className="grid md:grid-cols-2 gap-8 mt-6">
                                    <div className="p-6 bg-purple-500/5 border border-purple-500/30 rounded">
                                        <h4 className="text-xl font-bold text-purple-400 mb-4">ACOS (Advertising Cost of Sales)</h4>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Gasto publicitario ÷ Ventas por publicidad × 100
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                                <span className="text-slate-300">ACOS ideal</span>
                                                <span className="text-green-400 font-bold">10-15%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                                <span className="text-slate-300">ACOS tolerable (lanzamiento)</span>
                                                <span className="text-yellow-400 font-bold">20-30%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                                <span className="text-slate-300">ACOS cuenta nueva (realista)</span>
                                                <span className="text-red-400 font-bold">40-60%+</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-green-500/5 border border-green-500/30 rounded">
                                        <h4 className="text-xl font-bold text-green-400 mb-4">TACOS (Total Advertising Cost of Sales)</h4>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Gasto publicitario ÷ Ventas TOTALES × 100
                                        </p>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                                <span className="text-slate-300">TACOS saludable</span>
                                                <span className="text-green-400 font-bold">5-10%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                                <span className="text-slate-300">TACOS en crecimiento</span>
                                                <span className="text-yellow-400 font-bold">10-15%</span>
                                            </div>
                                            <div className="flex justify-between items-center p-2 bg-slate-900/50 rounded">
                                                <span className="text-slate-300">TACOS cuenta nueva</span>
                                                <span className="text-red-400 font-bold">25-40%+</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-purple-500/5 border-l-4 border-purple-500 rounded mt-6">
                                    <p className="text-slate-300">
                                        <span className="text-purple-400 font-semibold">💡 Clave:</span> Para que una campaña sea rentable, el ACOS debe ser <span className="text-green-400 font-semibold">menor que tu margen neto</span>. Si tu margen es 25% y tu ACOS es 40%, estás perdiendo dinero en cada venta publicitaria.
                                    </p>
                                </div>
                            </div>
                        </TerminalFrame>

                        {/* Inversión en Publicidad */}
                        <TerminalFrame>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                    <span className="text-lg">$</span>
                                    <span className="text-lg">cat inversion-publicidad.txt</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <DollarSign className="w-8 h-8 text-green-400" />
                                    Inversión Mensual en Product Ads (Mercado Ads)
                                </h3>

                                <div className="grid md:grid-cols-3 gap-6 mt-6">
                                    <div className="p-6 bg-slate-900/50 border border-slate-800 rounded">
                                        <h4 className="text-slate-400 text-sm mb-2">Campañas de prueba</h4>
                                        <p className="text-3xl font-bold text-white mb-2">$300 - $500 USD</p>
                                        <p className="text-xs text-slate-500">~$5,000 - $8,500 MXN/mes</p>
                                    </div>

                                    <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded">
                                        <h4 className="text-purple-400 text-sm mb-2">Campañas en crecimiento</h4>
                                        <p className="text-3xl font-bold text-white mb-2">$1,000 - $3,000 USD</p>
                                        <p className="text-xs text-slate-500">~$17,000 - $51,000 MXN/mes</p>
                                    </div>

                                    <div className="p-6 bg-red-500/10 border border-red-500/30 rounded">
                                        <h4 className="text-red-400 text-sm mb-2">Sectores competitivos</h4>
                                        <p className="text-3xl font-bold text-red-400 mb-2">$5,000+ USD</p>
                                        <p className="text-xs text-slate-500">~$85,000+ MXN/mes</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-red-500/5 border-l-4 border-red-500 rounded mt-6">
                                    <p className="text-slate-300">
                                        <span className="text-red-400 font-semibold">⚠️ Sin publicidad = sin visibilidad.</span> La publicidad en Mercado Libre es prácticamente obligatoria para aparecer en los primeros resultados. Sin ella, tus productos quedan enterrados.
                                    </p>
                                </div>
                            </div>
                        </TerminalFrame>

                        {/* Fulfillment */}
                        <TerminalFrame>
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                    <span className="text-lg">$</span>
                                    <span className="text-lg">cat costos-fulfillment.txt</span>
                                </div>

                                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Package className="w-8 h-8 text-blue-400" />
                                    Mercado Envíos Full (Fulfillment)
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6 mt-6">
                                    <div className="space-y-4">
                                        <h4 className="text-blue-400 font-semibold">Costos asociados:</h4>
                                        <ul className="space-y-3 text-sm text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <DollarSign className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                <span><span className="text-white font-semibold">Almacenamiento diario:</span> Cobro por unidad según tamaño</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Clock className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                                                <span><span className="text-white font-semibold">Stock antiguo (+120 días):</span> Cargo adicional por unidad</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <Package className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                                                <span><span className="text-white font-semibold">Colecta a domicilio:</span> Tarifa según volumen y distancia</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                                                <span><span className="text-white font-semibold">Retiro/descarte:</span> Costo por retirar productos de bodega</span>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-blue-500/5 border border-blue-500/30 rounded">
                                        <h4 className="text-blue-400 font-semibold mb-3">Sin Full = Sin competitividad</h4>
                                        <p className="text-sm text-slate-400 mb-4">
                                            Usar Full es prácticamente obligatorio para:
                                        </p>
                                        <ul className="space-y-2 text-sm text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                Aparecer en primeros resultados
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                Participar en Hot Sale, Buen Fin
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                Ofrecer envío gratis competitivo
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </TerminalFrame>

                        {/* Resumen: Por qué NO empezar de cero */}
                        <TerminalFrame className="border-red-500/30">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 text-red-400 font-mono mb-6">
                                    <AlertTriangle className="w-6 h-6" />
                                    <span className="text-xl font-bold">Por qué NO es rentable empezar desde cero</span>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-white">Costos de una cuenta nueva:</h4>
                                        <div className="space-y-3">
                                            <div className="flex justify-between p-3 bg-slate-900/50 border border-slate-800 rounded">
                                                <span className="text-slate-300">Comisión Premium</span>
                                                <span className="text-red-400 font-bold">~18-22%</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-slate-900/50 border border-slate-800 rounded">
                                                <span className="text-slate-300">ACOS inicial (sin reseñas)</span>
                                                <span className="text-red-400 font-bold">40-60%</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-slate-900/50 border border-slate-800 rounded">
                                                <span className="text-slate-300">Envío gratis (vendedor asume)</span>
                                                <span className="text-red-400 font-bold">~5-10%</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-slate-900/50 border border-slate-800 rounded">
                                                <span className="text-slate-300">Fulfillment + storage</span>
                                                <span className="text-red-400 font-bold">~3-8%</span>
                                            </div>
                                            <div className="flex justify-between p-3 bg-red-500/10 border border-red-500/30 rounded">
                                                <span className="text-white font-bold">TOTAL COSTO SOBRE VENTA</span>
                                                <span className="text-red-400 font-bold text-xl">66-100%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-lg font-bold text-white">Tiempo para rentabilidad:</h4>
                                        <div className="p-6 bg-slate-900/50 border border-slate-800 rounded space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Clock className="w-6 h-6 text-red-400" />
                                                <div>
                                                    <p className="text-white font-semibold">6-12 meses</p>
                                                    <p className="text-xs text-slate-400">Para acumular reseñas y reputación</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <TrendingUp className="w-6 h-6 text-yellow-400" />
                                                <div>
                                                    <p className="text-white font-semibold">12-18 meses</p>
                                                    <p className="text-xs text-slate-400">Para lograr ACOS sostenible (&lt;20%)</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <DollarSign className="w-6 h-6 text-green-400" />
                                                <div>
                                                    <p className="text-white font-semibold">18-24 meses</p>
                                                    <p className="text-xs text-slate-400">Para ser realmente rentable</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-4 bg-red-500/5 border-l-4 border-red-500 rounded">
                                            <p className="text-sm text-slate-300">
                                                <span className="text-red-400 font-semibold">Inversión perdida:</span> Durante esos 12+ meses, cada venta genera pérdida o break-even mientras se construye posicionamiento.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TerminalFrame>

                        {/* CALCULADORA DE RENTABILIDAD */}
                        <ProfitabilityCalculator />
                    </div>
                </div>
            </section>

            {/* Contexto del Problema */}
            <section id="contexto" className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat contexto-real.txt</span>
                            </div>

                            <div className="space-y-6 text-slate-300 leading-relaxed">
                                <h2 className="text-3xl font-bold text-white">El contexto real del problema</h2>

                                <p className="text-lg">
                                    Mexar nace sólida desde dos pilares claros:{" "}
                                    <span className="text-green-400 font-semibold">la capacidad comercial</span> y{" "}
                                    <span className="text-purple-400 font-semibold">el conocimiento profundo del producto farmacéutico</span>.
                                </p>

                                <p className="text-slate-400">
                                    Ese modelo funcionó durante años en licitaciones públicas y privadas, donde el éxito depende de
                                    anticipación, cumplimiento, calidad y relaciones comerciales.
                                </p>

                                <div className="p-6 bg-purple-500/5 border-l-4 border-purple-500 rounded mt-8">
                                    <p className="text-lg text-white font-semibold mb-3">
                                        El paso al retail digital representa un negocio distinto, no una extensión natural del anterior.
                                    </p>
                                    <p className="text-slate-400">
                                        Aquí no gana quien tiene mejor producto, sino quien:
                                    </p>
                                </div>

                                <div className="grid md:grid-cols-5 gap-4 mt-6">
                                    {[
                                        { icon: Zap, text: "Opera mejor" },
                                        { icon: TrendingUp, text: "Itera más rápido" },
                                        { icon: Package, text: "Menos errores logísticos" },
                                        { icon: BarChart3, text: "Controla costos reales" },
                                        { icon: Store, text: "Entiende cada canal" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded text-center">
                                            <item.icon className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                            <p className="text-sm text-slate-300">{item.text}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-red-500/5 border-l-4 border-red-500 rounded">
                                    <p className="text-slate-300">
                                        <span className="text-red-400 font-semibold">El problema actual:</span> No es que Mexar quiera crecer
                                        en retail. El problema es intentar hacerlo desde una lógica de{" "}
                                        <span className="text-white font-semibold">control operativo</span>, cuando el retail digital se
                                        gobierna mejor desde <span className="text-green-400 font-semibold">control estratégico y contractual</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Idea Central */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat idea-central.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">La idea central de la propuesta</h2>

                                <p className="text-lg text-slate-300 leading-relaxed">
                                    La propuesta consiste en que Mexar otorgue a un operador especializado la{" "}
                                    <span className="text-purple-400 font-semibold">concesión exclusiva</span> para administrar:
                                </p>

                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div className="p-6 bg-purple-500/10 border-2 border-purple-500/30 rounded">
                                        <Store className="w-10 h-10 text-purple-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Ecommerce Oficial</h3>
                                        <p className="text-sm text-slate-400">Tienda online propia con control total de experiencia</p>
                                    </div>

                                    <div className="p-6 bg-green-500/10 border-2 border-green-500/30 rounded">
                                        <Package className="w-10 h-10 text-green-400 mb-4" />
                                        <h3 className="text-xl font-bold text-white mb-2">Marketplaces</h3>
                                        <p className="text-sm text-slate-400">Mercado Libre, Amazon, y otros canales digitales</p>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-green-500/5 border border-green-500/30 rounded">
                                    <p className="text-lg text-slate-300">
                                        Mientras Mexar conserva el <span className="text-green-400 font-semibold">control total</span> del
                                        producto, la marca, el mensaje, el pricing estratégico y las decisiones de negocio.
                                    </p>
                                </div>

                                <div className="mt-6 p-6 bg-slate-900/50 border-l-4 border-purple-500 rounded">
                                    <p className="text-2xl font-bold text-white mb-2">Esto no es "soltar el negocio".</p>
                                    <p className="text-slate-400">
                                        Es separar claramente <span className="text-purple-400 font-semibold">quién decide</span> y{" "}
                                        <span className="text-green-400 font-semibold">quién ejecuta</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Error Conceptual */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat error-conceptual.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">El error conceptual que genera el miedo al "no control"</h2>

                                <p className="text-lg text-slate-300">
                                    El miedo de los dueños no nace de una falla lógica, sino de una confusión común:
                                </p>

                                <div className="text-center py-8">
                                    <p className="text-3xl font-bold text-red-400">Confundir control con ejecución.</p>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="p-6 bg-red-500/5 border border-red-500/30 rounded">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Unlock className="w-8 h-8 text-red-400" />
                                            <h3 className="text-xl font-bold text-red-400">Ejecución es:</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Subir productos
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Gestionar pedidos
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Contestar clientes
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Mover inventario
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Optimizar campañas
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <div className="w-1.5 h-1.5 mt-1.5 bg-red-400 rounded-full flex-shrink-0" />
                                                Resolver devoluciones
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="p-6 bg-green-500/5 border border-green-500/30 rounded">
                                        <div className="flex items-center gap-3 mb-4">
                                            <Lock className="w-8 h-8 text-green-400" />
                                            <h3 className="text-xl font-bold text-green-400">Control es:</h3>
                                        </div>
                                        <ul className="space-y-2 text-sm text-slate-400">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Decidir el precio mínimo
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Definir qué se puede prometer
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Aprobar mensajes y claims
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Decidir qué producto se lanza
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Fijar objetivos y medir resultados
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Corregir o terminar una relación
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="mt-8 p-6 bg-purple-500/5 border-l-4 border-purple-500 rounded">
                                    <p className="text-slate-300">
                                        Hoy los dueños sienten que <span className="text-red-400">"si no lo hacen ellos, pierden control"</span>,
                                        cuando en realidad lo único que perderían es{" "}
                                        <span className="text-green-400 font-semibold">carga operativa</span>.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Dónde vive el control */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-green-500/30">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat donde-vive-control.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Dónde vive realmente el control en este modelo</h2>

                                <p className="text-lg text-slate-300">
                                    El control no vive en estar encima de la operación. El control vive en:
                                </p>

                                <div className="grid md:grid-cols-3 gap-4 mt-8">
                                    {[
                                        { icon: FileText, title: "Acuerdos iniciales", desc: "Reglas claras desde el día uno" },
                                        { icon: Lock, title: "El contrato", desc: "Marco legal que protege" },
                                        { icon: Target, title: "Los KPIs", desc: "Métricas objetivas de éxito" },
                                        { icon: BarChart3, title: "Las métricas", desc: "Datos para tomar decisiones" },
                                        { icon: AlertTriangle, title: "Las consecuencias", desc: "Incentivos y penalizaciones" },
                                        { icon: Shield, title: "Cláusulas de salida", desc: "Libertad para terminar" },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-green-500/5 border border-green-500/20 rounded">
                                            <item.icon className="w-6 h-6 text-green-400 mb-3" />
                                            <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                            <p className="text-xs text-slate-400">{item.desc}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 p-6 bg-slate-900/50 border-l-4 border-green-500 rounded">
                                    <p className="text-lg text-slate-300">
                                        Si el control depende de estar vigilando todos los días, entonces{" "}
                                        <span className="text-red-400 font-semibold">no hay control</span>: hay{" "}
                                        <span className="text-red-400">dependencia y desgaste</span>.
                                    </p>
                                    <p className="text-lg text-white font-semibold mt-4">
                                        En este modelo, Mexar controla sin ejecutar, y eso es exactamente lo que permite escalar sin perder
                                        rumbo.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Riesgos Mitigados */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame>
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat riesgos-mitigados.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Los riesgos que preocupan a los dueños</h2>
                                <p className="text-slate-400">Y cómo están mitigados:</p>

                                <div className="space-y-4 mt-8">
                                    {[
                                        {
                                            q: "¿Y si perdemos el control?",
                                            a: "El control está en el contrato, no en la operación.",
                                        },
                                        {
                                            q: "¿Y si no lo hacen como queremos?",
                                            a: "No importa: las reglas no dependen de confianza, dependen de métricas.",
                                        },
                                        {
                                            q: "¿Y si dependemos demasiado del distribuidor?",
                                            a: "KPIs, cláusula de salida, transición ordenada.",
                                        },
                                        {
                                            q: "¿Y si dañan la marca?",
                                            a: "Gobierno de marca, aprobación de contenido, sanciones claras.",
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className="p-4 bg-slate-900/50 border border-slate-800 rounded">
                                            <p className="text-red-400 font-semibold mb-2">"{item.q}"</p>
                                            <p className="text-green-400">→ {item.a}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Idea Clave */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-purple-500/30">
                        <div className="text-center space-y-6 py-8">
                            <div className="inline-block">
                                <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                    <span className="text-lg">$</span>
                                    <span className="text-lg">echo $IDEA_CLAVE</span>
                                </div>
                            </div>

                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                El control real no está en <span className="text-red-400">hacer</span>.
                            </h2>
                            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                                Está en poder <span className="text-green-400">decidir</span>,{" "}
                                <span className="text-purple-400">medir</span>, <span className="text-blue-400">corregir</span> y{" "}
                                <span className="text-green-400">terminar</span>.
                            </h2>

                            <div className="mt-8 p-6 bg-slate-900/50 border border-slate-800 rounded max-w-3xl mx-auto">
                                <p className="text-lg text-slate-400">
                                    Un negocio donde "todo pasa por los dueños" no es un negocio controlado.
                                    <br />
                                    <span className="text-red-400 font-semibold">Es un negocio frágil.</span>
                                </p>
                            </div>
                        </div>
                    </TerminalFrame>
                </div>
            </section>

            {/* Conclusión */}
            <section className="py-20 border-t border-slate-800">
                <div className="container px-4 mx-auto max-w-6xl">
                    <TerminalFrame className="border-green-500/30">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 text-green-500 font-mono mb-6">
                                <span className="text-lg">$</span>
                                <span className="text-lg">cat conclusion.txt</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-3xl font-bold text-white">Conclusión</h2>

                                <div className="grid md:grid-cols-2 gap-8 mt-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-red-400 mb-4">Este modelo NO:</h3>
                                        <ul className="space-y-2 text-slate-400">
                                            <li>• Reduce control</li>
                                            <li>• Aumenta riesgo</li>
                                            <li>• Debilita a Mexar</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-green-400 mb-4">Este modelo SÍ:</h3>
                                        <ul className="space-y-2 text-slate-300">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Protege la marca
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Reduce desgaste
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Acelera aprendizaje
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Permite escalar
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                Evita 12-24 meses de pérdidas construyendo cuenta desde cero
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="p-6 bg-green-500/5 border-l-4 border-green-500 rounded mt-8">
                                    <p className="text-lg text-white">
                                        El control que hoy sienten que necesitan no se pierde.
                                        <br />
                                        <span className="text-green-400 font-semibold">
                                            Se rediseña correctamente desde el inicio, a través de acuerdos, métricas y gobierno.
                                        </span>
                                    </p>
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
