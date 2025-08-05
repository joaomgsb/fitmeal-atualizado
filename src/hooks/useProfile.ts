import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';

export interface WeightEntry {
  date: string;
  weight: number;
}

export interface BodyFatEntry {
  date: string;
  bodyFat: number;
}

export interface BodyMeasurements {
  date: string;
  chest: number;
  waist: number;
  hips: number;
  arms: number;
  thighs: number;
}

export interface UserProfile {
  name: string;
  email: string;
  isAdmin?: boolean;
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
  dietPreferences: string[];
  allergies: string[];
  startDate: string;
  weightHistory: WeightEntry[];
  bodyFatHistory: BodyFatEntry[];
  measurements: BodyMeasurements[];
  avatar?: string;
}

export const useProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Carrega o perfil do usuário ao iniciar
  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          // Criar perfil vazio se não existir
          const emptyProfile: UserProfile = {
            name: '',
            email: currentUser.email || '',
            gender: '',
            age: 0,
            height: 0,
            weight: 0,
            goal: '',
            activityLevel: '',
            workoutFrequency: '',
            workoutIntensity: '',
            workoutDuration: '',
            basalMetabolicRate: 0,
            totalDailyEnergyExpenditure: 0,
            knowsCalorieNeeds: false,
            customCalorieNeeds: 0,
            customProteinNeeds: 0,
            customCarbNeeds: 0,
            customFatNeeds: 0,
            dietPreferences: [],
            allergies: [],
            startDate: new Date().toISOString(),
            weightHistory: [],
            bodyFatHistory: [],
            measurements: []
          };

          await setDoc(docRef, emptyProfile);
          setProfile(emptyProfile);
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError('Erro ao carregar perfil. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  // Função para atualizar o perfil - com debounce interno para evitar muitas chamadas ao Firestore
  const updateProfile = useCallback(async (newData: Partial<UserProfile>, showToasts = false) => {
    if (!currentUser || !profile || isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const updatedProfile = { ...profile, ...newData };
      setProfile(updatedProfile);
      
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, updatedProfile);
      
      if (showToasts) {
        toast.success('Perfil atualizado com sucesso!', { 
          duration: 2000,
          position: 'top-right'
        });
      }
    } catch (err) {
      console.error('Erro ao atualizar perfil:', err);
      
      // Reverte para o perfil anterior em caso de erro
      setProfile(profile);
      
      if (showToasts) {
        toast.error('Erro ao atualizar perfil. Por favor, tente novamente.', {
          duration: 3000,
          position: 'top-right'
        });
      }
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 2000); // Evita múltiplas requisições em sequência
    }
  }, [currentUser, profile, isUpdating]);

  // Função para adicionar um novo registro de peso
  const addWeightEntry = async (weight: number) => {
    if (!profile || !currentUser) {
      throw new Error('Perfil não encontrado');
    }
    
    const newEntry: WeightEntry = {
      date: new Date().toISOString(),
      weight
    };

    const newHistory = [...(profile.weightHistory || []), newEntry];
    const updatedProfile = {
      ...profile,
      weightHistory: newHistory
    };

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, updatedProfile, { merge: true });
    setProfile(updatedProfile);
  };

  // Função para adicionar novas medidas corporais
  const addMeasurements = async (measurements: Omit<BodyMeasurements, 'date'>) => {
    if (!profile || !currentUser) {
      throw new Error('Perfil não encontrado');
    }
    
    const newEntry: BodyMeasurements = {
      date: new Date().toISOString(),
      ...measurements
    };

    const newMeasurements = [...(profile.measurements || []), newEntry];
    const updatedProfile = {
      ...profile,
      measurements: newMeasurements
    };

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, updatedProfile, { merge: true });
    setProfile(updatedProfile);
  };

  // Função para adicionar um novo registro de percentual de gordura
  const addBodyFatEntry = async (bodyFat: number) => {
    if (!profile || !currentUser) {
      throw new Error('Perfil não encontrado');
    }
    
    const newEntry: BodyFatEntry = {
      date: new Date().toISOString(),
      bodyFat
    };

    const newHistory = [...(profile.bodyFatHistory || []), newEntry];
    const updatedProfile = {
      ...profile,
      bodyFatHistory: newHistory
    };

    const docRef = doc(db, 'users', currentUser.uid);
    await setDoc(docRef, updatedProfile, { merge: true });
    setProfile(updatedProfile);
  };

  // Reset do histórico de peso
  const resetWeightHistory = async () => {
    if (!profile || !currentUser) return;
    
    try {
      const updatedProfile = {
        ...profile,
        weightHistory: []
      };

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, updatedProfile, { merge: true });
      setProfile(updatedProfile);
      
      toast.success('Histórico de peso resetado com sucesso!', {
        duration: 2000,
        position: 'top-right'
      });
    } catch (err) {
      console.error('Erro ao resetar histórico:', err);
      toast.error('Erro ao resetar histórico. Tente novamente.', {
        duration: 3000,
        position: 'top-right'
      });
    }
  };

  // Reset do histórico de percentual de gordura
  const resetBodyFatHistory = async () => {
    if (!profile || !currentUser) return;
    
    try {
      const updatedProfile = {
        ...profile,
        bodyFatHistory: []
      };

      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, updatedProfile, { merge: true });
      setProfile(updatedProfile);
      
      toast.success('Histórico de percentual de gordura resetado com sucesso!', {
        duration: 2000,
        position: 'top-right'
      });
    } catch (err) {
      console.error('Erro ao resetar histórico:', err);
      toast.error('Erro ao resetar histórico. Tente novamente.', {
        duration: 3000,
        position: 'top-right'
      });
    }
  };

  // Reset das medidas corporais
  const resetMeasurements = async () => {
    if (!profile || !currentUser || isUpdating) return;
    
    setIsUpdating(true);
    
    try {
      const updatedProfile = {
        ...profile,
        measurements: []
      };

      setProfile(updatedProfile);
      
      const docRef = doc(db, 'users', currentUser.uid);
      await setDoc(docRef, updatedProfile);
      
      toast.success('Medidas resetadas com sucesso!', {
        duration: 2000,
        position: 'top-right'
      });
    } catch (err) {
      console.error('Erro ao resetar medidas:', err);
      setProfile(profile); // Reverte em caso de erro
      toast.error('Erro ao resetar medidas. Tente novamente.', {
        duration: 3000,
        position: 'top-right'
      });
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 2000);
    }
  };

  return { 
    profile, 
    loading, 
    error,
    isUpdating,
    updateProfile, 
    addWeightEntry, 
    addMeasurements,
    addBodyFatEntry,
    resetWeightHistory,
    resetBodyFatHistory,
    resetMeasurements 
  };
};