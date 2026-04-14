/**
 * Componente: Matriz de Ingresos
 * Muestra tabla de ingresos por cliente y tipo
 */

import { Card } from '@/components/ui/card';
import { MatrizIngresos } from '@/lib/types/anexo';

interface Props {
  data: MatrizIngresos;
  mes: number;
  ano: number;
}

export default function AnexoMatrizIngresos({ data }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">1. Matriz de Ingresos</h2>

        {/* Tabla de ingresos por cliente */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Cliente</th>
                <th className="text-left py-2 px-4">Tipo Ingreso</th>
                <th className="text-right py-2 px-4">Monto Mensual</th>
                <th className="text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.filas.map((fila, idx) => (
                <tr key={idx} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{fila.cliente_nombre}</td>
                  <td className="py-2 px-4">
                    <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100">
                      {fila.tipo_ingreso}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right font-mono">
                    ${fila.monto_mensual.toLocaleString()}
                  </td>
                  <td className="py-2 px-4">{fila.estatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen por tipo */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(data.resumenPorTipo).map(([tipo, resumen]) => (
            <div key={tipo} className="bg-gray-50 p-4 rounded">
              <div className="text-sm font-medium text-gray-600 capitalize">{tipo}</div>
              <div className="text-2xl font-bold mt-2">
                ${resumen.monto_mensual.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {resumen.porcentaje_total.toFixed(1)}% • {resumen.certidumbre}
              </div>
            </div>
          ))}
        </div>

        {/* Lecturas clave */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <div className="font-semibold mb-2">Lecturas Clave</div>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>Total ingreso mensual:</strong> ${data.totales.ingreso_mensual_real.toLocaleString()}
            </li>
            <li>
              <strong>Ingreso fijo estructural:</strong> ${data.totales.ingreso_fijo_estructural.toLocaleString()}
            </li>
            <li>
              <strong>Dependencia variable:</strong> {data.totales.dependencia_variable_porcentaje.toFixed(1)}%
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
