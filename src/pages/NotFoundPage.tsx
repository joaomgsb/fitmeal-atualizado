import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary-500 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-neutral-600 mb-8 max-w-md">
          A página que você está procurando não existe ou foi removida. Verifique o endereço ou volte para a página inicial.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center text-white bg-primary-500 px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <ChevronLeft size={18} className="mr-2" />
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;