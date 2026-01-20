'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { TerminalFrame } from '@/components/ui/terminal-frame'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { CRMKanban } from './CRMKanban'

export default function CRMPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary font-mono">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-8 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TerminalFrame title="root@netlab:~/crm">
            <div className="p-6 space-y-6">
              <Button
                onClick={() => router.push('/admin')}
                variant="ghost"
                className="font-mono gap-2 text-sm mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver al Dashboard
              </Button>

              <CRMKanban />
            </div>
          </TerminalFrame>
        </motion.div>
      </div>
    </div>
  )
}
