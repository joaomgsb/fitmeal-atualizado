import React, { useState } from 'react';
import { X, FileText, ExternalLink, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const TermsOfUseModal: React.FC<TermsOfUseModalProps> = ({ isOpen, onClose, onAccept }) => {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const isAtBottom = target.scrollHeight - target.scrollTop <= target.clientHeight + 10;
    if (isAtBottom && !hasScrolledToBottom) {
      setHasScrolledToBottom(true);
    }
  };

  const handleAccept = () => {
    if (hasAccepted && hasScrolledToBottom) {
      onAccept();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-100 rounded-lg">
              <FileText className="text-primary-600" size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Termos de Uso e Política de Privacidade
              </h2>
              <p className="text-sm text-gray-600">
                É necessário aceitar os termos para continuar
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="flex-1 overflow-y-auto p-6 text-sm"
          onScroll={handleScroll}
        >
          {/* Resumo Executivo */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-blue-600 mt-1" size={20} />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">Resumo dos Pontos Principais:</h3>
                <ul className="space-y-1 text-blue-800 text-sm">
                  <li>• Esta plataforma oferece conteúdo educativo sobre nutrição e receitas fitness</li>
                  <li>• O conteúdo NÃO substitui orientação médica ou nutricional profissional</li>
                  <li>• Você deve consultar profissionais de saúde antes de alterar sua alimentação</li>
                  <li>• Coletamos e protegemos seus dados conforme a LGPD</li>
                  <li>• Ao usar a plataforma, você assume responsabilidade pelo uso das informações</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seção 1 - Identificação */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              IDENTIFICAÇÃO DA PLATAFORMA
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
              <p><strong>Nome:</strong> FitMeal</p>
              <p><strong>URL:</strong> https://fitmeal.netlify.app</p>
              <p><strong>Finalidade:</strong> Plataforma de receitas fitness e orientações nutricionais</p>
              <p><strong>Desenvolvedor:</strong> Inova.Js</p>
            </div>
          </div>

          {/* Seção 2 - Natureza do Conteúdo */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              NATUREZA DO CONTEÚDO
            </h3>
            <div className="space-y-3">
              <div className="bg-green-50 border-l-4 border-green-400 p-3">
                <h4 className="font-semibold text-green-800 mb-1">Planos Certificados por Profissional</h4>
                <p className="text-green-700 text-sm">Elaborados por nutricionista habilitada (CRN válido)</p>
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <h4 className="font-semibold text-yellow-800 mb-1">Conteúdo Gerado por IA</h4>
                <p className="text-yellow-700 text-sm">Baseado em algoritmos, sem certificação profissional</p>
              </div>
            </div>
          </div>

          {/* Aviso Importante */}
          <div className="mb-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
                ⚠️ AVISO IMPORTANTE
              </h3>
              <p className="text-red-700 leading-relaxed">
                <strong>Nenhum conteúdo desta plataforma substitui consulta, diagnóstico ou tratamento 
                realizados por profissionais de saúde qualificados.</strong> É fundamental consultar 
                nutricionista ou médico antes de adotar qualquer regime alimentar.
              </p>
            </div>
          </div>

          {/* Seção 3 - Isenção de Responsabilidade */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              ISENÇÃO DE RESPONSABILIDADE
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 mb-2">A plataforma FitMeal se exime de responsabilidade por:</p>
              <ul className="space-y-1 text-gray-700 text-sm ml-4">
                <li>• Utilização inadequada das informações</li>
                <li>• Reações adversas ou complicações de saúde</li>
                <li>• Resultados obtidos ou não obtidos</li>
                <li>• Decisões baseadas exclusivamente no conteúdo</li>
              </ul>
            </div>
          </div>

          {/* Seção 4 - Proteção de Dados LGPD */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              PROTEÇÃO DE DADOS (LGPD)
            </h3>
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2">Dados Coletados:</h4>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Nome, e-mail e informações do perfil</li>
                  <li>• Cookies técnicos para funcionamento</li>
                  <li>• Informações de navegação (IP)</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <h4 className="font-semibold text-blue-800 mb-2">Seus Direitos:</h4>
                <ul className="space-y-1 text-blue-700 text-sm">
                  <li>• Acesso, correção e exclusão dos dados</li>
                  <li>• Portabilidade e revogação de consentimento</li>
                  <li>• Informações sobre o tratamento</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Seção 5 - Consentimento */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">5</span>
              DECLARAÇÃO DE CONSENTIMENTO
            </h3>
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-lg p-4">
              <p className="text-gray-800 mb-3 font-medium">
                Ao aceitar estes termos, você declara que:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <p className="text-gray-700 text-sm">Leu e compreendeu integralmente estes termos</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <p className="text-gray-700 text-sm">Concorda com todas as disposições estabelecidas</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <p className="text-gray-700 text-sm">Reconhece a diferença entre conteúdo certificado e gerado por IA</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <p className="text-gray-700 text-sm">Compromete-se a buscar orientação profissional quando necessário</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <p className="text-gray-700 text-sm">Assume responsabilidade integral pelo uso das informações</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contato */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">CONTATO</h3>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-gray-700 text-sm">
                <strong>E-mail:</strong> inova.js001@gmail.com<br />
                <strong>Data de vigência:</strong> 14 de junho de 2025<br />
                <strong>Desenvolvido por:</strong> Inova.Js
              </p>
            </div>
          </div>

          {/* Link para versão completa */}
          <div className="text-center">
            <Link 
              to="/termos-de-uso" 
              target="_blank"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              <ExternalLink size={16} />
              Ver versão completa dos termos
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          {!hasScrolledToBottom && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm flex items-center gap-2">
                <AlertTriangle size={16} />
                Por favor, role até o final para ler todos os termos antes de aceitar.
              </p>
            </div>
          )}
          
          <div className="flex flex-col space-y-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasAccepted}
                onChange={(e) => setHasAccepted(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                disabled={!hasScrolledToBottom}
              />
              <span className="text-sm text-gray-700 leading-relaxed">
                Eu li, compreendi e aceito integralmente os Termos de Uso e Política de Privacidade 
                da plataforma FitMeal. Declaro estar ciente de que o conteúdo disponibilizado 
                não substitui orientação médica ou nutricional profissional e assumo total 
                responsabilidade pelo uso das informações.
              </span>
            </label>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleAccept}
                disabled={!hasAccepted || !hasScrolledToBottom}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Aceitar e Continuar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUseModal; 