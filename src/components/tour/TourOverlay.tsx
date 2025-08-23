import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Play, SkipForward } from 'lucide-react';
import { useTour } from '../../contexts/TourContext';

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

  const [targetElement, setTargetElement] = useState<HTMLElement | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isTourActive && tourSteps[currentStep]) {
      const currentStepData = tourSteps[currentStep];
      if (currentStepData && currentStepData.target) {
        // Pequeno delay para garantir que os elementos estejam renderizados
        const timer = setTimeout(() => {
          const element = document.querySelector(currentStepData.target) as HTMLElement;
          if (element) {
            setTargetElement(element);
            updateTooltipPosition(element);
          } else {
            console.warn(`Elemento não encontrado para o tour: ${currentStepData.target}`);
          }
        }, 100);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isTourActive, currentStep, tourSteps]);

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

        {/* Tooltip */}
        <motion.div
          className="absolute bg-white rounded-xl shadow-2xl p-6 max-w-sm pointer-events-auto"
          style={{
            top: Math.max(20, tooltipPosition.top),
            left: Math.max(20, Math.min(tooltipPosition.left, window.innerWidth - 300)),
            transform: 'translate(-50%, -50%)'
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
          <div className="flex items-center justify-between">
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
                <ChevronLeft size={20} />
              </button>
              <span className="text-sm text-gray-500">
                {currentStep + 1} de {tourSteps.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={skipTour}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <SkipForward size={16} />
                Pular
              </button>
              
              <button
                onClick={isLastStep ? completeTour : nextStep}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                {isLastStep ? 'Finalizar' : 'Próximo'}
                {!isLastStep && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourOverlay; 