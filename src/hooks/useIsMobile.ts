import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      // Verifica se está rodando no Capacitor (app nativo)
      const isNativePlatform = Capacitor.isNativePlatform();
      
      // Verifica se é um dispositivo móvel baseado no user agent
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Verifica se a largura da tela é menor que 768px (breakpoint mobile)
      const isMobileScreen = window.innerWidth < 768;
      
      // Considera mobile se qualquer uma das condições for verdadeira
      setIsMobile(isNativePlatform || isMobileUserAgent || isMobileScreen);
    };

    // Verifica inicialmente
    checkIfMobile();

    // Adiciona listener para mudanças de tamanho da tela
    window.addEventListener('resize', checkIfMobile);
    
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}; 