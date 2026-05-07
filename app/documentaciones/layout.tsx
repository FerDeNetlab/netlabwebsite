import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Documentaciones - Netlab',
    description: 'Editor interno de documentaciones de proyectos',
    robots: 'noindex, nofollow',
}

export default function DocumentacionesLayout({ children }: { children: React.ReactNode }) {
    return <div className="min-h-screen bg-background">{children}</div>
}
