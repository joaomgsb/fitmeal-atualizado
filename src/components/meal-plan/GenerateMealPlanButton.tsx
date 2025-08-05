import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, AlertCircle, Target, Activity, Clock, Calculator, Utensils, Sparkles, Zap } from 'lucide-react';
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
    !profile.goal && 'objetivo fitness',
    !profile.activityLevel && 'nível de atividade',
    !profile.workoutFrequency && 'frequência de treinos',
    !profile.workoutIntensity && 'intensidade dos treinos',
    !profile.workoutDuration && 'duração dos treinos'
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
        activityLevel: profile.activityLevel,
        workoutFrequency: profile.workoutFrequency,
        workoutIntensity: profile.workoutIntensity,
        workoutDuration: profile.workoutDuration,
        basalMetabolicRate: profile.basalMetabolicRate,
        totalDailyEnergyExpenditure: profile.totalDailyEnergyExpenditure,
        knowsCalorieNeeds: profile.knowsCalorieNeeds,
        customCalorieNeeds: profile.customCalorieNeeds || 0,
        customProteinNeeds: profile.customProteinNeeds || 0,
        customCarbNeeds: profile.customCarbNeeds || 0,
        customFatNeeds: profile.customFatNeeds || 0,
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

  if (!profile) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-neutral-600">Carregando perfil...</p>
      </div>
    );
  }

  if (missingFields.length > 0) {
    return (
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-yellow-600" />
        </div>
        <h3 className="text-xl font-bold text-yellow-800 mb-3">
          Perfil Incompleto
        </h3>
        <p className="text-yellow-700 mb-6 text-lg">
          Para gerar um plano personalizado, complete as seguintes informações no seu perfil:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 max-w-md mx-auto">
          {missingFields.map((field, index) => (
            <div key={index} className="flex items-center gap-3 bg-white/50 rounded-lg px-4 py-2">
              <span className="w-2 h-2 bg-yellow-500 rounded-full flex-shrink-0"></span>
              <span className="text-yellow-800 font-medium">{field}</span>
            </div>
          ))}
        </div>
        <Link
          to="/perfil"
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Completar Perfil
        </Link>
      </div>
    );
  }

  const profileFeatures = [
    {
      icon: <Target className="w-5 h-5" />,
      title: "Dados Físicos",
      description: "Peso, altura, idade e gênero",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Activity className="w-5 h-5" />,
      title: "Objetivo Fitness",
      description: "Meta e nível de atividade",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Rotina de Treinos",
      description: "Frequência, intensidade e duração",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: <Calculator className="w-5 h-5" />,
      title: "Metabolismo",
      description: "TMB e gasto energético total",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: <Utensils className="w-5 h-5" />,
      title: "Preferências",
      description: "Alimentares e restrições",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Timing Nutricional",
      description: "Horários e estratégias de refeição",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">
          Gerar Plano Personalizado
        </h2>
        <p className="text-primary-100 text-lg max-w-2xl mx-auto">
          Seu plano será criado com base no seu perfil completo, considerando todos os aspectos da sua rotina fitness
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {profileFeatures.map((feature, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-200">
            <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
              <div className="text-white">
                {feature.icon}
              </div>
            </div>
            <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
            <p className="text-primary-100 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <button
          onClick={handleGeneratePlan}
          disabled={loading}
          className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-white to-gray-100 text-primary-600 rounded-xl hover:from-gray-100 hover:to-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Gerando seu Plano...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6 mr-3" />
              Gerar Plano Personalizado
            </>
          )}
        </button>
        
        {error && (
          <div className="mt-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-xl max-w-md mx-auto">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateMealPlanButton;