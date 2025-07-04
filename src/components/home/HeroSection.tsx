import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/receitas?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleQuickSearch = (term: string) => {
    navigate(`/receitas?search=${encodeURIComponent(term)}`);
  };

  return (
    <section className="relative pt-16 md:pt-20 pb-20 md:pb-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900/80 to-neutral-900/40"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-display leading-tight mb-6 text-white">
              Nutrição <span className="text-primary-300">personalizada</span> para seus objetivos fitness
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-lg md:text-xl text-neutral-200 mb-8">
              Receitas deliciosas e planos alimentares personalizados, alinhados com seus treinos para maximizar seus resultados.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              to="/perfil"
              className="bg-primary-500 hover:bg-primary-600 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center justify-center transition-colors shadow-lg" 
            >
              Começar Agora <ChevronRight size={18} className="ml-1" />
            </Link>
            <Link
              to="/receitas"
              className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium px-8 py-3 rounded-lg inline-flex items-center justify-center border border-white/30 transition-all"
            >
              Explorar Receitas
            </Link>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 max-w-lg"
          >
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar receitas, planos alimentares..."
                  className="w-full bg-white/10 backdrop-blur-md border border-white/30 rounded-lg pl-12 pr-4 py-3 text-white placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Search size={20} className="text-neutral-300" />
                </div>
              </div>
            </form>
            <div className="mt-2 text-sm text-neutral-300 flex flex-wrap gap-2">
              <span>Busque por:</span>
              <button 
                onClick={() => handleQuickSearch('Receitas proteicas')}
                className="text-primary-300 hover:text-primary-200 hover:underline"
              >
                Receitas proteicas
              </button>
              <button 
                onClick={() => handleQuickSearch('Pré-treino')}
                className="text-primary-300 hover:text-primary-200 hover:underline"
              >
                Pré-treino
              </button>
              <button 
                onClick={() => handleQuickSearch('Baixas calorias')}
                className="text-primary-300 hover:text-primary-200 hover:underline"
              >
                Baixas calorias
              </button>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {[
            { value: "500+", label: "Receitas Fitness" },
            { value: "20k+", label: "Usuários Ativos" },
            { value: "95%", label: "Taxa de Satisfação" },
            { value: "70%", label: "Alcançam Objetivos" }
          ].map((stat, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-md rounded-lg p-4 md:p-6 text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-neutral-300 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;