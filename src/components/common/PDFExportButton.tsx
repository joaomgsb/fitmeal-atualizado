import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Download } from 'lucide-react';
import { isMobile, exportPDF } from '../../lib/pdfUtils';

interface PDFExportButtonProps {
  document: React.ReactElement;
  fileName: string;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * Componente reutilizável para exportação de PDF
 * Funciona automaticamente tanto no web quanto no móvel (Capacitor)
 * 
 * No web: usa PDFDownloadLink para download direto
 * No móvel: salva no filesystem e abre menu de compartilhamento
 */
const PDFExportButton: React.FC<PDFExportButtonProps> = ({
  document,
  fileName,
  children,
  className = 'bg-red-500 text-white hover:bg-red-600',
  title = 'Exportar PDF'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileExport = async () => {
    setIsLoading(true);
    try {
      await exportPDF(document, fileName);
    } catch (error) {
      console.error('Erro ao exportar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // No ambiente móvel, usar botão customizado
  if (isMobile) {
    return (
      <button
        onClick={handleMobileExport}
        disabled={isLoading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
          isLoading ? 'bg-gray-400 text-white cursor-not-allowed' : className
        }`}
      >
        <Download size={16} />
        {children || (
          <>
            <span className="hidden sm:inline">
              {isLoading ? 'Gerando PDF...' : title}
            </span>
            <span className="sm:hidden">PDF</span>
          </>
        )}
      </button>
    );
  }

  // No ambiente web, usar PDFDownloadLink
  return (
    <PDFDownloadLink document={document} fileName={fileName}>
      {({ loading }) => (
        <button
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            loading ? 'bg-gray-400 text-white cursor-not-allowed' : className
          }`}
          disabled={loading}
        >
          <Download size={16} />
          {children || (
            <>
              <span className="hidden sm:inline">
                {loading ? 'Gerando PDF...' : title}
              </span>
              <span className="sm:hidden">PDF</span>
            </>
          )}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default PDFExportButton; 