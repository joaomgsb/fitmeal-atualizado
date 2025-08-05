import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User, Edit2, LogOut, Save,
  Dumbbell, BarChart, LineChart, Trash2,
  Scale, Ruler, Calculator
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { useMealPlans } from '../hooks/useMealPlans';
import { toast } from 'react-hot-toast';
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import AvatarUpload from '../components/profile/AvatarUpload';
import CalculatorTab from '../components/profile/CalculatorTab';

export interface UserProfile {
  name: string;
  email: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  goal: string;
  activityLevel: string;
  workoutFrequency: string;
  workoutIntensity: string;
  workoutDuration: string;
  basalMetabolicRate: number;
  totalDailyEnergyExpenditure: number;
  knowsCalorieNeeds: boolean;
  customCalorieNeeds: number;
  customProteinNeeds: number;
  customCarbNeeds: number;
  customFatNeeds: number;
  avatar: string;
  dietPreferences: string[];
  allergies: string[];
  weightHistory: Array<{ date: string; weight: number }>;
  bodyFatHistory: Array<{ date: string; bodyFat: number }>;
  measurements: Array<{
    date: string;
    chest: number;
    waist: number;
    hips: number;
    arms: number;
    thighs: number;
  }>;
}

interface SavedPlan {
  id: string;
  plan: {
    id?: string;
    title?: string;
    isCustomPlan?: boolean;
    overview: {
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    };
    schedule?: Record<string, unknown>;
  };
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'perfil' | 'progresso' | 'planos' | 'calculadoras'>('perfil');
  const [isEditing, setIsEditing] = useState(false);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [showBodyFatModal, setShowBodyFatModal] = useState(false);
  const [showMeasurementsModal, setShowMeasurementsModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');
  
  const measurementRefs = {
    chest: useRef<HTMLInputElement>(null),
    waist: useRef<HTMLInputElement>(null),
    hips: useRef<HTMLInputElement>(null),
    arms: useRef<HTMLInputElement>(null),
    thighs: useRef<HTMLInputElement>(null)
  };

  const { logout } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    loading,
    isUpdating,
    updateProfile,
    addWeightEntry,
    addBodyFatEntry,
    addMeasurements,
    resetWeightHistory,
    resetBodyFatHistory,
    resetMeasurements
  } = useProfile();
  const { savedPlans, deletePlan, updatePlan } = useMealPlans();

  // Atualiza o estado local quando o profile mudar
  useEffect(() => {
    if (profile) {
      setLocalProfile(profile as UserProfile);
    }
  }, [profile]);

  // Efeito para controlar o scroll quando o modal estiver aberto
  useEffect(() => {
    if (showWeightModal || showMeasurementsModal || showBodyFatModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showWeightModal, showMeasurementsModal, showBodyFatModal]);
  
  // Reseta os valores dos inputs quando o modal abrir
  useEffect(() => {
    if (showMeasurementsModal) {
      Object.values(measurementRefs).forEach(ref => {
        if (ref.current) ref.current.value = '';
      });
    }
  }, [showMeasurementsModal]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch {
      console.error('Erro ao fazer logout');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      const loadingToast = toast.loading('Excluindo plano...');

      const success = await deletePlan(planId);

      toast.dismiss(loadingToast);

      if (success) {
        toast.success('Plano excluído com sucesso!', {
          duration: 2000
        });
      }
    } catch {
      toast.error('Erro ao excluir o plano. Tente novamente.', {
        duration: 3000
      });
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Salvar alterações
      if (localProfile && !isUpdating) {
        updateProfile(localProfile, true);
      }
    }
    setIsEditing(!isEditing);
  };

  // Função para calcular TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
  const calculateBMR = (weight: number, height: number, age: number, gender: string) => {
    if (gender === 'Masculino') {
      return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
    } else {
      return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
    }
  };

  // Função para calcular TDEE (Gasto Energético Total Diário)
  const calculateTDEE = (bmr: number, activityLevel: string) => {
    const activityMultipliers = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'ativo': 1.725,
      'muito_ativo': 1.9
    };
    
    return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number | string[]) => {
    if (!localProfile) return;
    
    const updatedProfile = { ...localProfile, [field]: value };
    
    // Recalcular TMB e TDEE quando dados físicos ou nível de atividade mudarem
    if (field === 'weight' || field === 'height' || field === 'age' || field === 'gender') {
      const bmr = calculateBMR(
        field === 'weight' ? value as number : localProfile.weight,
        field === 'height' ? value as number : localProfile.height,
        field === 'age' ? value as number : localProfile.age,
        field === 'gender' ? value as string : localProfile.gender
      );
      updatedProfile.basalMetabolicRate = bmr;
      
      if (localProfile.activityLevel) {
        updatedProfile.totalDailyEnergyExpenditure = calculateTDEE(bmr, localProfile.activityLevel);
      }
    } else if (field === 'activityLevel') {
              if (Number(localProfile.basalMetabolicRate) > 0) {
        updatedProfile.totalDailyEnergyExpenditure = calculateTDEE(localProfile.basalMetabolicRate, value as string);
      }
    }
    
    setLocalProfile(updatedProfile);
  };

