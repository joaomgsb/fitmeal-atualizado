import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Sparkles } from 'lucide-react';
import { useTour } from '../../contexts/TourContext';

const TourWelcomeModal: React.FC = () => {
  const { showTourForNewUser, startTour, skipTour, tourSteps } = useTour();

  if (!showTourForNewUser || !tourSteps || tourSteps.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/50"
          onClick={skipTour}
        />
        
        {/* Modal */}
        <motion.div
          className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Botão fechar */}
          <button
            onClick={skipTour}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>

          {/* Ícone */}
          <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles size={40} className="text-white" />
          </div>

          {/* Título */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Bem-vindo ao FitMeal! 🎉
          </h2>

          {/* Descrição */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Estamos muito felizes em ter você conosco! Que tal fazer um tour rápido para conhecer todas as funcionalidades incríveis que preparamos para você?
          </p>

          {/* Botões */}
          <div className="flex flex-col gap-3">
            <button
              onClick={startTour}
              className="flex items-center justify-center gap-3 w-full bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary-600 transition-colors shadow-lg hover:shadow-xl"
            >
              <Play size={20} />
              Iniciar Tour Interativo
            </button>
            
            <button
              onClick={skipTour}
              className="w-full py-3 px-6 text-gray-600 hover:text-gray-800 transition-colors font-medium"
            >
              Pular por enquanto
            </button>
          </div>

          {/* Dica */}
          <p className="text-sm text-gray-500 mt-6">
            Você pode sempre acessar o tour através do seu perfil
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TourWelcomeModal; 