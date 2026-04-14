import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { History, ArrowRight, Loader2 } from 'lucide-react';

interface HistoricalAnexo {
  mes: number;
  ano: number;
  ingreso_total: number;
  egreso_total: number;
  balance: number;
  cobertura_gastos_fijos_pct: number;
  dependencia_variable_pct: number;
  created_at: string;
  updated_at: string;
}

interface Variacion {
  anterior: number;
  actual: number;
  cambio_pct: number;
}

export function AnexoHistoricalView() {
  const [open, setOpen] = useState(false);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [historial, setHistorial] = useState<HistoricalAnexo[]>([]);
  const [loading, setLoading] = useState(false);
  const [comparandoMes1, setComparandoMes1] = useState<string | null>(null);
  const [comparandoMes2, setComparandoMes2] = useState<string | null>(null);
  const [comparativa, setComparativa] = useState<any>(null);
  const [comparativaLoading, setComparativaLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadHistorial();
    }
  }, [open, ano]);

  async function loadHistorial() {
    setLoading(true);
    try {
      const response = await fetch(`/api/finanzas/anexo/historico?ano=${ano}`);
      const data = await response.json();

      if (data.success) {
        setHistorial(data.data);
      }
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCompara() {
    if (!comparandoMes1 || !comparandoMes2) return;

    const [mes1, ano1] = comparandoMes1.split('-').map(Number);
    const [mes2, ano2] = comparandoMes2.split('-').map(Number);

    setComparativaLoading(true);
    try {
      const response = await fetch(
        `/api/finanzas/anexo/comparativa?mes1=${mes1}&ano1=${ano1}&mes2=${mes2}&ano2=${ano2}`
      );
      const data = await response.json();

      if (data.success) {
        setComparativa(data.data);
      }
    } catch (error) {
      console.error('Error comparando:', error);
    } finally {
      setComparativaLoading(false);
    }
  }

  const anos = Array.from({ length: 10 }, (_, i) => ({
    value: ano - 5 + i,
    label: (ano - 5 + i).toString(),
  }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Historial de Anexos Financieros</DialogTitle>
          <DialogDescription>
            Visualiza anexos anteriores y compara períodos
          </DialogDescription>
        </DialogHeader>

        {/* Selector de año */}
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-2">Año</label>
            <Select value={ano.toString()} onValueChange={(v) => setAno(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {anos.map((a) => (
                  <SelectItem key={a.value} value={a.value.toString()}>
                    {a.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Historial */}
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
          </div>
        ) : historial.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto border rounded p-2">
              {historial.map((anexo) => {
                const mesNombre = new Date(anexo.ano, anexo.mes - 1).toLocaleString(
                  'es-MX',
                  { month: 'long', year: 'numeric' }
                );

                return (
                  <Card
                    key={`${anexo.mes}-${anexo.ano}`}
                    className="p-3 cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => {
                      if (!comparandoMes1) {
                        setComparandoMes1(`${anexo.mes}-${anexo.ano}`);
                      } else if (!comparandoMes2 && `${anexo.mes}-${anexo.ano}` !== comparandoMes1) {
                        setComparandoMes2(`${anexo.mes}-${anexo.ano}`);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{mesNombre}</p>
                        <p className="text-sm text-gray-600">
                          Ingresos: ${anexo.ingreso_total.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          Egresos: ${anexo.egreso_total.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className="font-bold text-lg"
                          style={{
                            color: anexo.balance >= 0 ? '#16a34a' : '#dc2626',
                          }}
                        >
                          ${anexo.balance.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(anexo.created_at).toLocaleDateString('es-MX')}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* Comparativa */}
            <div className="border-t pt-4">
              <p className="text-sm font-medium mb-3">Comparar períodos:</p>
              <div className="flex items-center gap-2 text-sm">
                {comparandoMes1 ? (
                  <span className="bg-blue-100 text-blue-900 px-3 py-1 rounded">
                    {comparandoMes1}
                  </span>
                ) : (
                  <span className="text-gray-400">Selecciona mes 1</span>
                )}

                {comparandoMes1 && comparandoMes2 && <ArrowRight className="h-4 w-4" />}

                {comparandoMes2 ? (
                  <span className="bg-green-100 text-green-900 px-3 py-1 rounded">
                    {comparandoMes2}
                  </span>
                ) : comparandoMes1 ? (
                  <span className="text-gray-400">Selecciona mes 2</span>
                ) : null}

                {comparandoMes1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setComparandoMes1(null);
                      setComparandoMes2(null);
                    }}
                  >
                    ✕
                  </Button>
                )}
              </div>

              {comparandoMes1 && comparandoMes2 && (
                <Button
                  onClick={handleCompara}
                  disabled={comparativaLoading}
                  className="mt-3"
                  size="sm"
                >
                  {comparativaLoading ? 'Comparando...' : 'Comparar'}
                </Button>
              )}
            </div>

            {/* Resultados de Comparativa */}
            {comparativa && (
              <div className="border-t pt-4 space-y-3">
                <p className="text-sm font-medium">Resultados de Comparativa:</p>
                <div className="grid grid-cols-1 gap-2">
                  {comparativa.variaciones && Object.entries(comparativa.variaciones).map(([key, valor]: [string, any]) => (
                    <Card key={key} className="p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/_/g, ' ')}
                        </span>
                        <span
                          className={`font-bold ${
                            valor.cambio_pct >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {valor.cambio_pct >= 0 ? '+' : ''}
                          {valor.cambio_pct.toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        ${valor.anterior.toLocaleString()} → ${valor.actual.toLocaleString()}
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Card className="p-8 text-center">
            <p className="text-gray-500">No hay anexos guardados para {ano}</p>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
