/**
 * GET /api/finanzas/anexo/bolsas
 * POST /api/finanzas/anexo/bolsas (crear/actualizar bolsa presupuestaria)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getMatrizBolsas } from '@/lib/finanzas-helpers';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    const matriz = await getMatrizBolsas(mes, ano);

    return NextResponse.json(
      {
        success: true,
        data: matriz,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/bolsas:', error);
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
    const {
      mes,
      ano,
      bolsa_nombre,
      presupuesto_mensual,
      porcentaje_asignado,
      uso_descripcion,
    } = body;

    if (!mes || !ano || !bolsa_nombre) {
      return NextResponse.json(
        { success: false, error: 'mes, ano y bolsa_nombre son requeridos' },
        { status: 400 }
      );
    }

    // INSERT OR UPDATE
    const resultRaw = await sql`
      INSERT INTO bolsas_presupuestarias 
        (mes, ano, bolsa_nombre, presupuesto_mensual, porcentaje_asignado, uso_descripcion)
      VALUES (${mes}, ${ano}, ${bolsa_nombre}, ${presupuesto_mensual}, ${porcentaje_asignado}, ${uso_descripcion})
      ON CONFLICT (mes, ano, bolsa_nombre) 
      DO UPDATE SET 
        presupuesto_mensual = ${presupuesto_mensual},
        porcentaje_asignado = ${porcentaje_asignado},
        uso_descripcion = ${uso_descripcion},
        updated_at = NOW()
      RETURNING *
    `;
    const result = resultRaw as Record<string, unknown>[];

    return NextResponse.json(
      {
        success: true,
        data: result[0] ?? null,
        message: 'Bolsa presupuestaria guardada',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en POST /api/finanzas/anexo/bolsas:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
