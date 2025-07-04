import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PlanFeaturesProps {
  features: string[];
}

const PlanFeatures: React.FC<PlanFeaturesProps> = ({ features }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Características do Plano</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-1">
              <CheckCircle size={18} className="text-primary-500" />
            </div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanFeatures; 