/**
 * GET /api/finanzas/anexo/matriz-gastos
 * Obtiene matriz de gastos para el mes/año especificado
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMatrizGastos } from '@/lib/finanzas-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    const matriz = await getMatrizGastos(mes, ano);

    return NextResponse.json(
      {
        success: true,
        data: matriz,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/matriz-gastos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
