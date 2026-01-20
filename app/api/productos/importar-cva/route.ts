import { NextResponse } from 'next/server'
import { sql } from '@/lib/db'
import { auth } from '@/auth'

export async function POST(request: Request) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const body = await request.json()
    const { filters, startPage = 1, maxPages = 10 } = body

    // Usar credenciales de variables de entorno
    const user = process.env.CVA_USER
    const password = process.env.CVA_PASSWORD

    if (!user || !password) {
      return NextResponse.json(
        { error: 'Credenciales CVA no configuradas en el servidor' },
        { status: 500 }
      )
    }

    // 1. Autenticar con CVA y obtener token
    const authResponse = await fetch('https://apicvaservices.grupocva.com/api/v2/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password })
    })

    if (!authResponse.ok) {
      return NextResponse.json(
        { error: 'Credenciales inválidas de CVA' },
        { status: 401 }
      )
    }

    const authData = await authResponse.json()
    const token = authData.token

    // 2. Obtener productos de CVA en lotes limitados (máximo 10 páginas por llamada)
    const baseUrl = 'https://apicvaservices.grupocva.com/api/v2/catalogo_clientes/lista_precios'
    let todosLosArticulos: any[] = []
    let paginaActual = startPage
    let totalPaginas = 1
    let paginasProcesadas = 0

    console.log(`[v0] Iniciando descarga desde página ${startPage}, máximo ${maxPages} páginas...`)

    // Iterar solo por el número máximo de páginas permitidas
    do {
      const params = new URLSearchParams()
      params.append('page', paginaActual.toString())

      if (filters?.marca) params.append('marca', filters.marca)
      if (filters?.grupo) params.append('grupo', filters.grupo)
      if (filters?.exist) params.append('exist', filters.exist.toString())
      if (filters?.completos) params.append('completos', '1')

      const url = `${baseUrl}?${params.toString()}`

      // 3. Obtener productos de CVA página por página
      const productosResponse = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!productosResponse.ok) {
        return NextResponse.json(
          { error: 'Error al obtener productos de CVA' },
          { status: 500 }
        )
      }

      const data = await productosResponse.json()
      const articulos = data.articulos || []

      todosLosArticulos = todosLosArticulos.concat(articulos)

      // CVA devuelve paginación en el formato: {"paginacion": {"total_paginas": 290, "pagina": 3}}
      if (data.paginacion) {
        totalPaginas = data.paginacion.total_paginas || 1
      }

      paginasProcesadas++
      console.log(`[v0] Descargada página ${paginaActual}/${totalPaginas}, productos acumulados: ${todosLosArticulos.length}`)

      paginaActual++

    } while (paginaActual <= totalPaginas && paginasProcesadas < maxPages)

    const hayMasPaginas = paginaActual <= totalPaginas
    console.log(`[v0] Descarga de lote completada: ${todosLosArticulos.length} productos. ${hayMasPaginas ? `Quedan ${totalPaginas - paginaActual + 1} páginas más.` : 'Todas las páginas completadas.'}`)
    const articulos = todosLosArticulos

    // 4. Importar productos a la base de datos usando UPSERT por lotes
    const BATCH_SIZE = 100 // Procesar 100 productos a la vez
    let totalProcesados = 0
    let errores = 0
    let actualizados = 0

    console.log(`[v0] Iniciando importación de ${articulos.length} productos en lotes de ${BATCH_SIZE}`)

    // Procesar en chunks para evitar saturar la base de datos
    for (let i = 0; i < articulos.length; i += BATCH_SIZE) {
      const batch = articulos.slice(i, i + BATCH_SIZE)

      try {
        // Preparar valores para batch insert
        const values = batch.map(articulo => {
          const precio = articulo.moneda === 'Pesos'
            ? articulo.precio
            : articulo.precio * 20 // Conversión aproximada

          return {
            sku: articulo.clave,
            nombre: articulo.descripcion?.substring(0, 255) || articulo.clave,
            descripcion: articulo.descripcion || '',
            precio_unitario: precio,
            categoria: articulo.grupo || 'Sin categoría',
            unidad: 'pieza',
            activo: articulo.disponible > 0,
            proveedor: 'CVA'
          }
        })

        // Construir valores para UPSERT masivo
        const valuesPlaceholders = values.map((_, idx) => {
          const base = idx * 8
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`
        }).join(',')

        const flatValues = values.flatMap(p => [
          p.sku,
          p.nombre,
          p.descripcion,
          p.precio_unitario,
          p.categoria,
          p.unidad,
          p.activo,
          p.proveedor
        ])

        try {
          // Usar UPSERT masivo en una sola query - mucho más rápido
          await sql.unsafe(`
            INSERT INTO productos (sku, nombre, descripcion, precio_unitario, categoria, unidad, activo, proveedor, ultima_actualizacion_precio)
            VALUES ${valuesPlaceholders}
            ON CONFLICT (sku) 
            DO UPDATE SET
              nombre = EXCLUDED.nombre,
              descripcion = EXCLUDED.descripcion,
              precio_unitario = EXCLUDED.precio_unitario,
              categoria = EXCLUDED.categoria,
              activo = EXCLUDED.activo,
              proveedor = EXCLUDED.proveedor,
              ultima_actualizacion_precio = NOW(),
              updated_at = NOW()
          `, flatValues)

          totalProcesados += values.length
        } catch (error) {
          console.error(`[Auth] Error en batch insert: ${error}`)
          // Fallback: intentar uno por uno si falla el batch
          for (const producto of values) {
            try {
              await sql`
                INSERT INTO productos (sku, nombre, descripcion, precio_unitario, categoria, unidad, activo, proveedor, ultima_actualizacion_precio)
                VALUES (
                  ${producto.sku},
                  ${producto.nombre},
                  ${producto.descripcion},
                  ${producto.precio_unitario},
                  ${producto.categoria},
                  ${producto.unidad},
                  ${producto.activo},
                  ${producto.proveedor},
                  NOW()
                )
                ON CONFLICT (sku) 
                DO UPDATE SET
                  nombre = EXCLUDED.nombre,
                  descripcion = EXCLUDED.descripcion,
                  precio_unitario = EXCLUDED.precio_unitario,
                  categoria = EXCLUDED.categoria,
                  activo = EXCLUDED.activo,
                  proveedor = EXCLUDED.proveedor,
                  ultima_actualizacion_precio = NOW(),
                  updated_at = NOW()
              `
              totalProcesados++
            } catch (error) {
              console.error(`[v0] Error importando producto ${producto.sku}:`, error)
              errores++
            }
          }
        }

        console.log(`[v0] Procesados ${totalProcesados}/${articulos.length} productos, ${errores} errores`)

      } catch (error) {
        console.error(`[v0] Error fatal en lote ${i}-${i + BATCH_SIZE}:`, error)
        errores += batch.length
      }
    }

    console.log(`[v0] Importación finalizada: ${totalProcesados} exitosos, ${errores} errores de ${articulos.length} total`)

    return NextResponse.json({
      success: totalProcesados > 0,
      total: articulos.length,
      importados: totalProcesados,
      errores,
      hayMasPaginas,
      paginaActual: paginaActual,
      totalPaginas,
      mensaje: `Lote completado: ${totalProcesados} productos procesados. ${hayMasPaginas ? `Continuar desde página ${paginaActual}/${totalPaginas}` : 'Importación completa.'}`
    })

  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)
    console.error('[v0] Error en importación CVA:', errorMsg)
    return NextResponse.json(
      { error: errorMsg || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
