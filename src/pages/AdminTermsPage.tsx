import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, where, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { FileText, Users, TrendingUp, Calendar, Shield, AlertTriangle } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { TermsAcceptanceRecord, CURRENT_TERMS_VERSION } from '../lib/termsService';

const AdminTermsPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAcceptances: 0,
    currentVersionAcceptances: 0,
    todayAcceptances: 0,
    weekAcceptances: 0,
    signupAcceptances: 0,
    modalAcceptances: 0,
    updateAcceptances: 0
  });
  const [recentAcceptances, setRecentAcceptances] = useState<TermsAcceptanceRecord[]>([]);

  useEffect(() => {
    loadTermsStatistics();
  }, []);

  const loadTermsStatistics = async () => {
    try {
      setLoading(true);
      
      const termsRef = collection(db, 'termsAcceptances');
      
      // Total de aceitações
      const totalSnapshot = await getCountFromServer(termsRef);
      const totalAcceptances = totalSnapshot.data().count;

      // Aceitações da versão atual
      const currentVersionQuery = query(
        termsRef,
        where('termsVersion', '==', CURRENT_TERMS_VERSION)
      );
      const currentVersionSnapshot = await getCountFromServer(currentVersionQuery);
      const currentVersionAcceptances = currentVersionSnapshot.data().count;

      // Aceitações de hoje
      const today = new Date();
      const startOfToday = startOfDay(today);
      const endOfToday = endOfDay(today);
      
      const todayQuery = query(
        termsRef,
        where('acceptedAt', '>=', startOfToday),
        where('acceptedAt', '<=', endOfToday)
      );
      const todaySnapshot = await getCountFromServer(todayQuery);
      const todayAcceptances = todaySnapshot.data().count;

      // Aceitações da semana
      const weekAgo = subDays(today, 7);
      const weekQuery = query(
        termsRef,
        where('acceptedAt', '>=', startOfDay(weekAgo)),
        where('acceptedAt', '<=', endOfToday)
      );
      const weekSnapshot = await getCountFromServer(weekQuery);
      const weekAcceptances = weekSnapshot.data().count;

      // Aceitações por método
      const signupQuery = query(termsRef, where('acceptanceMethod', '==', 'signup'));
      const signupSnapshot = await getCountFromServer(signupQuery);
      const signupAcceptances = signupSnapshot.data().count;

      const modalQuery = query(termsRef, where('acceptanceMethod', '==', 'modal'));
      const modalSnapshot = await getCountFromServer(modalQuery);
      const modalAcceptances = modalSnapshot.data().count;

      const updateQuery = query(termsRef, where('acceptanceMethod', '==', 'required_update'));
      const updateSnapshot = await getCountFromServer(updateQuery);
      const updateAcceptances = updateSnapshot.data().count;

      // Aceitações recentes
      const recentQuery = query(
        termsRef,
        orderBy('acceptedAt', 'desc'),
        limit(10)
      );
      const recentSnapshot = await getDocs(recentQuery);
      const recentAcceptances = recentSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TermsAcceptanceRecord[];

      setStats({
        totalAcceptances,
        currentVersionAcceptances,
        todayAcceptances,
        weekAcceptances,
        signupAcceptances,
        modalAcceptances,
        updateAcceptances
      });
      
      setRecentAcceptances(recentAcceptances);

    } catch (error) {
      console.error('Erro ao carregar estatísticas dos termos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'signup': return 'Cadastro';
      case 'modal': return 'Modal';
      case 'required_update': return 'Atualização Obrigatória';
      default: return method;
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'signup': return 'bg-green-100 text-green-800';
      case 'modal': return 'bg-blue-100 text-blue-800';
      case 'required_update': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 pt-32">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary-100 rounded-lg">
              <Shield className="text-primary-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Gestão de Termos de Uso
              </h1>
              <p className="text-gray-600">
                Estatísticas e auditoria de aceitação dos termos de uso
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <FileText className="text-blue-600" size={20} />
              <div>
                <p className="font-semibold text-blue-900">Versão Atual dos Termos:</p>
                <p className="text-blue-800">{CURRENT_TERMS_VERSION}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Aceitações</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAcceptances}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Versão Atual</p>
                <p className="text-2xl font-bold text-gray-900">{stats.currentVersionAcceptances}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Shield className="text-green-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{stats.todayAcceptances}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Calendar className="text-orange-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                <p className="text-2xl font-bold text-gray-900">{stats.weekAcceptances}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="text-purple-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Estatísticas por Método */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aceitações por Método</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{stats.signupAcceptances}</p>
              <p className="text-sm text-green-800">Durante Cadastro</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{stats.modalAcceptances}</p>
              <p className="text-sm text-blue-800">Via Modal</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-2xl font-bold text-yellow-600">{stats.updateAcceptances}</p>
              <p className="text-sm text-yellow-800">Atualização Obrigatória</p>
            </div>
          </div>
        </div>

        {/* Aceitações Recentes */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Aceitações Recentes</h2>
          
          {recentAcceptances.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 mt-2">Nenhuma aceitação encontrada</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuário
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Método
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Versão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentAcceptances.map((acceptance) => (
                    <tr key={acceptance.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {acceptance.userName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {acceptance.userEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {acceptance.acceptedAt?.toDate ? 
                          format(acceptance.acceptedAt.toDate(), 'dd/MM/yyyy HH:mm', { locale: ptBR }) 
                          : 'Data indisponível'
                        }
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(acceptance.acceptanceMethod)}`}>
                          {getMethodLabel(acceptance.acceptanceMethod)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {acceptance.termsVersion}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {acceptance.ipAddress || 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Aviso de Conformidade */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-600 mt-1" size={20} />
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Conformidade LGPD</h3>
              <p className="text-blue-800 text-sm leading-relaxed">
                Todos os registros de aceitação dos termos são mantidos para fins de auditoria e 
                conformidade com a Lei Geral de Proteção de Dados (LGPD). Os dados incluem 
                informações de identificação do usuário, data/hora da aceitação, método utilizado 
                e informações técnicas do dispositivo para garantir a autenticidade da aceitação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTermsPage; 