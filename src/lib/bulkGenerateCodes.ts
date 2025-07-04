import { collection, addDoc, writeBatch, doc } from 'firebase/firestore';
import { db } from './firebase';
import { utils as XLSXUtils, write as XLSXWrite } from 'xlsx';

export interface BulkAccessCode {
  code: string;
  isUsed: boolean;
  createdAt: string;
  createdBy: string;
  description: string;
}

// Gerar código único de 6 caracteres (ABC123 format)
const generateCode = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  let code = '';
  // 3 letras
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // 3 números
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }
  
  return code;
};

// Verificar se código já existe no array
const codeExists = (code: string, existingCodes: string[]): boolean => {
  return existingCodes.includes(code);
};

// Gerar códigos únicos
export const generateUniqueCodes = (quantity: number): string[] => {
  const codes: string[] = [];
  
  while (codes.length < quantity) {
    const newCode = generateCode();
    if (!codeExists(newCode, codes)) {
      codes.push(newCode);
    }
  }
  
  return codes;
};

// Salvar códigos em lotes no Firestore (máximo 500 por lote)
export const bulkCreateAccessCodes = async (quantity: number = 1000): Promise<{ success: boolean; message: string; codes?: string[] }> => {
  try {
    console.log(`Iniciando geração de ${quantity} códigos...`);
    
    // Gerar códigos únicos
    const codes = generateUniqueCodes(quantity);
    console.log(`${codes.length} códigos únicos gerados.`);
    
    // Dividir em lotes de 500 (limite do Firestore)
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < codes.length; i += batchSize) {
      batches.push(codes.slice(i, i + batchSize));
    }
    
    console.log(`Dividindo em ${batches.length} lotes de até ${batchSize} códigos.`);
    
    // Processar cada lote
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = writeBatch(db);
      const currentBatch = batches[batchIndex];
      
      console.log(`Processando lote ${batchIndex + 1}/${batches.length} com ${currentBatch.length} códigos...`);
      
      currentBatch.forEach((code) => {
        const docRef = doc(collection(db, 'access_codes'));
        const codeData: BulkAccessCode = {
          code,
          isUsed: false,
          createdAt: new Date().toISOString(),
          createdBy: 'system-bulk',
          description: `Código gerado automaticamente - Lote ${batchIndex + 1}`
        };
        
        batch.set(docRef, codeData);
      });
      
      // Executar o lote
      await batch.commit();
      console.log(`Lote ${batchIndex + 1} salvo com sucesso!`);
    }
    
    console.log(`Todos os ${quantity} códigos foram salvos no banco de dados!`);
    
    return {
      success: true,
      message: `${quantity} códigos gerados e salvos com sucesso!`,
      codes
    };
    
  } catch (error) {
    console.error('Erro ao gerar códigos em lote:', error);
    return {
      success: false,
      message: 'Erro ao gerar códigos. Tente novamente.'
    };
  }
};

// Função para exportar códigos para Excel
export const exportCodesToCSV = (codes: string[]): void => {
  // Formatar a data no estilo brasileiro
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentDate = new Date();
  const formattedDate = formatDate(currentDate);
  
  // Preparar os dados para o Excel
  const excelData = codes.map(code => ({
    'Código': code,
    'Descrição': `Código gerado automaticamente - Lote ${formattedDate}`,
    'Data de Criação': formattedDate,
    'Status': 'Disponível'
  }));

  // Criar workbook e worksheet
  const ws = XLSXUtils.json_to_sheet(excelData);
  const wb = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(wb, ws, 'Códigos de Acesso');

  // Definir largura das colunas
  ws['!cols'] = [
    { wch: 10 },  // Código
    { wch: 40 },  // Descrição
    { wch: 20 },  // Data de Criação
    { wch: 12 }   // Status
  ];

  // Gerar arquivo Excel
  const excelBuffer = XLSXWrite(wb, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `codigos-acesso-bulk-${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};