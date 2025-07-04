import React from 'react';

interface MacrosSummaryProps {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const MacrosSummary: React.FC<MacrosSummaryProps> = ({
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
      <h2 className="text-lg font-bold mb-4">Resumo Nutricional</h2>
      <div className="space-y-4 overflow-x-auto">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Calorias Totais</span>
            <span className="font-medium">{totalCalories} kcal</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full"
              style={{ width: '100%' }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Proteínas</span>
            <span className="font-medium">{totalProtein}g</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full"
              style={{ width: `${(totalProtein / (totalProtein + totalCarbs + totalFat)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Carboidratos</span>
            <span className="font-medium">{totalCarbs}g</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full"
              style={{ width: `${(totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Gorduras</span>
            <span className="font-medium">{totalFat}g</span>
          </div>
          <div className="w-full bg-neutral-100 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${(totalFat / (totalProtein + totalCarbs + totalFat)) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MacrosSummary; 