/**
 * Componente: Matriz de Gastos
 * Muestra tabla de gastos fijos y variables
 */

import { Card } from '@/components/ui/card';
import { MatrizGastos } from '@/lib/types/anexo';

interface Props {
  data: MatrizGastos;
  mes: number;
  ano: number;
}

export default function AnexoMatrizGastos({ data }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">2. Matriz de Gastos</h2>

        {/* Gastos Fijos */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Costos Fijos</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-4">Concepto</th>
                  <th className="text-left py-2 px-4">Responsable</th>
                  <th className="text-right py-2 px-4">Monto Mensual</th>
                </tr>
              </thead>
              <tbody>
                {data.costos_fijos.map((gasto, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{gasto.concepto}</td>
                    <td className="py-2 px-4">{gasto.responsable || '-'}</td>
                    <td className="py-2 px-4 text-right font-mono">
                      ${gasto.monto_mensual.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-right mt-2 font-semibold">
            Total Fijos: ${data.totales.total_fijos.toLocaleString()}
          </div>
        </div>

        {/* Gastos Variables */}
        {data.costos_variables.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Costos Variables</h3>
            <div className="space-y-2">
              {data.costos_variables.map((gasto, idx) => (
                <div key={idx} className="bg-gray-50 p-3 rounded flex justify-between">
                  <div>
                    <div className="font-medium">{gasto.concepto}</div>
                    <div className="text-xs text-gray-600">Base: {gasto.base_calculo}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{gasto.valor}%</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-right mt-2 font-semibold">
              Total Variables Estimados: ${data.totales.total_variables_estimados.toLocaleString()}
            </div>
          </div>
        )}

        {/* Resumen */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Fijos</div>
              <div className="text-2xl font-bold">${data.totales.total_fijos.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Variables</div>
              <div className="text-2xl font-bold">
                ${data.totales.total_variables_estimados.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Total Egresos</div>
              <div className="text-2xl font-bold">${data.totales.total_egresos.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
