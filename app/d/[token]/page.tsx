import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import PublicDocClient from './PublicDocClient'
import type { DocProyectoCompleto } from '@/lib/types/documentaciones'

type Params = { params: Promise<{ token: string }> }

async function fetchProyecto(token: string): Promise<DocProyectoCompleto | null> {
    const h = await headers()
    const host = h.get('host')
    const protocol = host?.startsWith('localhost') ? 'http' : 'https'
    try {
        const res = await fetch(`${protocol}://${host}/api/documentaciones/publico/${token}`, {
            cache: 'no-store',
        })
        if (!res.ok) return null
        return await res.json()
    } catch {
        return null
    }
}

export default async function PublicDocPage({ params }: Params) {
    const { token } = await params
    const proyecto = await fetchProyecto(token)
    if (!proyecto) notFound()

    return <PublicDocClient proyecto={proyecto} token={token} />
}
