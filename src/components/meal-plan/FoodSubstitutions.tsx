import React from 'react';

interface Substitution {
  food: string;
  alternatives: string[];
}

interface FoodSubstitutionsProps {
  substitutions: Substitution[];
}

const FoodSubstitutions: React.FC<FoodSubstitutionsProps> = ({ substitutions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Substituições Recomendadas</h2>
      <div className="space-y-4">
        {substitutions.map((sub, index) => (
          <div key={index} className="bg-neutral-50 rounded-lg p-4">
            <h3 className="font-medium mb-2">{sub.food}</h3>
            <div className="flex flex-wrap gap-2">
              {sub.alternatives.map((alt, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-white rounded-full text-sm text-neutral-700 border border-neutral-200"
                >
                  {alt}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodSubstitutions; 