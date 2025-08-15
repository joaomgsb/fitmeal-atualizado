import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, ChevronDown, Settings, FileText, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();
  const adminDropdownRef = useRef<HTMLDivElement>(null);

  // CSS específico para MacBook M1
  const macbookCSS = `
    @media (-webkit-device-pixel-ratio: 2) and (min-width: 1440px) and (max-width: 1728px) {
      .macbook-navbar .nav-links {
        gap: 0.75rem !important;
      }
      .macbook-navbar .nav-link {
        padding-left: 0.75rem !important;
        padding-right: 0.75rem !important;
        font-size: 0.875rem !important;
      }
    }
    
    /* Garantir espaço adequado na navbar */
    .macbook-navbar {
      min-height: 4rem !important;
    }
    
    .macbook-navbar .nav-links {
      flex: 1;
      justify-content: center;
      margin: 0 2rem;
    }
    
    .macbook-navbar .nav-link {
      white-space: nowrap;
      min-width: fit-content;
    }
  `;

  // Close menu when navigating
  useEffect(() => {
    setIsMenuOpen(false);
    setIsAdminDropdownOpen(false);
  }, [location.pathname]);

  // Close admin dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (adminDropdownRef.current && !adminDropdownRef.current.contains(event.target as Node)) {
        setIsAdminDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Receitas', path: '/receitas' },
    { name: 'News', path: '/news' },
    { name: 'Planos', path: '/planos' },
    { name: 'Sugestões', path: '/sugestoes-receitas' },
    { name: 'Reconhecimento IA', path: '/reconhecimento-alimentos' },
    { name: 'Compras', path: '/lista-compras' },
    { name: 'Rastreador', path: '/tracker' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: Settings },
    { name: 'Gerenciar News', path: '/admin/news', icon: Newspaper },
    { name: 'Termos de Uso', path: '/admin/termos', icon: FileText },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: macbookCSS }} />
      <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md macbook-navbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0 mr-8">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo.jpeg"
                alt="FitMeal Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
              <span className="text-xl sm:text-2xl font-bold font-display text-neutral-800">
                Fit<span className="text-primary-500">Meal</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-3 xl:space-x-4 nav-links flex-1 justify-center">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-colors font-medium text-sm xl:text-base nav-link whitespace-nowrap ${
                    isActive 
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-100'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            
            {/* Admin Dropdown */}
            {profile?.isAdmin && (
              <div className="relative" ref={adminDropdownRef}>
                <button
                  onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                  className={`px-3 py-2 rounded-md transition-colors font-medium flex items-center gap-1 text-sm xl:text-base ${
                    location.pathname.startsWith('/admin')
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-100'
                  }`}
                >
                  Admin
                  <ChevronDown size={14} className={`transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isAdminDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
                  >
                    {adminLinks.map((link) => {
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                            location.pathname === link.path
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-50'
                          }`}
                          onClick={() => setIsAdminDropdownOpen(false)}
                        >
                          <Icon size={16} />
                          {link.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </div>
            )}
          </nav>

          {/* User Profile & Mobile Menu Button */}
          <div className="flex items-center space-x-2 sm:space-x-4 ml-8">
            <Link 
              to="/perfil" 
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-500 transition-colors"
            >
              <User size={20} className="sm:w-6 sm:h-6" />
            </Link>
            
            <button 
              className="lg:hidden flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} className="sm:w-6 sm:h-6" /> : <Menu size={20} className="sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="lg:hidden bg-white shadow-lg border-t border-gray-200"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="px-4 py-4">
            <nav className="flex flex-col space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-md transition-colors ${
                      isActive 
                        ? 'text-primary-600 bg-primary-50 font-medium' 
                        : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-100'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              
              {/* Admin Links for Mobile */}
              {profile?.isAdmin && (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-4 py-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Administração
                    </p>
                  </div>
                  {adminLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                          location.pathname === link.path
                            ? 'text-primary-600 bg-primary-50 font-medium'
                            : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-100'
                        }`}
                      >
                        <Icon size={18} />
                        {link.name}
                      </Link>
                    );
                  })}
                </>
              )}
            </nav>
          </div>
        </motion.div>
      )}
    </header>
    </>
  );
};

export default Navbar;