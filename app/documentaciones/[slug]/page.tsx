import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ProyectoEditorClient from './ProyectoEditorClient'

type Params = { params: Promise<{ slug: string }> }

export default async function ProyectoEditorPage({ params }: Params) {
    const session = await auth()
    if (!session) redirect('/documentaciones/login')
    const { slug } = await params

    return <ProyectoEditorClient slug={slug} sessionEmail={session.user?.email ?? ''} />
}
