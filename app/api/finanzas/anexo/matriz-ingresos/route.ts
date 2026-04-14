/**
 * GET /api/finanzas/anexo/matriz-ingresos
 * POST /api/finanzas/anexo/matriz-ingresos (para actualizar clasificaciones tipo_ingreso de facturas)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMatrizIngresos } from '@/lib/finanzas-helpers';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    const matriz = await getMatrizIngresos(mes, ano);

    return NextResponse.json(
      {
        success: true,
        data: matriz,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/matriz-ingresos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { factura_id, tipo_ingreso } = body;

    if (!factura_id || !tipo_ingreso) {
      return NextResponse.json(
        { success: false, error: 'factura_id y tipo_ingreso son requeridos' },
        { status: 400 }
      );
    }

    await sql`
      UPDATE facturas
      SET tipo_ingreso = ${tipo_ingreso}
      WHERE id = ${factura_id}
    `;

    return NextResponse.json(
      {
        success: true,
        message: 'Factura actualizada',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en POST /api/finanzas/anexo/matriz-ingresos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
