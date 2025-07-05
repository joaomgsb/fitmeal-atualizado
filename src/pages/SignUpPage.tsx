import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Mail, Lock, User, AlertCircle, Key } from 'lucide-react';
import { validateAccessCode, useAccessCode } from '../lib/accessCodes';
import TermsOfUseModal from '../components/TermsOfUseModal';
import { recordTermsAcceptanceWithAudit } from '../lib/termsService';

const SignUpPage: React.FC = () => {
  const [accessCode, setAccessCode] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validatingCode, setValidatingCode] = useState(false);
  const [codeValidated, setCodeValidated] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [goal, setGoal] = useState('');
  const [dietPreferences, setDietPreferences] = useState<string[]>([]);
  const [allergies, setAllergies] = useState('');
  const [step, setStep] = useState(1);
  
  // Estados para o modal de termos
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const fitnessGoals = [
    { id: 'emagrecimento', label: 'Perda de Peso' },
    { id: 'hipertrofia', label: 'Ganho Muscular' },
    { id: 'definicao', label: 'Definição Muscular' }
  ];

  const dietOptions = [
    { id: 'proteica', label: 'Rica em Proteínas' },
    { id: 'lowcarb', label: 'Baixo Carboidrato' },
    { id: 'vegetariana', label: 'Vegetariana' },
    { id: 'vegana', label: 'Vegana' },
    { id: 'paleo', label: 'Paleo' },
    { id: 'mediterranea', label: 'Mediterrânea' }
  ];

  const handleValidateCode = async () => {
    if (!accessCode.trim()) {
      setError('Por favor, insira o código de acesso.');
      return;
    }

    setValidatingCode(true);
    setError('');

    try {
      const validation = await validateAccessCode(accessCode.trim());
      if (validation.valid) {
        setCodeValidated(true);
        setError('');
      } else {
        setError(validation.message);
      }
    } catch (err) {
      setError('Erro ao validar código. Tente novamente.');
    } finally {
      setValidatingCode(false);
    }
  };

  const handleTermsAcceptance = async () => {
    setTermsAccepted(true);
    setShowTermsModal(false);
    
    // Mensagem de confirmação
    setError('');
    console.log('Termos de uso aceitos pelo usuário');
  };

  const handleProceedToSignup = () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
      return;
    }
    // Se já aceitou os termos, continua com o cadastro
    proceedWithSignup();
  };

  const proceedWithSignup = async () => {
    try {
      setError('');
      setLoading(true);
      const userCredential = await signUp(email, password);
      
      // Marcar código como usado
      if (userCredential.user) {
        await useAccessCode(accessCode.trim(), userCredential.user.uid);
      }
      
      // Criar perfil inicial do usuário
      if (userCredential.user) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          name,
          email,
          accessCode: accessCode.trim(),
          gender,
          age: Number(age),
          height: Number(height),
          weight: Number(weight),
          goal,
          activityLevel: '',
          dietPreferences,
          allergies: allergies ? allergies.split(',').map(a => a.trim()) : [],
          startDate: new Date().toISOString()
        });

        // Registrar aceitação dos termos de uso
        await recordTermsAcceptanceWithAudit(
          userCredential.user.uid,
          email,
          name,
          'signup'
        );
      }
      
      navigate('/perfil');
    } catch (error) {
      console.error('Erro ao criar conta:', error);
      setError('Falha ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!codeValidated) {
      setError('Por favor, valide seu código de acesso primeiro.');
      return;
    }

    if (password !== confirmPassword) {
      return setError('As senhas não coincidem');
    }

    // Verificar se todos os campos estão preenchidos
    if (!name || !email || !password || !confirmPassword || !gender || !age || !height || !weight || !goal) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Abrir modal de termos se ainda não foi aceito
    handleProceedToSignup();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold font-display mb-2">Crie sua conta</h2>
          <p className="text-neutral-600">
            Comece sua jornada para uma vida mais saudável
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center gap-2">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Código de Acesso da Academia
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => {
                      setAccessCode(e.target.value.toUpperCase());
                      setCodeValidated(false);
                      setError('');
                    }}
                    className={`w-full pl-10 pr-20 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      codeValidated ? 'border-green-500 bg-green-50' : 'border-neutral-200'
                    }`}
                    placeholder="Ex: ABC12345"
                    maxLength={8}
                    required
                  />
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                  {!codeValidated && (
                    <button
                      type="button"
                      onClick={handleValidateCode}
                      disabled={validatingCode || !accessCode.trim()}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 text-xs bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
                    >
                      {validatingCode ? 'Validando...' : 'Validar'}
                    </button>
                  )}
                  {codeValidated && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-500">
                      ✓
                    </div>
                  )}
                </div>
                {codeValidated && (
                  <p className="text-green-600 text-sm mt-1">✓ Código válido! Você pode prosseguir.</p>
                )}
                <p className="text-neutral-500 text-xs mt-1">
                  Entre em contato com a academia para obter seu código de acesso.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Nome</label>
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Confirmar Senha</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!codeValidated) {
                    setError('Por favor, valide seu código de acesso primeiro.');
                    return;
                  }
                  if (!name || !email || !password || !confirmPassword) {
                    setError('Preencha todos os campos.');
                    return;
                  }
                  if (password !== confirmPassword) {
                    setError('As senhas não coincidem');
                    return;
                  }
                  setError('');
                  setStep(2);
                }}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${
                  codeValidated 
                    ? 'bg-primary-500 text-white hover:bg-primary-600' 
                    : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                }`}
                disabled={!codeValidated}
              >
                Prosseguir
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Gênero</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Selecione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Feminino">Feminino</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Idade</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  min={1}
                  max={120}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Altura (cm)</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  min={50}
                  max={250}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Peso (kg)</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                  min={20}
                  max={300}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Objetivo Fitness</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Selecione</option>
                  {fitnessGoals.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Preferências Alimentares</label>
                <div className="flex flex-wrap gap-2 mb-1">
                  {dietOptions.map(option => (
                    <button
                      type="button"
                      key={option.id}
                      onClick={() => {
                        if (dietPreferences.includes(option.id)) {
                          setDietPreferences(dietPreferences.filter(o => o !== option.id));
                        } else {
                          setDietPreferences([...dietPreferences, option.id]);
                        }
                      }}
                      className={`px-4 py-2 rounded-full border transition-colors font-medium text-sm
                        ${dietPreferences.includes(option.id)
                          ? 'bg-primary-500 text-white border-primary-500 shadow'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-100'}`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <span className="text-xs text-neutral-500">Clique para selecionar uma ou mais opções.</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Alergias/Intolerâncias</label>
                <input
                  type="text"
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Ex: lactose, glúten, amendoim..."
                />
              </div>
              <div className="flex flex-col gap-2 items-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full bg-neutral-200 text-neutral-700 py-2 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 text-white py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Criando conta...' : termsAccepted ? 'Criar Conta' : 'Aceitar Termos e Criar Conta'}
                </button>
                {termsAccepted && (
                  <div className="mt-2 text-center">
                    <p className="text-sm text-green-600 flex items-center justify-center gap-1">
                      ✓ Termos de uso aceitos
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </form>

        <div className="mt-6 text-center">
          <p className="text-neutral-600">
            Já tem uma conta?{' '}
            <Link to="/login" className="text-primary-500 font-medium hover:text-primary-600">
              Faça login
            </Link>
          </p>
        </div>
      </div>

      {/* Modal de Termos de Uso */}
      <TermsOfUseModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={handleTermsAcceptance}
      />
    </div>
  );
};

export default SignUpPage;