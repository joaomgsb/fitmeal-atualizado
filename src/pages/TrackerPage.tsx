import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { 
  LineChart as LucideLineChart, BarChart3, Calendar as CalendarIcon, 
  ChevronLeft, ChevronRight, Clock, Flame, Beef, Wheat, Droplet,
  ChevronDown
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart as RePieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { useMealPlans } from '../hooks/useMealPlans';
import { Link } from 'react-router-dom';
import { getFoodNutritionInfo, FoodNutritionInfo } from '../lib/openai';

interface Food {
  name: string;
  amount: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  preparation?: string;
}

interface Meal {
  id?: number | string;
  time: string;
  name: string;
  description?: string;
  foods: Food[];
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface PlanOverview {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: number;
  duration: string;
  goals?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface Plan {
  overview: PlanOverview;
  meals: Meal[];
  features: string[];
  tips: string[];
  substitutions: Array<{
    food: string;
    alternatives: string[];
  }>;
  id?: string;
  title?: string;
  isCustomPlan?: boolean;
}

const COLORS = ['#EF4444', '#FBBF24', '#3B82F6'];

const TrackerPage: React.FC = () => {
  const [activeView, setActiveView] = useState<'diario' | 'semanal' | 'mensal'>('diario');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showPlanSelector, setShowPlanSelector] = useState(false);
  const [showGoalsEditor, setShowGoalsEditor] = useState(false);
  const [goals, setGoals] = useState<{
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  } | null>(null);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(new Set());
  const [dailyMeals, setDailyMeals] = useState<Meal[]>([]);
  const [showEditMealModal, setShowEditMealModal] = useState(false);
  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);
  const [loadingNutrition, setLoadingNutrition] = useState<number | null>(null); // Para controlar loading por alimento
  
  const { savedPlans } = useMealPlans();
  const selectedPlan: Plan | undefined = savedPlans.find(plan => plan.id === selectedPlanId)?.plan;
  
  const displayDate = currentDate.toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };
  
  const prevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };
  
  // Inicializa as metas e as refeições diárias quando um plano é selecionado ou a data muda (simplificado para plano selecionado por enquanto)
  React.useEffect(() => {
    if (selectedPlan) {
      // Calcula o total de calorias das refeições do plano para usar como meta
      const totalPlanCalories = selectedPlan.meals.reduce((total, meal) => {
        return total + (meal.totalCalories || 0);
      }, 0);
      
      const totalPlanProtein = selectedPlan.meals.reduce((total, meal) => {
        return total + (meal.totalProtein || 0);
      }, 0);
      
      const totalPlanCarbs = selectedPlan.meals.reduce((total, meal) => {
        return total + (meal.totalCarbs || 0);
      }, 0);
      
      const totalPlanFat = selectedPlan.meals.reduce((total, meal) => {
        return total + (meal.totalFat || 0);
      }, 0);
      
      setGoals({ // Inicializa as metas com base no total das refeições do plano
        calories: totalPlanCalories,
        protein: totalPlanProtein,
        carbs: totalPlanCarbs,
        fat: totalPlanFat
      });
      // Inicializa as refeições diárias com as refeições do plano. 
      // Em uma aplicação real, você buscaria/filtraria as refeições específicas para a currentDate
      // Atribuindo IDs string para compatibilidade com Set<string>
      setDailyMeals(selectedPlan.meals.map(meal => ({
        ...meal,
        id: meal.id !== undefined ? String(meal.id) : `${meal.time}-${meal.name}` // Garante ID string ou undefined
      })));
      // Limpa as refeições completadas ao carregar um novo plano
      setCompletedMeals(new Set());
    }
  }, [selectedPlan]); // Depende apenas do plano selecionado por enquanto

  // Função para gerar dados da semana
  const getWeekData = () => {
    if (!selectedPlan || !goals) return [];
    
    const weekData = [];
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + i);
      
      weekData.push({
        name: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][i],
        calories: selectedPlan.overview.calories,
        goal: goals.calories,
        protein: selectedPlan.overview.protein,
        proteinGoal: goals.protein,
        carbs: selectedPlan.overview.carbs,
        carbsGoal: goals.carbs,
        fat: selectedPlan.overview.fat,
        fatGoal: goals.fat,
        date: date.toISOString()
      });
    }

    return weekData;
  };

  // Função para gerar dados do mês
  const getMonthData = () => {
    if (!selectedPlan || !goals) return [];
    
    const monthData = [];
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    
    // Gera dados baseados no dia da semana para ter um padrão realista
    for (let i = 1; i <= endOfMonth.getDate(); i++) {
      const date = new Date(startOfMonth);
      date.setDate(i);
      const dayOfWeek = date.getDay(); // 0 = Domingo, 6 = Sábado
      
      // Simula um padrão realista onde:
      // - Dias de semana têm maior aderência (70-90%)
      // - Fins de semana têm menor aderência (50-70%)
      // - Alguns dias têm variações para simular eventos especiais
      let adherence = 0;
      let calories = selectedPlan.overview.calories;
      
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        // Fins de semana
        adherence = 60 + ((i * 13) % 11); // Varia entre 60-70%
        calories = Math.round(selectedPlan.overview.calories * (1 + (i % 3) * 0.1)); // +0-20% calorias
      } else {
        // Dias de semana
        adherence = 80 + ((i * 17) % 11); // Varia entre 80-90%
        calories = Math.round(selectedPlan.overview.calories * (0.9 + (i % 2) * 0.1)); // ±10% calorias
      }
      
      // Simula alguns eventos especiais (ex: feriados, eventos sociais)
      if (i % 7 === 0) {
        adherence = 50 + ((i * 11) % 16); // Dias especiais têm maior variação
        calories = Math.round(selectedPlan.overview.calories * 1.2); // +20% calorias
      }
      
      monthData.push({
        day: i,
        calories: calories,
        adherence: adherence,
        date: date.toISOString(),
        goal: goals.calories
      });
    }

    return monthData;
  };

  // Função para marcar/desmarcar refeição
  const toggleMealCompleted = (mealId: string) => {
    const newCompletedMeals = new Set(completedMeals);
    if (newCompletedMeals.has(mealId)) {
      newCompletedMeals.delete(mealId);
    } else {
      newCompletedMeals.add(mealId);
    }
    setCompletedMeals(newCompletedMeals);
  };

  // Função placeholder para salvar edição de refeição
  const handleEditMealSave = (editedMeal: Meal) => {
    console.log('Salvando edição da refeição (placeholder):', editedMeal);
    // Lógica para atualizar a refeição no estado dailyMeals seria implementada aqui
    // Ex: setDailyMeals(dailyMeals.map(meal => meal.id === editedMeal.id ? editedMeal : meal));
    setMealToEdit(null);
    setShowEditMealModal(false);
  };

  // Função para buscar informações nutricionais automaticamente
  const handleAutoFillNutrition = async (foodIndex: number) => {
    if (!mealToEdit) return;
    
    const food = mealToEdit.foods[foodIndex];
    if (!food.name.trim()) {
      alert('Por favor, digite o nome do alimento primeiro.');
      return;
    }
    
    setLoadingNutrition(foodIndex);
    
    try {
      const nutritionInfo = await getFoodNutritionInfo(food.name, food.amount);
      
      const newFoods = [...mealToEdit.foods];
      newFoods[foodIndex] = {
        ...newFoods[foodIndex],
        calories: nutritionInfo.calories,
        protein: nutritionInfo.protein,
        carbs: nutritionInfo.carbs,
        fat: nutritionInfo.fat
      };
      
      setMealToEdit({ ...mealToEdit, foods: newFoods });
    } catch (error) {
      console.error('Erro ao buscar informações nutricionais:', error);
      alert('Erro ao buscar informações nutricionais. Tente novamente.');
    } finally {
      setLoadingNutrition(null);
    }
  };

  // Função para abrir o modal de edição
  const handleEditMeal = (meal: Meal) => {
      setMealToEdit(meal);
      setShowEditMealModal(true);
  };

  // Se não houver plano selecionado, mostrar mensagem para selecionar
  if (!selectedPlan) {
    return (
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">
              Rastreador <span className="text-primary-500">Nutricional</span>
            </h1>
            <p className="text-neutral-600">
              Acompanhe seu consumo diário de nutrientes e mantenha-se no caminho certo para atingir seus objetivos.
            </p>
          </div>
          
          {/* View Selector */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveView('diario')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                  activeView === 'diario' 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <Clock size={18} />
                Diário
              </button>

              
              {/* Plan Selector */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowPlanSelector(!showPlanSelector)}
                  className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg flex items-center gap-2 hover:bg-primary-100 transition-colors"
                >
                  Selecionar Plano
                  <ChevronDown size={16} />
                </button>
                
                {showPlanSelector && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-100 z-10">
                    <div className="p-4">
                      <h3 className="font-medium mb-2">Planos Personalizados</h3>
                      {savedPlans.length === 0 ? (
                        <div className="text-center py-4">
                          <p className="text-neutral-500 text-sm mb-2">
                            Você ainda não tem planos salvos.
                          </p>
                          <Link
                            to="/planos"
                            className="text-primary-500 text-sm font-medium hover:text-primary-600"
                          >
                            Criar um plano →
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {savedPlans.map((plan) => (
                            <button
                              key={plan.id}
                              onClick={() => {
                                setSelectedPlanId(plan.id);
                                setShowPlanSelector(false);
                              }}
                              className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                                selectedPlanId === plan.id
                                  ? 'bg-primary-50 text-primary-700'
                                  : 'hover:bg-neutral-50'
                              }`}
                            >
                              <div className="font-medium">
                                {plan.plan.isCustomPlan === true 
                                  ? (plan.plan.title || 'Plano Personalizado')
                                  : plan.plan.title}
                              </div>
                              <div className="text-sm text-neutral-500">
                                {new Date(plan.createdAt).toLocaleDateString()}
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">Selecione um Plano Alimentar</h2>
              <p className="text-neutral-600 mb-6">
                Para começar a rastrear sua alimentação, selecione um plano personalizado ou crie um novo plano adaptado aos seus objetivos.
              </p>
              {savedPlans.length === 0 ? (
                <Link
                  to="/planos"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Criar Meu Primeiro Plano
                </Link>
              ) : (
                <button
                  onClick={() => setShowPlanSelector(true)}
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Selecionar um Plano
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dados do plano selecionado - Calculados apenas das refeições marcadas como completadas
  const calculatedTotals = dailyMeals.reduce((totals, meal) => {
    const mealId = String(meal.id || `${meal.time}-${meal.name}`);
    // Só conta se a refeição está marcada como completada
    if (completedMeals.has(mealId)) {
      totals.calories += meal.totalCalories || 0;
      totals.protein += meal.totalProtein || 0;
      totals.carbs += meal.totalCarbs || 0;
      totals.fat += meal.totalFat || 0;
    }
    return totals;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const totalCalories = calculatedTotals.calories;
  const totalProtein = calculatedTotals.protein;
  const totalCarbs = calculatedTotals.carbs;
  const totalFat = calculatedTotals.fat;
  
  // Usar goal se existir no estado goals, senão o do plano, senão 0
  const caloryGoal = goals?.calories || selectedPlan?.overview.calories || 0;
  const remainingCalories = caloryGoal - totalCalories;

  const macrosData = [
    { name: 'Proteínas', value: totalProtein, color: '#EF4444' },
    { name: 'Carboidratos', value: totalCarbs, color: '#FBBF24' },
    { name: 'Gorduras', value: totalFat, color: '#3B82F6' },
  ];
  
  return (
    <PageTransition>
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-display mb-2">
            Rastreador <span className="text-primary-500">Nutricional</span>
          </h1>
          <p className="text-neutral-600">
            Acompanhe seu consumo diário de nutrientes e mantenha-se no caminho certo para atingir seus objetivos.
          </p>
        </div>
        
        {/* View Selector */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveView('diario')}
              className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                activeView === 'diario' 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              <Clock size={18} />
              Diário
            </button>

            
            {/* Plan Selector */}
            <div className="relative ml-auto">
              <button
                onClick={() => setShowPlanSelector(!showPlanSelector)}
                className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg flex items-center gap-2 hover:bg-primary-100 transition-colors"
              >
                {selectedPlan ? (
                  selectedPlan.isCustomPlan === true 
                    ? (selectedPlan.title || 'Plano Personalizado')
                    : selectedPlan.title
                ) : 'Selecionar Plano'}
                <ChevronDown size={16} />
              </button>
              
              {showPlanSelector && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-neutral-100 z-10">
                  <div className="p-4">
                    <h3 className="font-medium mb-2">Planos Personalizados</h3>
                    {savedPlans.length === 0 ? (
                      <div className="text-center py-4">
                        <p className="text-neutral-500 text-sm mb-2">
                          Você ainda não tem planos salvos.
                        </p>
                        <Link
                          to="/planos"
                          className="text-primary-500 text-sm font-medium hover:text-primary-600"
                        >
                          Criar um plano →
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {savedPlans.map((plan) => (
                          <button
                            key={plan.id}
                            onClick={() => {
                              setSelectedPlanId(plan.id);
                              setShowPlanSelector(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                              selectedPlanId === plan.id
                                ? 'bg-primary-50 text-primary-700'
                                : 'hover:bg-neutral-50'
                            }`}
                          >
                            <div className="font-medium">
                              {plan.plan.isCustomPlan === true 
                                ? (plan.plan.title || 'Plano Personalizado')
                                : plan.plan.title}
                            </div>
                            <div className="text-sm text-neutral-500">
                              {new Date(plan.createdAt).toLocaleDateString()}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={prevDay}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-neutral-500" />
                <span className="font-medium">{displayDate}</span>
              </div>
              <button 
                onClick={nextDay}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
        
        {activeView === 'diario' && (
          <>
            {/* Daily Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
              <div className="lg:col-span-8">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Resumo do Dia</h2>
                    <span className="text-sm text-neutral-500">Meta: {caloryGoal} kcal</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Flame size={16} className="text-energy-500" />
                        <span className="text-sm text-neutral-500">Calorias</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">{totalCalories}</span>
                        <span className="text-sm text-neutral-500">kcal</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Beef size={16} className="text-red-500" />
                        <span className="text-sm text-neutral-500">Proteínas</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">{totalProtein}</span>
                        <span className="text-sm text-neutral-500">g</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Wheat size={16} className="text-yellow-500" />
                        <span className="text-sm text-neutral-500">Carboidratos</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">{totalCarbs}</span>
                        <span className="text-sm text-neutral-500">g</span>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Droplet size={16} className="text-blue-500" />
                        <span className="text-sm text-neutral-500">Gorduras</span>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-2xl font-bold">{totalFat}</span>
                        <span className="text-sm text-neutral-500">g</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progresso calórico</span>
                      <span>{Math.round((totalCalories / caloryGoal) * 100)}%</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-2.5">
                      <div 
                        className={`h-2.5 rounded-full ${remainingCalories >= 0 ? 'bg-primary-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min((totalCalories / caloryGoal) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap justify-between text-sm text-neutral-500">
                    <div>
                      <span className="font-medium text-neutral-800">{remainingCalories >= 0 ? remainingCalories : 0}</span> kcal restantes
                    </div>
                    <div>
                      Macro split: <span className="font-medium text-neutral-800">
                        {totalCalories > 0 ? Math.round((totalProtein * 4 / totalCalories) * 100) : 0}% / 
                        {totalCalories > 0 ? Math.round((totalCarbs * 4 / totalCalories) * 100) : 0}% / 
                        {totalCalories > 0 ? Math.round((totalFat * 9 / totalCalories) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                  <h2 className="text-xl font-bold mb-4">Distribuição de Macros</h2>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={macrosData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {macrosData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-6 mt-4">
                    {macrosData.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                        <span className="text-sm">{entry.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Meals */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Refeições do Dia</h2>
              </div>
              
              <div className="space-y-4">
                {dailyMeals.map((meal) => {
                  const mealId = String(meal.id || `${meal.time}-${meal.name}`);
                  const isCompleted = completedMeals.has(mealId);

                  return (
                    <motion.div 
                      key={mealId}
                      className={`bg-white rounded-lg shadow-sm overflow-hidden ${isCompleted ? 'opacity-60' : ''}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <div className="p-4 flex justify-between items-center cursor-pointer hover:bg-neutral-50">
                        <div className="flex items-center gap-4">
                          <button 
                            onClick={() => toggleMealCompleted(mealId)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted ? 'bg-green-500 text-white' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'}`}
                            aria-label={isCompleted ? 'Desmarcar refeição como completada' : 'Marcar refeição como completada'}
                          >
                            {isCompleted ? (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
                            )}
                          </button>

                          <div className="flex-1">
                            <h3 className={`font-medium ${isCompleted ? 'line-through text-neutral-500' : ''}`}>{meal.name}</h3>
                            <span className={`text-sm ${isCompleted ? 'line-through text-neutral-400' : 'text-neutral-500'}`}>{meal.time}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden sm:block text-right">
                            <span className="text-sm text-neutral-500">Calorias</span>
                            <p className={`font-medium ${isCompleted ? 'line-through text-neutral-500' : ''}`}>{meal.totalCalories} kcal</p>
                          </div>
                          <div className="hidden md:flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Beef size={14} className={`text-red-500 ${isCompleted ? 'opacity-60' : ''}`} />
                              <span className={`text-sm font-medium ${isCompleted ? 'line-through text-neutral-500' : ''}`}>{meal.totalProtein}g</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Wheat size={14} className={`text-yellow-500 ${isCompleted ? 'opacity-60' : ''}`} />
                              <span className={`text-sm font-medium ${isCompleted ? 'line-through text-neutral-500' : ''}`}>{meal.totalCarbs}g</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Droplet size={14} className={`text-blue-500 ${isCompleted ? 'opacity-60' : ''}`} />
                              <span className={`text-sm font-medium ${isCompleted ? 'line-through text-neutral-500' : ''}`}>{meal.totalFat}g</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleEditMeal(meal)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-primary-500 hover:bg-neutral-200 transition-colors ml-4"
                            aria-label="Editar refeição"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                          </button>
                          <ChevronRight size={18} className="text-neutral-400" />
                        </div>
                      </div>
                      
                      <div className={`px-4 pb-4 ${isCompleted ? 'opacity-60' : ''}`}>
                        <table className="w-full text-sm">
                          <thead className="text-neutral-500">
                            <tr>
                              <th className="py-2 text-left w-[30%]">Alimento</th>
                              <th className="py-2 text-right w-[15%]">Quantidade</th>
                              <th className="py-2 text-right w-[15%]">Calorias</th>
                              <th className="hidden md:table-cell py-2 text-right w-[13%]">P</th>
                              <th className="hidden md:table-cell py-2 text-right w-[13%]">C</th>
                              <th className="hidden md:table-cell py-2 text-right w-[13%]">G</th>
                            </tr>
                          </thead>
                          <tbody>
                            {meal.foods.map((food, idx) => (
                              <tr key={idx} className="border-t border-neutral-100">
                                <td className="py-2 text-left">{food.name}</td>
                                <td className="py-2 text-right text-neutral-500 whitespace-nowrap">{food.amount}</td>
                                <td className="py-2 text-right whitespace-nowrap">{food.calories} kcal</td>
                                <td className="hidden md:table-cell py-2 text-right whitespace-nowrap">{food.protein}g</td>
                                <td className="hidden md:table-cell py-2 text-right whitespace-nowrap">{food.carbs}g</td>
                                <td className="hidden md:table-cell py-2 text-right whitespace-nowrap">{food.fat}g</td>
                              </tr>
                            ))}
                            <tr className="border-t border-neutral-200">
                              <td className="py-2 font-medium">Total</td>
                              <td className="py-2"></td>
                              <td className="py-2 text-right font-medium whitespace-nowrap">{meal.totalCalories} kcal</td>
                              <td className="hidden md:table-cell py-2 text-right font-medium whitespace-nowrap">{meal.totalProtein}g</td>
                              <td className="hidden md:table-cell py-2 text-right font-medium whitespace-nowrap">{meal.totalCarbs}g</td>
                              <td className="hidden md:table-cell py-2 text-right font-medium whitespace-nowrap">{meal.totalFat}g</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Modal para Editar Refeição (Estrutura básica) */}
            {showEditMealModal && mealToEdit && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-auto relative">
                        <h3 className="text-xl font-bold mb-4">Editar Refeição: {mealToEdit.name}</h3>
                        
                        {/* Formulário de edição de alimentos */}
                        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                            <div>
                                <label htmlFor="editMealTime" className="block text-sm font-medium text-neutral-700">Horário</label>
                                <input 
                                    type="time" 
                                    id="editMealTime" 
                                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2" 
                                    value={mealToEdit.time} 
                                    onChange={(e) => {
                                        setMealToEdit({ ...mealToEdit, time: e.target.value });
                                    }}
                                />
                            </div>

                            <h4 className="font-semibold text-neutral-800 mt-4 mb-2">Alimentos:</h4>
                            <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
                                <p className="text-sm text-blue-700">
                                    💡 <strong>Dica:</strong> Digite o nome do alimento e clique em "Buscar Info Nutricional" para preencher automaticamente as calorias e macronutrientes!
                                </p>
                            </div>
                            {mealToEdit.foods.map((food, foodIndex) => (
                                <div key={foodIndex} className="border border-neutral-200 rounded-md p-3 space-y-2 bg-neutral-50">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700">Nome do Alimento</label>
                                        <input 
                                            type="text" 
                                            value={food.name}
                                            onChange={(e) => {
                                                const newFoods = [...mealToEdit.foods];
                                                newFoods[foodIndex] = { ...newFoods[foodIndex], name: e.target.value };
                                                setMealToEdit({ ...mealToEdit, foods: newFoods });
                                            }}
                                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 text-sm"
                                        />
                                    </div>
                                     <div>
                                        <label className="block text-sm font-medium text-neutral-700">Quantidade</label>
                                        <input 
                                            type="text" 
                                            value={food.amount}
                                            onChange={(e) => {
                                                const newFoods = [...mealToEdit.foods];
                                                newFoods[foodIndex] = { ...newFoods[foodIndex], amount: e.target.value };
                                                setMealToEdit({ ...mealToEdit, foods: newFoods });
                                            }}
                                            className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 text-sm"
                                        />
                                    </div>
                                    
                                    {/* Botão para busca automática de informações nutricionais */}
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleAutoFillNutrition(foodIndex)}
                                            disabled={loadingNutrition === foodIndex || !food.name.trim()}
                                            className={`px-3 py-1 text-sm rounded-md flex items-center gap-2 transition-colors ${
                                                loadingNutrition === foodIndex
                                                    ? 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                                                    : 'bg-primary-100 text-primary-700 hover:bg-primary-200'
                                            }`}
                                        >
                                            {loadingNutrition === foodIndex ? (
                                                <>
                                                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Buscando...
                                                </>
                                            ) : (
                                                <>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                                                    Buscar Info Nutricional
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {/* Campos de macros - Simplificados por enquanto, edição completa exigiria mais inputs */}
                                     <div className="grid grid-cols-3 gap-3">
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700">Kcal</label>
                                            <input 
                                                type="number" 
                                                value={food.calories}
                                                onChange={(e) => {
                                                    const newFoods = [...mealToEdit.foods];
                                                    newFoods[foodIndex] = { ...newFoods[foodIndex], calories: Number(e.target.value) };
                                                    setMealToEdit({ ...mealToEdit, foods: newFoods });
                                                }}
                                                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 text-sm"
                                            />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-neutral-700">P (g)</label>
                                            <input 
                                                type="number" 
                                                value={food.protein}
                                                onChange={(e) => {
                                                    const newFoods = [...mealToEdit.foods];
                                                    newFoods[foodIndex] = { ...newFoods[foodIndex], protein: Number(e.target.value) };
                                                    setMealToEdit({ ...mealToEdit, foods: newFoods });
                                                }}
                                                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 text-sm"
                                            />
                                        </div>
                                         <div>
                                            <label className="block text-sm font-medium text-neutral-700">C (g)</label>
                                            <input 
                                                type="number" 
                                                value={food.carbs}
                                                onChange={(e) => {
                                                    const newFoods = [...mealToEdit.foods];
                                                    newFoods[foodIndex] = { ...newFoods[foodIndex], carbs: Number(e.target.value) };
                                                    setMealToEdit({ ...mealToEdit, foods: newFoods });
                                                }}
                                                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-neutral-700">G (g)</label>
                                            <input 
                                                type="number" 
                                                value={food.fat}
                                                onChange={(e) => {
                                                    const newFoods = [...mealToEdit.foods];
                                                    newFoods[foodIndex] = { ...newFoods[foodIndex], fat: Number(e.target.value) };
                                                    setMealToEdit({ ...mealToEdit, foods: newFoods });
                                                }}
                                                className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 text-sm"
                                            />
                                        </div>
                                     </div>
                                      <div className="flex justify-end">
                                         <button 
                                             onClick={() => {
                                                 const newFoods = mealToEdit.foods.filter((_, index) => index !== foodIndex);
                                                 setMealToEdit({ ...mealToEdit, foods: newFoods });
                                             }}
                                             className="text-red-600 hover:text-red-800 text-sm"
                                         >
                                             Remover Alimento
                                         </button>
                                      </div>
                                </div>
                            ))}
                             {/* Botão para adicionar novo alimento */}
                             <div>
                                <button 
                                    onClick={() => {
                                        const newFoods = [...mealToEdit.foods, { name: '', amount: '', calories: 0, protein: 0, carbs: 0, fat: 0 }];
                                        setMealToEdit({ ...mealToEdit, foods: newFoods });
                                    }}
                                    className="w-full px-4 py-2 bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                                >
                                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
                                    Adicionar Novo Alimento
                                </button>
                             </div>
                        </div>
                       
                        <div className="mt-6 flex justify-end gap-3">
                            <button 
                                onClick={() => { setMealToEdit(null); setShowEditMealModal(false); }}
                                className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-md hover:bg-neutral-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={() => {
                                    // Recalcular totais antes de salvar
                                    const updatedTotals = mealToEdit.foods.reduce((totals, food) => {
                                        totals.calories += food.calories || 0;
                                        totals.protein += food.protein || 0;
                                        totals.carbs += food.carbs || 0;
                                        totals.fat += food.fat || 0;
                                        return totals;
                                    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

                                    const updatedMeal = {
                                        ...mealToEdit,
                                        totalCalories: updatedTotals.calories,
                                        totalProtein: updatedTotals.protein,
                                        totalCarbs: updatedTotals.carbs,
                                        totalFat: updatedTotals.fat,
                                    };

                                    // Atualizar o estado dailyMeals com a refeição editada
                                    setDailyMeals(dailyMeals.map(meal => 
                                        meal.id === updatedMeal.id ? updatedMeal : meal
                                    ));

                                    handleEditMealSave(updatedMeal); // Chamar a função de salvar (que agora fecha o modal e loga)
                                }}
                                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
          </>
        )}
        
        {activeView === 'semanal' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Resumo Semanal de Nutrientes</h2>
              <button
                onClick={() => setShowGoalsEditor(true)}
                className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg flex items-center gap-2 hover:bg-primary-100 transition-colors"
              >
                Ajustar Metas
                <ChevronDown size={16} />
              </button>
            </div>
            
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={getWeekData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calories" fill="#10B981" name="Calorias" />
                  <Bar dataKey="goal" fill="#9CA3AF" name="Meta" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Média de Calorias</h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">{selectedPlan.overview.calories}</span>
                  <span className="text-sm text-neutral-500">kcal/dia</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  Meta: {goals?.calories || 0} kcal
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Média de Proteínas</h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">{selectedPlan.overview.protein}</span>
                  <span className="text-sm text-neutral-500">g/dia</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  Meta: {goals?.protein || 0}g
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Aderência ao Plano</h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">
                    {goals ? Math.round((selectedPlan.overview.calories / goals.calories) * 100) : 0}%
                  </span>
                  <span className="text-sm text-neutral-500">meta</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">Baseado nas metas definidas</div>
              </div>
            </div>

            {/* Modal de Edição de Metas */}
            {showGoalsEditor && goals && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h3 className="text-xl font-bold mb-4">Ajustar Metas</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Meta de Calorias (kcal/dia)
                      </label>
                      <input
                        type="number"
                        value={goals.calories}
                        onChange={(e) => setGoals(prev => prev ? {...prev, calories: Number(e.target.value)} : null)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Meta de Proteínas (g/dia)
                      </label>
                      <input
                        type="number"
                        value={goals.protein}
                        onChange={(e) => setGoals(prev => prev ? {...prev, protein: Number(e.target.value)} : null)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Meta de Carboidratos (g/dia)
                      </label>
                      <input
                        type="number"
                        value={goals.carbs}
                        onChange={(e) => setGoals(prev => prev ? {...prev, carbs: Number(e.target.value)} : null)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1">
                        Meta de Gorduras (g/dia)
                      </label>
                      <input
                        type="number"
                        value={goals.fat}
                        onChange={(e) => setGoals(prev => prev ? {...prev, fat: Number(e.target.value)} : null)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-6">
                    <button
                      onClick={() => setShowGoalsEditor(false)}
                      className="px-4 py-2 text-neutral-600 hover:text-neutral-700"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={() => {
                        // Aqui você pode implementar a lógica para salvar as metas no backend
                        setShowGoalsEditor(false);
                      }}
                      className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                    >
                      Salvar Metas
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {activeView === 'mensal' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-6">Tendências Mensais</h2>
            
            <div className="h-80 mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getMonthData()}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="calories" />
                  <YAxis yAxisId="adherence" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="calories"
                    type="monotone" 
                    dataKey="calories" 
                    stroke="#10B981" 
                    name="Calorias"
                  />
                  <Line 
                    yAxisId="adherence"
                    type="monotone" 
                    dataKey="adherence" 
                    stroke="#6366F1" 
                    name="Aderência (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Média Mensal de Calorias</h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">{selectedPlan?.overview.calories || 0}</span>
                  <span className="text-sm text-neutral-500">kcal/dia</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">Meta diária do plano</div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Distribuição de Macros</h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">{selectedPlan?.overview.protein || 0}g P</span>
                  <span className="text-sm text-neutral-500">meta diária</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  {selectedPlan?.overview.carbs || 0}g C / {selectedPlan?.overview.fat || 0}g G
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Progresso Mensal</h3>
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">Em andamento</span>
                </div>
                <div className="text-sm text-neutral-500 mt-1">
                  Acompanhe seu progresso diariamente
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <p className="text-primary-600 text-sm">
                <strong>Nota:</strong> Para um acompanhamento mais preciso, registre suas refeições diariamente.
                Os dados mostrados são baseados no seu plano selecionado e serão atualizados conforme você registra suas refeições.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
    </PageTransition>
  );
};

export default TrackerPage;