import React from 'react';
import { 
  Utensils, 
  Zap, 
  Beef, 
  Wheat, 
  Droplets, 
  TrendingUp, 
  CheckCircle,
  Lightbulb,
  Target
} from 'lucide-react';
import { FoodRecognitionResult } from '../../lib/openai';

interface FoodRecognitionResultsProps {
  result: FoodRecognitionResult;
  imageUrl: string;
}

const FoodRecognitionResults: React.FC<FoodRecognitionResultsProps> = ({ 
  result, 
  imageUrl 
}) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-error';
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80) return <CheckCircle size={16} className="text-success" />;
    if (confidence >= 60) return <Target size={16} className="text-warning" />;
    return <Target size={16} className="text-error" />;
  };

  return (
    <div className="space-y-6">
      {/* Imagem analisada */}
      <div className="bg-white rounded-xl shadow-card p-4">
        <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
          <Utensils size={20} className="text-primary-500" />
          Imagem Analisada
        </h3>
        <div className="relative">
          <img 
            src={imageUrl} 
            alt="Alimento analisado" 
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {result.foods.length} alimento{result.foods.length !== 1 ? 's' : ''} detectado{result.foods.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Resumo nutricional */}
      <div className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6">
        <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Zap size={24} className="text-primary-500" />
          Resumo Nutricional
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-primary-600">
              {result.totalCalories}
            </div>
            <div className="text-sm text-neutral-600">Calorias</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-energy-600">
              {result.totalProtein}g
            </div>
            <div className="text-sm text-neutral-600">Proteínas</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-accent-600">
              {result.totalCarbs}g
            </div>
            <div className="text-sm text-neutral-600">Carboidratos</div>
          </div>
          
          <div className="bg-white rounded-lg p-4 text-center shadow-card">
            <div className="text-2xl font-bold text-neutral-600">
              {result.totalFat}g
            </div>
            <div className="text-sm text-neutral-600">Gorduras</div>
          </div>
        </div>

        {/* Distribuição de macronutrientes */}
        <div className="bg-white rounded-lg p-4 shadow-card">
          <h4 className="font-semibold text-neutral-800 mb-3">Distribuição de Macronutrientes</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Beef size={16} className="text-energy-500" />
                <span className="text-sm text-neutral-600">Proteínas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-energy-500 rounded-full"
                    style={{ width: `${(result.totalProtein * 4 / result.totalCalories) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-800">
                  {Math.round((result.totalProtein * 4 / result.totalCalories) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wheat size={16} className="text-accent-500" />
                <span className="text-sm text-neutral-600">Carboidratos</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-accent-500 rounded-full"
                    style={{ width: `${(result.totalCarbs * 4 / result.totalCalories) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-800">
                  {Math.round((result.totalCarbs * 4 / result.totalCalories) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets size={16} className="text-neutral-500" />
                <span className="text-sm text-neutral-600">Gorduras</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-neutral-500 rounded-full"
                    style={{ width: `${(result.totalFat * 9 / result.totalCalories) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-neutral-800">
                  {Math.round((result.totalFat * 9 / result.totalCalories) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alimentos identificados */}
      <div className="bg-white rounded-xl shadow-card p-6">
        <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
          <Utensils size={24} className="text-primary-500" />
          Alimentos Identificados
        </h3>
        
        <div className="space-y-4">
          {result.foods.map((food, index) => (
            <div key={index} className="border border-neutral-200 rounded-lg p-4 hover:shadow-card transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-neutral-800">{food.name}</h4>
                    {getConfidenceIcon(food.confidence)}
                  </div>
                  <p className="text-sm text-neutral-600">{food.estimatedAmount}</p>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${getConfidenceColor(food.confidence)}`}>
                    {food.confidence}% confiança
                  </div>
                  <div className="text-lg font-bold text-primary-600">
                    {food.calories} kcal
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-energy-600">{food.protein}g</div>
                  <div className="text-neutral-500">Proteína</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-accent-600">{food.carbs}g</div>
                  <div className="text-neutral-500">Carboidratos</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-neutral-600">{food.fat}g</div>
                  <div className="text-neutral-500">Gorduras</div>
                </div>
              </div>
              
              {food.fiber && (
                <div className="mt-3 pt-3 border-t border-neutral-100">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-success">{food.fiber}g</div>
                      <div className="text-neutral-500">Fibras</div>
                    </div>
                    {food.sugar && (
                      <div className="text-center">
                        <div className="font-semibold text-warning">{food.sugar}g</div>
                        <div className="text-neutral-500">Açúcares</div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sugestões */}
      {result.suggestions && result.suggestions.length > 0 && (
        <div className="bg-gradient-to-br from-success-50 to-warning-50 rounded-xl p-6">
          <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
            <Lightbulb size={24} className="text-success" />
            Sugestões Nutricionais
          </h3>
          
          <div className="space-y-3">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-success rounded-full mt-2 flex-shrink-0" />
                <p className="text-neutral-700">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodRecognitionResults; 