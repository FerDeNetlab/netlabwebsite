/**
 * GET /api/finanzas/anexo/comparativa
 * Compara dos anexos y devuelve variaciones
 */

import { NextRequest, NextResponse } from 'next/server';
import { compararAnexos } from '@/lib/finanzas-fase2-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    const mes1 = parseInt(searchParams.get('mes1') || '1');
    const ano1 = parseInt(searchParams.get('ano1') || new Date().getFullYear() - 1 + '');
    const mes2 = parseInt(searchParams.get('mes2') || new Date().getMonth() + 1 + '');
    const ano2 = parseInt(searchParams.get('ano2') || new Date().getFullYear() + '');

    // Validar parámetros
    if (
      isNaN(mes1) || mes1 < 1 || mes1 > 12 ||
      isNaN(ano1) || ano1 < 2020 || ano1 > 2099 ||
      isNaN(mes2) || mes2 < 1 || mes2 > 12 ||
      isNaN(ano2) || ano2 < 2020 || ano2 > 2099
    ) {
      return NextResponse.json(
        { success: false, error: 'Parámetros de fecha inválidos' },
        { status: 400 }
      );
    }

    const comparativa = await compararAnexos(mes1, ano1, mes2, ano2);

    if (!comparativa) {
      return NextResponse.json(
        { success: false, error: 'No hay anexos para comparar en esos períodos' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: comparativa,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/comparativa:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
