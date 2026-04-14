/**
 * GET /api/finanzas/anexo/pipeline
 * Obtiene oportunidades del CRM en etapas finalización (propuesta + negociación)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPipelineComercial } from '@/lib/finanzas-helpers';

export async function GET(_request: NextRequest) {
  try {
    const pipeline = await getPipelineComercial();

    return NextResponse.json(
      {
        success: true,
        data: pipeline,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/pipeline:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
