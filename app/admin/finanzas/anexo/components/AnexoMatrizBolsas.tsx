/**
 * Componente: Matriz de Bolsas Presupuestarias
 * Muestra distribución de presupuesto por bolsa
 */

import { Card } from '@/components/ui/card';
import { MatrizBolsas, BolsaPresupuestaria } from '@/lib/types/anexo';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  data: MatrizBolsas;
  mes: number;
  ano: number;
}

const BOLSA_COLORES: Record<BolsaPresupuestaria, string> = {
  [BolsaPresupuestaria.OPERACION_FIJA]: 'bg-red-100 border-red-300',
  [BolsaPresupuestaria.OPERACION_VARIABLE]: 'bg-yellow-100 border-yellow-300',
  [BolsaPresupuestaria.RESERVA]: 'bg-blue-100 border-blue-300',
  [BolsaPresupuestaria.CRECIMIENTO]: 'bg-green-100 border-green-300',
  [BolsaPresupuestaria.UTILIDAD]: 'bg-purple-100 border-purple-300',
};

export default function AnexoMatrizBolsas({ data, mes, ano }: Props) {
  const [editando, setEditando] = useState(false);

  const handleGuardar = async (bolsa: BolsaPresupuestaria) => {
    try {
      await fetch('/api/finanzas/anexo/bolsas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mes,
          ano,
          bolsa_nombre: bolsa,
          presupuesto_mensual: 0,
          porcentaje_asignado: 0,
        }),
      });
      setEditando(false);
    } catch (error) {
      console.error('Error guardando bolsa:', error);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">3. Matriz de Bolsas Presupuestarias</h2>
          <Button onClick={() => setEditando(!editando)} variant="outline" size="sm">
            {editando ? 'Cancelar' : 'Editar'}
          </Button>
        </div>

        {/* Grid de bolsas */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {data.bolsas.map((bolsa) => (
            <div
              key={bolsa.bolsa}
              className={`p-4 rounded border-2 ${BOLSA_COLORES[bolsa.bolsa as BolsaPresupuestaria]}`}
            >
              <div className="font-semibold capitalize text-sm mb-2">
                {bolsa.bolsa.replace(/_/g, ' ')}
              </div>
              <div className="text-2xl font-bold mb-1">
                ${bolsa.presupuesto_mensual.toLocaleString()}
              </div>
              <div className="text-xs text-gray-600">{bolsa.porcentaje_asignado}% del total</div>
              <div className="text-xs text-gray-500 mt-2 italic">{bolsa.uso}</div>
            </div>
          ))}
        </div>

        {/* Validación de cobertura */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded">
          <h3 className="font-semibold mb-3">Validación de Cobertura de Gastos Fijos</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Gastos Fijos Reales</div>
              <div className="text-2xl font-bold">
                ${data.validacion_cobertura.gastos_fijos.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Ingreso Fijo Disponible</div>
              <div className="text-2xl font-bold">
                ${data.validacion_cobertura.ingreso_fijo.toLocaleString()}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">% Cobertura Pura</div>
              <div
                className={`text-2xl font-bold ${
                  data.validacion_cobertura.porcentaje_cobertura_fija_pura >= 100
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {data.validacion_cobertura.porcentaje_cobertura_fija_pura.toFixed(1)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">% Cobertura Ampliada</div>
              <div
                className={`text-2xl font-bold ${
                  data.validacion_cobertura.porcentaje_cobertura_ampliada >= 100
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {data.validacion_cobertura.porcentaje_cobertura_ampliada.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
