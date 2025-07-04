import React, { useRef, useState } from 'react';
import { Camera, User } from 'lucide-react';

interface AvatarUploadProps {
  currentImage?: string;
  onImageUpload: (file: File) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ currentImage, onImageUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImage);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Criar preview da imagem
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Enviar arquivo para o componente pai
      onImageUpload(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      <div className="w-24 h-24 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
        {previewUrl ? (
          <img 
            src={previewUrl} 
            alt="Foto de perfil" 
            className="w-full h-full object-cover"
          />
        ) : (
          <User size={48} className="text-neutral-400" />
        )}
      </div>
      <button 
        onClick={handleButtonClick}
        type="button"
        className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white hover:bg-primary-600 transition-colors shadow-md"
      >
        <Camera size={16} />
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default AvatarUpload; 