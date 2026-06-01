'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import {
  Users,
  DollarSign,
  TrendingUp,
  LogOut,
  Briefcase,
  ClipboardList,
  Package,
  Plus,
  UserCog
} from 'lucide-react'
import Image from 'next/image'
import { Navbar } from '@/components/navbar'

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
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 pt-4 pb-[env(safe-area-inset-bottom,16px)] pb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title="root@netlab:~/dashboard">
            <div className="p-4 md:p-6 space-y-6">
              {/* Header */}
              <div className="border-b border-green-500/20 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <Image
                    src="/logo-netlab.png"
                    alt="Netlab"
                    width={120}
                    height={36}
                    className="h-8 w-auto"
                  />
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="font-mono gap-1.5 text-xs bg-transparent px-3 py-2 h-auto"
                    size="sm"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Salir
                  </Button>
                </div>
                <h1 className="text-xl md:text-3xl font-mono text-green-400 mb-1">
                  Dashboard
                </h1>
                <p className="text-gray-400 font-mono text-xs">
                  {new Date().toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              {/* Stats Grid — 2 cols en mobile */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => router.push(stat.path)}
                    className="bg-zinc-900/50 border border-green-500/20 rounded-xl p-4 active:scale-95 transition-all cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs font-mono mb-1 leading-tight">
                          {stat.title}
                        </p>
                        <p className={`text-2xl font-bold font-mono ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-5 w-5 ${stat.color}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Módulos Principales — grid 2x3 en mobile */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
                {modules.map((module, index) => (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.07 }}
                    onClick={() => router.push(module.path)}
                    className={`bg-zinc-900/50 border ${module.borderColor} rounded-xl p-4 active:scale-95 transition-all cursor-pointer`}
                  >
                    <div className="flex flex-col items-start gap-3">
                      <div className={`p-3 rounded-xl ${module.bgColor}`}>
                        <module.icon className={`h-6 w-6 ${module.color}`} />
                      </div>
                      <div>
                        <h3 className={`text-sm font-bold font-mono ${module.color} mb-0.5`}>
                          {module.title}
                        </h3>
                        <p className="text-gray-500 text-xs font-mono leading-tight">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-zinc-900/50 border border-purple-500/20 rounded-xl p-4">
                <h2 className="text-sm font-mono text-purple-400 mb-3 flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Nuevo Cliente', path: '/admin/clientes/nuevo' },
                    { label: 'Nueva Cotización', path: '/admin/cotizaciones/nueva' },
                    { label: 'Nueva Oportunidad', path: '/admin/crm' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => router.push(action.path)}
                      className="bg-zinc-800/50 active:bg-zinc-800 border border-gray-700 active:border-green-500/50 rounded-lg px-4 py-3.5 text-left text-sm font-mono text-gray-300 active:text-green-400 transition-all"
                    >
                      + {action.label}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
