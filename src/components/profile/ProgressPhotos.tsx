import React, { useState, useRef } from 'react';
import { Camera, Upload, Trash2, Eye, Calendar, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  category: 'front' | 'back' | 'side' | 'other';
  notes?: string;
}

interface ProgressPhotosProps {
  photos: ProgressPhoto[];
  onAddPhoto: (photo: Omit<ProgressPhoto, 'id'>) => Promise<void>;
  onDeletePhoto: (photoId: string) => Promise<void>;
  onUpdatePhoto: (photoId: string, updates: Partial<ProgressPhoto>) => Promise<void>;
}

const ProgressPhotos: React.FC<ProgressPhotosProps> = ({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onUpdatePhoto
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'front' | 'back' | 'side' | 'other'>('front');
  const [photoNotes, setPhotoNotes] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<ProgressPhoto | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.size, file.type);
      
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem');
        return;
      }

      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      setSelectedFile(file);
      
      // Criar preview com compressão
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular dimensões para manter proporção e limitar tamanho
        const maxWidth = 800;
        const maxHeight = 800;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Desenhar imagem redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Converter para base64 com qualidade reduzida
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
        console.log('Original size:', file.size);
        console.log('Compressed URL length:', compressedDataUrl.length);
        setPreviewUrl(compressedDataUrl);
      };
      
      img.onerror = () => {
        console.error('Error loading image');
        toast.error('Erro ao carregar a imagem. Tente novamente.');
      };
      
      const reader = new FileReader();
      reader.onloadend = () => {
        img.src = reader.result as string;
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast.error('Erro ao ler o arquivo. Tente novamente.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('handleUpload called');
    console.log('selectedFile:', selectedFile);
    console.log('previewUrl:', previewUrl);
    
    if (!selectedFile || !previewUrl) {
      toast.error('Por favor, selecione uma imagem');
      return;
    }

    setIsUploading(true);
    
    try {
      // Verificar se previewUrl existe
      if (!previewUrl) {
        toast.error('Erro ao processar a imagem. Tente novamente.');
        return;
      }
      
      // Verificar se a imagem não é muito grande
      if (previewUrl.length > 1000000) { // ~1MB em base64
        toast.error('A imagem é muito grande. Tente uma imagem menor.');
        return;
      }
      
      const photoData = {
        date: new Date().toISOString(),
        imageUrl: previewUrl,
        category: selectedCategory,
        ...(photoNotes.trim() && { notes: photoNotes.trim() })
      };
      
      console.log('Calling onAddPhoto with:', photoData);
      console.log('Image URL length:', previewUrl?.length);
      await onAddPhoto(photoData);

      toast.success('Foto de progresso adicionada com sucesso!');
      setShowUploadModal(false);
      resetForm();
    } catch (error) {
      console.error('Error in handleUpload:', error);
      toast.error('Erro ao adicionar foto. Tente novamente.');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPhotoNotes('');
    setSelectedCategory('front');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta foto? Esta ação não pode ser desfeita.')) {
      try {
        await onDeletePhoto(photoId);
        toast.success('Foto excluída com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir foto. Tente novamente.');
      }
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'front': return 'Frente';
      case 'back': return 'Costas';
      case 'side': return 'Lateral';
      case 'other': return 'Outro';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'front': return '👤';
      case 'back': return '🔙';
      case 'side': return '↔️';
      case 'other': return '📷';
      default: return '📷';
    }
  };

  const downloadImage = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const groupedPhotos = photos.reduce((groups, photo) => {
    const date = new Date(photo.date).toLocaleDateString('pt-BR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(photo);
    return groups;
  }, {} as Record<string, ProgressPhoto[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Fotos de Progresso</h3>
          <p className="text-sm text-neutral-500">
            Acompanhe sua evolução física através de fotos
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Camera size={18} />
          <span>Adicionar Foto</span>
        </button>
      </div>

      {/* Fotos */}
      {photos.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Camera size={48} className="mx-auto mb-4 text-neutral-400" />
          <h4 className="text-lg font-medium text-neutral-600 mb-2">
            Nenhuma foto de progresso
          </h4>
          <p className="text-neutral-500 mb-4">
            Comece a registrar sua evolução física adicionando sua primeira foto
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mx-auto"
          >
            <Camera size={18} />
            <span>Adicionar Primeira Foto</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedPhotos).map(([date, datePhotos]) => (
            <div key={date} className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
              <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-neutral-500" />
                  <span className="font-medium text-neutral-700">{date}</span>
                  <span className="text-sm text-neutral-500">
                    ({datePhotos.length} foto{datePhotos.length > 1 ? 's' : ''})
                  </span>
                </div>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {datePhotos.map((photo) => (
                    <div key={photo.id} className="bg-neutral-50 rounded-lg overflow-hidden">
                      <div className="relative aspect-square">
                        <img
                          src={photo.imageUrl}
                          alt={`Foto de progresso - ${getCategoryLabel(photo.category)}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => {
                            setSelectedPhoto(photo);
                            setShowPhotoModal(true);
                          }}
                        />
                        <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {getCategoryIcon(photo.category)} {getCategoryLabel(photo.category)}
                        </div>
                        <div className="absolute top-2 right-2 flex gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadImage(photo.imageUrl, `progresso_${date}_${photo.category}.jpg`);
                            }}
                            className="bg-black bg-opacity-50 text-white p-1 rounded hover:bg-opacity-70 transition-colors"
                            title="Download"
                          >
                            <Download size={12} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id);
                            }}
                            className="bg-red-500 text-white p-1 rounded hover:bg-red-600 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      
                      {photo.notes && (
                        <div className="p-3">
                          <p className="text-sm text-neutral-600">{photo.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Upload */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Adicionar Foto de Progresso</h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              {/* Seleção de categoria */}
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2">
                  Categoria da Foto
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: 'front', label: 'Frente', icon: '👤' },
                    { value: 'back', label: 'Costas', icon: '🔙' },
                    { value: 'side', label: 'Lateral', icon: '↔️' },
                    { value: 'other', label: 'Outro', icon: '📷' }
                  ].map((category) => (
                    <button
                      key={category.value}
                      type="button"
                      onClick={() => setSelectedCategory(category.value as any)}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedCategory === category.value
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-neutral-200 hover:border-primary-200'
                      }`}
                    >
                      <div className="text-lg mb-1">{category.icon}</div>
                      <div className="text-sm font-medium">{category.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload de arquivo */}
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-2">
                  Selecionar Imagem
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 text-center hover:border-primary-300 transition-colors">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-2 w-full"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <>
                        <Upload size={32} className="text-neutral-400" />
                        <span className="text-neutral-600">Clique para selecionar uma imagem</span>
                        <span className="text-xs text-neutral-500">Máximo 5MB</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-neutral-500 mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  value={photoNotes}
                  onChange={(e) => setPhotoNotes(e.target.value)}
                  placeholder="Ex: Após 2 meses de treino, perda de 5kg..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || isUploading}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Salvando...' : 'Salvar Foto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showPhotoModal && selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold">
                  {getCategoryIcon(selectedPhoto.category)} {getCategoryLabel(selectedPhoto.category)}
                </h3>
                <p className="text-sm text-neutral-500">
                  {new Date(selectedPhoto.date).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="text-neutral-500 hover:text-neutral-700"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center mb-4">
              <img
                src={selectedPhoto.imageUrl}
                alt={`Foto de progresso - ${getCategoryLabel(selectedPhoto.category)}`}
                className="max-w-full max-h-96 object-contain rounded-lg"
              />
            </div>
            
            {selectedPhoto.notes && (
              <div className="bg-neutral-50 p-4 rounded-lg">
                <h4 className="font-medium text-neutral-700 mb-2">Observações:</h4>
                <p className="text-neutral-600">{selectedPhoto.notes}</p>
              </div>
            )}
            
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => downloadImage(selectedPhoto.imageUrl, `progresso_${new Date(selectedPhoto.date).toLocaleDateString('pt-BR')}_${selectedPhoto.category}.jpg`)}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressPhotos; 