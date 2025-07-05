import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { doesUserNeedToReacceptTerms } from '../lib/termsService';

export const useTermsCheck = () => {
  const [needsToAcceptTerms, setNeedsToAcceptTerms] = useState(false);
  const [checkingTerms, setCheckingTerms] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const checkTermsAcceptance = async () => {
      if (!user) {
        setCheckingTerms(false);
        setNeedsToAcceptTerms(false);
        return;
      }

      try {
        setCheckingTerms(true);
        const needsAcceptance = await doesUserNeedToReacceptTerms(user.uid);
        setNeedsToAcceptTerms(needsAcceptance);
      } catch (error) {
        console.error('Erro ao verificar aceitação dos termos:', error);
        // Em caso de erro, assume que precisa aceitar por segurança
        setNeedsToAcceptTerms(true);
      } finally {
        setCheckingTerms(false);
      }
    };

    checkTermsAcceptance();
  }, [user]);

  return {
    needsToAcceptTerms,
    checkingTerms,
    setNeedsToAcceptTerms
  };
}; 