import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import { generateMealPlan } from '../../lib/openai';
import { useProfile } from '../../hooks/useProfile';

interface GenerateMealPlanButtonProps {
  onPlanGenerated: (plan: any) => void;
}

const GenerateMealPlanButton: React.FC<GenerateMealPlanButtonProps> = ({ onPlanGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useProfile();

  const missingFields = !profile ? [] : [
    !profile.weight && 'peso',
    !profile.height && 'altura',
    !profile.age && 'idade',
    !profile.gender && 'gênero',
    !profile.goal && 'objetivo fitness'
  ].filter(Boolean);

  const handleGeneratePlan = async () => {
    if (!profile) return;
    if (missingFields.length > 0) return;

    try {
      setLoading(true);
      setError(null);

      const userData = {
        goal: profile.goal,
        weight: profile.weight,
        height: profile.height,
        age: profile.age,
        gender: profile.gender,
        activityLevel: 'moderado',
        dietPreferences: profile.dietPreferences,
        allergies: profile.allergies
      };

      const plan = await generateMealPlan(userData);
      onPlanGenerated(plan);
    } catch (error) {
      setError('Não foi possível gerar o plano. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      {!profile ? (
        <div>
          <p className="text-primary-50 mb-4">
            Faça login ou crie uma conta para gerar seu plano personalizado.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-md"
          >
            Fazer Login
          </Link>
        </div>
      ) : missingFields.length > 0 ? (
        <div>
          <div className="flex items-start gap-3 justify-center mb-4">
            <AlertCircle size={20} className="text-primary-50 mt-0.5" />
            <div>
              <p className="text-primary-50 font-medium mb-1">Complete seu perfil</p>
              <p className="text-primary-50/90">
                Para gerar seu plano personalizado, precisamos que você informe:
                {' '}{missingFields.join(', ')}.
              </p>
            </div>
          </div>
          <Link 
            to="/perfil" 
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-md"
          >
            Completar Perfil
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-primary-500/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm text-primary-50 mb-1">Peso Atual</p>
              <p className="text-xl font-medium text-white">{profile.weight} kg</p>
            </div>
            <div className="bg-primary-500/10 backdrop-blur-sm p-4 rounded-lg">
              <p className="text-sm text-primary-50 mb-1">Altura</p>
              <p className="text-xl font-medium text-white">{profile.height} cm</p>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 text-red-100">
                <AlertCircle size={18} />
                <p>{error}</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className={`inline-flex items-center justify-center px-8 py-3 rounded-lg font-medium transition-colors shadow-md ${
              loading
                ? 'bg-white/50 text-primary-800 cursor-not-allowed'
                : 'bg-white text-primary-600 hover:bg-primary-50'
            }`}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin mr-2" />
                <span>Gerando plano...</span>
              </>
            ) : (
              <span>Gerar Plano Personalizado</span>
            )}
          </button>
        </>
      )}
    </div>
  );
};

export default GenerateMealPlanButton;