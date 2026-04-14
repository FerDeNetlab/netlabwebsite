/**
 * GET /api/finanzas/anexo
 * Obtiene el Anexo Financiero completo para un mes/año específico
 * 
 * Query params:
 *   - mes: number (1-12)
 *   - ano: number (ej: 2026)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generarAnexoFinanciero } from '@/lib/finanzas-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    // Validar parámetros
    if (isNaN(mes) || mes < 1 || mes > 12) {
      return NextResponse.json(
        { success: false, error: 'Mes inválido (debe ser 1-12)' },
        { status: 400 }
      );
    }

    if (isNaN(ano) || ano < 2020 || ano > 2099) {
      return NextResponse.json(
        { success: false, error: 'Año inválido' },
        { status: 400 }
      );
    }

    // Generar Anexo
    const anexo = await generarAnexoFinanciero(mes, ano);

    return NextResponse.json(
      {
        success: true,
        data: anexo,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
