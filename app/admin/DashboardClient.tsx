'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  DollarSign,
  TrendingUp,
  LogOut,
  Briefcase,
  ClipboardList,
  Package,
  Plus,
  UserCog,
  CheckSquare
} from 'lucide-react'
import Image from 'next/image'

interface DashboardStats {
  totalClientes: number
  proyectosActivos: number
  cotizacionesPendientes: number
  oportunidadesAbiertas: number
}

import type { Session } from 'next-auth'

interface DashboardClientProps {
  session: Session
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    proyectosActivos: 0,
    cotizacionesPendientes: 0,
    oportunidadesAbiertas: 0,
  })

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  useEffect(() => {
    window.scrollTo(0, 0)

    // Fetch real data from API
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/dashboard/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('[v0] Error fetching stats:', error)
      }
    }

    fetchStats()
  }, [])

  const statCards = [
    {
      title: 'Clientes Activos',
      value: stats.totalClientes,
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      path: '/admin/clientes',
    },
    {
      title: 'Oportunidades CRM',
      value: stats.oportunidadesAbiertas,
      icon: TrendingUp,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      path: '/admin/crm',
    },
    {
      title: 'Cotizaciones Pendientes',
      value: stats.cotizacionesPendientes,
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      path: '/admin/cotizaciones',
    },
  ]

  const modules = [
    {
      title: 'Clientes',
      description: 'Gestiona clientes y datos fiscales',
      icon: Users,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-500/20',
      path: '/admin/clientes',
    },
    {
      title: 'CRM',
      description: 'Pipeline de oportunidades de negocio',
      icon: Briefcase,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      borderColor: 'border-cyan-500/20',
      path: '/admin/crm',
    },
    {
      title: 'Cotizaciones',
      description: 'Crear y gestionar cotizaciones',
      icon: ClipboardList,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      borderColor: 'border-yellow-500/20',
      path: '/admin/cotizaciones',
    },
    {
      title: 'Productos',
      description: 'Catálogo de productos y servicios',
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      borderColor: 'border-purple-500/20',
      path: '/admin/cotizaciones/productos',
    },
    {
      title: 'Finanzas',
      description: 'Facturas, gastos y flujo de efectivo',
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      borderColor: 'border-emerald-500/20',
      path: '/admin/finanzas',
    },
    {
      title: 'Recursos Humanos',
      description: 'Empleados, documentos y datos laborales',
      icon: UserCog,
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      borderColor: 'border-orange-500/20',
      path: '/admin/rh',
    },
    {
      title: 'Pendientes',
      description: 'Mis tareas y pendientes de otros',
      icon: CheckSquare,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      borderColor: 'border-amber-500/20',
      path: '/admin/pendientes',
    },
  ]

  return (
    <div
      className="min-h-screen bg-[#0a0a0a]"
      style={{ paddingBottom: 'max(24px, env(safe-area-inset-bottom))' }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur border-b border-green-500/20 px-4 flex items-center justify-between"
        style={{ paddingTop: 'max(12px, env(safe-area-inset-top))', paddingBottom: '12px' }}
      >
        <Image
          src="/logo-netlab.png"
          alt="Netlab"
          width={130}
          height={40}
          className="h-8 w-auto"
        />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-gray-400 active:text-red-400 transition-colors py-2 px-1"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-mono">Salir</span>
        </button>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Saludo */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold font-mono text-white">
            Hola, {session.user?.name?.split(' ')[0] ?? 'Admin'} 👋
          </h1>
          <p className="text-gray-500 font-mono text-sm mt-0.5">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </motion.div>

        {/* Stats — 3 chips horizontales */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="grid grid-cols-3 gap-2"
        >
          {statCards.map((stat) => (
            <button
              key={stat.title}
              onClick={() => router.push(stat.path)}
              className={`bg-zinc-900 border border-zinc-800 active:border-zinc-600 rounded-2xl p-3 text-left active:scale-95 transition-all`}
            >
              <div className={`p-2 rounded-xl ${stat.bgColor} w-fit mb-2`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <p className={`text-2xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
              <p className="text-gray-500 text-[10px] font-mono leading-tight mt-0.5">{stat.title}</p>
            </button>
          ))}
        </motion.div>

        {/* Módulos — lista de filas grandes */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-3 px-1">Módulos</p>
          <div className="space-y-2">
            {modules.map((module, index) => (
              <motion.button
                key={module.title}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.18 + index * 0.05 }}
                onClick={() => router.push(module.path)}
                className={`w-full flex items-center gap-4 bg-zinc-900 border ${module.borderColor} rounded-2xl px-4 py-4 active:scale-[0.98] transition-all text-left`}
              >
                <div className={`p-3 rounded-xl ${module.bgColor} shrink-0`}>
                  <module.icon className={`h-7 w-7 ${module.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-bold font-mono ${module.color}`}>{module.title}</p>
                  <p className="text-gray-500 text-xs font-mono leading-snug mt-0.5 truncate">{module.description}</p>
                </div>
                <svg className="h-5 w-5 text-gray-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
        >
          <p className="text-gray-500 text-xs font-mono uppercase tracking-widest mb-3 px-1">Acciones Rápidas</p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { label: 'Nuevo Cliente', path: '/admin/clientes/nuevo', icon: Users },
              { label: 'Nueva Cotización', path: '/admin/cotizaciones/nueva', icon: ClipboardList },
              { label: 'Nueva Oportunidad', path: '/admin/crm', icon: TrendingUp },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => router.push(action.path)}
                className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 active:border-green-500/40 rounded-2xl px-4 py-4 active:scale-[0.98] transition-all"
              >
                <div className="p-2 rounded-lg bg-green-400/10 shrink-0">
                  <Plus className="h-5 w-5 text-green-400" />
                </div>
                <span className="text-sm font-mono text-gray-300">{action.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Spacer bottom */}
        <div className="h-4" />
      </div>
    </div>
  )
}
