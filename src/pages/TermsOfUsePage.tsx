import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

const TermsOfUsePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-50 pt-20">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Voltar
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary-100 rounded-lg">
              <FileText className="text-primary-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Termos de Uso e Política de Privacidade
              </h1>
              <p className="text-neutral-600 mt-1">
                Plataforma FitMeal - Última atualização: 15 de junho de 2025 - Versão: 2.0
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          
          {/* Seção 1 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              IDENTIFICAÇÃO E ACEITAÇÃO DOS TERMOS
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.1 Identificação da Plataforma</h3>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• <strong>Nome:</strong> FitMeal</li>
                <li>• <strong>URL:</strong> https://fitmeal.netlify.app</li>
                <li>• <strong>Aplicativo móvel:</strong> Disponível para iOS e Android</li>
                <li>• <strong>Finalidade:</strong> Plataforma digital dedicada ao fornecimento de receitas fitness, orientações nutricionais, informações sobre alimentação saudável e comunidade interativa</li>
                <li>• <strong>Desenvolvedor:</strong> Inova.Js</li>
                <li>• <strong>Sede:</strong> Betim, Minas Gerais, Brasil</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.2 Aceitação dos Termos</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                O acesso, cadastro e utilização da plataforma FitMeal, seja através do website ou aplicativo móvel, implica na aceitação integral, expressa e irrevogável destes Termos de Uso e Política de Privacidade.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-semibold text-yellow-800 mb-2">IMPORTANTE:</p>
                <p className="text-yellow-700">
                  Caso não concorde com qualquer disposição estabelecida neste documento, o usuário deverá abster-se imediatamente de utilizar a plataforma e, se já possuir conta, solicitar o cancelamento de seu cadastro.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">1.3 Capacidade para Aceitar os Termos</h3>
              <p className="text-gray-700 leading-relaxed mb-3">Para utilizar a plataforma, o usuário deve:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Ter pelo menos 18 anos de idade completos; OU</li>
                <li>• Ter entre 14 e 17 anos com autorização expressa dos responsáveis legais; OU</li>
                <li>• Ser pessoa jurídica com representação legal adequada</li>
              </ul>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-red-700 font-semibold">
                  Menores de 14 anos não podem utilizar a plataforma sob nenhuma circunstância.
                </p>
              </div>
            </div>
          </section>

          {/* Seção 2 - Nova seção de Definições */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              DEFINIÇÕES IMPORTANTES
            </h2>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              Para melhor compreensão deste documento, estabelecemos as seguintes definições:
            </p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p><strong className="text-blue-800">Plataforma:</strong> <span className="text-blue-700">Conjunto de serviços digitais oferecidos através do website e aplicativo FitMeal</span></p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p><strong className="text-green-800">Usuário/Titular:</strong> <span className="text-green-700">Pessoa física ou jurídica que utiliza a plataforma</span></p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p><strong className="text-purple-800">Conta:</strong> <span className="text-purple-700">Perfil individual criado pelo usuário mediante cadastro</span></p>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                  <p><strong className="text-orange-800">Conteúdo Certificado:</strong> <span className="text-orange-700">Receitas e orientações validadas pela nutricionista responsável técnica</span></p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p><strong className="text-yellow-800">Conteúdo IA:</strong> <span className="text-yellow-700">Informações geradas por inteligência artificial sem supervisão profissional</span></p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                  <p><strong className="text-indigo-800">Dados Pessoais:</strong> <span className="text-indigo-700">Informações que identificam ou tornam identificável uma pessoa natural</span></p>
                </div>
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
                  <p><strong className="text-teal-800">Controlador:</strong> <span className="text-teal-700">Inova.Js, responsável pelas decisões sobre tratamento de dados pessoais</span></p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p><strong className="text-red-800">LGPD:</strong> <span className="text-red-700">Lei Geral de Proteção de Dados (Lei nº 13.709/2018)</span></p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 3 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              DESCRIÇÃO DOS SERVIÇOS
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.1 Funcionalidades Principais</h3>
              <p className="text-gray-700 leading-relaxed mb-4">A plataforma FitMeal oferece:</p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-3">Conteúdo Nutricional:</h4>
                  <ul className="space-y-2 text-green-700 text-sm">
                    <li>• Receitas fitness certificadas por nutricionista</li>
                    <li>• Informações nutricionais educativas</li>
                    <li>• Orientações sobre alimentação saudável</li>
                    <li>• Conteúdo gerado por inteligência artificial (devidamente identificado)</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-3">Funcionalidades Interativas:</h4>
                  <ul className="space-y-2 text-blue-700 text-sm">
                    <li>• Sistema de cadastro e perfil personalizado</li>
                    <li>• Favoritar receitas e criar listas personalizadas</li>
                    <li>• Comunidade com sistema de postagens</li>
                    <li>• Área de notícias com comentários e curtidas</li>
                    <li>• Newsletter automática com conteúdo selecionado</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-purple-800 mb-3">Responsabilidade Técnica:</h4>
                <ul className="space-y-2 text-purple-700 text-sm">
                  <li>• <strong>Nutricionista Responsável:</strong> Viviane Ferreira</li>
                  <li>• <strong>Registro CRN:</strong> 24028</li>
                  <li>• <strong>Escopo:</strong> Certificação e validação do conteúdo nutricional profissional</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">3.2 Requisitos Técnicos</h3>
              <p className="text-gray-700 leading-relaxed mb-3">Para utilização adequada da plataforma:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Conexão estável com a internet</li>
                <li>• Navegador atualizado ou aplicativo móvel oficial</li>
                <li>• Aceite de cookies essenciais para funcionamento</li>
                <li>• Cadastro obrigatório para acesso completo às funcionalidades</li>
              </ul>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              NATUREZA DO CONTEÚDO E LIMITAÇÕES
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Propósito Educativo e Informativo</h3>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <p className="font-semibold text-yellow-800 mb-2">ATENÇÃO FUNDAMENTAL:</p>
                <p className="text-yellow-700 leading-relaxed mb-3">
                  Todo conteúdo disponibilizado possui caráter exclusivamente educativo e informativo, não constituindo:
                </p>
                <ul className="space-y-1 text-yellow-700 text-sm ml-4">
                  <li>• Orientação médica individualizada</li>
                  <li>• Prescrição nutricional personalizada</li>
                  <li>• Diagnóstico de condições de saúde</li>
                  <li>• Tratamento para patologias específicas</li>
                  <li>• Substituição de consulta profissional</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Classificação de Conteúdos</h3>
              
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  4.2.1 Conteúdo Certificado Profissionalmente ✅
                </h4>
                <ul className="space-y-1 text-green-700 text-sm">
                  <li>• Elaborado e validado pela nutricionista Viviane Ferreira (CRN 24028)</li>
                  <li>• Fundamentado em diretrizes científicas atualizadas</li>
                  <li>• Sob responsabilidade técnica da profissional habilitada</li>
                  <li>• Identificado claramente na plataforma</li>
                </ul>
              </div>

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  4.2.2 Conteúdo Gerado por Inteligência Artificial ⚠️
                </h4>
                <ul className="space-y-1 text-yellow-700 text-sm">
                  <li>• Produzido através de algoritmos de IA</li>
                  <li>• Ausência de certificação profissional</li>
                  <li>• Baseado em recomendações algorítmicas gerais</li>
                  <li>• Não substitui orientação nutricional individualizada</li>
                  <li>• Claramente identificado como "Conteúdo IA"</li>
                </ul>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.3 Obrigatoriedade de Consulta Profissional</h3>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <Shield className="text-red-500 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-red-800 mb-2">É IMPRESCINDÍVEL consultar profissionais habilitados antes de adotar qualquer orientação da plataforma, especialmente nas seguintes situações:</p>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-800 mb-2">Condições de Saúde:</h4>
                  <ul className="space-y-1 text-orange-700 text-sm">
                    <li>• Presença de patologias (diabetes, hipertensão, doenças cardiovasculares, etc.)</li>
                    <li>• Histórico de alergias ou intolerâncias alimentares</li>
                    <li>• Transtornos alimentares ou histórico familiar</li>
                    <li>• Uso regular de medicamentos</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Situações Especiais:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Período gestacional, lactação ou planejamento familiar</li>
                    <li>• Objetivos específicos de alteração ponderal</li>
                    <li>• Atividade física intensa ou competitiva</li>
                    <li>• Idade inferior a 18 anos ou superior a 65 anos</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 5 - Nova seção Direitos do Usuário */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              DIREITOS DO USUÁRIO
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.1 Direitos Fundamentais</h3>
              <p className="text-gray-700 leading-relaxed mb-4">O usuário possui os seguintes direitos garantidos:</p>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Acesso ao Serviço:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Utilização gratuita das funcionalidades básicas</li>
                    <li>• Acesso igualitário e não discriminatório</li>
                    <li>• Informações claras sobre funcionamento da plataforma</li>
                  </ul>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Proteção de Dados:</h4>
                  <ul className="space-y-1 text-blue-700 text-sm">
                    <li>• Transparência total sobre coleta e uso de dados</li>
                    <li>• Controle sobre informações pessoais</li>
                    <li>• Segurança no tratamento de dados pessoais</li>
                  </ul>
                </div>
                
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-800 mb-2">Atendimento e Suporte:</h4>
                  <ul className="space-y-1 text-purple-700 text-sm">
                    <li>• Canal de comunicação direto e eficiente</li>
                    <li>• Resposta às solicitações em prazo adequado</li>
                    <li>• Esclarecimentos sobre termos e políticas</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">5.2 Direitos Específicos da LGPD</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Conforme Lei Geral de Proteção de Dados, o usuário tem direito a:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">📋</div>
                    <p className="text-gray-700 text-sm">Confirmação da existência de tratamento de dados</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">👁️</div>
                    <p className="text-gray-700 text-sm">Acesso aos dados pessoais tratados</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">✏️</div>
                    <p className="text-gray-700 text-sm">Correção de dados incompletos, inexatos ou desatualizados</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">🗑️</div>
                    <p className="text-gray-700 text-sm">Anonimização, bloqueio ou eliminação de dados desnecessários</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">📦</div>
                    <p className="text-gray-700 text-sm">Portabilidade dos dados para outro fornecedor</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">🔒</div>
                    <p className="text-gray-700 text-sm">Eliminação dos dados tratados com consentimento</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">🔄</div>
                    <p className="text-gray-700 text-sm">Informação sobre compartilhamento de dados</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">❌</div>
                    <p className="text-gray-700 text-sm">Informação sobre possibilidade de não fornecer consentimento</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 mt-1">🚫</div>
                    <p className="text-gray-700 text-sm">Revogação do consentimento a qualquer momento</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 6 - Responsabilidades do Usuário */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
              RESPONSABILIDADES DO USUÁRIO
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Obrigações Gerais</h3>
              <p className="text-gray-700 leading-relaxed mb-4">O usuário compromete-se a:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Uso Adequado:</h4>
                  <ul className="space-y-1 text-green-700 text-sm">
                    <li>• Utilizar a plataforma apenas para fins lícitos e pessoais</li>
                    <li>• Manter sigilo de dados de acesso à conta</li>
                    <li>• Fornecer informações verdadeiras no cadastro</li>
                    <li>• Respeitar direitos autorais e propriedade intelectual</li>
                  </ul>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Condutas Proibidas:</h4>
                  <ul className="space-y-1 text-red-700 text-sm">
                    <li>• Reproduzir, distribuir ou explorar comercialmente o conteúdo sem autorização</li>
                    <li>• Compartilhar dados de acesso com terceiros</li>
                    <li>• Interferir no funcionamento técnico da plataforma</li>
                    <li>• Publicar conteúdo ofensivo, discriminatório ou inadequado</li>
                    <li>• Solicitar diagnósticos ou prescrições médicas</li>
                    <li>• Divulgar informações médicas pessoais em comentários públicos</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Responsabilidade pelo Uso das Informações</h3>
              <p className="text-gray-700 leading-relaxed mb-3">O usuário assume integralmente a responsabilidade por:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Decisões baseadas no conteúdo da plataforma</li>
                <li>• Consequências da aplicação de orientações sem supervisão profissional</li>
                <li>• Reações adversas, processos alérgicos ou complicações de saúde</li>
                <li>• Resultados obtidos ou não obtidos através do uso da plataforma</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Consentimento Informado e Declarações</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ao utilizar a plataforma, o usuário declara expressamente que:
              </p>
              
                             <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✅</div>
                  <p className="text-gray-700">Compreende que alterações alimentares podem impactar significativamente a saúde</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✅</div>
                  <p className="text-gray-700">Reconhece a diferença entre conteúdo certificado profissionalmente e gerado por IA</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✅</div>
                  <p className="text-gray-700">Está ciente da necessidade de orientação profissional especializada</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✅</div>
                  <p className="text-gray-700">Compromete-se a buscar orientação médica/nutricional quando necessário</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✅</div>
                  <p className="text-gray-700">Assume responsabilidade integral pelo uso adequado das informações</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="text-green-600 mt-1">✅</div>
                  <p className="text-gray-700">Exime a plataforma de responsabilidade por uso inadequado ou consequências não previstas</p>
                </div>
              </div>
            </div>
          </section>

          {/* Seção 4 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              CONSENTIMENTO INFORMADO
            </h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.1 Declaração de Conhecimento</h3>
              <p className="text-gray-700 leading-relaxed mb-3">
                Ao utilizar a plataforma, o usuário declara:
              </p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Compreender que alterações alimentares podem impactar significativamente a saúde</li>
                <li>• Reconhecer a distinção entre conteúdo certificado profissionalmente e gerado por IA</li>
                <li>• Estar ciente da necessidade de orientação profissional especializada</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">4.2 Responsabilidade do Usuário</h3>
              <p className="text-gray-700 leading-relaxed mb-3">O usuário:</p>
              <ul className="space-y-2 text-gray-700 ml-4">
                <li>• Assume integralmente a responsabilidade pelo uso das informações</li>
                <li>• Compromete-se a buscar orientação profissional quando necessário</li>
                <li>• Exime a plataforma de responsabilidade por consequências do uso inadequado</li>
              </ul>
            </div>
          </section>

          {/* Seção 5 */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">5</span>
              POLÍTICA DE USO DA PLATAFORMA
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-800 mb-3">5.1 Usos Permitidos</h3>
                <ul className="space-y-2 text-green-700 text-sm">
                  <li>• Consulta de receitas e informações nutricionais para uso pessoal</li>
                  <li>• Compartilhamento de conteúdo com devidos créditos à fonte</li>
                  <li>• Utilização não comercial das informações</li>
                </ul>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-red-800 mb-3">5.2 Usos Proibidos</h3>
                <ul className="space-y-2 text-red-700 text-sm">
                  <li>• Reprodução integral de conteúdo sem autorização expressa</li>
                  <li>• Exploração comercial não autorizada</li>
                  <li>• Compartilhamento de informações médicas pessoais em comentários</li>
                  <li>• Solicitação de diagnósticos ou prescrições médicas</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seção 6 - LGPD */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">6</span>
              PROTEÇÃO DE DADOS PESSOAIS (LGPD)
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.1 Base Legal</h3>
                <p className="text-gray-700 leading-relaxed">
                  O tratamento de dados pessoais fundamenta-se no artigo 7º da Lei Geral de Proteção de Dados (LGPD), baseado em interesse legítimo e consentimento do titular.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.2 Dados Coletados</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Dados Fornecidos Voluntariamente:</h4>
                    <ul className="space-y-1 text-blue-700 text-sm">
                      <li>• Nome, e-mail e mensagem através de formulário de contato</li>
                      <li>• Nome e e-mail para assinatura de newsletter</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-800 mb-2">Dados Coletados Automaticamente:</h4>
                    <ul className="space-y-1 text-orange-700 text-sm">
                      <li>• Cookies técnicos para funcionalidade da plataforma</li>
                      <li>• Informações de navegação e localização (endereço IP)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.3 Finalidades do Tratamento</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Resposta a mensagens e solicitações</li>
                  <li>• Aprimoramento da experiência do usuário</li>
                  <li>• Análises estatísticas de uso da plataforma</li>
                  <li>• Comunicações solicitadas pelo usuário</li>
                  <li>• Cumprimento de obrigações legais</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.4 Compartilhamento de Dados</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Os dados pessoais são compartilhados exclusivamente:
                </p>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Por determinação legal ou judicial</li>
                  <li>• Com prestadores de serviços essenciais ao funcionamento da plataforma</li>
                  <li>• Mediante consentimento expresso do titular</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.5 Período de Retenção</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Dados de contato: até 5 anos</li>
                  <li>• Dados de navegação: até 12 meses</li>
                  <li>• Cookies: removidos automaticamente ao encerrar o navegador</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.6 Direitos do Titular</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  O usuário possui os seguintes direitos garantidos pela LGPD:
                </p>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Acesso, correção, exclusão e portabilidade dos dados</li>
                  <li>• Informação sobre tratamento, revogação de consentimento</li>
                  <li>• Oposição ao tratamento e revisão de decisões automatizadas</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.7 Segurança dos Dados</h3>
                <p className="text-gray-700 leading-relaxed mb-3">
                  A plataforma adota as seguintes medidas de segurança:
                </p>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Criptografia SSL/TLS para transmissão de dados</li>
                  <li>• Controle de acesso restrito às informações</li>
                  <li>• Realização de backups regulares e monitoramento contínuo</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.8 Transferência Internacional</h3>
                <p className="text-gray-700 leading-relaxed">
                  Para serviços externos utilizados, são adotadas garantias adequadas de proteção conforme a LGPD.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">6.9 Proteção de Menores</h3>
                <ul className="space-y-2 text-gray-700 ml-4">
                  <li>• Proibida a coleta de dados de menores de 14 anos</li>
                  <li>• Usuários entre 14 e 17 anos necessitam consentimento dos responsáveis legais</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Seções restantes em formato mais compacto */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">7</span>
              PROPRIEDADE INTELECTUAL
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>7.1 Direitos Autorais:</strong> Todo conteúdo original é protegido por direitos autorais. Receitas certificadas são propriedade intelectual da nutricionista responsável. Design e desenvolvimento pertencem à plataforma FitMeal.</p>
              <p><strong>7.2 Uso Autorizado:</strong> Consulta e utilização doméstica do conteúdo, compartilhamento com devidos créditos à fonte, impressão para uso pessoal e não comercial.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">8</span>
              MODIFICAÇÕES E ATUALIZAÇÕES
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>8.1 Alterações nos Termos:</strong> A plataforma reserva-se o direito de alterar estes termos a qualquer momento. Mudanças relevantes serão notificadas aos usuários. O uso continuado da plataforma implica aceitação das alterações.</p>
              <p><strong>8.2 Atualizações de Conteúdo:</strong> O conteúdo da plataforma está sujeito a alterações ou remoção sem aviso prévio, podendo ser atualizado conforme novas diretrizes científicas ou regulamentares.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">9</span>
              SUPORTE E CONTATO
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>9.1 Canais de Comunicação:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• E-mail: inova.js001@gmail.com</li>
                <li>• Formulário: Disponível na seção "Contato" da plataforma</li>
              </ul>
              <p><strong>9.2 Prazos de Resposta:</strong></p>
              <ul className="ml-4 space-y-1">
                <li>• Questões gerais: até 72 horas úteis</li>
                <li>• Questões relacionadas à LGPD: até 15 dias úteis</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">10</span>
              DISPOSIÇÕES LEGAIS
            </h2>
            <div className="space-y-4 text-gray-700">
              <p><strong>10.1 Legislação Aplicável:</strong> Lei Geral de Proteção de Dados (Lei nº 13.709/2018), Código de Defesa do Consumidor (Lei nº 8.078/1990), Marco Civil da Internet (Lei nº 12.965/2014).</p>
              <p><strong>10.2 Foro Competente:</strong> Para questões de consumo, será competente o foro da comarca do usuário. Para questões empresariais, o foro da sede da empresa.</p>
              <p><strong>10.3 Integralidade:</strong> Este documento constitui o acordo integral entre usuário e plataforma, prevalecendo sobre quaisquer acordos anteriores.</p>
            </div>
          </section>

          {/* Declaração de Consentimento */}
          <section className="mb-8">
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-primary-200 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="bg-primary-100 text-primary-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">14</span>
                DECLARAÇÃO FINAL DE CONSENTIMENTO
              </h2>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-lg font-semibold text-yellow-800 mb-2">⚠️ ATENÇÃO ESPECIAL ⚠️</p>
                  <p className="text-yellow-700">
                    Ao criar conta, acessar ou utilizar a plataforma FitMeal, o usuário declara expressamente que:
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Leu integralmente e compreendeu todos os termos deste documento</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Concorda plenamente com todas as disposições estabelecidas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Reconhece a diferença entre conteúdo certificado pela nutricionista Viviane Ferreira (CRN 24028) e conteúdo gerado por IA</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Compreende que nenhum conteúdo substitui orientação médica ou nutricional individualizada</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Compromete-se a buscar orientação profissional qualificada quando necessário</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Assume integralmente a responsabilidade pelo uso adequado das informações disponibilizadas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Consente com o tratamento de dados pessoais conforme política de privacidade</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-green-600 mt-1">✅</div>
                    <p className="text-gray-700">Exime a plataforma, desenvolvedores e profissionais envolvidos de responsabilidade por consequências do uso inadequado</p>
                  </div>
                </div>
              </div>
              
              <div className="text-center text-gray-600 space-y-2">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="font-semibold text-gray-800 mb-2">📋 REGISTRO DE ACEITE</p>
                  <p className="font-semibold">Data de vigência: 15 de junho de 2025</p>
                  <p className="font-semibold">Versão: 2.0</p>
                  <p>Desenvolvido por: Inova.Js</p>
                  <p>Responsabilidade técnica nutricional: Viviane Ferreira (CRN 24028)</p>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <p className="font-semibold text-blue-800 mb-2">📞 CONTATO PARA DÚVIDAS</p>
                  <p className="text-blue-700">E-mail: inova.js001@gmail.com</p>
                  <p className="text-blue-700">Assunto sugerido: "Dúvidas sobre Termos de Uso"</p>
                </div>
                
                <div className="text-center text-gray-500 text-sm mt-4">
                  <p>© 2025 FitMeal - Todos os direitos reservados</p>
                  <p>Desenvolvido por Inova.Js - Betim/MG</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;