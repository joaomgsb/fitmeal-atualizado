import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Droplets, Beef, Scale, Target } from 'lucide-react';

const CalculatorTab: React.FC = () => {
  // Estados para IMC
  const [imcHeight, setImcHeight] = useState('');
  const [imcWeight, setImcWeight] = useState('');
  const [imcAge, setImcAge] = useState('');
  const [imcResult, setImcResult] = useState<{ value: number; category: string; color: string } | null>(null);

  // Estados para Água
  const [waterWeight, setWaterWeight] = useState('');
  const [waterAge, setWaterAge] = useState('');
  const [waterActivity, setWaterActivity] = useState('sedentario');
  const [waterResult, setWaterResult] = useState<number | null>(null);

  // Estados para Proteína
  const [proteinWeight, setProteinWeight] = useState('');
  const [proteinGoal, setProteinGoal] = useState('manutencao');
  const [proteinActivity, setProteinActivity] = useState('moderado');
  const [proteinResult, setProteinResult] = useState<{ min: number; max: number } | null>(null);

  // Função para calcular IMC
  const calculateIMC = () => {
    const height = parseFloat(imcHeight) / 100; // converter cm para metros
    const weight = parseFloat(imcWeight);
    const age = parseFloat(imcAge);
    
    if (height > 0 && weight > 0 && age > 0) {
      const imc = weight / (height * height);
      let category = '';
      let color = '';
      
      // Ajuste para faixas etárias (idosos têm faixas ligeiramente diferentes)
      const isElderly = age >= 65;
      
      if (isElderly) {
        if (imc < 22) {
          category = 'Abaixo do peso';
          color = 'text-blue-600';
        } else if (imc < 27) {
          category = 'Peso normal';
          color = 'text-green-600';
        } else if (imc < 32) {
          category = 'Sobrepeso';
          color = 'text-yellow-600';
        } else if (imc < 37) {
          category = 'Obesidade grau I';
          color = 'text-orange-600';
        } else if (imc < 42) {
          category = 'Obesidade grau II';
          color = 'text-red-600';
        } else {
          category = 'Obesidade grau III';
          color = 'text-red-800';
        }
      } else {
        if (imc < 18.5) {
          category = 'Abaixo do peso';
          color = 'text-blue-600';
        } else if (imc < 25) {
          category = 'Peso normal';
          color = 'text-green-600';
        } else if (imc < 30) {
          category = 'Sobrepeso';
          color = 'text-yellow-600';
        } else if (imc < 35) {
          category = 'Obesidade grau I';
          color = 'text-orange-600';
        } else if (imc < 40) {
          category = 'Obesidade grau II';
          color = 'text-red-600';
        } else {
          category = 'Obesidade grau III';
          color = 'text-red-800';
        }
      }
      
      setImcResult({ value: parseFloat(imc.toFixed(1)), category, color });
    }
  };

  // Função para calcular consumo de água
  const calculateWater = () => {
    const weight = parseFloat(waterWeight);
    const age = parseFloat(waterAge);
    
    if (weight > 0 && age > 0) {
      let baseWater = weight * 35; // 35ml por kg de peso corporal
      
      // Ajustar baseado na idade
      if (age >= 65) {
        baseWater *= 1.1; // Idosos precisam de mais hidratação
      } else if (age <= 18) {
        baseWater *= 1.05; // Jovens têm metabolismo mais acelerado
      }
      
      // Ajustar baseado na atividade física
      switch (waterActivity) {
        case 'sedentario':
          baseWater *= 1;
          break;
        case 'leve':
          baseWater *= 1.2;
          break;
        case 'moderado':
          baseWater *= 1.4;
          break;
        case 'intenso':
          baseWater *= 1.6;
          break;
        case 'muito_intenso':
          baseWater *= 1.8;
          break;
      }
      
      setWaterResult(parseFloat((baseWater / 1000).toFixed(1))); // converter para litros
    }
  };

  // Função para calcular proteína
  const calculateProtein = () => {
    const weight = parseFloat(proteinWeight);
    
    if (weight > 0) {
      let proteinPerKg = 0;
      
      // Definir quantidade base por objetivo
      switch (proteinGoal) {
        case 'manutencao':
          proteinPerKg = 1.2;
          break;
        case 'emagrecimento':
          proteinPerKg = 1.6;
          break;
        case 'hipertrofia':
          proteinPerKg = 2.0;
          break;
        case 'definicao':
          proteinPerKg = 2.2;
          break;
      }
      
      // Ajustar baseado na atividade física
      switch (proteinActivity) {
        case 'sedentario':
          proteinPerKg *= 0.9;
          break;
        case 'leve':
          proteinPerKg *= 1;
          break;
        case 'moderado':
          proteinPerKg *= 1.1;
          break;
        case 'intenso':
          proteinPerKg *= 1.2;
          break;
        case 'muito_intenso':
          proteinPerKg *= 1.3;
          break;
      }
      
      const minProtein = weight * proteinPerKg;
      const maxProtein = weight * (proteinPerKg + 0.3);
      
      setProteinResult({
        min: parseFloat(minProtein.toFixed(0)),
        max: parseFloat(maxProtein.toFixed(0))
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold font-display mb-2">
          <Calculator className="inline mr-2" size={28} />
          Calculadoras Fitness
        </h2>
        <p className="text-neutral-600">
          Ferramentas essenciais para acompanhar sua jornada fitness
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculadora de IMC */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 min-h-[480px] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Scale className="text-blue-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Calculadora de IMC</h3>
            <p className="text-neutral-600 text-sm">Índice de Massa Corporal</p>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Altura (cm)
              </label>
              <input
                type="number"
                value={imcHeight}
                onChange={(e) => setImcHeight(e.target.value)}
                placeholder="Ex: 175"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                value={imcWeight}
                onChange={(e) => setImcWeight(e.target.value)}
                placeholder="Ex: 70"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Idade (anos)
              </label>
              <input
                type="number"
                value={imcAge}
                onChange={(e) => setImcAge(e.target.value)}
                placeholder="Ex: 30"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              onClick={calculateIMC}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors mt-auto"
            >
              Calcular IMC
            </button>

            {imcResult && (
              <motion.div 
                className="bg-blue-50 rounded-lg p-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold text-blue-600 mb-1">
                  {imcResult.value}
                </div>
                <div className={`font-medium ${imcResult.color}`}>
                  {imcResult.category}
                </div>
                <div className="text-xs text-neutral-600 mt-2">
                  Valores de referência para adultos
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Calculadora de Água */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 min-h-[480px] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Droplets className="text-cyan-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Consumo de Água</h3>
            <p className="text-neutral-600 text-sm">Hidratação diária ideal</p>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                value={waterWeight}
                onChange={(e) => setWaterWeight(e.target.value)}
                placeholder="Ex: 70"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Idade (anos)
              </label>
              <input
                type="number"
                value={waterAge}
                onChange={(e) => setWaterAge(e.target.value)}
                placeholder="Ex: 30"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Nível de Atividade
              </label>
              <select
                value={waterActivity}
                onChange={(e) => setWaterActivity(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              >
                <option value="sedentario">Sedentário</option>
                <option value="leve">Atividade Leve</option>
                <option value="moderado">Atividade Moderada</option>
                <option value="intenso">Atividade Intensa</option>
                <option value="muito_intenso">Muito Intenso</option>
              </select>
            </div>

            <button
              onClick={calculateWater}
              className="w-full bg-cyan-500 text-white py-3 rounded-lg font-medium hover:bg-cyan-600 transition-colors mt-auto"
            >
              Calcular Água
            </button>

            {waterResult && (
              <motion.div 
                className="bg-cyan-50 rounded-lg p-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-3xl font-bold text-cyan-600 mb-1">
                  {waterResult}L
                </div>
                <div className="font-medium text-cyan-700">
                  por dia
                </div>
                <div className="text-xs text-neutral-600 mt-2">
                  Aproximadamente {Math.round(waterResult * 4)} copos de 250ml
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Calculadora de Proteína */}
        <motion.div 
          className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6 min-h-[480px] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Beef className="text-red-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-neutral-800">Necessidade Proteica</h3>
            <p className="text-neutral-600 text-sm">Proteína diária ideal</p>
          </div>

          <div className="space-y-4 flex-grow">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Peso (kg)
              </label>
              <input
                type="number"
                value={proteinWeight}
                onChange={(e) => setProteinWeight(e.target.value)}
                placeholder="Ex: 70"
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Objetivo
              </label>
              <select
                value={proteinGoal}
                onChange={(e) => setProteinGoal(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="manutencao">Manutenção</option>
                <option value="emagrecimento">Emagrecimento</option>
                <option value="hipertrofia">Hipertrofia</option>
                <option value="definicao">Definição</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Atividade Física
              </label>
              <select
                value={proteinActivity}
                onChange={(e) => setProteinActivity(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="sedentario">Sedentário</option>
                <option value="leve">Leve (1-3x/semana)</option>
                <option value="moderado">Moderado (3-5x/semana)</option>
                <option value="intenso">Intenso (6-7x/semana)</option>
                <option value="muito_intenso">Muito Intenso (2x/dia)</option>
              </select>
            </div>

            <button
              onClick={calculateProtein}
              className="w-full bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-colors mt-auto"
            >
              Calcular Proteína
            </button>

            {proteinResult && (
              <motion.div 
                className="bg-red-50 rounded-lg p-4 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-2xl font-bold text-red-600 mb-1">
                  {proteinResult.min} - {proteinResult.max}g
                </div>
                <div className="font-medium text-red-700">
                  por dia
                </div>
                <div className="text-xs text-neutral-600 mt-2">
                  Distribua ao longo das refeições
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Dicas */}
      <motion.div 
        className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 border border-primary-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="text-lg font-bold text-primary-800 mb-4 flex items-center">
          <Target className="mr-2" size={20} />
          Dicas Importantes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h4 className="font-semibold text-blue-700 mb-2">💡 IMC</h4>
            <p className="text-neutral-600">
              O IMC é uma referência geral. Atletas podem ter IMC alto devido à massa muscular.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h4 className="font-semibold text-cyan-700 mb-2">💧 Hidratação</h4>
            <p className="text-neutral-600">
              Aumente o consumo em dias quentes, durante exercícios ou se consumir cafeína/álcool.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-primary-200">
            <h4 className="font-semibold text-red-700 mb-2">🥩 Proteína</h4>
            <p className="text-neutral-600">
              Distribua a proteína em 4-6 refeições. Combine com carboidratos pós-treino.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CalculatorTab;