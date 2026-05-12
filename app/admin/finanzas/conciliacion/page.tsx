import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import ConciliacionClient from './ConciliacionClient'

export const metadata = { title: 'Conciliación Bancaria | Netlab Admin' }

export default async function ConciliacionPage() {
  const session = await auth()
  if (!session) redirect('/admin/login')
  return <ConciliacionClient />
}
