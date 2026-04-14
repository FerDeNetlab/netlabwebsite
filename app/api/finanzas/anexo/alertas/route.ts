/**
 * GET /api/finanzas/anexo/alertas
 * Obtiene alertas detectadas automáticamente + registradas manualmente
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAlertasFinancieras } from '@/lib/finanzas-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    const alertas = await getAlertasFinancieras(mes, ano);

    return NextResponse.json(
      {
        success: true,
        data: alertas,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/alertas:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
