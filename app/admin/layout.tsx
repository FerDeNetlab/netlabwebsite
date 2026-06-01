import type { Metadata, Viewport } from 'next'
import { PWARegister, PWAInstallBanner } from '@/components/pwa'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#22c55e',
}

export const metadata: Metadata = {
  title: 'Netlab Admin',
  description: 'Panel de control interno Netlab',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Netlab',
  },
  icons: {
    apple: [
      { url: '/apple-icon.png', sizes: '180x180' },
    ],
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Netlab',
    'format-detection': 'telephone=no',
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PWARegister />
      {children}
      <PWAInstallBanner />
    </>
  )
}
