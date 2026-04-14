/**
 * Componente: Pipeline Comercial
 * Muestra oportunidades en cierre con probabilidad ponderada
 */

import { Card } from '@/components/ui/card';
import { PipelineComercial } from '@/lib/types/anexo';

interface Props {
  data: PipelineComercial;
  mes: number;
  ano: number;
}

export default function AnexoPipeline({ data }: Props) {
  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">5. Pipeline Comercial</h2>

        {data.proyectos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay oportunidades en cierre (propuesta + negociación)</p>
          </div>
        ) : (
          <>
            {/* Tabla de oportunidades */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-2 px-4">Cliente</th>
                    <th className="text-left py-2 px-4">Tipo Ingreso</th>
                    <th className="text-right py-2 px-4">Monto</th>
                    <th className="text-center py-2 px-4">Probabilidad</th>
                    <th className="text-right py-2 px-4">Impacto Ponderado</th>
                  </tr>
                </thead>
                <tbody>
                  {data.proyectos.map((proyecto, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{proyecto.cliente}</td>
                      <td className="py-2 px-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100">
                          {proyecto.tipo_ingreso}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-right font-mono">
                        ${proyecto.monto.toLocaleString()}
                      </td>
                      <td className="py-2 px-4 text-center">{proyecto.probabilidad}%</td>
                      <td className="py-2 px-4 text-right font-mono font-bold">
                        ${proyecto.impacto_mensual.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 border border-green-200 p-4 rounded">
                <div className="text-sm text-gray-600">Ingreso Potencial Posible</div>
                <div className="text-3xl font-bold mt-2">
                  ${data.impacto_potencial.ingreso_adicional_posible.toLocaleString()}
                </div>
              </div>
              <div className="bg-purple-50 border border-purple-200 p-4 rounded">
                <div className="text-sm text-gray-600">Impacto en Cobertura Fija</div>
                <div className="text-3xl font-bold mt-2">
                  ${data.impacto_potencial.impacto_en_cobertura_fija.toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
