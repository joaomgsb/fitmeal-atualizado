import React from 'react';
import { CheckCircle } from 'lucide-react';

interface PreparationTipsProps {
  tips: string[];
}

const PreparationTips: React.FC<PreparationTipsProps> = ({ tips }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-bold mb-6">Dicas de Preparação</h2>
      <ul className="space-y-3">
        {tips.map((tip, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="mt-1">
              <CheckCircle size={18} className="text-primary-500" />
            </div>
            <span>{tip}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PreparationTips; 