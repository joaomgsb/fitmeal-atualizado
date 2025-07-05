import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTermsCheck } from '../hooks/useTermsCheck';
import TermsOfUseModal from './TermsOfUseModal';
import { recordTermsAcceptanceWithAudit } from '../lib/termsService';

interface TermsGuardProps {
  children: React.ReactNode;
}

const TermsGuard: React.FC<TermsGuardProps> = ({ children }) => {
  const { user } = useAuth();
  const { needsToAcceptTerms, checkingTerms, setNeedsToAcceptTerms } = useTermsCheck();
  const [processing, setProcessing] = useState(false);

  const handleTermsAcceptance = async () => {
    if (!user) return;

    try {
      setProcessing(true);
      
      await recordTermsAcceptanceWithAudit(
        user.uid,
        user.email || '',
        user.displayName || 'Usuário',
        'required_update'
      );

      setNeedsToAcceptTerms(false);
    } catch (error) {
      console.error('Erro ao registrar aceitação dos termos:', error);
    } finally {
      setProcessing(false);
    }
  };

  // Mostra loading enquanto verifica os termos
  if (checkingTerms) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Verificando termos de uso...</p>
        </div>
      </div>
    );
  }

  // Se não precisa aceitar os termos, renderiza o conteúdo normalmente
  if (!needsToAcceptTerms) {
    return <>{children}</>;
  }

  // Se precisa aceitar os termos, força o modal
  return (
    <>
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-yellow-600 text-2xl">⚠️</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Termos de Uso Atualizados
            </h2>
            <p className="text-gray-600">
              Nossos termos de uso foram atualizados. Para continuar usando a plataforma, 
              você precisa aceitar os novos termos.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={() => setNeedsToAcceptTerms(true)}
              disabled={processing}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {processing ? 'Processando...' : 'Ver e Aceitar Termos'}
            </button>
            
            <p className="text-xs text-gray-500">
              Você não poderá usar a plataforma sem aceitar os termos atualizados.
            </p>
          </div>
        </div>
      </div>

      {/* Modal de Termos */}
      <TermsOfUseModal
        isOpen={needsToAcceptTerms}
        onClose={() => {}} // Não permite fechar sem aceitar
        onAccept={handleTermsAcceptance}
      />
    </>
  );
};

export default TermsGuard; 