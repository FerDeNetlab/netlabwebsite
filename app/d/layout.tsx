import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Documentación · Netlab',
    description: 'Manual interactivo de tu sistema',
    robots: 'noindex, nofollow',
}

export default function PublicDocLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background">{children}</div>
}
