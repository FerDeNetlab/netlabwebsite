import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import FlujoEditorClient from './FlujoEditorClient'

type Params = { params: Promise<{ slug: string; flujoId: string }> }

export default async function FlujoEditorPage({ params }: Params) {
    const session = await auth()
    if (!session) redirect('/documentaciones/login')
    const { slug, flujoId } = await params

    return <FlujoEditorClient slug={slug} flujoId={flujoId} sessionEmail={session.user?.email ?? ''} />
}
