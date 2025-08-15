import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Camera, 
  Brain, 
  Zap, 
  TrendingUp, 
  ArrowLeft,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageUpload from '../components/food-recognition/ImageUpload';
import FoodRecognitionResults from '../components/food-recognition/FoodRecognitionResults';
import { recognizeFoodFromImage, FoodRecognitionResult } from '../lib/openai';
import { logCameraInfo } from '../utils/cameraTest';

const FoodRecognitionPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [result, setResult] = useState<FoodRecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Testar câmera quando a página carregar
  React.useEffect(() => {
    logCameraInfo();
  }, []);

  const handleImageSelected = async (url: string) => {
    setImageUrl(url);
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const recognitionResult = await recognizeFoodFromImage(url);
      setResult(recognitionResult);
      toast.success('Análise concluída com sucesso!');
    } catch (error) {
      console.error('Erro no reconhecimento:', error);
      setError('Erro ao analisar a imagem. Tente novamente.');
      toast.error('Erro ao analisar a imagem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    toast.error(errorMessage);
  };

  const handleReset = () => {
    setImageUrl(null);
    setResult(null);
    setError(null);
  };

  const features = [
    {
      icon: <Camera size={24} className="text-primary-500" />,
      title: "Foto Instantânea",
      description: "Tire uma foto ou faça upload de uma imagem do seu alimento"
    },
    {
      icon: <Brain size={24} className="text-primary-500" />,
      title: "IA Inteligente",
      description: "Reconhecimento avançado usando inteligência artificial"
    },
    {
      icon: <Zap size={24} className="text-primary-500" />,
      title: "Análise Nutricional",
      description: "Informações detalhadas sobre calorias e macronutrientes"
    },
    {
      icon: <TrendingUp size={24} className="text-primary-500" />,
      title: "Sugestões Personalizadas",
      description: "Dicas para melhorar sua alimentação baseadas na análise"
    }
  ];

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-br from-neutral-50 to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-neutral-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Link 
              to="/"
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <ArrowLeft size={20} className="text-neutral-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-neutral-800">
                Reconhecimento de Alimentos
              </h1>
              <p className="text-neutral-600">
                Tire uma foto e descubra as informações nutricionais
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Features Section */}
          {!imageUrl && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-neutral-800 mb-4">
                  Descubra o que está no seu prato
                </h2>
                <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
                  Use inteligência artificial para identificar alimentos e obter informações nutricionais detalhadas instantaneamente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow h-full flex flex-col"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-shrink-0">
                        {feature.icon}
                      </div>
                      <h3 className="font-semibold text-neutral-800 text-base leading-tight">{feature.title}</h3>
                    </div>
                    <p className="text-neutral-600 text-sm leading-relaxed flex-1">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Upload Section */}
          {!imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8"
            >
              <ImageUpload
                onImageSelected={handleImageSelected}
                onError={handleError}
                isLoading={isLoading}
              />
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-4 shadow-card">
                <RefreshCw size={24} className="text-primary-500 animate-spin" />
                <span className="text-lg font-medium text-neutral-800">
                  Analisando sua imagem...
                </span>
              </div>
              <p className="text-neutral-600 mt-4">
                Nossa IA está identificando os alimentos e calculando as informações nutricionais
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error-50 border border-error-200 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center gap-3 mb-3">
                <AlertCircle size={24} className="text-error" />
                <h3 className="font-semibold text-error">Erro na análise</h3>
              </div>
              <p className="text-error-700 mb-4">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error-600 transition-colors"
              >
                Tentar Novamente
              </button>
            </motion.div>
          )}

          {/* Results */}
          {result && imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-neutral-800">
                  Resultados da Análise
                </h2>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={16} />
                  Nova Análise
                </button>
              </div>

              <FoodRecognitionResults result={result} imageUrl={imageUrl} />
            </motion.div>
          )}

          {/* Tips Section */}
          {!imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mt-12"
            >
              <h3 className="text-xl font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <AlertCircle size={24} className="text-primary-500" />
                Dicas para Melhores Resultados
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-neutral-700">Certifique-se de que a imagem esteja bem iluminada</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-neutral-700">Foque nos alimentos que deseja analisar</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-neutral-700">Evite imagens muito distantes ou desfocadas</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-neutral-700">Para pratos com múltiplos alimentos, tire uma foto de cima</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodRecognitionPage; 