import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import PublicTicketsClient from './PublicTicketsClient'
import type { PortalPublico } from '@/lib/types/tickets'

type Params = { params: Promise<{ token: string }> }

async function fetchPortal(token: string): Promise<PortalPublico | null> {
    const h = await headers()
    const host = h.get('host')
    const protocol = host?.startsWith('localhost') ? 'http' : 'https'
    try {
        const res = await fetch(`${protocol}://${host}/api/tickets/publico/${token}`, { cache: 'no-store' })
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

export default async function PublicTicketsPage({ params }: Params) {
    const { token } = await params
    const portal = await fetchPortal(token)
    if (!portal) notFound()

    return <PublicTicketsClient portal={portal} token={token} />
}
