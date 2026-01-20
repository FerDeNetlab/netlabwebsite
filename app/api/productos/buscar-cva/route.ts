import { NextResponse } from 'next/server'
import { auth } from '@/auth'

/**
 * Endpoint para búsqueda dinámica de productos en CVA
 * Útil para autocompletar en cotizaciones sin importar todos los productos
 */
export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { busqueda, limite = 50 } = body

    const user = process.env.CVA_USER
    const password = process.env.CVA_PASSWORD

    if (!user || !password) {
      return NextResponse.json(
        { error: 'Credenciales CVA no configuradas' },
        { status: 500 }
      )
    }

    // 1. Autenticar
    const authResponse = await fetch('https://apicvaservices.grupocva.com/api/v2/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password })
    })

    if (!authResponse.ok) {
      return NextResponse.json({ error: 'Error de autenticación' }, { status: 401 })
    }

    const authData = await authResponse.json()
    const token = authData.token

    // 2. Buscar productos
    const url = new URL('https://apicvaservices.grupocva.com/api/v2/catalogo_clientes/lista_precios')
    if (busqueda) {
      url.searchParams.append('buscar', busqueda)
    }
    url.searchParams.append('exist', '3') // Solo con disponibilidad
    url.searchParams.append('limite', limite.toString())

    const productosResponse = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    if (!productosResponse.ok) {
      return NextResponse.json({ error: 'Error al buscar productos' }, { status: 500 })
    }

    const data = await productosResponse.json()

    // Formatear para el frontend
    const productos = (data.articulos || []).map((art: any) => ({
      sku: art.clave,
      nombre: art.descripcion,
      precio: art.moneda === 'Pesos' ? art.precio : art.precio * 20,
      disponible: art.disponible,
      categoria: art.grupo,
      marca: art.marca
    }))

    return NextResponse.json({
      success: true,
      productos,
      total: productos.length
    })

  } catch (error) {
    console.error('[v0] Error en búsqueda CVA:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
