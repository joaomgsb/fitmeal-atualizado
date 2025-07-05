import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, User, Dumbbell, ChevronDown, Settings, FileText, Newspaper } from 'lucide-react';
import { motion } from 'framer-motion';
import { useProfile } from '../../hooks/useProfile';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { profile } = useProfile();
  const adminDropdownRef = useRef<HTMLDivElement>(null);

  // Effect for handling scroll behavior
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Planos Alimentares', path: '/planos' },
    { name: 'Sugestões de Receitas', path: '/sugestoes-receitas' },
    { name: 'Lista de Compras', path: '/lista-compras' },
    { name: 'Rastreador', path: '/tracker' },
  ];

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: Settings },
    { name: 'Gerenciar News', path: '/admin/news', icon: Newspaper },
    { name: 'Termos de Uso', path: '/admin/termos', icon: FileText },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-150 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/images/logo.jpeg"
                alt="BioFitness Logo"
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold font-display text-neutral-800">
                Fit<span className="text-primary-500">Meal</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden [@media(min-width:1024px)_and_(max-width:1279px)]:hidden xl:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-md transition-colors font-medium ${
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
                  className={`px-4 py-2 rounded-md transition-colors font-medium flex items-center gap-1 ${
                    location.pathname.startsWith('/admin')
                      ? 'text-primary-600 bg-primary-50' 
                      : 'text-neutral-600 hover:text-primary-500 hover:bg-neutral-100'
                  }`}
                >
                  Admin
                  <ChevronDown size={16} className={`transition-transform ${isAdminDropdownOpen ? 'rotate-180' : ''}`} />
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

          {/* User Profile & Mobile/Tablet Menu Button */}
          <div className="flex items-center space-x-4">
            <Link 
              to="/perfil" 
              className="flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-500 transition-colors"
            >
              <User size={20} />
            </Link>
            
            <button 
              className="xl:hidden flex items-center justify-center w-10 h-10 rounded-md bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="xl:hidden bg-white shadow-lg absolute top-full left-0 right-0"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container mx-auto px-4 py-4">
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
  );
};

export default Navbar;