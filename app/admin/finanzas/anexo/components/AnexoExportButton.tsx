import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, Download } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface AnexoExportButtonProps {
  mes: number;
  ano: number;
  disabled?: boolean;
}

export function AnexoExportButton({ mes, ano, disabled = false }: AnexoExportButtonProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleExportHTML = async () => {
    try {
      setLoading('html');
      const response = await fetch(
        `/api/finanzas/anexo/export/html?mes=${mes}&ano=${ano}`
      );
      
      if (!response.ok) throw new Error('Error descargando HTML');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Anexo_${mes}_${ano}.html`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error:', error);
      alert('Error descargando documento');
    } finally {
      setLoading(null);
    }
  };

  const handlePrint = async () => {
    try {
      setLoading('print');
      const response = await fetch(
        `/api/finanzas/anexo/export/html?mes=${mes}&ano=${ano}`
      );
      
      if (!response.ok) throw new Error('Error obteniendo documento');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const printWindow = window.open(url, '_blank');
      
      if (printWindow) {
        printWindow.addEventListener('load', () => {
          setTimeout(() => printWindow.print(), 250);
        });
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error abriendo documento para imprimir');
    } finally {
      setLoading(null);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled || loading !== null}
          className="flex items-center gap-2"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          Descargar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportHTML} disabled={loading !== null}>
          <FileDown className="h-4 w-4 mr-2" />
          <span>Descargar como HTML</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handlePrint} disabled={loading !== null}>
          <span>🖨️</span>
          <span className="ml-2">Imprimir / PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