  const handleAddWeight = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newWeight || !localProfile) {
      toast.error('Por favor, insira um peso válido');
      return;
    }

    const weight = parseFloat(newWeight);
    if (isNaN(weight)) {
      toast.error('Por favor, insira um peso válido');
      return;
    }

    const loadingToast = toast.loading('Salvando peso...');

    try {
      await addWeightEntry(weight);
      toast.dismiss(loadingToast);
      setNewWeight('');
      setShowWeightModal(false);
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Erro ao salvar o peso. Tente novamente.');
    }
  };

  const handleResetWeight = async () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico de peso? Esta ação não pode ser desfeita.')) {
      await resetWeightHistory();
      toast.success('Histórico de peso resetado com sucesso!');
    }
  };

  const handleResetMeasurements = async () => {
    if (window.confirm('Tem certeza que deseja apagar todas as medidas corporais? Esta ação não pode ser desfeita.')) {
      await resetMeasurements();
      toast.success('Medidas corporais resetadas com sucesso!');
    }
  };

  const handleViewPlanDetails = (savedPlan: SavedPlan) => {
    if (savedPlan.plan.isCustomPlan) {
      navigate('/planos/personalizado', { state: { generatedPlan: savedPlan.plan } });
    } else {
      navigate(`/planos/${savedPlan.plan.id}`);
    }
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      updateProfile({ avatar: result }, true);
    };
    reader.readAsDataURL(file);
  };

  const handleAddBodyFat = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newBodyFat || !localProfile) {
      toast.error('Por favor, insira um percentual de gordura válido');
      return;
    }

    const bodyFat = parseFloat(newBodyFat);
    if (isNaN(bodyFat) || bodyFat < 0 || bodyFat > 100) {
      toast.error('Por favor, insira um percentual de gordura válido (entre 0 e 100)');
      return;
    }

    const loadingToast = toast.loading('Salvando percentual de gordura...');

    try {
      await addBodyFatEntry(bodyFat);
      toast.dismiss(loadingToast);
      setNewBodyFat('');
      setShowBodyFatModal(false);
    } catch {
      toast.dismiss(loadingToast);
      toast.error('Erro ao salvar o percentual de gordura. Tente novamente.');
    }
  };

  const handleResetBodyFat = async () => {
    if (window.confirm('Tem certeza que deseja apagar todo o histórico de percentual de gordura? Esta ação não pode ser desfeita.')) {
      await resetBodyFatHistory();
      toast.success('Histórico de percentual de gordura resetado com sucesso!');
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!localProfile) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p>Erro ao carregar perfil. Tente novamente mais tarde.</p>
      </div>
    );
  }

  // Calcula a meta de peso baseada no objetivo
  const getTargetWeight = () => {
    const currentWeight = localProfile.weightHistory && localProfile.weightHistory.length > 0
      ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
      : localProfile.weight;

    if (!currentWeight) return 0;

    switch (localProfile.goal) {
      case 'emagrecimento':
        return Math.round(currentWeight * 0.9); // -10% do peso atual
      case 'hipertrofia':
        return Math.round(currentWeight * 1.1); // +10% do peso atual
      case 'definicao':
        return currentWeight; // mantém o peso atual
      default:
        return currentWeight;
    }
  };

  const targetWeight = getTargetWeight();

  const WeightModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowWeightModal(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">Registrar Novo Peso</h3>
        <form onSubmit={handleAddWeight}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-500 mb-1">
              Peso (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={newWeight}
              onChange={(e) => setNewWeight(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: 70.5"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowWeightModal(false)}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const handleAddMeasurements = (e: React.FormEvent) => {
    e.preventDefault();

    const measurements = {
      chest: Number(measurementRefs.chest.current?.value || 0),
      waist: Number(measurementRefs.waist.current?.value || 0),
      hips: Number(measurementRefs.hips.current?.value || 0),
      arms: Number(measurementRefs.arms.current?.value || 0),
      thighs: Number(measurementRefs.thighs.current?.value || 0)
    };
    
    if (Object.values(measurements).some(n => isNaN(n) || n <= 0)) {
      toast.error('Preencha todas as medidas corretamente');
      return;
    }

    addMeasurements(measurements);
    setShowMeasurementsModal(false);
  };

  const MeasurementsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowMeasurementsModal(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">Registrar Medidas Corporais</h3>
        <form onSubmit={handleAddMeasurements}>
          {[
            { key: 'chest', label: 'Tórax' },
            { key: 'waist', label: 'Cintura' },
            { key: 'hips', label: 'Quadril' },
            { key: 'arms', label: 'Braços' },
            { key: 'thighs', label: 'Coxas' }
          ].map(({ key, label }) => (
            <div key={key} className="mb-4">
              <label htmlFor={`measurement-${key}`} className="block text-sm font-medium text-neutral-500 mb-1">
                {label} (cm)
              </label>
              <input
                ref={measurementRefs[key as keyof typeof measurementRefs]}
                id={`measurement-${key}`}
                type="number"
                step="0.1"
                defaultValue=""
                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder={`Ex: ${key === 'arms' ? '35.5' : '80.0'}`}
              />
            </div>
          ))}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowMeasurementsModal(false)}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const BodyFatModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowBodyFatModal(false)}>
      <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <h3 className="text-xl font-bold mb-4">Registrar Percentual de Gordura</h3>
        <form onSubmit={handleAddBodyFat}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-500 mb-1">
              Percentual de Gordura (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={newBodyFat}
              onChange={(e) => setNewBodyFat(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Ex: 15.5"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBodyFatModal(false)}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="md:sticky top-24 bg-white rounded-xl shadow-sm p-6 w-full">
              <div className="flex flex-col items-center mb-6">
                <div className="mb-4">
                  <AvatarUpload
                    currentImage={localProfile.avatar}
                    onImageUpload={handleImageUpload}
                  />
                </div>
                <h1 className="text-xl font-bold">{localProfile.name || 'Sem nome'}</h1>
                <p className="text-neutral-500 text-sm">{localProfile.email}</p>

                <div className="mt-2 px-3 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-full">
                  Plano: Gratuito
                </div>
              </div>

              <div className="space-y-1 mb-6">
                <button
                  onClick={() => setActiveTab('perfil')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'perfil'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                >
                  <User size={18} />
                  <span>Meu Perfil</span>
                </button>
                <button
                  onClick={() => setActiveTab('planos')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'planos'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                >
                  <Save size={18} />
                  <span>Planos Salvos</span>
                </button>
                <button
                  onClick={() => setActiveTab('progresso')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'progresso'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                >
                  <BarChart size={18} />
                  <span>Meu Progresso</span>
                </button>
                <button
                  onClick={() => setActiveTab('calculadoras')}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${activeTab === 'calculadoras'
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-neutral-600 hover:bg-neutral-50'
                    }`}
                >
                  <Calculator size={18} />
                  <span>Calculadoras</span>
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-neutral-600 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                <span>Sair</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-8 lg:col-span-9">
            {activeTab === 'perfil' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                  <h2 className="text-xl font-bold">Informações do Perfil</h2>
                  <button
                    onClick={handleEditToggle}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isEditing
                      ? 'bg-primary-500 text-white hover:bg-primary-600'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                  >
                    {isEditing ? (
                      <>
                        <Save size={18} />
                        <span>Salvar</span>
                      </>
                    ) : (
                      <>
                        <Edit2 size={18} />
                        <span>Editar</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Nome</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={localProfile.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-neutral-800">{localProfile.name || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Email</label>
                      <p className="text-neutral-800">{localProfile.email}</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Gênero</label>
                      {isEditing ? (
                        <select
                          value={localProfile.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        >
                          <option value="" disabled>Selecione</option>
                          <option value="Masculino">Masculino</option>
                          <option value="Feminino">Feminino</option>
                          <option value="Outro">Outro</option>
                        </select>
                      ) : (
                        <p className="text-neutral-800">{localProfile.gender || 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Idade</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={localProfile.age}
                          onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-neutral-800">{localProfile.age ? `${localProfile.age} anos` : 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Altura</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={localProfile.height}
                          onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-neutral-800">{localProfile.height ? `${localProfile.height} cm` : 'Não informado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-neutral-500 mb-1">Peso</label>
                      {isEditing ? (
                        <input
                          type="number"
                          value={localProfile.weight}
                          onChange={(e) => handleInputChange('weight', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-neutral-800">{localProfile.weight ? `${localProfile.weight} kg` : 'Não informado'}</p>
                      )}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Objetivo Fitness</h3>

                    {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { id: 'emagrecimento', label: 'Perda de Peso', icon: <LineChart size={18} /> },
                          { id: 'hipertrofia', label: 'Ganho Muscular', icon: <Dumbbell size={18} /> },
                          { id: 'definicao', label: 'Definição Muscular', icon: <BarChart size={18} /> }
                        ].map((goal) => (
                          <button
                            key={goal.id}
                            onClick={() => handleInputChange('goal', goal.id)}
                            className={`flex items-center gap-2 p-3 rounded-lg border ${localProfile.goal === goal.id
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : 'border-neutral-200 hover:border-primary-200'
                              }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${localProfile.goal === goal.id
                              ? 'bg-primary-100'
                              : 'bg-neutral-100'
                              }`}>
                              {goal.icon}
                            </div>
                            <span>{goal.label}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-lg">
                        <div className="w-10 h-10 bg-primary-100 text-primary-500 rounded-full flex items-center justify-center">
                          {localProfile.goal === 'emagrecimento' ? <LineChart size={20} /> :
                            localProfile.goal === 'hipertrofia' ? <Dumbbell size={20} /> :
                              <BarChart size={20} />}
                        </div>
                        <div>
                          <p className="font-medium">
                            {localProfile.goal === 'emagrecimento' ? 'Perda de Peso' :
                              localProfile.goal === 'hipertrofia' ? 'Ganho Muscular' :
                                localProfile.goal === 'definicao' ? 'Definição Muscular' :
                                  'Não informado'}
                          </p>
                          <p className="text-sm text-neutral-500">
                            {localProfile.goal === 'emagrecimento' ? 'Foco em déficit calórico controlado' :
                              localProfile.goal === 'hipertrofia' ? 'Foco em superávit calórico e proteínas' :
                                localProfile.goal === 'definicao' ? 'Foco em manutenção calórica e composição corporal' :
                                  'Selecione um objetivo'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Preferências Alimentares</h3>

                    {isEditing ? (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-neutral-500 mb-2">Dietas</label>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { id: 'proteica', label: 'Rica em Proteínas' },
                              { id: 'lowcarb', label: 'Baixo Carboidrato' },
                              { id: 'vegetariana', label: 'Vegetariana' },
                              { id: 'vegana', label: 'Vegana' },
                              { id: 'paleo', label: 'Paleo' },
                              { id: 'mediterranea', label: 'Mediterrânea' }
                            ].map((diet) => (
                              <button
                                key={diet.id}
                                onClick={() => {
                                  if (!localProfile) return;
                                  const newPreferences = localProfile.dietPreferences.includes(diet.id)
                                    ? localProfile.dietPreferences.filter(d => d !== diet.id)
                                    : [...localProfile.dietPreferences, diet.id];
                                  handleInputChange('dietPreferences', newPreferences);
                                }}
                                className={`px-3 py-1 rounded-full text-sm ${localProfile.dietPreferences.includes(diet.id)
                                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                  : 'bg-neutral-100 text-neutral-700 border border-neutral-200 hover:bg-neutral-200'
                                  }`}
                              >
                                {diet.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-neutral-500 mb-2">Alergias/Intolerâncias</label>
                          <input
                            type="text"
                            placeholder="Adicione alergias separadas por vírgula"
                            value={localProfile.allergies.join(', ') || ''}
                            onChange={(e) => handleInputChange('allergies', e.target.value.split(', ').filter(Boolean))}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-2">Dietas Preferidas</h4>
                          <div className="flex flex-wrap gap-2">
                            {localProfile.dietPreferences.length > 0 ? localProfile.dietPreferences.map((diet) => (
                              <span
                                key={diet}
                                className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                              >
                                {diet === 'proteica' ? 'Rica em Proteínas' :
                                  diet === 'lowcarb' ? 'Baixo Carboidrato' :
                                    diet === 'vegetariana' ? 'Vegetariana' :
                                      diet === 'vegana' ? 'Vegana' :
                                        diet === 'paleo' ? 'Paleo' : 'Mediterrânea'}
                              </span>
                            )) : (
                              <p className="text-neutral-500 text-sm">Nenhuma dieta selecionada</p>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium text-neutral-500 mb-2">Alergias/Intolerâncias</h4>
                          <div className="flex flex-wrap gap-2">
                            {localProfile.allergies.length > 0 ? (
                              localProfile.allergies.map((allergy) => (
                                <span
                                  key={allergy}
                                  className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                                >
                                  {allergy}
                                </span>
                              ))
                            ) : (
                              <p className="text-neutral-500 text-sm">Nenhuma alergia/intolerância registrada</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Atividade Física e Metabolismo</h3>

                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-neutral-500 mb-1">Nível de Atividade</label>
                            <select
                              value={localProfile.activityLevel || ''}
                              onChange={(e) => handleInputChange('activityLevel', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="" disabled>Selecione</option>
                              <option value="sedentario">Sedentário - Pouco ou nenhum exercício</option>
                              <option value="leve">Levemente Ativo - Exercício leve 1-3 dias/semana</option>
                              <option value="moderado">Moderadamente Ativo - Exercício moderado 3-5 dias/semana</option>
                              <option value="ativo">Muito Ativo - Exercício intenso 6-7 dias/semana</option>
                              <option value="muito_ativo">Extremamente Ativo - Exercício muito intenso, trabalho físico</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-500 mb-1">Frequência de Treinos</label>
                            <select
                              value={localProfile.workoutFrequency || ''}
                              onChange={(e) => handleInputChange('workoutFrequency', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="" disabled>Selecione</option>
                              <option value="1-2">1-2 vezes por semana</option>
                              <option value="3-4">3-4 vezes por semana</option>
                              <option value="5-6">5-6 vezes por semana</option>
                              <option value="7">Todos os dias</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-500 mb-1">Intensidade dos Treinos</label>
                            <select
                              value={localProfile.workoutIntensity || ''}
                              onChange={(e) => handleInputChange('workoutIntensity', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="" disabled>Selecione</option>
                              <option value="baixa">Baixa Intensidade - Caminhada, yoga, alongamento</option>
                              <option value="moderada">Moderada - Corrida leve, musculação moderada</option>
                              <option value="alta">Alta Intensidade - HIIT, musculação pesada, esportes</option>
                              <option value="muito_alta">Muito Alta - CrossFit, atletismo profissional</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-neutral-500 mb-1">Duração dos Treinos</label>
                            <select
                              value={localProfile.workoutDuration || ''}
                              onChange={(e) => handleInputChange('workoutDuration', e.target.value)}
                              className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            >
                              <option value="" disabled>Selecione</option>
                              <option value="30min">Até 30 minutos</option>
                              <option value="45min">30-45 minutos</option>
                              <option value="60min">45-60 minutos</option>
                              <option value="90min">60-90 minutos</option>
                              <option value="120min">Mais de 90 minutos</option>
                            </select>
                          </div>
                        </div>

                        {Number(localProfile.basalMetabolicRate) > 0 && (
                          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-2">Cálculos Automáticos</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-blue-700 font-medium">Taxa Metabólica Basal (TMB):</span>
                                <span className="text-blue-800 ml-2">{localProfile.basalMetabolicRate} calorias/dia</span>
                              </div>
                              {Number(localProfile.totalDailyEnergyExpenditure) > 0 && (
                                <div>
                                  <span className="text-blue-700 font-medium">Gasto Energético Total (TDEE):</span>
                                  <span className="text-blue-800 ml-2">{localProfile.totalDailyEnergyExpenditure} calorias/dia</span>
                                </div>
                              )}
                            </div>
                            <p className="text-xs text-blue-600 mt-2">
                              * Estes valores são calculados automaticamente com base nos seus dados físicos e nível de atividade.
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-neutral-500 mb-1">Nível de Atividade</h4>
                            <p className="text-neutral-800">
                              {localProfile.activityLevel === 'sedentario' ? 'Sedentário' :
                               localProfile.activityLevel === 'leve' ? 'Levemente Ativo' :
                               localProfile.activityLevel === 'moderado' ? 'Moderadamente Ativo' :
                               localProfile.activityLevel === 'ativo' ? 'Muito Ativo' :
                               localProfile.activityLevel === 'muito_ativo' ? 'Extremamente Ativo' :
                               'Não informado'}
                            </p>
                          </div>

                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-neutral-500 mb-1">Frequência de Treinos</h4>
                            <p className="text-neutral-800">
                              {localProfile.workoutFrequency === '1-2' ? '1-2 vezes por semana' :
                               localProfile.workoutFrequency === '3-4' ? '3-4 vezes por semana' :
                               localProfile.workoutFrequency === '5-6' ? '5-6 vezes por semana' :
                               localProfile.workoutFrequency === '7' ? 'Todos os dias' :
                               'Não informado'}
                            </p>
                          </div>

                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-neutral-500 mb-1">Intensidade dos Treinos</h4>
                            <p className="text-neutral-800">
                              {localProfile.workoutIntensity === 'baixa' ? 'Baixa Intensidade' :
                               localProfile.workoutIntensity === 'moderada' ? 'Moderada' :
                               localProfile.workoutIntensity === 'alta' ? 'Alta Intensidade' :
                               localProfile.workoutIntensity === 'muito_alta' ? 'Muito Alta' :
                               'Não informado'}
                            </p>
                          </div>

                          <div className="bg-neutral-50 p-4 rounded-lg">
                            <h4 className="text-sm font-medium text-neutral-500 mb-1">Duração dos Treinos</h4>
                            <p className="text-neutral-800">
                              {localProfile.workoutDuration === '30min' ? 'Até 30 minutos' :
                               localProfile.workoutDuration === '45min' ? '30-45 minutos' :
                               localProfile.workoutDuration === '60min' ? '45-60 minutos' :
                               localProfile.workoutDuration === '90min' ? '60-90 minutos' :
                               localProfile.workoutDuration === '120min' ? 'Mais de 90 minutos' :
                               'Não informado'}
                            </p>
                          </div>
                        </div>

                        {/* Exibir cálculos */}
                        <div>
                          {Number(localProfile.basalMetabolicRate) > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <h4 className="font-medium text-blue-900 mb-2">Informações Metabólicas</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-blue-700 font-medium">Taxa Metabólica Basal (TMB):</span>
                                  <span className="text-blue-800 ml-2">{localProfile.basalMetabolicRate} calorias/dia</span>
                                </div>
                                {Number(localProfile.totalDailyEnergyExpenditure) > 0 && (
                                  <div>
                                    <span className="text-blue-700 font-medium">Gasto Energético Total (TDEE):</span>
                                    <span className="text-blue-800 ml-2">{localProfile.totalDailyEnergyExpenditure} calorias/dia</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'planos' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                  <h2 className="text-xl font-bold">Planos Alimentares Salvos</h2>
                  <Link
                    to="/planos"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Gerar Novo Plano
                  </Link>
                </div>

                <div className="p-6">
                  {savedPlans.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-neutral-600 mb-4">
                        Você ainda não tem nenhum plano alimentar salvo.
                      </p>
                      <Link
                        to="/planos"
                        className="text-primary-500 font-medium hover:text-primary-600"
                      >
                        Gerar meu primeiro plano →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {savedPlans.map((savedPlan) => (
                        <div
                          key={savedPlan.id}
                          className="bg-white rounded-lg shadow-sm"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                {savedPlan.plan.isCustomPlan === true ? (
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="text"
                                      defaultValue={savedPlan.plan.title || 'Plano Personalizado'}
                                      onBlur={async (e) => {
                                        const newTitle = e.target.value.trim();
                                        if (newTitle && newTitle !== savedPlan.plan.title) {
                                          const success = await updatePlan(savedPlan.id, {
                                            ...savedPlan,
                                            plan: {
                                              ...savedPlan.plan,
                                              title: newTitle
                                            }
                                          });
                                          if (success) {
                                            toast.success('Título atualizado com sucesso!');
                                          }
                                        }
                                      }}
                                      className="text-lg font-medium bg-transparent hover:bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 focus:outline-none"
                                    />
                                  </div>
                                ) : (
                                  <h3 className="text-lg font-medium">
                                    {savedPlan.plan.title}
                                  </h3>
                                )}
                                <p className="text-sm text-neutral-500">
                                  Criado em: {new Date(savedPlan.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeletePlan(savedPlan.id)}
                                className="text-red-500 hover:text-red-600 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>

                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div className="px-1">
                                <div className="text-sm text-neutral-500">Calorias</div>
                                <div className="font-medium">{savedPlan.plan.overview.calories} kcal</div>
                              </div>
                              <div className="px-1">
                                <div className="text-sm text-neutral-500">Proteínas</div>
                                <div className="font-medium">{savedPlan.plan.overview.protein}g</div>
                              </div>
                              <div className="px-1">
                                <div className="text-sm text-neutral-500">Carboidratos</div>
                                <div className="font-medium">{savedPlan.plan.overview.carbs}g</div>
                              </div>
                              <div className="px-1">
                                <div className="text-sm text-neutral-500">Gorduras</div>
                                <div className="font-medium">{savedPlan.plan.overview.fat}g</div>
                              </div>
                            </div>

                            <div className="mt-4">
                              <button
                                onClick={() => handleViewPlanDetails(savedPlan)}
                                className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                              >
                                Ver Detalhes →
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'progresso' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold">Progresso de Peso</h2>
                    <div className="flex flex-col xs:flex-row gap-2">
                      {localProfile.weightHistory && localProfile.weightHistory.length > 0 && (
                        <button
                          onClick={handleResetWeight}
                          className="flex items-center justify-center xs:justify-start gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                          <span className="hidden xs:inline">Resetar Histórico</span>
                          <span className="xs:hidden">Resetar</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowWeightModal(true)}
                        className="flex items-center justify-center xs:justify-start gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Scale size={18} />
                        <span className="hidden xs:inline">Registrar Peso</span>
                        <span className="xs:hidden">Registrar</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Peso Atual</h3>
                        <p className="text-2xl font-bold">
                          {localProfile.weightHistory && localProfile.weightHistory.length > 0
                            ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
                            : localProfile.weight} <span className="text-sm text-neutral-500">kg</span>
                        </p>
                        <div className="text-xs text-neutral-500">
                          <p>{localProfile.weightHistory && localProfile.weightHistory.length > 0
                            ? new Date(localProfile.weightHistory[localProfile.weightHistory.length - 1].date).toLocaleDateString('pt-BR')
                            : new Date().toLocaleDateString('pt-BR')}</p>
                          {localProfile.weightHistory && localProfile.weightHistory.length > 1 && (
                            <p className="mt-1">
                              {(() => {
                                const currentWeight = localProfile.weightHistory[localProfile.weightHistory.length - 1].weight;
                                const previousWeight = localProfile.weightHistory[localProfile.weightHistory.length - 2].weight;
                                const diff = currentWeight - previousWeight;
                                return (
                                  <span className={`font-medium ${diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-neutral-500'}`}>
                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                                  </span>
                                );
                              })()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Meta de Peso</h3>
                        <p className="text-2xl font-bold">{targetWeight} <span className="text-sm text-neutral-500">kg</span></p>
                        <p className="text-xs text-neutral-500">
                          {localProfile.goal === 'emagrecimento' && `Perder ${Math.abs(localProfile.weightHistory && localProfile.weightHistory.length > 0
                            ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight - targetWeight
                            : localProfile.weight - targetWeight)} kg`}
                          {localProfile.goal === 'hipertrofia' && `Ganhar ${Math.abs(targetWeight - (localProfile.weightHistory && localProfile.weightHistory.length > 0
                            ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
                            : localProfile.weight))} kg`}
                          {localProfile.goal === 'definicao' && 'Manter peso atual'}
                        </p>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">IMC</h3>
                        <p className="text-2xl font-bold">
                          {localProfile.height && (localProfile.weightHistory && localProfile.weightHistory.length > 0
                            ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
                            : localProfile.weight)
                            ? ((localProfile.weightHistory && localProfile.weightHistory.length > 0
                              ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
                              : localProfile.weight) / Math.pow(localProfile.height / 100, 2)).toFixed(1)
                            : '--'
                          }
                        </p>
                        <p className="text-xs text-neutral-500">
                          {localProfile.height && (localProfile.weightHistory && localProfile.weightHistory.length > 0
                            ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
                            : localProfile.weight)
                            ? (() => {
                              const imc = (localProfile.weightHistory && localProfile.weightHistory.length > 0
                                ? localProfile.weightHistory[localProfile.weightHistory.length - 1].weight
                                : localProfile.weight) / Math.pow(localProfile.height / 100, 2);
                              if (imc < 18.5) return 'Abaixo do peso';
                              if (imc < 25) return 'Peso normal';
                              if (imc < 30) return 'Sobrepeso';
                              return 'Obesidade';
                            })()
                            : 'Complete seu perfil'
                          }
                        </p>
                      </div>
                    </div>

                    <div className="h-64 bg-neutral-50 rounded-lg p-4 mb-4">
                      {localProfile.weightHistory && localProfile.weightHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ReLineChart
                            data={localProfile.weightHistory.map(entry => ({
                              date: new Date(entry.date).toLocaleDateString('pt-BR'),
                              peso: entry.weight
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="peso" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                          </ReLineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                          <Scale size={32} className="mb-2" />
                          <p>Registre seu peso para ver o gráfico de evolução</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Seção de Percentual de Gordura */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold">Percentual de Gordura</h2>
                    <div className="flex flex-col xs:flex-row gap-2">
                      {localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 0 && (
                        <button
                          onClick={handleResetBodyFat}
                          className="flex items-center justify-center xs:justify-start gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                          <span className="hidden xs:inline">Resetar Histórico</span>
                          <span className="xs:hidden">Resetar</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowBodyFatModal(true)}
                        className="flex items-center justify-center xs:justify-start gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Scale size={18} />
                        <span className="hidden xs:inline">Registrar % Gordura</span>
                        <span className="xs:hidden">Registrar</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">% Gordura Atual</h3>
                        <p className="text-2xl font-bold">
                          {localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 0
                            ? localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 1].bodyFat.toFixed(1)
                            : '--'} <span className="text-sm text-neutral-500">%</span>
                        </p>
                        <div className="text-xs text-neutral-500">
                          <p>{localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 0
                            ? new Date(localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 1].date).toLocaleDateString('pt-BR')
                            : 'Nenhum registro'}</p>
                          {localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 1 && (
                            <p className="mt-1">
                              {(() => {
                                const current = localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 1].bodyFat;
                                const previous = localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 2].bodyFat;
                                const diff = current - previous;
                                return (
                                  <span className={`font-medium ${diff < 0 ? 'text-green-500' : diff > 0 ? 'text-red-500' : 'text-neutral-500'}`}>
                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                                  </span>
                                );
                              })()}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Classificação</h3>
                        <p className="text-2xl font-bold">
                          {localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 0
                            ? (() => {
                              const bodyFat = localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 1].bodyFat;
                              const gender = localProfile.gender.toLowerCase();
                              
                              if (gender === 'masculino') {
                                if (bodyFat < 6) return 'Essencial';
                                if (bodyFat < 14) return 'Atleta';
                                if (bodyFat < 18) return 'Fitness';
                                if (bodyFat < 25) return 'Normal';
                                return 'Alto';
                              } else {
                                if (bodyFat < 14) return 'Essencial';
                                if (bodyFat < 21) return 'Atleta';
                                if (bodyFat < 25) return 'Fitness';
                                if (bodyFat < 32) return 'Normal';
                                return 'Alto';
                              }
                            })()
                            : '--'
                          }
                        </p>
                        <p className="text-xs text-neutral-500">
                          Baseado em padrões de composição corporal
                        </p>
                      </div>

                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h3 className="text-sm font-medium text-neutral-500 mb-1">Progresso</h3>
                        <p className="text-2xl font-bold">
                          {localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 1
                            ? (() => {
                              const current = localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 1].bodyFat;
                              const previous = localProfile.bodyFatHistory[localProfile.bodyFatHistory.length - 2].bodyFat;
                              const diff = current - previous;
                              return `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%`;
                            })()
                            : '--'
                          }
                        </p>
                        <p className="text-xs text-neutral-500">
                          Em relação à última medição
                        </p>
                      </div>
                    </div>

                    <div className="h-64 bg-neutral-50 rounded-lg p-4">
                      {localProfile.bodyFatHistory && localProfile.bodyFatHistory.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <ReLineChart
                            data={localProfile.bodyFatHistory.map(entry => ({
                              date: new Date(entry.date).toLocaleDateString('pt-BR'),
                              gordura: entry.bodyFat
                            }))}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
                            <Tooltip />
                            <Line type="monotone" dataKey="gordura" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
                          </ReLineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                          <Scale size={32} className="mb-2" />
                          <p>Registre seu percentual de gordura para ver o gráfico de evolução</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="flex justify-between items-center p-6 border-b border-neutral-100">
                    <h2 className="text-xl font-bold">Medidas Corporais</h2>
                    <div className="flex flex-col xs:flex-row gap-2">
                      {localProfile.measurements && localProfile.measurements.length > 0 && (
                        <button
                          onClick={handleResetMeasurements}
                          className="flex items-center justify-center xs:justify-start gap-2 px-4 py-2 text-red-600 hover:text-red-700 transition-colors"
                        >
                          <Trash2 size={18} />
                          <span className="hidden xs:inline">Resetar Medidas</span>
                          <span className="xs:hidden">Resetar</span>
                        </button>
                      )}
                      <button
                        onClick={() => setShowMeasurementsModal(true)}
                        className="flex items-center justify-center xs:justify-start gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                      >
                        <Ruler size={18} />
                        <span className="hidden xs:inline">Registrar Medidas</span>
                        <span className="xs:hidden">Registrar</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6">
                    {localProfile.measurements && localProfile.measurements.length > 0 ? (
                      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {[
                          { key: 'chest', label: 'Tórax' },
                          { key: 'waist', label: 'Cintura' },
                          { key: 'hips', label: 'Quadril' },
                          { key: 'arms', label: 'Braços' },
                          { key: 'thighs', label: 'Coxas' }
                        ].map(({ key, label }) => {
                          const lastMeasurement = localProfile.measurements[localProfile.measurements.length - 1];
                          const previousMeasurement = localProfile.measurements.length > 1
                            ? localProfile.measurements[localProfile.measurements.length - 2]
                            : null;
                          const value = Number(lastMeasurement[key as keyof typeof lastMeasurement]);
                          const previousValue = previousMeasurement
                            ? Number(previousMeasurement[key as keyof typeof previousMeasurement])
                            : null;
                          const diff = previousValue ? Number(value) - Number(previousValue) : 0;

                          return (
                            <div key={key} className="bg-neutral-50 p-4 rounded-lg">
                              <h3 className="text-sm font-medium text-neutral-500 mb-1">{label}</h3>
                              <p className="text-2xl font-bold">{value} <span className="text-sm text-neutral-500">cm</span></p>
                              {previousValue && (
                                <p className="text-xs text-neutral-500">
                                  <span className={diff > 0 ? 'text-green-500' : diff < 0 ? 'text-red-500' : 'text-neutral-500'}>
                                    {diff > 0 ? '+' : ''}{diff.toFixed(1)} cm
                                  </span>
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Ruler size={32} className="mx-auto mb-2 text-neutral-400" />
                        <p className="text-neutral-500">
                          Registre suas medidas corporais para acompanhar seu progresso
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calculadoras' && (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <CalculatorTab />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showWeightModal && <WeightModal />}
      {showMeasurementsModal && <MeasurementsModal />}
      {showBodyFatModal && <BodyFatModal />}
    </div>
  );
};

export default ProfilePage;