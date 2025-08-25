import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from 'lucide-react';
import { useTour } from '../../contexts/TourContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const TourOverlay: React.FC = () => {
  const {
    isTourActive,
    currentStep,
    tourSteps,
    nextStep,
    previousStep,
    skipTour,
    completeTour
  } = useTour();
  const isMobile = useIsMobile();

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTourActive && tourSteps[currentStep]) {
      const currentStepData = tourSteps[currentStep];
      if (currentStepData && currentStepData.target) {
        // Delay variável baseado no passo e dispositivo
        const delay = isMobile && currentStep === 0 ? 800 : 100; // Delay maior para o menu mobile
        
        const timer = setTimeout(() => {
          let element = document.querySelector(currentStepData.target) as HTMLElement;
          
          // Se não encontrar o elemento, tenta estratégias alternativas para mobile
          if (!element && isMobile) {
            // Estratégia 1: Busca por texto exato do link
            const allLinks = document.querySelectorAll('a');
            const linkText = currentStepData.title.toLowerCase();
            
            for (const link of allLinks) {
              if (link.textContent?.toLowerCase().trim() === linkText) {
                element = link as HTMLElement;
                break;
              }
            }
            
            // Estratégia 2: Busca por texto parcial se a primeira falhar
            if (!element) {
              for (const link of allLinks) {
                if (link.textContent?.toLowerCase().includes(linkText)) {
                  element = link as HTMLElement;
                  break;
                }
              }
            }
            
            // Estratégia 3: Busca por href se as anteriores falharem
            if (!element) {
              const hrefPath = currentStepData.target.match(/href="([^"]+)"/)?.[1];
              if (hrefPath) {
                for (const link of allLinks) {
                  if (link.getAttribute('href') === hrefPath) {
                    element = link as HTMLElement;
                    break;
                  }
                }
              }
            }
            
            // Estratégia 4: Busca específica para o menu mobile
            if (!element && currentStep > 0) {
              const mobileMenuLinks = document.querySelectorAll('.lg\\:hidden nav a');
              console.log('🔍 Links do menu mobile encontrados:', mobileMenuLinks.length);
              mobileMenuLinks.forEach((link, index) => {
                console.log(`  ${index}: "${link.textContent?.trim()}" -> ${link.getAttribute('href')}`);
              });
              
              for (const link of mobileMenuLinks) {
                if (link.textContent?.toLowerCase().trim() === linkText) {
                  element = link as HTMLElement;
                  console.log('✅ Elemento encontrado via estratégia 4:', link.textContent?.trim());
                  break;
                }
              }
            }
            
            // Debug: Mostra todos os links encontrados se nenhuma estratégia funcionar
            if (!element) {
              console.log('🔍 Debug - Todos os links na página:');
              const allLinks = document.querySelectorAll('a');
              allLinks.forEach((link, index) => {
                console.log(`  ${index}: "${link.textContent?.trim()}" -> ${link.getAttribute('href')} (classe: ${link.className})`);
              });
            }
          }
          
          if (element) {
            setTargetElement(element);
            updateTooltipPosition(element);
          } else {
            console.warn(`Elemento não encontrado para o tour: ${currentStepData.target} - Título: ${currentStepData.title}`);
          }
        }, delay);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isTourActive, currentStep, tourSteps, isMobile]);

  // Adiciona listener para mudanças de orientação da tela em mobile
  useEffect(() => {
    if (isMobile) {
      const handleOrientationChange = () => {
        // Pequeno delay para a tela se ajustar
        setTimeout(() => {
          if (targetElement && isTourActive) {
            updateTooltipPosition(targetElement);
          }
        }, 300);
      };

      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleOrientationChange);
      
      return () => {
        window.removeEventListener('orientationchange', handleOrientationChange);
        window.removeEventListener('resize', handleOrientationChange);
      };
    }
  }, [isMobile, targetElement, isTourActive]);

  useEffect(() => {
    const handleResize = () => {
      if (targetElement && isTourActive) {
        updateTooltipPosition(targetElement);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [targetElement, isTourActive]);

  const updateTooltipPosition = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const step = tourSteps[currentStep];
    
    if (!step) return;
    
    let top = 0;
    let left = 0;

    if (isMobile) {
      // Em mobile, posiciona o tooltip de forma que seja sempre visível
      // Calcula a altura estimada do tooltip (aproximadamente 280px)
      const tooltipHeight = 280;
      const safeMargin = 20; // Margem de segurança
      
      // Posiciona o tooltip para que caiba completamente na tela
      top = Math.min(
        window.innerHeight - tooltipHeight - safeMargin,
        window.innerHeight - 250
      );
      
      // Centraliza horizontalmente com margens de segurança
      left = Math.max(
        safeMargin + 150, // Metade da largura do tooltip + margem
        Math.min(
          window.innerWidth / 2,
          window.innerWidth - 150 - safeMargin
        )
      );
      
      // Fallback: se ainda assim o tooltip estiver cortado, força uma posição segura
      if (top < safeMargin) {
        top = safeMargin;
      }
      if (top + tooltipHeight > window.innerHeight - safeMargin) {
        top = window.innerHeight - tooltipHeight - safeMargin;
      }
      if (left < safeMargin) {
        left = safeMargin + 150;
      }
      if (left + 300 > window.innerWidth - safeMargin) {
        left = window.innerWidth - 300 - safeMargin;
      }
    } else {
      // Desktop: posicionamento baseado na posição do elemento
      switch (step.position) {
        case 'top':
          top = rect.top - 20;
          left = rect.left + rect.width / 2;
          break;
        case 'bottom':
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
          break;
        case 'left':
          top = rect.top + rect.height / 2;
          left = rect.left - 20;
          break;
        case 'right':
          top = rect.top + rect.height / 2;
          left = rect.right + 20;
          break;
        default:
          // Fallback para posição padrão
          top = rect.bottom + 20;
          left = rect.left + rect.width / 2;
          break;
      }
    }

    setTooltipPosition({ top, left });
  };

  if (!isTourActive || !tourSteps || tourSteps.length === 0) return null;

  const currentStepData = tourSteps[currentStep];
  if (!currentStepData) return null;

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === tourSteps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[9999] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black/50 pointer-events-auto" />
        
        {/* Highlight do elemento atual */}
        {targetElement && (
          <motion.div
            className="absolute border-4 border-primary-500 rounded-lg shadow-2xl pointer-events-none"
            style={{
              top: targetElement.getBoundingClientRect().top - 8,
              left: targetElement.getBoundingClientRect().left - 8,
              width: targetElement.getBoundingClientRect().width + 16,
              height: targetElement.getBoundingClientRect().height + 16,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Fallback highlight para mobile quando elemento não for encontrado */}
        {isMobile && !targetElement && currentStep > 0 && (
          <motion.div
            className="absolute border-4 border-primary-500 rounded-lg shadow-2xl pointer-events-none"
            style={{
              top: 80, // Posição aproximada do menu mobile
              left: 20,
              width: window.innerWidth - 40,
              height: 60,
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Tooltip */}
        <motion.div
          className={`absolute bg-white rounded-xl shadow-2xl pointer-events-auto ${
            isMobile ? 'p-6 max-w-[90vw]' : 'p-6 max-w-sm'
          }`}
          style={{
            top: isMobile ? tooltipPosition.top : Math.max(20, tooltipPosition.top),
            left: isMobile ? tooltipPosition.left : Math.max(20, Math.min(tooltipPosition.left, window.innerWidth - 300)),
            transform: isMobile ? 'translate(-50%, 0)' : 'translate(-50%, -50%)',
            // Garante que o tooltip seja sempre visível em mobile
            maxHeight: isMobile ? '80vh' : 'auto',
            overflow: isMobile ? 'auto' : 'visible',
            // Z-index alto para garantir que esteja sempre visível
            zIndex: 10000
          }}
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Indicador de posição */}
          <div className="absolute w-4 h-4 bg-white transform rotate-45 border-l border-t border-gray-200"
               style={{
                 top: currentStepData.position === 'bottom' ? '-8px' : 'auto',
                 bottom: currentStepData.position === 'top' ? '-8px' : 'auto',
                 left: currentStepData.position === 'right' ? '-8px' : 'auto',
                 right: currentStepData.position === 'left' ? '-8px' : 'auto',
                 borderLeft: currentStepData.position === 'left' ? 'none' : '1px solid #e5e7eb',
                 borderTop: currentStepData.position === 'top' ? 'none' : '1px solid #e5e7eb',
                 borderRight: currentStepData.position === 'right' ? '1px solid #e5e7eb' : 'none',
                 borderBottom: currentStepData.position === 'bottom' ? '1px solid #e5e7eb' : 'none',
               }}
          />

          {/* Cabeçalho */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {currentStep + 1}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {currentStepData.title}
              </h3>
            </div>
            <button
              onClick={skipTour}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Descrição */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Controles */}
          <div className={`flex items-center justify-between ${isMobile ? 'flex-col gap-3' : ''}`}>
            <div className="flex items-center gap-2">
              <button
                onClick={previousStep}
                disabled={isFirstStep}
                className={`p-2 rounded-lg transition-colors ${
                  isFirstStep
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft size={isMobile ? 24 : 20} />
              </button>
              <span className="text-sm text-gray-500">
                {currentStep + 1} de {tourSteps.length}
              </span>
            </div>

            <div className={`flex items-center gap-2 ${isMobile ? 'w-full justify-center' : ''}`}>
              <button
                onClick={skipTour}
                className={`flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors ${
                  isMobile ? 'min-h-[44px] min-w-[80px]' : ''
                }`}
              >
                <SkipForward size={isMobile ? 18 : 16} />
                <span className={isMobile ? 'text-base' : 'text-sm'}>Pular</span>
              </button>
              
              <button
                onClick={isLastStep ? completeTour : nextStep}
                className={`flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors ${
                  isMobile ? 'min-h-[44px] min-w-[80px]' : ''
                }`}
              >
                <span className={isMobile ? 'text-base' : 'text-sm'}>
                  {isLastStep ? 'Finalizar' : 'Próximo'}
                </span>
                {!isLastStep && <ChevronRight size={isMobile ? 18 : 16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourOverlay; 