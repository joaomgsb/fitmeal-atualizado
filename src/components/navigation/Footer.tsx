import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, MessageCircle, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-800 text-neutral-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-white">
                Big<span className="text-primary-400">Iron</span>
              </span>
            </Link>
            <p className="mt-4 text-sm">
              Sua plataforma completa de receitas e planos alimentares para objetivos fitness.
              Nutrição orientada para seus resultados.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://www.instagram.com/big_iron_ct" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61552627118944" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=5531983306606&text=Olá%2C+vim+pelo+aplicativo.&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-primary-400 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Início</Link></li>
              <li><Link to="/receitas" className="hover:text-primary-400 transition-colors">Receitas</Link></li>
              <li><Link to="/planos" className="hover:text-primary-400 transition-colors">Planos Alimentares</Link></li>
              <li><Link to="/lista-compras" className="hover:text-primary-400 transition-colors">Lista de Compras</Link></li>
              <li><Link to="/tracker" className="hover:text-primary-400 transition-colors">Rastreador</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Blog de Nutrição</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Calculadora de Macros</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Base de Alimentos</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-neutral-400" />
                <a href="bigironbh@gmail.com" className="hover:text-primary-400 transition-colors">bigironbh@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-700 mt-8 pt-8 text-sm text-neutral-500 flex flex-col md:flex-row justify-between">
          <p>&copy; {new Date().getFullYear()} FitMeal. Todos os direitos reservados.</p>
          <div className="mt-2 md:mt-0 space-x-4">
            <Link to="/termos-de-uso" className="hover:text-primary-400 transition-colors">Termos de Uso e Política de Privacidade</Link>
            <a href="mailto:inova.js001@gmail.com" className="hover:text-primary-400 transition-colors">Contato LGPD</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;