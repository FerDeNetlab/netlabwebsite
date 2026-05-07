import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import DocumentacionesClient from './DocumentacionesClient'

export default async function DocumentacionesPage() {
    const session = await auth()
    if (!session) redirect('/documentaciones/login')

    return <DocumentacionesClient session={session} />
}
