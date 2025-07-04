import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface GeneratedPlan {
  id?: string;
  title?: string;
  isCustomPlan?: boolean;
  overview: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    meals: number;
    duration: string;
  };
  features: string[];
  meals: {
    time: string;
    name: string;
    description: string;
    foods: {
      name: string;
      amount: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
      preparation: string;
    }[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
  }[];
  tips: string[];
  substitutions: {
    food: string;
    alternatives: string[];
  }[];
}

export interface SavedMealPlan {
  id: string;
  createdAt: string;
  plan: GeneratedPlan;
}

export const useMealPlans = () => {
  const { currentUser } = useAuth();
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSavedPlans = async () => {
      if (!currentUser) {
        setLoading(false);
        setError('Usuário não autenticado');
        return;
      }

      try {
        const plansRef = collection(db, 'users', currentUser.uid, 'meal_plans');
        const plansSnap = await getDocs(plansRef);
        
        const plans: SavedMealPlan[] = [];
        plansSnap.forEach((doc) => {
          plans.push({
            id: doc.id,
            ...doc.data()
          } as SavedMealPlan);
        });

        setSavedPlans(plans.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      } catch (err: any) {
        console.error('Erro ao carregar planos salvos:', err);
        setError('Erro ao carregar planos salvos. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchSavedPlans();
  }, [currentUser]);

  const savePlan = async (plan: GeneratedPlan) => {
    if (!currentUser) {
      setError('Usuário não autenticado');
      return null;
    }

    try {
      // Verificar primeiro se já existe um plano idêntico
      if (plan.isCustomPlan) {
        const isDuplicate = savedPlans.some((savedPlan) => {
          if (!savedPlan.plan.isCustomPlan) return false;
          
          // Comparar características essenciais
          const sameMacros = 
            savedPlan.plan.overview.calories === plan.overview.calories &&
            savedPlan.plan.overview.protein === plan.overview.protein &&
            savedPlan.plan.overview.carbs === plan.overview.carbs &&
            savedPlan.plan.overview.fat === plan.overview.fat;
            
          // Se tiverem os mesmos macros e o mesmo número de refeições, provavelmente é o mesmo plano
          return sameMacros && savedPlan.plan.meals.length === plan.meals.length;
        });
        
        if (isDuplicate) {
          return null; // Não salvar se já existir um plano idêntico
        }
      } else {
        // Para planos não personalizados, verificar pelo ID
        const isDuplicate = savedPlans.some((savedPlan) => 
          !savedPlan.plan.isCustomPlan && savedPlan.plan.id === plan.id
        );
        
        if (isDuplicate) {
          return null;
        }
      }

      const plansRef = collection(db, 'users', currentUser.uid, 'meal_plans');
      const newPlanRef = doc(plansRef);
      
      const savedPlan: SavedMealPlan = {
        id: newPlanRef.id,
        createdAt: new Date().toISOString(),
        plan
      };

      setSavedPlans(prev => [savedPlan, ...prev]);

      await setDoc(newPlanRef, savedPlan);
      return savedPlan;
    } catch (err: any) {
      console.error('Erro ao salvar plano:', err);
      return null;
    }
  };

  const deletePlan = async (planId: string) => {
    if (!currentUser) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      const planRef = doc(db, 'users', currentUser.uid, 'meal_plans', planId);
      
      setSavedPlans(prev => prev.filter(p => p.id !== planId));

      deleteDoc(planRef).catch(err => {
        console.error('Erro ao excluir plano:', err);
        setSavedPlans(prev => {
          const deletedPlan = prev.find(p => p.id === planId);
          return deletedPlan ? [...prev, deletedPlan] : prev;
        });
        throw err;
      });

      return true;
    } catch (err: any) {
      console.error('Erro ao excluir plano:', err);
      setError('Erro ao excluir plano. Por favor, tente novamente.');
      return false;
    }
  };

  const updatePlan = async (planId: string, updates: Partial<SavedMealPlan>) => {
    if (!currentUser) {
      setError('Usuário não autenticado');
      return false;
    }

    try {
      const planRef = doc(db, 'users', currentUser.uid, 'meal_plans', planId);
      
      // Atualiza o estado local primeiro
      setSavedPlans(prev => prev.map(p => 
        p.id === planId 
          ? { ...p, ...updates }
          : p
      ));

      // Atualiza no Firestore
      await setDoc(planRef, updates, { merge: true });
      return true;
    } catch (err: any) {
      console.error('Erro ao atualizar plano:', err);
      setError('Erro ao atualizar plano. Por favor, tente novamente.');
      return false;
    }
  };

  return { savedPlans, loading, error, savePlan, deletePlan, updatePlan };
}; 