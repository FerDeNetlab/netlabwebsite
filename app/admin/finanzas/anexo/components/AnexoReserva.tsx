/**
 * Componente: Reserva Operativa
 * Muestra meses de cobertura
 */

import { Card } from '@/components/ui/card';
import { ReservaOperativa } from '@/lib/types/anexo';

interface Props {
  data: ReservaOperativa;
  mes: number;
  ano: number;
}

export default function AnexoReserva({ data }: Props) {
  const cobertura = data.meses_cubiertos;
  const severidad = cobertura < 2 ? 'critical' : cobertura < 3 ? 'warning' : 'safe';
  const colorBg = severidad === 'critical' ? 'bg-red-50' : severidad === 'warning' ? 'bg-yellow-50' : 'bg-green-50';
  const colorBorder = severidad === 'critical' ? 'border-red-200' : severidad === 'warning' ? 'border-yellow-200' : 'border-green-200';

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">6. Reserva Operativa</h2>

        <div className={`${colorBg} border ${colorBorder} p-6 rounded mb-6`}>
          <div className="text-sm font-medium text-gray-600 mb-2">Meses de Cobertura</div>
          <div className="text-5xl font-bold mb-2">{cobertura.toFixed(1)}</div>
          <div className="text-sm">
            {severidad === 'critical' && '⚠️ CRÍTICO: Menos de 2 meses de cobertura'}
            {severidad === 'warning' && '⚠️ ATENCIÓN: 2-3 meses de cobertura'}
            {severidad === 'safe' && '✅ SEGURO: 3+ meses de cobertura'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Gastos Fijos Mensuales</div>
            <div className="text-2xl font-bold mt-2">
              ${data.gastos_fijos_mensuales.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-sm text-gray-600">Caja Disponible</div>
            <div className="text-2xl font-bold mt-2">
              ${data.caja_disponible.toLocaleString()}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
