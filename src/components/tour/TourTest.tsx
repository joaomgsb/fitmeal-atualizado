import React from 'react';
import { useTour } from '../../contexts/TourContext';

const TourTest: React.FC = () => {
  const { 
    isTourActive, 
    currentStep, 
    tourSteps, 
    startTour, 
    showTourForNewUser,
    nextStep,
    previousStep,
    skipTour,
    completeTour
  } = useTour();

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Teste do Tour</h3>
      
      <div className="space-y-2 text-sm">
        <p><strong>Tour Ativo:</strong> {isTourActive ? 'Sim' : 'Não'}</p>
        <p><strong>Passo Atual:</strong> {currentStep + 1} de {tourSteps.length}</p>
        <p><strong>Mostrar para Novo Usuário:</strong> {showTourForNewUser ? 'Sim' : 'Não'}</p>
      </div>

      <div className="mt-4 space-y-2">
        <button
          onClick={startTour}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Iniciar Tour
        </button>
        
        {isTourActive && (
          <div className="space-y-2">
            <button
              onClick={previousStep}
              disabled={currentStep === 0}
              className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              onClick={nextStep}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Próximo
            </button>
            <button
              onClick={skipTour}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Pular Tour
            </button>
          </div>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-medium mb-2">Passos do Tour:</h4>
        <div className="space-y-1 text-xs">
          {tourSteps.map((step, index) => (
            <div key={step.id} className="flex items-center gap-2">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                index === currentStep ? 'bg-blue-500 text-white' : 'bg-gray-300'
              }`}>
                {index + 1}
              </span>
              <span className={index === currentStep ? 'font-medium' : ''}>
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TourTest; 