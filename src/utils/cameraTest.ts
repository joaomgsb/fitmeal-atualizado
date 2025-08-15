// Utilitário para testar a câmera no Capacitor

export const testCameraCapability = async (): Promise<{
  isCapacitor: boolean;
  hasCamera: boolean;
  hasPermissions: boolean;
  error?: string;
}> => {
  try {
    // Detectar se estamos no Capacitor
    const isCapacitor = typeof window !== 'undefined' && 'Capacitor' in window;
    
    // Verificar se o navegador suporta getUserMedia
    const hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    
    if (!hasGetUserMedia) {
      return {
        isCapacitor,
        hasCamera: false,
        hasPermissions: false,
        error: 'Navegador não suporta acesso à câmera'
      };
    }

    // Tentar acessar a câmera
    const stream = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        facingMode: 'environment',
        width: { ideal: 1280, max: 1920 },
        height: { ideal: 720, max: 1080 },
        aspectRatio: { ideal: 16/9 }
      } 
    });

    // Se chegou até aqui, a câmera está funcionando
    stream.getTracks().forEach(track => track.stop());

    return {
      isCapacitor,
      hasCamera: true,
      hasPermissions: true
    };

  } catch (error) {
    console.error('❌ Erro no teste da câmera:', error);
    
    let errorMessage = 'Erro desconhecido';
    
    if (error instanceof Error) {
      switch (error.name) {
        case 'NotAllowedError':
          errorMessage = 'Permissão da câmera negada';
          break;
        case 'NotFoundError':
          errorMessage = 'Câmera não encontrada';
          break;
        case 'NotSupportedError':
          errorMessage = 'Câmera não suportada';
          break;
        case 'NotReadableError':
          errorMessage = 'Câmera em uso por outro aplicativo';
          break;
        default:
          errorMessage = error.message;
      }
    }

    return {
      isCapacitor: typeof window !== 'undefined' && 'Capacitor' in window,
      hasCamera: false,
      hasPermissions: false,
      error: errorMessage
    };
  }
};

export const logCameraInfo = async () => {
  console.log('🔍 Testando funcionalidade da câmera...');
  
  const result = await testCameraCapability();
  
  console.log('📱 Informações da câmera:', {
    isCapacitor: result.isCapacitor,
    hasCamera: result.hasCamera,
    hasPermissions: result.hasPermissions,
    error: result.error
  });

  if (result.isCapacitor) {
    console.log('✅ Executando no Capacitor');
  } else {
    console.log('🌐 Executando no navegador web');
  }

  if (result.hasCamera && result.hasPermissions) {
    console.log('✅ Câmera funcionando corretamente');
  } else {
    console.log('❌ Problema com a câmera:', result.error);
  }

  return result;
}; 