import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  addDoc,
  deleteDoc 
} from 'firebase/firestore';
import { db } from './firebase';

export interface AccessCode {
  id: string;
  code: string;
  isUsed: boolean;
  usedBy?: string; // UID do usuário que usou
  usedAt?: string; // Data de uso
  createdAt: string;
  createdBy: string; // Admin que criou
  description?: string; // Ex: "Aluno João Silva"
}

// Gerar código único de 8 caracteres
export const generateUniqueCode = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Verificar se código existe e está disponível
export const validateAccessCode = async (code: string): Promise<{ valid: boolean; message: string }> => {
  try {
    const codesRef = collection(db, 'access_codes');
    const q = query(codesRef, where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { valid: false, message: 'Código de acesso inválido.' };
    }

    const codeDoc = querySnapshot.docs[0];
    const codeData = codeDoc.data() as AccessCode;

    if (codeData.isUsed) {
      return { valid: false, message: 'Este código já foi utilizado.' };
    }

    return { valid: true, message: 'Código válido!' };
  } catch (error) {
    console.error('Erro ao validar código:', error);
    return { valid: false, message: 'Erro ao validar código. Tente novamente.' };
  }
};

// Marcar código como usado
export const useAccessCode = async (code: string, userId: string): Promise<boolean> => {
  try {
    const codesRef = collection(db, 'access_codes');
    const q = query(codesRef, where('code', '==', code.toUpperCase()));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const codeDoc = querySnapshot.docs[0];
      await updateDoc(codeDoc.ref, {
        isUsed: true,
        usedBy: userId,
        usedAt: new Date().toISOString()
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error('Erro ao marcar código como usado:', error);
    return false;
  }
};

// Criar novo código de acesso (apenas admins)
export const createAccessCode = async (description?: string, createdBy: string = 'admin'): Promise<string> => {
  try {
    let code = generateUniqueCode();
    
    // Verificar se o código já existe (muito improvável, mas por segurança)
    let codeExists = true;
    while (codeExists) {
      const codesRef = collection(db, 'access_codes');
      const q = query(codesRef, where('code', '==', code));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        codeExists = false;
      } else {
        code = generateUniqueCode();
      }
    }

    const newCode: Omit<AccessCode, 'id'> = {
      code,
      isUsed: false,
      createdAt: new Date().toISOString(),
      createdBy,
      description
    };

    const docRef = await addDoc(collection(db, 'access_codes'), newCode);
    return code;
  } catch (error) {
    console.error('Erro ao criar código:', error);
    throw error;
  }
};

// Listar todos os códigos (apenas admins)
export const getAllAccessCodes = async (): Promise<AccessCode[]> => {
  try {
    const codesRef = collection(db, 'access_codes');
    const querySnapshot = await getDocs(codesRef);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as AccessCode));
  } catch (error) {
    console.error('Erro ao buscar códigos:', error);
    return [];
  }
};

// Deletar código (apenas admins)
export const deleteAccessCode = async (codeId: string): Promise<boolean> => {
  try {
    await deleteDoc(doc(db, 'access_codes', codeId));
    return true;
  } catch (error) {
    console.error('Erro ao deletar código:', error);
    return false;
  }
};