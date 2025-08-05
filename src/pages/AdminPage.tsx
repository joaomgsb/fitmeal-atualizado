import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, CheckCircle, XCircle, Search,
  RefreshCw, User, Mail, Settings, BarChart3
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import PageTransition from '../components/PageTransition';

interface UserData {
  id: string;
  name: string;
  email: string;
  startDate: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const usersData: UserData[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        usersData.push({
          id: doc.id,
          name: data.name || 'Nome não informado',
          email: data.email || 'Email não informado',
          startDate: data.startDate || new Date().toISOString(),
          isDeleted: data.isDeleted || false,
          deletedAt: data.deletedAt
        });
      });
      
      setUsers(usersData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()));
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    const confirmMessage = `Tem certeza que deseja excluir o usuário "${userName}" do sistema?\n\nEsta ação irá:\n- Bloquear o acesso do usuário à plataforma\n- Impedir que ele faça login novamente\n\nEsta ação não pode ser desfeita.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await updateDoc(doc(db, 'users', userId), {
          isDeleted: true,
          deletedAt: new Date().toISOString(),
          deletedBy: 'admin'
        });
        
        toast.success(`Usuário "${userName}" excluído com sucesso!`);
        await loadUsers();
      } catch (error) {
        toast.error('Erro ao excluir usuário');
      }
    }
  };

  // Função para destacar termos de busca
  const highlightSearchTerm = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => !u.isDeleted).length,
    deleted: users.filter(u => u.isDeleted).length
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">
              Painel <span className="text-primary-500">Administrativo</span>
            </h1>
            <p className="text-neutral-600">
              Gerencie usuários da plataforma FitMeal.
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Total de Usuários</p>
                  <p className="text-2xl font-bold text-neutral-800">{stats.total}</p>
                </div>
                <Users className="text-neutral-400" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                <CheckCircle className="text-green-400" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Usuários Excluídos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.deleted}</p>
                </div>
                <XCircle className="text-red-400" size={32} />
              </div>
            </div>
          </div>

          {/* Filtros e Ações */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex flex-col md:flex-row gap-4 flex-grow">
                <div className="relative flex-grow max-w-md">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Buscar por nome ou email do usuário..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                      title="Limpar busca"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadUsers}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Atualizar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Usuários */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold">
                Usuários ({filteredUsers.length})
                {searchTerm && (
                  <span className="ml-2 text-sm font-normal text-blue-600">
                    • {filteredUsers.length} resultado{filteredUsers.length !== 1 ? 's' : ''} para "{searchTerm}"
                  </span>
                )}
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="animate-spin mx-auto mb-4 text-neutral-400" size={32} />
                <p className="text-neutral-500">Carregando usuários...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="mx-auto mb-4 text-neutral-300" size={48} />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado ainda'}
                </h3>
                <p className="text-neutral-500">
                  {searchTerm ? 'Tente ajustar sua busca.' : 'Os usuários aparecerão aqui quando se cadastrarem.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredUsers.map((user) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 hover:bg-neutral-50 transition-colors ${
                      user.isDeleted ? 'bg-red-50' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-lg font-medium ${
                            user.isDeleted 
                              ? 'text-red-600' 
                              : 'text-neutral-800'
                          }`}>
                            <span 
                              dangerouslySetInnerHTML={{ 
                                __html: highlightSearchTerm(user.name, searchTerm) 
                              }}
                            />
                          </span>
                          {user.isDeleted ? (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <XCircle size={16} />
                              Excluído
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle size={16} />
                              Ativo
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600 space-y-1">
                          <p className="flex items-center gap-2">
                            <Mail size={14} />
                            <span 
                              dangerouslySetInnerHTML={{ 
                                __html: highlightSearchTerm(user.email, searchTerm) 
                              }}
                            />
                          </p>
                          <p><strong>Cadastrado em:</strong> {new Date(user.startDate).toLocaleDateString('pt-BR')}</p>
                          {user.isDeleted && user.deletedAt && (
                            <p><strong>Excluído em:</strong> {new Date(user.deletedAt).toLocaleDateString('pt-BR')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!user.isDeleted && (
                          <button
                            onClick={() => handleDeleteUser(user.id, user.name)}
                            className="p-2 text-neutral-500 hover:text-red-600 transition-colors"
                            title="Excluir usuário"
                          >
                            <User size={18} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminPage;