import React from 'react';
import { Flame, Beef, Wheat, Droplet } from 'lucide-react';

export interface Food {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  preparation?: string;
}

interface MealCardProps {
  time: string;
  name: string;
  foods: Food[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

const MealCard: React.FC<MealCardProps> = ({
  time,
  name,
  foods,
  totalCalories,
  totalProtein,
  totalCarbs,
  totalFat
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all min-w-full">
      {/* Cabeçalho da Refeição */}
      <div className="bg-primary-50 rounded-t-xl p-4 border border-primary-100 text-primary-700">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-primary-600 bg-white px-3 py-1 rounded-full border border-primary-100">
              {time}
            </div>
            <h3 className="font-semibold text-primary-700">{name}</h3>
          </div>
          
          {/* Macros da Refeição */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Flame size={16} className="text-energy-500" />
              <span className="font-medium">{totalCalories} kcal</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Beef size={16} className="text-red-500" />
              <span className="font-medium">{totalProtein}g</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wheat size={16} className="text-yellow-500" />
              <span className="font-medium">{totalCarbs}g</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplet size={16} className="text-blue-500" />
              <span className="font-medium">{totalFat}g</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Lista de Alimentos */}
      <div className="border border-t-0 border-neutral-200 rounded-b-xl">
        <div className="divide-y divide-neutral-100 overflow-x-auto">
          {foods.map((food, index) => (
            <div key={index} className="p-4 hover:bg-neutral-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                <div className="flex-grow">
                  <div className="flex items-center flex-wrap gap-2">
                    <h4 className="font-medium text-neutral-900">{food.name}</h4>
                    <span className="bg-primary-50 text-primary-700 rounded-full text-sm font-medium px-2 py-0.5 border border-primary-100">
                      {food.amount}
                    </span>
                  </div>
                  {food.preparation && (
                    <p className="text-sm text-neutral-600 mt-2">{food.preparation}</p>
                  )}
                </div>
                
                {/* Macros do Alimento */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1.5 bg-energy-50 rounded-lg px-2 py-1">
                    <Flame size={14} className="text-energy-500" />
                    <span className="text-sm text-energy-700 font-medium">{food.calories}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-red-50 rounded-lg px-2 py-1">
                    <Beef size={14} className="text-red-500" />
                    <span className="text-sm text-red-700 font-medium">{food.protein}g</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-yellow-50 rounded-lg px-2 py-1">
                    <Wheat size={14} className="text-yellow-500" />
                    <span className="text-sm text-yellow-700 font-medium">{food.carbs}g</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-blue-50 rounded-lg px-2 py-1">
                    <Droplet size={14} className="text-blue-500" />
                    <span className="text-sm text-blue-700 font-medium">{food.fat}g</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MealCard; 