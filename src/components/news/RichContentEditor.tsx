import React, { useState, useRef } from 'react';
import { Video, Plus, X, AlertCircle, Bold, Italic, Type, List, ListOrdered, Quote } from 'lucide-react';

interface RichContentEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichContentEditor: React.FC<RichContentEditorProps> = ({
  value,
  onChange,
  placeholder = "Escreva o conteúdo completo do artigo..."
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [videoError, setVideoError] = useState('');
  const [insertPosition, setInsertPosition] = useState<'end' | 'cursor'>('end');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertVideo = () => {
    if (!videoUrl.trim()) {
      setVideoError('Por favor, insira uma URL de vídeo ou código iframe');
      return;
    }

    let iframeCode = '';
    
          // Verificar se é um código iframe completo
      if (videoUrl.includes('<iframe')) {
        // Extrair o iframe e envolver com o container
        const iframeMatch = videoUrl.match(/<iframe[^>]*src="([^"]*)"[^>]*>/);
        if (iframeMatch) {
          const src = iframeMatch[1];
          iframeCode = `<div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 20px 0;">
  <iframe 
    src="${src}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    frameborder="0">
  </iframe>
</div>`;
        } else {
          setVideoError('Código iframe inválido. Verifique se contém src="..."');
          return;
        }
    } else {
      // Extrair ID do vídeo do YouTube
      const youtubeMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
      const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
      
      if (youtubeMatch) {
        const videoId = youtubeMatch[1];
        iframeCode = `<div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 20px 0;">
  <iframe 
    src="https://www.youtube.com/embed/${videoId}?rel=0" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen
    frameborder="0">
  </iframe>
</div>`;
      } else if (vimeoMatch) {
        const videoId = vimeoMatch[1];
        iframeCode = `<div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 20px 0;">
  <iframe 
    src="https://player.vimeo.com/video/${videoId}?h=hash&dnt=1" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allow="autoplay; fullscreen; picture-in-picture"
    allowfullscreen
    frameborder="0">
  </iframe>
</div>`;
      } else {
        // Para outros tipos de vídeo, tentar usar a URL diretamente
        iframeCode = `<div class="video-container" style="position: relative; width: 100%; height: 0; padding-bottom: 56.25%; margin: 20px 0;">
  <iframe 
    src="${videoUrl}" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    frameborder="0">
  </iframe>
</div>`;
      }
    }

    // Inserir o iframe no conteúdo
    let newContent = '';
    
    if (insertPosition === 'cursor' && textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      newContent = value.substring(0, start) + '\n\n' + iframeCode + '\n\n' + value.substring(end);
    } else {
      // Inserir no final
      newContent = value + '\n\n' + iframeCode + '\n\n';
    }
    
    onChange(newContent);
    
    // Limpar e fechar modal
    setVideoUrl('');
    setVideoError('');
    setShowVideoModal(false);
  };

  const handleVideoUrlChange = (url: string) => {
    setVideoUrl(url);
    setVideoError('');
  };

  // Funções de formatação de texto
  const formatText = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = '';
    let newCursorPos = start;
    
    switch (format) {
      case 'bold':
        newText = `**${selectedText}**`;
        newCursorPos = start + 2;
        break;
      case 'italic':
        newText = `*${selectedText}*`;
        newCursorPos = start + 1;
        break;
      case 'h1':
        newText = `# ${selectedText}`;
        newCursorPos = start + 2;
        break;
      case 'h2':
        newText = `## ${selectedText}`;
        newCursorPos = start + 3;
        break;
      case 'h3':
        newText = `### ${selectedText}`;
        newCursorPos = start + 4;
        break;
      case 'bullet':
        newText = `- ${selectedText}`;
        newCursorPos = start + 2;
        break;
      case 'numbered':
        newText = `1. ${selectedText}`;
        newCursorPos = start + 3;
        break;
      case 'quote':
        newText = `> ${selectedText}`;
        newCursorPos = start + 2;
        break;
      default:
        return;
    }
    
    const newContent = value.substring(0, start) + newText + value.substring(end);
    onChange(newContent);
    
    // Restaurar foco e posição do cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos + selectedText.length);
      }
    }, 0);
  };

  const insertFormat = (format: string) => {
    if (!textareaRef.current) return;
    
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    let insertText = '';
    let newCursorPos = start;
    
    switch (format) {
      case 'bold':
        insertText = '**texto em negrito**';
        newCursorPos = start + 2;
        break;
      case 'italic':
        insertText = '*texto em itálico*';
        newCursorPos = start + 1;
        break;
      case 'h1':
        insertText = '# Título Principal';
        newCursorPos = start + 2;
        break;
      case 'h2':
        insertText = '## Subtítulo';
        newCursorPos = start + 3;
        break;
      case 'h3':
        insertText = '### Subseção';
        newCursorPos = start + 4;
        break;
      case 'bullet':
        insertText = '- Item da lista';
        newCursorPos = start + 2;
        break;
      case 'numbered':
        insertText = '1. Item numerado';
        newCursorPos = start + 3;
        break;
      case 'quote':
        insertText = '> Citação ou destaque';
        newCursorPos = start + 2;
        break;
      default:
        return;
    }
    
    const newContent = value.substring(0, start) + insertText + value.substring(end);
    onChange(newContent);
    
    // Restaurar foco e posição do cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos + insertText.length - 2);
      }
    }, 0);
  };

  // Atalhos de teclado
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          formatText('bold');
          break;
        case 'i':
          e.preventDefault();
          formatText('italic');
          break;
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas de formatação */}
      <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs font-medium text-neutral-700">Formatação:</span>
          
          {/* Formatação de texto */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-2 text-neutral-600 hover:bg-white hover:text-neutral-900 rounded transition-colors"
              title="Negrito (Ctrl+B)"
            >
              <Bold size={14} />
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-2 text-neutral-600 hover:bg-white hover:text-neutral-900 rounded transition-colors"
              title="Itálico (Ctrl+I)"
            >
              <Italic size={14} />
            </button>
          </div>

          {/* Títulos */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => formatText('h1')}
              className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300 rounded transition-colors"
              title="Título Principal"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => formatText('h2')}
              className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300 rounded transition-colors"
              title="Subtítulo"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => formatText('h3')}
              className="px-2 py-1 text-xs bg-neutral-200 text-neutral-700 hover:bg-neutral-300 rounded transition-colors"
              title="Subseção"
            >
              H3
            </button>
          </div>

          {/* Listas */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => formatText('bullet')}
              className="p-2 text-neutral-600 hover:bg-white hover:text-neutral-900 rounded transition-colors"
              title="Lista com marcadores"
            >
              <List size={14} />
            </button>
            <button
              type="button"
              onClick={() => formatText('numbered')}
              className="p-2 text-neutral-600 hover:bg-white hover:text-neutral-900 rounded transition-colors"
              title="Lista numerada"
            >
              <ListOrdered size={14} />
            </button>
          </div>

          {/* Citação */}
          <button
            type="button"
            onClick={() => formatText('quote')}
            className="p-2 text-neutral-600 hover:bg-white hover:text-neutral-900 rounded transition-colors"
            title="Citação"
          >
            <Quote size={14} />
          </button>
        </div>

        {/* Inserir formatação */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-neutral-700">Inserir:</span>
          
          <button
            type="button"
            onClick={() => insertFormat('bold')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Negrito
          </button>
          <button
            type="button"
            onClick={() => insertFormat('italic')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Itálico
          </button>
          <button
            type="button"
            onClick={() => insertFormat('h1')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Título
          </button>
          <button
            type="button"
            onClick={() => insertFormat('h2')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Subtítulo
          </button>
          <button
            type="button"
            onClick={() => insertFormat('bullet')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Lista
          </button>
          <button
            type="button"
            onClick={() => insertFormat('quote')}
            className="px-2 py-1 text-xs bg-blue-100 text-blue-700 hover:bg-blue-200 rounded transition-colors"
          >
            Citação
          </button>
        </div>
      </div>

      {/* Botão para inserir vídeo */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setShowVideoModal(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Video size={16} />
          Inserir Vídeo
        </button>
        <span className="text-xs text-neutral-500">
          Suporta URLs e códigos iframe
        </span>
      </div>

      {/* Editor de texto */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        rows={12}
        placeholder={placeholder}
      />

      {/* Preview do conteúdo */}
      {value && (
        <div className="mt-4 p-4 bg-neutral-50 rounded-lg">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">Preview do Conteúdo:</h4>
          <div className="prose prose-sm max-w-none">
            {(() => {
              // Função para converter Markdown para HTML
              const markdownToHtml = (text: string) => {
                return text
                  // Títulos
                  .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                  .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
                  .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
                  // Negrito
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                  // Itálico
                  .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                  // Listas numeradas
                  .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
                  // Listas com marcadores
                  .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
                  // Citações
                  .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 italic text-gray-600 my-4">$1</blockquote>')
                  // Quebras de linha
                  .replace(/\n/g, '<br />');
              };

              // Separar texto e vídeos
              const parts = [];
              let videoIndex = 0;
              
              // Encontrar todos os vídeos no conteúdo
              const videoRegex = /<div class="video-container"[^>]*>.*?<\/div>/gs;
              let match;
              
              while ((match = videoRegex.exec(value)) !== null) {
                // Adicionar texto antes do vídeo
                const textBefore = value.substring(videoIndex, match.index);
                if (textBefore.trim()) {
                  parts.push(
                    <div key={`text-${videoIndex}`} dangerouslySetInnerHTML={{ 
                      __html: markdownToHtml(textBefore)
                    }} />
                  );
                }
                
                // Extrair src do iframe
                const iframeMatch = match[0].match(/src="([^"]*)"/);
                if (iframeMatch) {
                  const src = iframeMatch[1];
                  parts.push(
                    <div key={`video-${videoIndex}`} className="my-5">
                      <div className="video-container" style={{
                        position: 'relative',
                        width: '100%',
                        height: 0,
                        paddingBottom: '56.25%',
                        margin: '20px 0'
                      }}>
                        <iframe
                          src={src}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 'none'
                          }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          frameBorder="0"
                        />
                      </div>
                    </div>
                  );
                }
                
                videoIndex = match.index + match[0].length;
              }
              
              // Adicionar texto restante
              const remainingText = value.substring(videoIndex);
              if (remainingText.trim()) {
                parts.push(
                  <div key={`text-end`} dangerouslySetInnerHTML={{ 
                    __html: markdownToHtml(remainingText)
                  }} />
                );
              }
              
              return parts.length > 0 ? parts : (
                <div dangerouslySetInnerHTML={{ 
                  __html: markdownToHtml(value)
                }} />
              );
            })()}
          </div>
        </div>
      )}

      {/* Modal para inserir vídeo */}
      {showVideoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Inserir Vídeo</h3>
              <button
                onClick={() => {
                  setShowVideoModal(false);
                  setVideoUrl('');
                  setVideoError('');
                }}
                className="p-1 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

                          <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    URL do Vídeo
                  </label>
                                  <textarea
                  value={videoUrl}
                  onChange={(e) => handleVideoUrlChange(e.target.value)}
                  placeholder="Cole aqui a URL do vídeo ou o código iframe completo..."
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  rows={3}
                />
                  {videoError && (
                    <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                      <AlertCircle size={14} />
                      {videoError}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Posição de Inserção
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="end"
                        checked={insertPosition === 'end'}
                        onChange={(e) => setInsertPosition(e.target.value as 'end' | 'cursor')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Inserir no final do texto</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        value="cursor"
                        checked={insertPosition === 'cursor'}
                        onChange={(e) => setInsertPosition(e.target.value as 'end' | 'cursor')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Inserir na posição do cursor</span>
                    </label>
                  </div>
                </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Formatos Aceitos:</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li>• <strong>URLs:</strong> https://www.youtube.com/watch?v=VIDEO_ID</li>
                  <li>• <strong>URLs:</strong> https://youtu.be/VIDEO_ID</li>
                  <li>• <strong>URLs:</strong> https://vimeo.com/VIDEO_ID</li>
                  <li>• <strong>Código iframe:</strong> Cole o código completo do iframe</li>
                </ul>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowVideoModal(false);
                    setVideoUrl('');
                    setVideoError('');
                  }}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={insertVideo}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus size={16} />
                  Inserir Vídeo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichContentEditor; 