/**
 * GET /api/finanzas/anexo/historico
 * Obtiene lista de anexos históricos almacenados
 * 
 * POST /api/finanzas/anexo/historico
 * Guarda el Anexo Financiero completo en el historial
 * 
 * POST Body:
 *   - anexo: AnexoFinanciero
 *   - notas?: string
 *   - generado_por?: string
 */

import { NextRequest, NextResponse } from 'next/server';
import { obtenerHistorialAnexos, guardarAnexoEnHistorial } from '@/lib/finanzas-fase2-helpers';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { anexo, notas, generado_por } = body;

    if (!anexo) {
      return NextResponse.json(
        { success: false, error: 'Anexo requerido' },
        { status: 400 }
      );
    }

    // Validar que sea un AnexoFinanciero válido
    if (!anexo.mes || !anexo.ano || !anexo.matriz_ingresos) {
      return NextResponse.json(
        { success: false, error: 'Datos de anexo inválidos' },
        { status: 400 }
      );
    }

    await guardarAnexoEnHistorial(anexo, generado_por, notas);

    return NextResponse.json({
      success: true,
      message: `Anexo ${anexo.mes}/${anexo.ano} guardado en historial`,
    });
  } catch (error) {
    console.error('Error en POST /api/finanzas/anexo/historico:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    if (isNaN(ano) || ano < 2020 || ano > 2099) {
      return NextResponse.json(
        { success: false, error: 'Año inválido' },
        { status: 400 }
      );
    }

    const historial = await obtenerHistorialAnexos(ano);

    return NextResponse.json(
      {
        success: true,
        data: historial,
        total: historial.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/historico:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
