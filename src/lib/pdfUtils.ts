import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { pdf } from '@react-pdf/renderer';

// Detecta se está rodando no ambiente móvel do Capacitor
export const isMobile = Capacitor.isNativePlatform();

// Função para gerar PDF como blob
export const generatePDFBlob = async (document: React.ReactElement): Promise<Blob> => {
  const pdfBytes = await pdf(document).toBlob();
  return pdfBytes;
};

// Função para salvar PDF no dispositivo móvel
export const savePDFToDevice = async (
  document: React.ReactElement,
  fileName: string
): Promise<void> => {
  try {
    // Gerar o PDF como blob
    const pdfBlob = await generatePDFBlob(document);
    
    // Converter blob para base64
    const arrayBuffer = await pdfBlob.arrayBuffer();
    const base64Data = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    
    // Salvar no filesystem do dispositivo
    const result = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Documents,
      recursive: true
    });
    
    console.log('PDF salvo em:', result.uri);
    
    // Compartilhar o arquivo
    await Share.share({
      title: 'Plano Alimentar',
      text: 'Seu plano alimentar personalizado',
      url: result.uri,
      dialogTitle: 'Compartilhar plano alimentar'
    });
    
  } catch (error) {
    console.error('Erro ao salvar PDF:', error);
    throw error;
  }
};

// Função principal para exportar PDF
export const exportPDF = async (
  document: React.ReactElement,
  fileName: string
): Promise<void> => {
  if (isMobile) {
    // No ambiente móvel, salvar no dispositivo e compartilhar
    await savePDFToDevice(document, fileName);
  } else {
    // No web, usar o comportamento padrão do PDFDownloadLink
    // Esta função será chamada apenas como fallback no web
    console.log('No ambiente web, use PDFDownloadLink diretamente');
  }
}; 