'use client'

import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { 
  DollarSign, 
  Users, 
  FileText, 
  CheckSquare, 
  TrendingUp, 
  Clock, 
  LogOut,
  Briefcase,
  ClipboardList
} from 'lucide-react'
import Image from 'next/image'
import Navbar from '@/components/navbar' // Import Navbar component

interface DashboardStats {
  totalClientes: number
  proyectosActivos: number
  cotizacionesPendientes: number
  tareasAbiertas: number
  ingresosMes: number
  horasRegistradas: number
}

interface DashboardClientProps {
  session: {
    user: {
      email?: string
      name?: string
      id?: string
    }
  }
}

export default function DashboardClient({ session }: DashboardClientProps) {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalClientes: 0,
    proyectosActivos: 0,
    cotizacionesPendientes: 0,
    tareasAbiertas: 0,
    ingresosMes: 0,
    horasRegistradas: 0,
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
      title: 'Proyectos Activos',
      value: stats.proyectosActivos,
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      path: '/admin/proyectos',
    },
    {
      title: 'Cotizaciones Pendientes',
      value: stats.cotizacionesPendientes,
      icon: DollarSign,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      path: '/admin/cotizaciones',
    },
    {
      title: 'Tareas Abiertas',
      value: stats.tareasAbiertas,
      icon: CheckSquare,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      path: '/admin/tareas',
    },
    {
      title: 'Ingresos del Mes',
      value: `$${(stats.ingresosMes / 1000).toFixed(0)}K`,
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      path: '/admin/finanzas',
    },
    {
      title: 'Horas Registradas',
      value: stats.horasRegistradas,
      icon: Clock,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      path: '/admin/tiempo',
    },
  ]

  const modules = [
    {
      title: 'CRM',
      description: 'Gestiona oportunidades de negocio',
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
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title="root@netlab:~/dashboard">
            <div className="p-6 space-y-8">
              {/* Header */}
              <div className="border-b border-green-500/20 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <Image
                    src="/logo-netlab.png"
                    alt="Netlab"
                    width={150}
                    height={45}
                    className="h-10 w-auto"
                  />
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="font-mono gap-2 text-sm bg-transparent"
                    size="sm"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                  </Button>
                </div>
                <h1 className="text-3xl font-mono text-green-400 mb-2">
                  Dashboard - ERP Netlab
                </h1>
                <p className="text-gray-400 font-mono text-sm">
                  Panel de control interno • {new Date().toLocaleDateString('es-MX', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statCards.map((stat, index) => (
                  <motion.div
                    key={stat.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => router.push(stat.path)}
                    className="bg-zinc-900/50 border border-green-500/20 rounded-lg p-6 hover:border-green-500/40 transition-all cursor-pointer hover:scale-105"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-gray-400 text-sm font-mono mb-2">
                          {stat.title}
                        </p>
                        <p className={`text-3xl font-bold font-mono ${stat.color}`}>
                          {stat.value}
                        </p>
                      </div>
                      <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                        <stat.icon className={`h-6 w-6 ${stat.color}`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Módulos Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modules.map((module, index) => (
                  <motion.div
                    key={module.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    onClick={() => router.push(module.path)}
                    className={`bg-zinc-900/50 border ${module.borderColor} rounded-lg p-6 hover:border-opacity-60 transition-all cursor-pointer hover:scale-105`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-lg ${module.bgColor}`}>
                        <module.icon className={`h-8 w-8 ${module.color}`} />
                      </div>
                      <div>
                        <h3 className={`text-xl font-mono ${module.color} mb-1`}>
                          {module.title}
                        </h3>
                        <p className="text-gray-400 text-sm font-mono">
                          {module.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="bg-zinc-900/50 border border-purple-500/20 rounded-lg p-6">
                <h2 className="text-xl font-mono text-purple-400 mb-4">
                  Acciones Rápidas
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Nuevo Cliente', path: '/admin/clientes/nuevo' },
                    { label: 'Nuevo Proyecto', path: '/admin/proyectos/nuevo' },
                    { label: 'Nueva Cotización', path: '/admin/cotizaciones/nuevo' },
                    { label: 'Registrar Tiempo', path: '/admin/tiempo' },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={() => router.push(action.path)}
                      className="bg-zinc-800/50 hover:bg-zinc-800 border border-gray-700 hover:border-green-500/50 rounded px-4 py-3 text-center text-sm font-mono text-gray-300 hover:text-green-400 transition-all"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-zinc-900/50 border border-cyan-500/20 rounded-lg p-6">
                <h2 className="text-xl font-mono text-cyan-400 mb-4">
                  Actividad Reciente
                </h2>
                <div className="space-y-3">
                  {[
                    { time: '10:30', action: 'Nueva cotización creada', client: 'GOMWATER' },
                    { time: '09:15', action: 'Proyecto actualizado', client: 'Tierra Fértil' },
                    { time: '08:45', action: 'Pago registrado', client: 'Laboratorios Pisa' },
                  ].map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 text-sm font-mono p-3 bg-zinc-800/30 rounded border border-gray-700/50"
                    >
                      <span className="text-gray-500">{activity.time}</span>
                      <span className="text-gray-400">{activity.action}</span>
                      <span className="text-green-400 ml-auto">{activity.client}</span>
                    </div>
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
