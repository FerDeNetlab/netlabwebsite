'use client'
import { useEffect, useState } from 'react'
import { Download, X, Share } from 'lucide-react'

export function PWARegister() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/admin' })
        .then((reg) => console.log('[SW] Registrado:', reg.scope))
        .catch((err) => console.error('[SW] Error:', err))
    }
  }, [])

  return null
}

// Detecta si está en iOS Safari (no instalada aún)
function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}
function isInStandaloneMode() {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
}

export function PWAInstallBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Solo mostrar en iOS cuando NO está instalada
    if (isIOS() && !isInStandaloneMode()) {
      const dismissed = sessionStorage.getItem('pwa-banner-dismissed')
      if (!dismissed) setShow(true)
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 bg-[#0f1f0f] border border-green-500/40 rounded-xl p-4 shadow-2xl font-mono">
      <button
        onClick={() => {
          sessionStorage.setItem('pwa-banner-dismissed', '1')
          setShow(false)
        }}
        className="absolute top-3 right-3 text-slate-500 hover:text-white"
        aria-label="Cerrar"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3 pr-6">
        <div className="w-10 h-10 bg-green-500/10 border border-green-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <Download className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <p className="text-green-400 font-bold text-sm">Instalar Netlab Admin</p>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
            Toca{' '}
            <Share className="w-3 h-3 inline text-blue-400 mx-0.5" />
            {' '}y luego <span className="text-white">"Agregar a inicio"</span> para usarla como app.
          </p>
        </div>
      </div>
    </div>
  )
}
