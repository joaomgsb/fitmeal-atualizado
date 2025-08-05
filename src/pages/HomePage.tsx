import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle, Dumbbell, Utensils, ShoppingBag, LineChart } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeatureCard from '../components/home/FeatureCard';


const HomePage: React.FC = () => {
  const features = [
    {
      icon: <Utensils size={24} className="text-primary-500" />,
      title: "Receitas Fitness",
      description: "Centenas de receitas saborosas alinhadas com seus objetivos fitness, categorizadas por macronutrientes e propósito."
    },
    {
      icon: <Dumbbell size={24} className="text-primary-500" />,
      title: "Planos Personalizados",
      description: "Planos alimentares adaptados ao seu objetivo, preferências e rotina de treinos para maximizar resultados."
    },
    {
      icon: <LineChart size={24} className="text-primary-500" />,
      title: "Rastreador Nutricional",
      description: "Acompanhe macronutrientes, calorias e progresso com visualizações intuitivas e relatórios personalizados."
    },
    {
      icon: <ShoppingBag size={24} className="text-primary-500" />,
      title: "Lista de Compras",
      description: "Gere automaticamente listas de compras baseadas nos seus planos alimentares, economizando tempo e dinheiro."
    }
  ];
  
  const benefits = [
    "Receitas alinhadas a objetivos fitness específicos",
    "Planos alimentares personalizados para seu metabolismo",
    "Rastreamento simplificado de macronutrientes",
    "Economia de tempo no planejamento alimentar",
    "Orientações nutricionais baseadas em ciência",
    "Integração com sua rotina de treinos"
  ];

  return (
    <div className="pt-16">
      <HeroSection />
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Transforme sua alimentação <span className="text-primary-500">e seus resultados</span>
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              A FitMeal combina nutrição fitness, tecnologia e conveniência para ajudar você a atingir seus objetivos, sem complicações.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>
      

      
      {/* Nutritionist Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="images/vivi.png" 
                alt="Nutricionista" 
                className="rounded-xl shadow-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">
                Conheça nossa <span className="text-primary-500">Nutricionista</span>
              </h2>
              <p className="text-neutral-600 text-lg mb-8">
                Conte com o acompanhamento profissional da nossa nutricionista especializada em nutrição esportiva para alcançar seus objetivos de forma saudável e sustentável.
              </p>
              
              <div className="bg-neutral-50 p-6 rounded-xl border border-neutral-100 mb-8">
                <h3 className="text-xl font-semibold mb-2">Viviane Ferreira</h3>
                <p className="text-primary-600 font-medium mb-4">CRN 24028</p>
                <ul className="space-y-3 text-neutral-700">
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Especialista em Nutrição Esportiva
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Experiência em planejamento nutricional personalizado
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                    Foco em resultados e bem-estar
                  </li>
                </ul>
              </div>
              
              <Link
                to="https://api.whatsapp.com/send/?phone=5531998887395&text&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-md"
              >
                Agendar Consulta <ArrowRight size={18} className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-primary-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-display mb-6">
                Por que escolher a FitMeal para sua jornada fitness?
              </h2>
              <p className="mb-8 text-primary-50">
                A combinação perfeita entre nutrição de qualidade e conveniência para maximizar seus resultados.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircle className="mt-1 mr-3 flex-shrink-0" size={20} />
                    <p>{benefit}</p>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-10">
                <Link 
                  to="/planos" 
                  className="inline-flex items-center bg-white text-primary-600 font-medium rounded-lg px-6 py-3 shadow-md hover:shadow-lg hover:bg-neutral-50 transition-all"
                >
                  Comece seu plano alimentar <ArrowRight size={18} className="ml-2" />
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-w-4 aspect-h-3 rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="Refeição saudável preparada" 
                  className="object-cover w-full h-full rounded-xl"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="bg-primary-500 text-white p-2 rounded">
                    <LineChart size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Refeições balanceadas</p>
                    <p className="font-bold text-neutral-800">80% de usuários com sucesso</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-display mb-6">
            Pronto para transformar sua nutrição?
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto mb-10">
            Junte-se a milhares de pessoas que estão atingindo seus objetivos fitness com alimentação inteligente e personalizada.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/perfil"
              className="bg-primary-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors shadow-md"
            >
              Criar Conta Grátis
            </Link>
            <Link
              to="/receitas"
              className="bg-white text-neutral-700 border border-neutral-300 px-8 py-3 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
            >
              Explorar Receitas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;