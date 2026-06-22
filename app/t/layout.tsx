import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Soporte - Netlab',
    description: 'Portal de tickets de soporte',
    robots: 'noindex, nofollow',
}

export default function TicketsPublicLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background">{children}</div>
}
