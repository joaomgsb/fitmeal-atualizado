import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import TermsGuard from '../components/TermsGuard';
import { useAuth } from '../contexts/AuthContext';

const MainLayout: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {user ? (
          <TermsGuard>
            <Outlet />
          </TermsGuard>
        ) : (
          <Outlet />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;