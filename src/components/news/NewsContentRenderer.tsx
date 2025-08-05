import React from 'react';

interface NewsContentRendererProps {
  content: string;
  className?: string;
}

const NewsContentRenderer: React.FC<NewsContentRendererProps> = ({ 
  content, 
  className = "text-neutral-700 leading-relaxed" 
}) => {
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

  // Função para processar o conteúdo completo
  const processContent = (content: string) => {
    // Separar texto e vídeos
    const parts = [];
    let videoIndex = 0;
    
    // Encontrar todos os vídeos no conteúdo
    const videoRegex = /<div class="video-container"[^>]*>.*?<\/div>/gs;
    let match;
    
    while ((match = videoRegex.exec(content)) !== null) {
      // Adicionar texto antes do vídeo
      const textBefore = content.substring(videoIndex, match.index);
      if (textBefore.trim()) {
        parts.push(markdownToHtml(textBefore));
      }
      
      // Adicionar o vídeo
      parts.push(match[0]);
      
      videoIndex = match.index + match[0].length;
    }
    
    // Adicionar texto restante
    const remainingText = content.substring(videoIndex);
    if (remainingText.trim()) {
      parts.push(markdownToHtml(remainingText));
    }
    
    return parts.length > 0 ? parts.join('') : markdownToHtml(content);
  };

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ 
        __html: processContent(content)
      }} 
    />
  );
};

export default NewsContentRenderer; 