import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, HelpCircle } from 'lucide-react';
import { useTour } from '../../contexts/TourContext';
import { useIsMobile } from '../../hooks/useIsMobile';

const TourFloatingButton: React.FC = () => {
  const { startTour, tourSteps, isTourActive } = useTour();
  const [isExpanded, setIsExpanded] = useState(false);
  const isMobile = useIsMobile();

  // Só mostra o botão se houver passos do tour e o tour não estiver ativo
  if (!tourSteps || tourSteps.length === 0 || isTourActive) return null;

  return (
    <div className={`fixed z-[9997] ${isMobile ? 'bottom-4 right-4' : 'bottom-6 right-6'}`}>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className={`absolute bg-white rounded-xl shadow-2xl p-4 mb-2 ${
              isMobile ? 'bottom-20 right-0 min-w-[280px]' : 'bottom-16 right-0 min-w-[200px]'
            }`}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            {/* Seta */}
            <div className={`absolute bottom-0 w-3 h-3 bg-white transform rotate-45 border-r border-b border-gray-200 ${
              isMobile ? 'right-8' : 'right-6'
            }`} />
            
            <div className="text-center">
              <h3 className={`font-semibold text-gray-900 mb-2 ${isMobile ? 'text-lg' : 'text-base'}`}>
                Precisa de ajuda?
              </h3>
              <p className={`text-gray-600 mb-3 ${isMobile ? 'text-base' : 'text-sm'}`}>
                Revise as funcionalidades da plataforma
              </p>
              <button
                onClick={() => {
                  startTour();
                  setIsExpanded(false);
                }}
                className={`w-full bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors font-medium ${
                  isMobile ? 'text-base py-3' : 'text-sm'
                }`}
              >
                Iniciar Tour
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botão principal */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`bg-primary-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center ${
          isMobile ? 'w-16 h-16' : 'w-14 h-14'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={isMobile ? 28 : 24} />
            </motion.div>
          ) : (
            <motion.div
              key="help"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <HelpCircle size={isMobile ? 28 : 24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default TourFloatingButton; 