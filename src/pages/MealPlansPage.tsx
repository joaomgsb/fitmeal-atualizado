import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import { 
  ArrowRight, Calendar, Target, Clock, ChevronRight, Award,
  BarChart, Dumbbell, CheckCircle
} from 'lucide-react';
import GenerateMealPlanButton from '../components/meal-plan/GenerateMealPlanButton';

const MealPlansPage: React.FC = () => {
  const navigate = useNavigate();

  const handlePlanGenerated = (plan: any) => {
    // Navega para a página de detalhes com o plano gerado
    navigate('/planos/personalizado', { state: { generatedPlan: plan } });
  };

  const plans = [
    {
      id: 'perda-peso',
      title: 'Perda de Peso',
      description: 'Plano alimentar com déficit calórico controlado para perda de gordura preservando massa muscular.',
      duration: '8 semanas',
      meals: 5,
      image: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      color: 'from-blue-500 to-blue-700',
      features: [
        'Déficit calórico moderado de 20%',
        'Maior ênfase em proteínas (2g/kg)',
        'Timing nutricional para treinos',
        'Cardápio rotativo de 21 dias',
        'Opções de substituições'
      ]
    },
    {
      id: 'hipertrofia',
      title: 'Ganho Muscular',
      description: 'Plano alimentar com superávit calórico para maximizar o ganho de massa muscular.',
      duration: '12 semanas',
      meals: 6,
      image: 'https://images.pexels.com/photos/1320917/pexels-photo-1320917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      color: 'from-green-500 to-green-700',
      features: [
        'Superávit calórico de 10-15%',
        'Alta ingestão proteica (2.2g/kg)',
        'Foco em carboidratos nos pré/pós treinos',
        'Estratégias para hardgainers',
        'Nutrição periódica baseada no treino'
      ]
    },
    {
      id: 'definicao',
      title: 'Definição Muscular',
      description: 'Plano alimentar para redução de gordura corporal mantendo massa muscular e performance.',
      duration: '10 semanas',
      meals: 5,
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop',
      color: 'from-purple-500 to-purple-700',
      features: [
        'Déficit calórico estratégico',
        'Protocolo de carb cycling',
        'Alta ingestão proteica (2.4g/kg)',
        'Estratégias para evitar platôs',
        'Suplementação direcionada'
      ]
    }
  ];
  
  const testimonials = [
    {
      id: 1,
      name: 'Ana Silva',
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=600',
      text: 'O plano de Perda de Peso mudou completamente minha relação com a comida. Perdi 12kg em 3 meses sem passar fome e ainda melhorei meu desempenho na academia!',
      plan: 'Perda de Peso',
      result: '-12kg em 3 meses'
    },
    {
      id: 2,
      name: 'Roberto Costa',
      image: 'https://images.unsplash.com/photo-1583468982228-19f19164aee2?q=80&w=1011&auto=format&fit=crop',
      text: 'Sempre fui hardgainer e tinha dificuldade para ganhar massa. Com o plano de Ganho Muscular, finalmente consegui ganhar 8kg de massa magra em 4 meses!',
      plan: 'Ganho Muscular',
      result: '+8kg de massa magra'
    },
    {
      id: 3,
      name: 'Carolina Mendes',
      image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?q=80&w=1374&auto=format&fit=crop',
      text: 'O plano de Definição Muscular foi perfeito para minha fase de competição. Consegui reduzir 6% de gordura mantendo toda minha massa muscular.',
      plan: 'Definição Muscular',
      result: '-6% de gordura corporal'
    }
  ];
  
  return (
    <PageTransition>
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-6">
              Planos Alimentares Personalizados para Seus Objetivos
            </h1>
            <p className="text-primary-50 text-lg mb-12">
              Desenvolvidos por especialistas em nutrição esportiva, nossos planos são criados para otimizar seus resultados fitness com alimentação balanceada e deliciosa.
            </p>

            {/* Como Funciona */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-8">Como Funciona</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                    1
                  </div>
                  <h3 className="font-medium mb-2">Complete seu Perfil</h3>
                  <p className="text-primary-50">
                    Informe seus dados básicos e objetivos para um plano sob medida.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                    2
                  </div>
                  <h3 className="font-medium mb-2">Preferências Alimentares</h3>
                  <p className="text-primary-50">
                    Personalize seu plano com suas preferências e restrições.
                  </p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0 mb-4">
                    3
                  </div>
                  <h3 className="font-medium mb-2">Receba seu Plano</h3>
                  <p className="text-primary-50">
                    Receba um plano personalizado pronto para começar.
                  </p>
                </div>
              </div>
            </div>

            {/* Gerador de Plano */}
            <div className="max-w-lg mx-auto">
              <GenerateMealPlanButton onPlanGenerated={handlePlanGenerated} />
            </div>
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              Por que escolher nossos <span className="text-primary-500">Planos Alimentares</span>?
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Combinamos ciência da nutrição esportiva com praticidade para criar planos que realmente funcionam.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Target size={24} className="text-primary-500" />,
                title: "Personalização Avançada",
                description: "Planos adaptados ao seu metabolismo, preferências alimentares e objetivos específicos."
              },
              {
                icon: <Calendar size={24} className="text-primary-500" />,
                title: "Planejamento Simplificado",
                description: "Cardápios semanais completos com lista de compras e guia de preparação."
              },
              {
                icon: <BarChart size={24} className="text-primary-500" />,
                title: "Acompanhamento de Progresso",
                description: "Ferramentas para monitorar sua evolução e ajustar o plano conforme necessário."
              }
            ].map((benefit, index) => (
              <motion.div 
                key={index}
                className="bg-white p-6 rounded-xl border border-neutral-200 shadow-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary-50 rounded-md flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-neutral-800">{benefit.title}</h3>
                <p className="text-neutral-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Plans Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              Escolha o Plano Ideal para <span className="text-primary-500">Seu Objetivo</span>
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Todos os nossos planos são desenvolvidos por nutricionistas especializados em fitness e personalizáveis para suas necessidades.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div 
                key={plan.id}
                className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col h-full"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="relative h-48">
                  <div className={`absolute inset-0 bg-gradient-to-r ${plan.color} opacity-80`}></div>
                  <img 
                    src={plan.image} 
                    alt={plan.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-bold text-white">{plan.title}</h3>
                  </div>
                </div>
                
                <div className="p-6 flex-grow">
                  <p className="text-neutral-600 mb-4">{plan.description}</p>
                  
                  <div className="flex items-center justify-between mb-6 text-sm">
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Clock size={16} />
                      <span>{plan.duration}</span>
                    </div>
                    <div className="flex items-center gap-1 text-neutral-600">
                      <Calendar size={16} />
                      <span>{plan.meals} refeições/dia</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold mb-3 text-neutral-800">Características:</h4>
                    <ul className="space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle size={16} className="text-primary-500 mt-1 flex-shrink-0" />
                          <span className="text-neutral-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="p-6 pt-0 mt-auto">
                  <Link
                    to={`/planos/${plan.id}`}
                    className="block w-full py-3 bg-primary-500 text-white text-center rounded-lg font-medium hover:bg-primary-600 transition-colors"
                  >
                    Ver Detalhes
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              to="/perfil"
              className="inline-flex items-center gap-2 text-primary-500 font-medium hover:text-primary-600 transition-colors"
            >
              Criar plano totalmente personalizado <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              Como Funcionam Nossos <span className="text-primary-500">Planos Alimentares</span>
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Processo simples e eficiente para planos nutricionais personalizados.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="text-white" size={24} />,
                title: "Escolha seu objetivo",
                description: "Selecione entre perda de peso, ganho muscular ou definição.",
                color: "bg-primary-500"
              },
              {
                icon: <Dumbbell className="text-white" size={24} />,
                title: "Compartilhe seu perfil",
                description: "Informe seus dados, rotina de treinos e preferências alimentares.",
                color: "bg-accent-500"
              },
              {
                icon: <Calendar className="text-white" size={24} />,
                title: "Receba seu plano",
                description: "Plano personalizado com cardápio e lista de compras.",
                color: "bg-energy-500"
              },
              {
                icon: <BarChart className="text-white" size={24} />,
                title: "Acompanhe seu progresso",
                description: "Registre sua evolução e ajuste o plano conforme necessário.",
                color: "bg-purple-500"
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                  {step.icon}
                </div>
                {index < 3 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-neutral-200 -translate-x-8 z-0"></div>
                )}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold font-display mb-4">
              Histórias de <span className="text-primary-500">Sucesso</span>
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Veja os resultados reais que nossos usuários conseguiram com os planos alimentares da FitMeal.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <motion.div 
                key={testimonial.id}
                className="bg-white p-6 rounded-xl shadow-card"
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center mb-4">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-sm text-neutral-500">Plano: {testimonial.plan}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-neutral-600 italic">"{testimonial.text}"</p>
                </div>
                
                <div className="flex items-center">
                  <Award size={18} className="text-primary-500 mr-2" />
                  <span className="font-medium text-neutral-800">{testimonial.result}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold font-display mb-6">
            Pronto para transformar sua alimentação e resultados?
          </h2>
          <p className="text-primary-50 max-w-2xl mx-auto mb-8">
            Comece hoje mesmo com um plano alimentar personalizado que vai potencializar seus treinos e ajudar você a atingir seus objetivos fitness.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/perfil"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors shadow-md"
            >
              Criar Meu Plano
            </Link>
            <Link
              to="/receitas"
              className="bg-transparent text-white border border-white/30 backdrop-blur-sm px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              Explorar Receitas
            </Link>
          </div>
        </div>
      </section>
    </div>
    </PageTransition>
  );
};

export default MealPlansPage;