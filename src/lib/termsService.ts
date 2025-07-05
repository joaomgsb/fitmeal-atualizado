import { doc, setDoc, getDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface TermsAcceptance {
  userId: string;
  userEmail: string;
  userName: string;
  acceptedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  termsVersion: string;
  acceptanceMethod: 'signup' | 'modal' | 'required_update';
}

export interface TermsAcceptanceRecord {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  acceptedAt: any; // Firestore Timestamp
  ipAddress?: string;
  userAgent?: string;
  termsVersion: string;
  acceptanceMethod: 'signup' | 'modal' | 'required_update';
}

// Versão atual dos termos - atualize sempre que modificar os termos
export const CURRENT_TERMS_VERSION = '2025-06-14-v1.0';

/**
 * Registra a aceitação dos termos de uso no Firestore
 */
export const recordTermsAcceptance = async (acceptance: Omit<TermsAcceptance, 'acceptedAt' | 'termsVersion'>): Promise<void> => {
  try {
    // Coleta informações adicionais do navegador
    const userAgent = navigator.userAgent;
    
    // Dados da aceitação
    const acceptanceData: Partial<TermsAcceptanceRecord> = {
      ...acceptance,
      acceptedAt: serverTimestamp(),
      termsVersion: CURRENT_TERMS_VERSION,
      userAgent,
    };

    // Salva na coleção de registros de aceitação (para auditoria)
    await addDoc(collection(db, 'termsAcceptances'), acceptanceData);

    // Atualiza o documento do usuário com a informação da última aceitação
    await setDoc(doc(db, 'users', acceptance.userId), {
      termsAcceptance: {
        acceptedAt: serverTimestamp(),
        version: CURRENT_TERMS_VERSION,
        method: acceptance.acceptanceMethod
      }
    }, { merge: true });

    console.log('Aceitação dos termos registrada com sucesso');
  } catch (error) {
    console.error('Erro ao registrar aceitação dos termos:', error);
    throw new Error('Falha ao registrar aceitação dos termos');
  }
};

/**
 * Verifica se o usuário aceitou a versão atual dos termos
 */
export const hasUserAcceptedCurrentTerms = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return false;
    }

    const userData = userDoc.data();
    const termsAcceptance = userData.termsAcceptance;

    if (!termsAcceptance) {
      return false;
    }

    // Verifica se a versão aceita é a atual
    return termsAcceptance.version === CURRENT_TERMS_VERSION;
  } catch (error) {
    console.error('Erro ao verificar aceitação dos termos:', error);
    return false;
  }
};

/**
 * Coleta informações do dispositivo/navegador para auditoria
 */
export const getDeviceInfo = () => {
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    cookieEnabled: navigator.cookieEnabled,
    timestamp: new Date().toISOString()
  };
};

/**
 * Função auxiliar para tentar obter o IP do usuário (opcional)
 * Note: Isso requer uma API externa como ipify.org
 */
export const getUserIP = async (): Promise<string | null> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.warn('Não foi possível obter o IP do usuário:', error);
    return null;
  }
};

/**
 * Registra a aceitação dos termos com informações completas de auditoria
 */
export const recordTermsAcceptanceWithAudit = async (
  userId: string,
  userEmail: string,
  userName: string,
  method: 'signup' | 'modal' | 'required_update'
): Promise<void> => {
  try {
    // Coleta informações para auditoria
    const deviceInfo = getDeviceInfo();
    const ipAddress = await getUserIP();

    // Registra a aceitação
    await recordTermsAcceptance({
      userId,
      userEmail,
      userName,
      acceptanceMethod: method,
      ipAddress: ipAddress || undefined,
      userAgent: deviceInfo.userAgent
    });

    console.log('Aceitação dos termos registrada com auditoria completa');
  } catch (error) {
    console.error('Erro ao registrar aceitação com auditoria:', error);
    throw error;
  }
};

/**
 * Força o usuário a aceitar novos termos (quando há atualização)
 */
export const requireTermsReacceptance = async (userId: string): Promise<void> => {
  try {
    await setDoc(doc(db, 'users', userId), {
      termsAcceptance: {
        requiresReacceptance: true,
        lastPromptedAt: serverTimestamp()
      }
    }, { merge: true });
  } catch (error) {
    console.error('Erro ao marcar necessidade de reaceitação:', error);
    throw error;
  }
};

/**
 * Verifica se o usuário precisa aceitar novos termos
 */
export const doesUserNeedToReacceptTerms = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    
    if (!userDoc.exists()) {
      return true; // Novo usuário precisa aceitar
    }

    const userData = userDoc.data();
    const termsAcceptance = userData.termsAcceptance;

    if (!termsAcceptance) {
      return true; // Nunca aceitou
    }

    // Verifica se precisa reaceitar ou se a versão não é a atual
    return termsAcceptance.requiresReacceptance === true || 
           termsAcceptance.version !== CURRENT_TERMS_VERSION;
  } catch (error) {
    console.error('Erro ao verificar necessidade de reaceitação:', error);
    return true; // Em caso de erro, requer aceitação por segurança
  }
};

export default {
  recordTermsAcceptance,
  hasUserAcceptedCurrentTerms,
  recordTermsAcceptanceWithAudit,
  requireTermsReacceptance,
  doesUserNeedToReacceptTerms,
  CURRENT_TERMS_VERSION
}; 