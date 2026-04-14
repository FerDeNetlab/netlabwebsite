/**
 * Componente: Decisiones de Junta
 * Muestra checklist de decisiones
 */

import { Card } from '@/components/ui/card';
import { DecisionesJunta } from '@/lib/types/anexo';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  data: DecisionesJunta;
  mes: number;
  ano: number;
}

export default function AnexoDecisiones({ data, mes, ano }: Props) {
  const [decisiones, setDecisiones] = useState(data.obligatorias);
  const [saving, setSaving] = useState(false);

  const handleToggle = async (id: string, completado: boolean) => {
    setSaving(true);
    try {
      const decision = decisiones.find((d) => d.id === id);
      if (decision) {
        await fetch('/api/finanzas/anexo/decisiones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            mes,
            ano,
            pregunta: decision.pregunta,
            respuesta: !completado,
            decision_detalle: decision.detalles,
          }),
        });

        setDecisiones(
          decisiones.map((d) => (d.id === id ? { ...d, completado: !completado } : d))
        );
      }
    } catch (error) {
      console.error('Error guardando decisión:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">7. Decisiones de la Junta</h2>

        {/* Obligatorias */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Decisiones Obligatorias</h3>
          <div className="space-y-2">
            {decisiones.map((decision) => (
              <div key={decision.id} className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50">
                <Checkbox
                  checked={decision.completado}
                  onCheckedChange={() => handleToggle(decision.id, decision.completado)}
                  disabled={saving}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label className="text-sm font-medium cursor-pointer">{decision.pregunta}</label>
                  {decision.respuesta !== undefined && (
                    <div className="text-sm text-gray-600 mt-1">
                      Respuesta: {decision.respuesta ? '✅ Sí' : '❌ No'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acuerdos */}
        {data.acuerdos.length > 0 && (
          <div>
            <h3 className="font-semibold mb-3">Acuerdos Registrados</h3>
            <div className="space-y-2">
              {data.acuerdos.map((acuerdo, idx) => (
                <div key={idx} className="bg-green-50 border border-green-200 p-3 rounded">
                  <div className="font-medium">{acuerdo.decision}</div>
                  {acuerdo.responsable && (
                    <div className="text-sm text-gray-600">Responsable: {acuerdo.responsable}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
