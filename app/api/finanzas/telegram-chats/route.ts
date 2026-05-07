import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function GET() {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    try {
        const rows = (await sql`
      SELECT t.*, cl.nombre as cliente_nombre
      FROM telegram_chats t
      LEFT JOIN clientes cl ON t.cliente_id = cl.id
      ORDER BY t.created_at DESC
    `) as Record<string, unknown>[]
        return NextResponse.json({ chats: rows })
    } catch (error) {
        console.error('[telegram-chats] GET error:', error)
        return NextResponse.json({ error: 'Error al consultar chats' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    try {
        const body = await request.json()
        const { chat_id, user_email, cliente_id, username, nombre, activo } = body
        if (!chat_id) return NextResponse.json({ error: 'chat_id requerido' }, { status: 400 })
        const rows = (await sql`
      INSERT INTO telegram_chats (chat_id, user_email, cliente_id, username, nombre, activo)
      VALUES (${String(chat_id)}, ${user_email || null}, ${cliente_id || null}, ${username || null}, ${nombre || null}, ${activo ?? true})
      ON CONFLICT (chat_id) DO UPDATE SET
        user_email = EXCLUDED.user_email,
        cliente_id = EXCLUDED.cliente_id,
        username = EXCLUDED.username,
        nombre = EXCLUDED.nombre,
        activo = EXCLUDED.activo,
        updated_at = NOW()
      RETURNING *
    `) as Record<string, unknown>[]
        return NextResponse.json(rows[0], { status: 201 })
    } catch (error) {
        console.error('[telegram-chats] POST error:', error)
        return NextResponse.json({ error: 'Error al guardar chat' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    const session = await auth()
    if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 })
        await sql`DELETE FROM telegram_chats WHERE id = ${id}`
        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[telegram-chats] DELETE error:', error)
        return NextResponse.json({ error: 'Error al eliminar chat' }, { status: 500 })
    }
}
