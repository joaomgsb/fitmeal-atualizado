import React, { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import MealPlanPDF from './MealPlanPDF';
import { Food } from './MealCard';
import { isMobile, exportPDF } from '../../lib/pdfUtils';

interface DownloadPDFButtonProps {
  meals: {
    time: string;
    name: string;
    foods: Food[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }[];
  totalDailyCalories: number;
  totalDailyProtein: number;
  totalDailyCarbs: number;
  totalDailyFat: number;
}

const DownloadPDFButton: React.FC<DownloadPDFButtonProps> = ({
  meals,
  totalDailyCalories,
  totalDailyProtein,
  totalDailyCarbs,
  totalDailyFat,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleMobileExport = async () => {
    setIsLoading(true);
    try {
      const pdfDocument = (
        <MealPlanPDF
          meals={meals}
          totalDailyCalories={totalDailyCalories}
          totalDailyProtein={totalDailyProtein}
          totalDailyCarbs={totalDailyCarbs}
          totalDailyFat={totalDailyFat}
        />
      );
      
      await exportPDF(pdfDocument, 'plano-alimentar.pdf');
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
        className={`
          px-4 py-2 rounded-lg font-medium text-white
          ${isLoading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}
          transition-colors duration-200
        `}
      >
        {isLoading ? 'Gerando PDF...' : 'Baixar Plano (PDF)'}
      </button>
    );
  }

  // No ambiente web, usar PDFDownloadLink
  return (
    <PDFDownloadLink
      document={
        <MealPlanPDF
          meals={meals}
          totalDailyCalories={totalDailyCalories}
          totalDailyProtein={totalDailyProtein}
          totalDailyCarbs={totalDailyCarbs}
          totalDailyFat={totalDailyFat}
        />
      }
      fileName="plano-alimentar.pdf"
    >
      {({ loading }) => (
        <button
          className={`
            px-4 py-2 rounded-lg font-medium text-white
            ${loading ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'}
            transition-colors duration-200
          `}
          disabled={loading}
        >
          {loading ? 'Gerando PDF...' : 'Baixar Plano (PDF)'}
        </button>
      )}
    </PDFDownloadLink>
  );
};

export default DownloadPDFButton; 