/**
 * Componente: Conclusión Financiera
 * Resumen ejecutivo editable
 */

import { Card } from '@/components/ui/card';
import { ConclusionFinanciera } from '@/lib/types/anexo';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface Props {
  data: ConclusionFinanciera;
  mes: number;
  ano: number;
}

export default function AnexoConclusion({ data }: Props) {
  const [editando, setEditando] = useState(false);
  const [resumen, setResumen] = useState(data.resumen_ejecutivo);
  const [saving, setSaving] = useState(false);

  const handleGuardar = async () => {
    setSaving(true);
    try {
      // En una implementación real, guardaría esto en la BD
      console.log('Guardando conclusión:', resumen);
      setEditando(false);
    } catch (error) {
      console.error('Error guardando conclusión:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">9. Conclusión Financiera</h2>
          {!editando && <Button onClick={() => setEditando(true)} variant="outline" size="sm">Editar</Button>}
        </div>

        {editando ? (
          <div className="space-y-4">
            <Textarea
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Escribe el resumen ejecutivo de la situación financiera..."
              className="min-h-48"
            />
            <div className="flex gap-2">
              <Button onClick={handleGuardar} disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button variant="outline" onClick={() => setEditando(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{resumen}</p>
          </div>
        )}
      </Card>
    </div>
  );
}
