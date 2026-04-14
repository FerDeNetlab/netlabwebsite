/**
 * Componente: Alertas Financieras
 * Muestra alertas detectadas automáticamente
 */

import { Card } from '@/components/ui/card';
import { Alertas, SeveridadAlerta } from '@/lib/types/anexo';

interface Props {
  data: Alertas;
  mes: number;
  ano: number;
}

const SEVERIDAD_COLORES: Record<SeveridadAlerta, string> = {
  [SeveridadAlerta.INFO]: 'bg-blue-50 border-blue-200',
  [SeveridadAlerta.WARNING]: 'bg-yellow-50 border-yellow-200',
  [SeveridadAlerta.CRITICAL]: 'bg-red-50 border-red-200',
};

const SEVERIDAD_ICONOS: Record<SeveridadAlerta, string> = {
  [SeveridadAlerta.INFO]: 'ℹ️',
  [SeveridadAlerta.WARNING]: '⚠️',
  [SeveridadAlerta.CRITICAL]: '🚨',
};

export default function AnexoAlertas({ data }: Props) {
  if (data.alertas.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">8. Alertas Financieras</h2>
        <div className="text-center py-8 text-green-600">
          <div className="text-4xl mb-2">✅</div>
          <p>No hay alertas detectadas. Situación financiera estable.</p>
        </div>
      </Card>
    );
  }

  const alertasPorSeveridad = {
    [SeveridadAlerta.CRITICAL]: data.alertas.filter((a) => a.severidad === SeveridadAlerta.CRITICAL),
    [SeveridadAlerta.WARNING]: data.alertas.filter((a) => a.severidad === SeveridadAlerta.WARNING),
    [SeveridadAlerta.INFO]: data.alertas.filter((a) => a.severidad === SeveridadAlerta.INFO),
  };

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">8. Alertas Financieras</h2>

        {/* Críticas */}
        {alertasPorSeveridad[SeveridadAlerta.CRITICAL].length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-red-700 mb-3">🚨 Alertas Críticas</h3>
            <div className="space-y-2">
              {alertasPorSeveridad[SeveridadAlerta.CRITICAL].map((alerta, idx) => (
                <div key={idx} className="bg-red-50 border-2 border-red-300 p-4 rounded">
                  <div className="font-semibold text-red-900">{alerta.tipo.replace(/_/g, ' ')}</div>
                  <div className="text-sm text-red-800 mt-1">{alerta.descripcion}</div>
                  <div className="text-sm text-red-700 mt-2">Valor: {alerta.valor}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Advertencias */}
        {alertasPorSeveridad[SeveridadAlerta.WARNING].length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-yellow-700 mb-3">⚠️ Advertencias</h3>
            <div className="space-y-2">
              {alertasPorSeveridad[SeveridadAlerta.WARNING].map((alerta, idx) => (
                <div key={idx} className="bg-yellow-50 border-2 border-yellow-300 p-4 rounded">
                  <div className="font-semibold text-yellow-900">{alerta.tipo.replace(/_/g, ' ')}</div>
                  <div className="text-sm text-yellow-800 mt-1">{alerta.descripcion}</div>
                  <div className="text-sm text-yellow-700 mt-2">Valor: {alerta.valor}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informativas */}
        {alertasPorSeveridad[SeveridadAlerta.INFO].length > 0 && (
          <div>
            <h3 className="font-semibold text-blue-700 mb-3">ℹ️ Información</h3>
            <div className="space-y-2">
              {alertasPorSeveridad[SeveridadAlerta.INFO].map((alerta, idx) => (
                <div key={idx} className="bg-blue-50 border border-blue-200 p-3 rounded">
                  <div className="font-semibold text-blue-900 text-sm">{alerta.tipo.replace(/_/g, ' ')}</div>
                  <div className="text-sm text-blue-800 mt-1">{alerta.descripcion}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
