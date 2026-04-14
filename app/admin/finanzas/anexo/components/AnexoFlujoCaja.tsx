/**
 * Componente: Flujo de Caja
 * Muestra proyección de caja 4 semanas
 */

import { Card } from '@/components/ui/card';
import { FlujoCaja } from '@/lib/types/anexo';

interface Props {
  data: FlujoCaja;
  mes: number;
  ano: number;
}

export default function AnexoFlujoCaja({ data }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">4. Flujo de Caja</h2>

        {/* Caja Actual */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Caja Actual</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-sm text-gray-600">Saldo en Banco</div>
              <div className="text-2xl font-bold mt-2">
                ${data.caja_actual.saldo_en_banco.toLocaleString()}
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded">
              <div className="text-sm text-gray-600">Cuentas por Cobrar</div>
              <div className="text-2xl font-bold mt-2">
                ${data.caja_actual.cuentas_por_cobrar.toLocaleString()}
              </div>
            </div>
            <div className="bg-red-50 p-4 rounded">
              <div className="text-sm text-gray-600">Cuentas por Pagar</div>
              <div className="text-2xl font-bold mt-2">
                ${data.caja_actual.cuentas_por_pagar.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Flujo 4 semanas */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Flujo Proyectado (4 Semanas)</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2 px-4">Semana</th>
                  <th className="text-right py-2 px-4">Ingresos Esperados</th>
                  <th className="text-right py-2 px-4">Ingresos Comprometidos</th>
                  <th className="text-right py-2 px-4">Egresos</th>
                  <th className="text-right py-2 px-4">Balance</th>
                </tr>
              </thead>
              <tbody>
                {data.flujo_proyectado_4_semanas.map((semana) => (
                  <tr key={semana.semana} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">Semana {semana.semana}</td>
                    <td className="py-2 px-4 text-right font-mono">
                      ${semana.ingresos_esperados.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      ${semana.ingresos_comprometidos.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right font-mono">
                      ${semana.egresos.toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold">
                      ${semana.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lecturas clave */}
        {data.lecturas_clave && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <div className="font-semibold mb-2">Lecturas Clave</div>
            <ul className="space-y-1 text-sm">
              {data.lecturas_clave.margen_maniobra_semanas && (
                <li>
                  <strong>Margen de maniobra:</strong> {data.lecturas_clave.margen_maniobra_semanas} semanas
                </li>
              )}
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
