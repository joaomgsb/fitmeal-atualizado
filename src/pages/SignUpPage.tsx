import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Mail, Lock, User, AlertCircle, Activity, Calculator, Heart } from 'lucide-react';
import TermsOfUseModal from '../components/TermsOfUseModal';
import { recordTermsAcceptanceWithAudit } from '../lib/termsService';

const SignUpPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  // Etapa 2 - Dados físicos e preferências
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('');
  
  // Etapa 3 - Atividade física e gasto calórico
  const [activityLevel, setActivityLevel] = useState('');
  const [workoutFrequency, setWorkoutFrequency] = useState('');
  const [workoutIntensity, setWorkoutIntensity] = useState('');
  const [workoutDuration, setWorkoutDuration] = useState('');
  const [basalMetabolicRate, setBasalMetabolicRate] = useState('');
  const [totalDailyEnergyExpenditure, setTotalDailyEnergyExpenditure] = useState('');
  const [knowsCalorieNeeds, setKnowsCalorieNeeds] = useState(false);
  const [customCalorieNeeds, setCustomCalorieNeeds] = useState('');
  const [customProteinNeeds, setCustomProteinNeeds] = useState('');
  const [customCarbNeeds, setCustomCarbNeeds] = useState('');
  const [customFatNeeds, setCustomFatNeeds] = useState('');
  
  const [step, setStep] = useState(1);
  
  // Estados para o modal de termos
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const fitnessGoals = [
    { id: 'emagrecimento', label: 'Perda de Peso' },
    { id: 'hipertrofia', label: 'Ganho Muscular' },
    { id: 'definicao', label: 'Definição Muscular' }
  ];

  const dietOptions = [
    { id: 'proteica', label: 'Rica em Proteínas' },
    { id: 'lowcarb', label: 'Baixo Carboidrato' },
    { id: 'vegetariana', label: 'Vegetariana' },
    { id: 'vegana', label: 'Vegana' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'mediterranea', label: 'Mediterrânea' }
  ];

  const activityLevels = [
    { id: 'sedentario', label: 'Sedentário', description: 'Pouco ou nenhum exercício' },
    { id: 'leve', label: 'Levemente Ativo', description: 'Exercício leve 1-3 dias/semana' },
    { id: 'moderado', label: 'Moderadamente Ativo', description: 'Exercício moderado 3-5 dias/semana' },
    { id: 'ativo', label: 'Muito Ativo', description: 'Exercício intenso 6-7 dias/semana' },
    { id: 'muito_ativo', label: 'Extremamente Ativo', description: 'Exercício muito intenso, trabalho físico' }
  ];

  const workoutFrequencies = [
    { id: '1-2', label: '1-2 vezes por semana' },
    { id: '3-4', label: '3-4 vezes por semana' },
    { id: '5-6', label: '5-6 vezes por semana' },
    { id: '7', label: 'Todos os dias' }
  ];

  const workoutIntensities = [
    { id: 'baixa', label: 'Baixa Intensidade', description: 'Caminhada, yoga, alongamento' },
    { id: 'moderada', label: 'Moderada', description: 'Corrida leve, musculação moderada' },
    { id: 'alta', label: 'Alta Intensidade', description: 'HIIT, musculação pesada, esportes' },
    { id: 'muito_alta', label: 'Muito Alta', description: 'CrossFit, atletismo profissional' }
  ];

  const workoutDurations = [
    { id: '30min', label: 'Até 30 minutos' },
    { id: '45min', label: '30-45 minutos' },
    { id: '60min', label: '45-60 minutos' },
    { id: '90min', label: '60-90 minutos' },
    { id: '120min', label: 'Mais de 90 minutos' }
  ];

  // Função para calcular TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
  const calculateBMR = () => {
    if (!weight || !height || !age || !gender) return 0;
    
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseFloat(age);
    
    if (gender === 'Masculino') {
      return Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5);
    } else {
      return Math.round(10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161);
    }
  };

  // Função para calcular TDEE (Gasto Energético Total Diário)
  const calculateTDEE = () => {
    const bmr = calculateBMR();
    if (!bmr || !activityLevel) return 0;
    
    const activityMultipliers = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'ativo': 1.725,
      'muito_ativo': 1.9
    };
    
    return Math.round(bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]);
  };

  // Atualizar cálculos quando dados mudarem
  React.useEffect(() => {
    if (weight && height && age && gender) {
      const bmr = calculateBMR();
      setBasalMetabolicRate(bmr.toString());
      
      if (activityLevel) {
        const tdee = calculateTDEE();
        setTotalDailyEnergyExpenditure(tdee.toString());
      }
    }
  }, [weight, height, age, gender, activityLevel]);

  const handleTermsAcceptance = async () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    
    // Mensagem de confirmação
    setError('');
    console.log('Termos de uso aceitos pelo usuário');
  };

  const handleProceedToSignup = () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }
    // Se já aceitou os termos, continua com o cadastro
    proceedWithSignup();
  };

  const proceedWithSignup = async () => {
    try {
      setError('');
      setLoading(true);
      const userCredential = await signUp(email, password);
      
      // Criar perfil inicial do usuário
      if (userCredential.user) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          gender,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          goal,
          activityLevel,
          workoutFrequency,
          workoutIntensity,
          workoutDuration,
          basalMetabolicRate: Number(basalMetabolicRate),
          totalDailyEnergyExpenditure: Number(totalDailyEnergyExpenditure),
          knowsCalorieNeeds,
          customCalorieNeeds: knowsCalorieNeeds ? Number(customCalorieNeeds) : 0,
          customProteinNeeds: knowsCalorieNeeds ? Number(customProteinNeeds) : 0,
          customCarbNeeds: knowsCalorieNeeds ? Number(customCarbNeeds) : 0,
          customFatNeeds: knowsCalorieNeeds ? Number(customFatNeeds) : 0,
          dietPreferences,
          allergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
          startDate: new Date().toISOString()
        });

        // Registrar aceitação dos termos de uso
        await recordTermsAcceptanceWithAudit(
          userCredential.user.uid,
          email,
          name,
          'signup'
        );
      }
      
      navigate('/perfil');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setError('Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem');
    }

    // Verificar se todos os campos estão preenchidos
    if (!name || !email || !password || !confirmPassword || !gender || !age || !height || !weight || !goal) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Abrir modal de termos se ainda não foi aceito
    handleProceedToSignup();
  };

  const validateStep1 = () => {
    return name && email && password && confirmPassword && password === confirmPassword;
  };

  const validateStep2 = () => {
    return gender && age && height && weight && goal;
  };

  const validateStep3 = () => {
    return activityLevel && workoutFrequency && workoutIntensity && workoutDuration;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 py-8">
      <div className="max-w-md w-full">
        <div className={`text-center ${step === 2 ? 'mb-12' : 'mb-8'}`}>
          <h2 className="text-3xl font-bold font-display mb-2">Crie sua conta</h2>
          <p className="text-neutral-600">
            Comece sua jornada para uma vida mais saudável
          </p>
          
          {/* Indicador de progresso */}
          <div className="flex justify-center mt-6 mb-4">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-neutral-200 text-neutral-500'
                  }`}>
                    {stepNumber}
                  </div>
                  {stepNumber < 3 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      step > stepNumber ? 'bg-primary-500' : 'bg-neutral-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <p className="text-sm text-neutral-500">
            {step === 1 && 'Informações Básicas'}
            {step === 2 && 'Dados Físicos e Preferências'}
            {step === 3 && 'Atividade Física e Metabolismo'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Confirmar Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!validateStep1()) {
                    setError('Preencha todos os campos corretamente.');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className="w-full py-2 rounded-lg font-medium transition-colors bg-primary-500 text-white hover:bg-primary-600"
              >
                Prosseguir
              </button>
            </>
          )}
          
          {step === 2 && (
            <>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Gênero</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>Selecione</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Idade</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    min={1}
                    max={120}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Altura (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    min={50}
                    max={250}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Peso (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                    min={20}
                    max={300}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Objetivo Fitness</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  >
                    <option value="" disabled>Selecione</option>
                    {fitnessGoals.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Preferências Alimentares</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {dietOptions.map(option => (
                      <button
                        type="button"
                        key={option.id}
                        onClick={() => {
                          if (dietPreferences.includes(option.id)) {
                            setDietPreferences(dietPreferences.filter(o => o !== option.id));
                          } else {
                            setDietPreferences([...dietPreferences, option.id]);
                          }
                        }}
                        className={`px-4 py-2 rounded-full border transition-colors font-medium text-sm
                          ${dietPreferences.includes(option.id)
                            ? 'bg-primary-500 text-white border-primary-500 shadow'
                            : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-neutral-500">Clique para selecionar uma ou mais opções.</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Alergias/Intolerâncias</label>
                  <input
                    type="text"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-3 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ex: lactose, glúten, amendoim..."
                  />
                </div>
              </div>
              <div className="flex flex-col gap-3 items-center mt-8">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-neutral-200 text-neutral-700 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!validateStep2()) {
                      setError('Preencha todos os campos obrigatórios.');
                      return;
                    }
                    setError('');
                    setStep(3);
                  }}
                  className="w-full bg-primary-500 text-white py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Prosseguir
                </button>
              </div>
            </>
          )}
          
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nível de Atividade Física</label>
                <select
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Selecione</option>
                  {activityLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.label} - {level.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Frequência de Treinos</label>
                <select
                  value={workoutFrequency}
                  onChange={(e) => setWorkoutFrequency(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Selecione</option>
                  {workoutFrequencies.map(freq => (
                    <option key={freq.id} value={freq.id}>{freq.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Intensidade dos Treinos</label>
                <select
                  value={workoutIntensity}
                  onChange={(e) => setWorkoutIntensity(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Selecione</option>
                  {workoutIntensities.map(intensity => (
                    <option key={intensity.id} value={intensity.id}>
                      {intensity.label} - {intensity.description}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Duração dos Treinos</label>
                <select
                  value={workoutDuration}
                  onChange={(e) => setWorkoutDuration(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Selecione</option>
                  {workoutDurations.map(duration => (
                    <option key={duration.id} value={duration.id}>{duration.label}</option>
                  ))}
                </select>
              </div>
              
              {/* Cálculos automáticos */}
              {(basalMetabolicRate || totalDailyEnergyExpenditure) && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <h4 className="font-medium text-blue-900 flex items-center gap-2">
                    <Calculator size={16} />
                    Cálculos Automáticos
                  </h4>
                  {basalMetabolicRate && (
                    <p className="text-sm text-blue-800">
                      <strong>Taxa Metabólica Basal (TMB):</strong> {basalMetabolicRate} calorias/dia
                    </p>
                  )}
                  {totalDailyEnergyExpenditure && (
                    <p className="text-sm text-blue-800">
                      <strong>Gasto Energético Total (TDEE):</strong> {totalDailyEnergyExpenditure} calorias/dia
                    </p>
                  )}
                  <p className="text-xs text-blue-600 mt-2">
                    * Estes valores são calculados automaticamente com base nos seus dados. 
                    A IA usará essas informações para gerar planos alimentares mais precisos.
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="knowsCalorieNeeds"
                    checked={knowsCalorieNeeds}
                    onChange={(e) => setKnowsCalorieNeeds(e.target.checked)}
                    className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                  />
                  <label htmlFor="knowsCalorieNeeds" className="text-sm text-neutral-700">
                    Eu sei minhas necessidades calóricas específicas (opcional)
                  </label>
                </div>
                
                {knowsCalorieNeeds && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-4">
                    <h4 className="font-medium text-blue-900 flex items-center gap-2">
                      <Calculator size={16} />
                      Suas Necessidades Calóricas Específicas
                    </h4>
                    <p className="text-sm text-blue-800">
                      Insira suas necessidades calóricas e de macronutrientes específicas. 
                      A IA usará essas informações em vez dos cálculos automáticos.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          Calorias Diárias (kcal)
                        </label>
                        <input
                          type="number"
                          value={customCalorieNeeds}
                          onChange={(e) => setCustomCalorieNeeds(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 2200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          Proteínas (g)
                        </label>
                        <input
                          type="number"
                          value={customProteinNeeds}
                          onChange={(e) => setCustomProteinNeeds(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 150"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          Carboidratos (g)
                        </label>
                        <input
                          type="number"
                          value={customCarbNeeds}
                          onChange={(e) => setCustomCarbNeeds(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 200"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-900 mb-1">
                          Gorduras (g)
                        </label>
                        <input
                          type="number"
                          value={customFatNeeds}
                          onChange={(e) => setCustomFatNeeds(e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: 70"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-2 items-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-full bg-neutral-200 text-neutral-700 py-2 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading || !validateStep3()}
                  className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Criando conta...' : termsAccepted ? 'Criar Conta' : 'Aceitar Termos e Criar Conta'}
                </button>
                {termsAccepted && (
                  <div className="mt-2 text-center">
                    <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                      ✓ Termos de uso aceitos
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </form>

        <div className={`text-center ${step === 2 ? 'mt-8' : 'mt-6'}`}>
          <p className="text-neutral-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Modal de Termos de Uso */}
      <TermsOfUseModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAcceptance}
      />
    </div>
  );
};

export default SignUpPage;