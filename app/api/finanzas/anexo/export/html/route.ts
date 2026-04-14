/**
 * GET /api/finanzas/anexo/export/html
 * Genera HTML imprimible del Anexo Financiero
 * 
 * Query params:
 *   - mes: number (1-12)
 *   - ano: number (ej: 2026)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generarAnexoFinanciero } from '@/lib/finanzas-helpers';
import { registrarExport as registrarExportFase2 } from '@/lib/finanzas-fase2-helpers';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const mes = parseInt(searchParams.get('mes') || new Date().getMonth() + 1 + '');
    const ano = parseInt(searchParams.get('ano') || new Date().getFullYear() + '');

    if (isNaN(mes) || mes < 1 || mes > 12 || isNaN(ano) || ano < 2020 || ano > 2099) {
      return NextResponse.json(
        { success: false, error: 'Parámetros inválidos' },
        { status: 400 }
      );
    }

    // Generar anexo
    const anexo = await generarAnexoFinanciero(mes, ano);

    // Registrar descarga
    try {
      await registrarExportFase2(mes, ano, 'pdf', 'HTML', `Anexo_${mes}_${ano}.html`);
    } catch (e) {
      console.error('Error registrando export:', e);
    }

    // Generar HTML
    const html = generarHTMLAnexo(anexo);

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `attachment; filename="Anexo_${mes}_${ano}.html"`,
      },
    });
  } catch (error) {
    console.error('Error en GET /api/finanzas/anexo/export/html:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

function generarHTMLAnexo(anexo: any): string {
  const mesNombre = new Date(anexo.ano, anexo.mes - 1).toLocaleString('es-MX', {
    month: 'long',
    year: 'numeric',
  });

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Anexo Financiero ${mesNombre}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: white;
      padding: 20px;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none; }
      page { page-break-after: always; }
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
    }
    header {
      border-bottom: 3px solid #374151;
      padding-bottom: 20px;
      margin-bottom: 30px;
      text-align: center;
    }
    h1 {
      font-size: 28px;
      margin-bottom: 5px;
      color: #1f2937;
    }
    .subtitle {
      font-size: 16px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    .meta {
      font-size: 12px;
      color: #9ca3af;
    }
    section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    section h2 {
      font-size: 20px;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-bottom: 20px;
      color: #1f2937;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-bottom: 20px;
    }
    @media print { .metrics { grid-template-columns: repeat(4, 1fr); } }
    .metric {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 15px;
      text-align: center;
    }
    .metric-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 600;
      margin-bottom: 8px;
      text-transform: uppercase;
    }
    .metric-value {
      font-size: 24px;
      font-weight: bold;
      color: #1f2937;
    }
    .metric-detail {
      font-size: 11px;
      color: #9ca3af;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    th {
      background: #f3f4f6;
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      text-transform: uppercase;
    }
    td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      font-size: 13px;
    }
    tr:nth-child(even) { background: #f9fafb; }
    .text-right { text-align: right; }
    .text-center { text-align: center; }
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-fijo { background: #fee2e2; color: #991b1b; }
    .badge-runrate { background: #fef3c7; color: #92400e; }
    .badge-variable { background: #dbeafe; color: #1e40af; }
    .alert {
      border-left: 4px solid;
      padding: 15px;
      margin-bottom: 15px;
      border-radius: 4px;
      font-size: 13px;
    }
    .alert-critical { border-color: #dc2626; background: #fee2e2; color: #991b1b; }
    .alert-warning { border-color: #f59e0b; background: #fef3c7; color: #92400e; }
    .alert-info { border-color: #3b82f6; background: #dbeafe; color: #1e40af; }
    .footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
      margin-top: 40px;
      text-align: center;
      font-size: 11px;
      color: #9ca3af;
    }
    .print-button {
      background: #1f2937;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .print-button:hover { background: #111827; }
  </style>
</head>
<body>
  <div class="container">
    <button class="print-button no-print" onclick="window.print()">🖨️ Imprimir / Descargar PDF</button>
    
    <header>
      <h1>Anexo Financiero</h1>
      <div class="subtitle">Netlab • Matriz Operativa y Presupuesto</div>
      <div class="subtitle">${mesNombre}</div>
      <div class="meta">Generado: ${new Date().toLocaleString('es-MX')}</div>
    </header>

    <!-- 1. MATRIZ DE INGRESOS -->
    <section>
      <h2>1. Matriz de Ingresos</h2>
      <div class="metrics">
        <div class="metric">
          <div class="metric-label">Total Ingresos Mensuales</div>
          <div class="metric-value">$${anexo.matriz_ingresos.totales.ingreso_mensual_real.toLocaleString()}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Ingresos Fijo Estructural</div>
          <div class="metric-value">$${anexo.matriz_ingresos.totales.ingreso_fijo_estructural.toLocaleString()}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Dependencia Variable</div>
          <div class="metric-value">${anexo.matriz_ingresos.totales.dependencia_variable_porcentaje.toFixed(1)}%</div>
        </div>
        <div class="metric">
          <div class="metric-label">Clientes Activos</div>
          <div class="metric-value">${anexo.matriz_ingresos.filas.length}</div>
        </div>
      </div>
      <table>
        <thead><tr><th>Cliente</th><th>Tipo</th><th>Monto Mensual</th><th>%</th></tr></thead>
        <tbody>
          ${anexo.matriz_ingresos.filas.map((f: any) => `
            <tr>
              <td>${f.cliente_nombre}</td>
              <td><span class="badge badge-${f.tipo_ingreso === 'fijo' ? 'fijo' : f.tipo_ingreso === 'run_rate' ? 'runrate' : 'variable'}">${f.tipo_ingreso}</span></td>
              <td class="text-right">$${f.monto_mensual.toLocaleString()}</td>
              <td class="text-center">${((f.monto_mensual / anexo.matriz_ingresos.totales.ingreso_mensual_real) * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </section>

    <!-- 2. MATRIZ DE GASTOS -->
    <section>
      <h2>2. Matriz de Gastos</h2>
      <div class="metrics">
        <div class="metric">
          <div class="metric-label">Gastos Fijos</div>
          <div class="metric-value">$${anexo.matriz_gastos.totales.total_fijos.toLocaleString()}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Gastos Variables (Est.)</div>
          <div class="metric-value">$${anexo.matriz_gastos.totales.total_variables_estimados.toLocaleString()}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Total Egresos</div>
          <div class="metric-value">$${anexo.matriz_gastos.totales.total_egresos.toLocaleString()}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Balance</div>
          <div class="metric-value" style="color: ${(anexo.matriz_ingresos.totales.ingreso_mensual_real - anexo.matriz_gastos.totales.total_egresos) >= 0 ? '#16a34a' : '#dc2626'}">
            $${(anexo.matriz_ingresos.totales.ingreso_mensual_real - anexo.matriz_gastos.totales.total_egresos).toLocaleString()}
          </div>
        </div>
      </div>
    </section>

    <!-- 3. BOLSAS PRESUPUESTARIAS -->
    <section>
      <h2>3. Bolsas Presupuestarias</h2>
      <div class="metrics">
        ${anexo.matriz_bolsas.bolsas.map((b: any) => `
          <div class="metric">
            <div class="metric-label">${b.bolsa.replace(/_/g, ' ')}</div>
            <div class="metric-value">$${b.presupuesto_mensual.toLocaleString()}</div>
            <div class="metric-detail">${b.porcentaje_asignado}% del total</div>
          </div>
        `).join('')}
      </div>
    </section>

    <!-- 4. KPIs CLAVE -->
    <section>
      <h2>4. Indicadores Clave</h2>
      <div class="metrics">
        <div class="metric">
          <div class="metric-label">Cobertura Gastos Fijos (Pura)</div>
          <div class="metric-value" style="color: ${anexo.matriz_bolsas.validacion_cobertura.porcentaje_cobertura_fija_pura >= 100 ? '#16a34a' : '#dc2626'}">
            ${anexo.matriz_bolsas.validacion_cobertura.porcentaje_cobertura_fija_pura.toFixed(1)}%
          </div>
        </div>
        <div class="metric">
          <div class="metric-label">Cobertura Ampliada (con Run Rate)</div>
          <div class="metric-value" style="color: ${anexo.matriz_bolsas.validacion_cobertura.porcentaje_cobertura_ampliada >= 100 ? '#16a34a' : '#dc2626'}">
            ${anexo.matriz_bolsas.validacion_cobertura.porcentaje_cobertura_ampliada.toFixed(1)}%
          </div>
        </div>
        <div class="metric">
          <div class="metric-label">Meses de Cobertura</div>
          <div class="metric-value">${anexo.reserva_operativa.meses_cubiertos.toFixed(1)}</div>
        </div>
        <div class="metric">
          <div class="metric-label">Pipeline Ponderado</div>
          <div class="metric-value">$${anexo.pipeline_comercial.impacto_potencial.ingreso_adicional_posible.toLocaleString()}</div>
        </div>
      </div>
    </section>

    <!-- 5. ALERTAS -->
    ${anexo.alertas.alertas.length > 0 ? `
      <section>
        <h2>5. Alertas Detectadas</h2>
        ${anexo.alertas.alertas.map((a: any) => {
          let alertClass = 'alert-info';
          let icon = 'ℹ️';
          if (a.severidad === 'critical') { alertClass = 'alert-critical'; icon = '🚨'; }
          else if (a.severidad === 'warning') { alertClass = 'alert-warning'; icon = '⚠️'; }
          return `<div class="alert ${alertClass}">${icon} <strong>${a.tipo.replace(/_/g, ' ')}</strong>: ${a.descripcion}</div>`;
        }).join('')}
      </section>
    ` : ''}

    <!-- FOOTER -->
    <footer class="footer">
      <p>Este documento fue generado automáticamente desde el módulo de Anexo Financiero.</p>
      <p>Fecha: ${new Date().toLocaleString('es-MX')} • Mensual • Confidencial</p>
    </footer>
  </div>
</body>
</html>
  `.trim();
}
