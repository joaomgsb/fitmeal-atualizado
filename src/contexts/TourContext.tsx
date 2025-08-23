import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  order: number;
}

interface TourContextType {
  isTourActive: boolean;
  currentStep: number;
  tourSteps: TourStep[];
  startTour: () => void;
  nextStep: () => void;
  previousStep: () => void;
  skipTour: () => void;
  completeTour: () => void;
  showTourForNewUser: boolean;
}

const TourContext = createContext<TourContextType | null>(null);

export const useTour = () => {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error('useTour deve ser usado dentro de um TourProvider');
  }
  return context;
};

const defaultTourSteps: TourStep[] = [
  {
    id: 'home',
    title: 'Bem-vindo ao FitMeal!',
    description: 'Esta é a página inicial onde você encontra um resumo das funcionalidades principais.',
    target: 'nav a[href="/"]',
    position: 'bottom',
    order: 1
  },
  {
    id: 'news',
    title: 'Seção de Notícias',
    description: 'Fique por dentro das últimas novidades sobre nutrição, fitness e saúde.',
    target: 'nav a[href="/news"]',
    position: 'bottom',
    order: 2
  },
  {
    id: 'recipes',
    title: 'Receitas',
    description: 'Explore nossa coleção de receitas saudáveis e deliciosas.',
    target: 'nav a[href="/receitas"]',
    position: 'bottom',
    order: 3
  },
  {
    id: 'meal-plans',
    title: 'Planos de Refeição',
    description: 'Crie planos personalizados de refeição baseados nos seus objetivos.',
    target: 'nav a[href="/planos"]',
    position: 'bottom',
    order: 4
  },
  {
    id: 'suggestions',
    title: 'Sugestões de Receitas',
    description: 'Receba sugestões personalizadas baseadas no seu perfil e preferências.',
    target: 'nav a[href="/sugestoes-receitas"]',
    position: 'bottom',
    order: 5
  },
  {
    id: 'food-recognition',
    title: 'Reconhecimento de Alimentos',
    description: 'Use IA para identificar alimentos e obter informações nutricionais.',
    target: 'nav a[href="/reconhecimento-alimentos"]',
    position: 'bottom',
    order: 6
  },
  {
    id: 'shopping-list',
    title: 'Lista de Compras',
    description: 'Organize suas compras com listas inteligentes baseadas nos seus planos.',
    target: 'nav a[href="/lista-compras"]',
    position: 'bottom',
    order: 7
  },
  {
    id: 'tracker',
    title: 'Rastreador de Progresso',
    description: 'Monitore seu progresso e mantenha-se motivado com suas metas.',
    target: 'nav a[href="/tracker"]',
    position: 'bottom',
    order: 8
  },
  {
    id: 'profile',
    title: 'Seu Perfil',
    description: 'Gerencie suas informações pessoais, metas e preferências.',
    target: 'header a[href="/perfil"]',
    position: 'left',
    order: 9
  }
];

export const TourProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTourForNewUser, setShowTourForNewUser] = useState(false);
  const { currentUser } = useAuth();

  const tourSteps = defaultTourSteps;

  useEffect(() => {
    if (currentUser) {
      checkIfNewUser();
    }
  }, [currentUser]);

  const checkIfNewUser = async () => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const hasCompletedTour = userData.hasCompletedTour || false;
        const isNewUser = userData.isNewUser || false;

        if (isNewUser && !hasCompletedTour) {
          setShowTourForNewUser(true);
        }
      } else {
        // Usuário não existe no Firestore ainda, é um novo usuário
        setShowTourForNewUser(true);
      }
    } catch (error) {
      console.error('Erro ao verificar status do usuário:', error);
    }
  };

  const startTour = () => {
    if (tourSteps && tourSteps.length > 0) {
      setIsTourActive(true);
      setCurrentStep(0);
      setShowTourForNewUser(false);
    } else {
      console.warn('Não há passos do tour disponíveis');
    }
  };

  const nextStep = () => {
    if (tourSteps.length > 0 && currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const previousStep = () => {
    if (tourSteps.length > 0 && currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = async () => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          hasCompletedTour: true,
          isNewUser: false,
          tourSkippedAt: new Date()
        });
      } catch (error) {
        console.error('Erro ao salvar status do tour:', error);
      }
    }
    
    setIsTourActive(false);
    setShowTourForNewUser(false);
    setCurrentStep(0);
  };

  const completeTour = async () => {
    if (currentUser) {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userDocRef, {
          hasCompletedTour: true,
          isNewUser: false,
          tourCompletedAt: new Date()
        });
      } catch (error) {
        console.error('Erro ao salvar status do tour:', error);
      }
    }
    
    setIsTourActive(false);
    setShowTourForNewUser(false);
    setCurrentStep(0);
  };

  const value = {
    isTourActive,
    currentStep,
    tourSteps,
    startTour,
    nextStep,
    previousStep,
    skipTour,
    completeTour,
    showTourForNewUser
  };

  return (
    <TourContext.Provider value={value}>
      {children}
    </TourContext.Provider>
  );
}; 