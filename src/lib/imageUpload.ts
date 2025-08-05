// Upload de imagens usando ImgBB (serviço gratuito)
const IMGBB_API_KEY = '7e4f1387e24d1ce0dfeab61c64212319'; // Chave de exemplo - você precisa criar uma conta gratuita

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  try {
    console.log('Iniciando upload da imagem:', file.name);
    
    // Validar tipo de arquivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('Tipo de arquivo não suportado. Use JPEG, PNG ou WebP.');
    }

    // Validar tamanho (máximo 32MB - limite do ImgBB)
    const maxSize = 32 * 1024 * 1024; // 32MB
    if (file.size > maxSize) {
      throw new Error('Arquivo muito grande. Tamanho máximo: 32MB.');
    }

    // Converter para base64
    const base64 = await fileToBase64(file);
    
    // Preparar dados para envio
    const formData = new FormData();
    formData.append('key', IMGBB_API_KEY);
    formData.append('image', base64.split(',')[1]); // Remove o prefixo data:image/...;base64,
    formData.append('name', file.name);

    console.log('Enviando para ImgBB...');

    // Fazer upload para ImgBB
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error?.message || 'Erro desconhecido no upload');
    }

    console.log('Upload bem-sucedido:', result.data.url);
    return result.data.url;

  } catch (error) {
    console.error('Erro no upload da imagem:', error);
    throw error;
  }
};

// Função alternativa usando Cloudinary (também gratuito)
export const uploadImageToCloudinary = async (file: File): Promise<string> => {
  try {
    const CLOUDINARY_UPLOAD_PRESET = 'bigiron_preset'; // Você precisa criar este preset
    const CLOUDINARY_CLOUD_NAME = 'seu-cloud-name'; // Substitua pelo seu cloud name
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error(`Erro no upload: ${response.status}`);
    }

    const result = await response.json();
    return result.secure_url;

  } catch (error) {
    console.error('Erro no upload para Cloudinary:', error);
    throw error;
  }
};

// Função para converter arquivo para base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Função principal que tenta diferentes serviços
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Primeiro tenta ImgBB
    return await uploadImageToImgBB(file);
  } catch (error) {
    console.warn('ImgBB falhou, tentando método alternativo...');
    
    // Se ImgBB falhar, converte para base64 e retorna
    // (não é ideal para produção, mas funciona para testes)
    try {
      const base64 = await fileToBase64(file);
      console.log('Usando base64 como fallback');
      return base64;
    } catch (base64Error) {
      throw new Error('Falha em todos os métodos de upload');
    }
  }
};