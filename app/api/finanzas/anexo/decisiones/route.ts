/**
 * GET /api/finanzas/anexo/decisiones
 * POST /api/finanzas/anexo/decisiones (crear/actualizar decisión)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getDecisionesJunta } from '@/lib/finanzas-helpers';
import { sql } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    const decisiones = await getDecisionesJunta(mes, ano);

    return NextResponse.json(
      {
        success: true,
        data: decisiones,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/decisiones:', error);
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
    const { mes, ano, pregunta, respuesta, decision_detalle, responsable_decision } = body;

    if (!mes || !ano || !pregunta) {
      return NextResponse.json(
        { success: false, error: 'mes, ano y pregunta son requeridos' },
        { status: 400 }
      );
    }

    // INSERT
    const result = await sql`
      INSERT INTO decisiones_junta 
        (mes, ano, pregunta, respuesta, decision_detalle, responsable_decision, completado)
      VALUES (${mes}, ${ano}, ${pregunta}, ${respuesta ?? null}, ${decision_detalle ?? null}, ${responsable_decision ?? null}, ${respuesta !== undefined})
      RETURNING *
    `;

    return NextResponse.json(
      {
        success: true,
        data: result[0],
        message: 'Decisión guardada',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en POST /api/finanzas/anexo/decisiones:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
