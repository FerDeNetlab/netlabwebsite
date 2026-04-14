'use client';

/**
 * Página principal del Anexo Financiero
 * /admin/finanzas/anexo/page.tsx
 * 
 * Componente cliente que:
 * 1. Permite seleccionar mes/año
 * 2. Carga datos del API
 * 3. Muestra los 9 componentes del Anexo
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AnexoFinanciero } from '@/lib/types/anexo';
import AnexoMatrizIngresos from './components/AnexoMatrizIngresos';
import AnexoMatrizGastos from './components/AnexoMatrizGastos';
import AnexoMatrizBolsas from './components/AnexoMatrizBolsas';
import AnexoPipeline from './components/AnexoPipeline';
import AnexoFlujoCaja from './components/AnexoFlujoCaja';
import AnexoReserva from './components/AnexoReserva';
import AnexoDecisiones from './components/AnexoDecisiones';
import AnexoAlertas from './components/AnexoAlertas';
import AnexoConclusion from './components/AnexoConclusion';
import { AnexoExportButton } from './components/AnexoExportButton';
import { AnexoHistoricalView } from './components/AnexoHistoricalView';

export default function AnexoFinancieroPage() {
  const [mes, setMes] = useState<number>(new Date().getMonth() + 1);
  const [ano, setAno] = useState<number>(new Date().getFullYear());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anexo, setAnexo] = useState<AnexoFinanciero | null>(null);
  const { toast } = useToast();

  // Cargar anexo cuando cambie mes/año
  useEffect(() => {
    loadAnexo();
  }, [mes, ano]);

  async function loadAnexo() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/finanzas/anexo?mes=${mes}&ano=${ano}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Error al cargar anexo');
        return;
      }

      setAnexo(data.data);

      // Guardar en historial automáticamente cuando se genera
      try {
        const saveResponse = await fetch('/api/finanzas/anexo/historico', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            anexo: data.data,
            notas: 'Generado automáticamente',
          }),
        });

        if (saveResponse.ok) {
          toast({
            title: 'Anexo guardado',
            description: `Anexo ${mes}/${ano} guardado en historial`,
          });
        }
      } catch (e) {
        console.error('Error guardando en historial:', e);
        // No mostrar error al usuario, es solo auditoría
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  const mesNombre = new Date(ano, mes - 1).toLocaleString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const meses = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(ano, i).toLocaleString('es-ES', { month: 'long' }),
  }));

  const anos = Array.from({ length: 10 }, (_, i) => ({
    value: ano - 5 + i,
    label: (ano - 5 + i).toString(),
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Anexo Financiero</h1>
          <p className="text-gray-600 mt-1">{mesNombre}</p>
        </div>
        <div className="flex gap-2">
          <AnexoHistoricalView />
          <AnexoExportButton mes={mes} ano={ano} disabled={!anexo || loading} />
        </div>
      </div>

      {/* Selector de mes/año */}
      <Card className="p-4">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium block mb-2">Mes</label>
            <Select value={mes.toString()} onValueChange={(v) => setMes(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {meses.map((m) => (
                  <SelectItem key={m.value} value={m.value.toString()}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

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

          <Button onClick={loadAnexo} disabled={loading}>
            {loading ? 'Cargando...' : 'Generar Anexo'}
          </Button>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">{error}</p>
        </Card>
      )}

      {/* Contenido principal */}
      {anexo ? (
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
            <TabsTrigger value="gastos">Gastos</TabsTrigger>
            <TabsTrigger value="bolsas">Bolsas</TabsTrigger>
            <TabsTrigger value="flujo">Flujo</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
            <TabsTrigger value="reserva">Reserva</TabsTrigger>
            <TabsTrigger value="decisiones">Decisiones</TabsTrigger>
            <TabsTrigger value="alertas">Alertas</TabsTrigger>
          </TabsList>

          {/* 1. Matriz de Ingresos */}
          <TabsContent value="ingresos">
            <AnexoMatrizIngresos data={anexo.matriz_ingresos} mes={mes} ano={ano} />
          </TabsContent>

          {/* 2. Matriz de Gastos */}
          <TabsContent value="gastos">
            <AnexoMatrizGastos data={anexo.matriz_gastos} mes={mes} ano={ano} />
          </TabsContent>

          {/* 3. Matriz de Bolsas */}
          <TabsContent value="bolsas">
            <AnexoMatrizBolsas data={anexo.matriz_bolsas} mes={mes} ano={ano} />
          </TabsContent>

          {/* 4. Flujo de Caja */}
          <TabsContent value="flujo">
            <AnexoFlujoCaja data={anexo.flujo_caja} mes={mes} ano={ano} />
          </TabsContent>

          {/* 5. Pipeline Comercial */}
          <TabsContent value="pipeline">
            <AnexoPipeline data={anexo.pipeline_comercial} mes={mes} ano={ano} />
          </TabsContent>

          {/* 6. Reserva Operativa */}
          <TabsContent value="reserva">
            <AnexoReserva data={anexo.reserva_operativa} mes={mes} ano={ano} />
          </TabsContent>

          {/* 7. Decisiones de Junta */}
          <TabsContent value="decisiones">
            <AnexoDecisiones data={anexo.decisiones_junta} mes={mes} ano={ano} />
          </TabsContent>

          {/* 8. Alertas */}
          <TabsContent value="alertas">
            <AnexoAlertas data={anexo.alertas} mes={mes} ano={ano} />
          </TabsContent>

          {/* 9. Resumen Ejecutivo */}
          <TabsContent value="resumen">
            <div className="space-y-6">
              <AnexoConclusion data={anexo.conclusion} mes={mes} ano={ano} />
              {/* Mostrar KPIs principales */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="text-sm font-medium text-gray-600">Cobertura Gastos Fijos</div>
                  <div className="text-2xl font-bold mt-2">
                    {(
                      (anexo.matriz_bolsas.validacion_cobertura.ingreso_fijo /
                        anexo.matriz_bolsas.validacion_cobertura.gastos_fijos) *
                      100
                    ).toFixed(1)}
                    %
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-medium text-gray-600">Dependencia Variable</div>
                  <div className="text-2xl font-bold mt-2">
                    {anexo.matriz_ingresos.totales.dependencia_variable_porcentaje.toFixed(1)}%
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-medium text-gray-600">Ingresos Totales</div>
                  <div className="text-2xl font-bold mt-2">
                    ${anexo.matriz_ingresos.totales.ingreso_mensual_real.toLocaleString()}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm font-medium text-gray-600">Egresos Totales</div>
                  <div className="text-2xl font-bold mt-2">
                    ${anexo.matriz_gastos.totales.total_egresos.toLocaleString()}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        !loading && (
          <Card className="p-8 text-center">
            <p className="text-gray-500">Haz clic en "Generar Anexo" para comenzar</p>
          </Card>
        )
      )}
    </div>
  );
}
