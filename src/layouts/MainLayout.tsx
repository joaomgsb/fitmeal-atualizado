import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import TermsGuard from '../components/TermsGuard';
import { useAuth } from '../contexts/AuthContext';
import { TourOverlay, TourWelcomeModal, TourFloatingButton } from '../components/tour';
import { useTour } from '../contexts/TourContext';

const MainLayout: React.FC = () => {
  const { currentUser } = useAuth();
  const { isTourActive } = useTour();

  // Verifica a rota atual para aplicar estilos específicos
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const isPlansPage = location.pathname === '/planos';
  
  // Adiciona padding apenas para páginas que não são a Home ou Planos
  const mainClasses = `flex-grow ${!isHomePage && !isPlansPage ? 'pt-24' : ''}`;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={mainClasses}>
        {currentUser ? (
          <TermsGuard>
            <div className={!isHomePage && !isPlansPage ? 'container mx-auto px-4' : ''}>
              <Outlet />
            </div>
          </TermsGuard>
        ) : (
          <div className={!isHomePage && !isPlansPage ? 'container mx-auto px-4' : ''}>
            <Outlet />
          </div>
        )}
      </main>
      <Footer />
      
      {/* Componentes do Tour */}
      {currentUser && <TourOverlay />}
      {currentUser && <TourWelcomeModal />}
      {currentUser && <TourFloatingButton />}
    </div>
  );
};

export default MainLayout;