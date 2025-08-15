import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '../../lib/imageUpload';


interface ImageUploadProps {
  onImageSelected: (imageUrl: string) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onImageSelected, 
  onError, 
  isLoading = false 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadImage(file);
      onImageSelected(imageUrl);
    } catch {
      onError('Erro ao fazer upload da imagem. Tente novamente.');
    }
  };

  const startCamera = async () => {
    try {
      console.log('🔍 Iniciando câmera...');
      
      // Verificar suporte a mediaDevices
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Seu navegador não suporta acesso à câmera');
      }

      // Detectar se é dispositivo móvel
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      console.log('📱 Dispositivo móvel detectado:', isMobile);

      // Configurações otimizadas para mobile
      const constraints = {
        video: {
          facingMode: 'environment', // Usar câmera traseira
          width: { ideal: isMobile ? 1280 : 1920, max: 1920 },
          height: { ideal: isMobile ? 720 : 1080, max: 1080 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      console.log('📷 Solicitando permissão da câmera...');
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('✅ Permissão concedida, configurando stream...');
      setStream(mediaStream);
      
      // Forçar renderização do componente antes de configurar o vídeo
      setShowCamera(true);
      
      // Pequeno atraso para garantir que o componente foi renderizado
      setTimeout(() => {
        if (videoRef.current) {
          console.log('🎥 Configurando elemento de vídeo...');
          videoRef.current.srcObject = mediaStream;
          
          videoRef.current.onloadedmetadata = () => {
            console.log('✅ Metadados do vídeo carregados');
            console.log('📐 Dimensões do vídeo:', {
              videoWidth: videoRef.current?.videoWidth,
              videoHeight: videoRef.current?.videoHeight,
              clientWidth: videoRef.current?.clientWidth,
              clientHeight: videoRef.current?.clientHeight
            });
            videoRef.current?.play().catch(e => {
              console.error('❌ Erro ao reproduzir vídeo:', e);
              onError('Não foi possível iniciar a câmera: ' + e.message);
            });
          };
          
          videoRef.current.onplay = () => {
            console.log('▶️ Vídeo em reprodução');
          };
          
          videoRef.current.onerror = () => {
            console.error('❌ Erro no elemento de vídeo');
            onError('Erro ao acessar a câmera. Verifique as permissões.');
          };
        } else {
          console.error('❌ Elemento de vídeo não encontrado');
          onError('Erro ao configurar a câmera. Tente novamente.');
        }
      }, 100);
    } catch (error) {
      console.error('❌ Erro ao acessar câmera:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          onError('Permissão da câmera negada. Por favor, permita o acesso à câmera nas configurações do dispositivo.');
        } else if (error.name === 'NotFoundError') {
          onError('Câmera não encontrada. Verifique se o dispositivo possui uma câmera.');
        } else if (error.name === 'NotSupportedError') {
          onError('Câmera não suportada neste dispositivo.');
        } else {
          onError(`Erro ao acessar câmera: ${error.message}`);
        }
      } else {
        onError('Não foi possível acessar a câmera. Verifique as permissões.');
      }
    }
  };

  const stopCamera = () => {
    console.log('🛑 Parando câmera...');
    if (stream) {
      try {
        stream.getTracks().forEach(track => {
          console.log(`Parando track: ${track.kind} (${track.label})`);
          track.stop();
        });
      } catch (error) {
        console.error('Erro ao parar stream:', error);
      }
      setStream(null);
    }
    
    // Limpar o srcObject do vídeo
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setShowCamera(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    // Configurar canvas com as dimensões do vídeo
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o frame atual do vídeo no canvas
    // Para dispositivos móveis, garantir que a orientação seja correta
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Converter para blob e fazer upload
    canvas.toBlob(async (blob) => {
      if (!blob) return;

      try {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const imageUrl = await uploadImage(file);
        onImageSelected(imageUrl);
        stopCamera();
      } catch {
        onError('Erro ao processar a foto. Tente novamente.');
      }
    }, 'image/jpeg', 0.9);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        try {
          const imageUrl = await uploadImage(file);
          onImageSelected(imageUrl);
        } catch {
          onError('Erro ao fazer upload da imagem. Tente novamente.');
        }
      } else {
        onError('Por favor, selecione apenas arquivos de imagem.');
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        console.log('🧹 Limpando câmera ao desmontar componente');
        stopCamera();
      }
    };
  }, [stream]);

  if (showCamera) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="relative w-full h-full max-w-2xl max-h-[80vh] bg-black rounded-lg overflow-hidden">
          {/* Header da câmera */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/50 to-transparent p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={stopCamera}
                className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors"
                aria-label="Fechar câmera"
              >
                <X size={24} />
              </button>
              <h3 className="text-white font-semibold">Tirar Foto</h3>
              <div className="w-10" /> {/* Espaçador */}
            </div>
          </div>

          {/* Vídeo da câmera */}
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto"
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-center p-4">
                  <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                  <p>Iniciando câmera...</p>
                </div>
              </div>
            )}
          </div>

          {/* Controles da câmera */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
            <div className="flex items-center justify-center">
              <button
                onClick={capturePhoto}
                disabled={isLoading}
                className="w-16 h-16 rounded-full bg-white border-4 border-primary-500 flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 size={24} className="text-primary-500 animate-spin" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-500" />
                )}
              </button>
            </div>
          </div>

          {/* Canvas oculto para captura */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className="relative border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center hover:border-primary-400 transition-colors cursor-pointer bg-neutral-50 hover:bg-neutral-100"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center">
              <Upload size={24} className="text-primary-500" />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-2">
              Envie uma foto do seu alimento
            </h3>
            <p className="text-neutral-600 mb-4">
              Arraste e solte uma imagem aqui, ou clique para selecionar
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              disabled={isLoading}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Upload size={16} />
              Escolher Arquivo
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                startCamera();
              }}
              disabled={isLoading}
              className="px-6 py-3 bg-energy-500 text-white rounded-lg hover:bg-energy-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Camera size={16} />
              Tirar Foto
            </button>
          </div>

          <p className="text-sm text-neutral-500">
            Formatos suportados: JPEG, PNG, WebP (máx. 32MB)
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload; 