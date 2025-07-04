import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Trash2, Copy, Eye, EyeOff, Users, 
  Key, Calendar, CheckCircle, XCircle, Search,
  Download, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { 
  createAccessCode, 
  getAllAccessCodes, 
  deleteAccessCode, 
  AccessCode 
} from '../lib/accessCodes';
import { bulkCreateAccessCodes, exportCodesToCSV } from '../lib/bulkGenerateCodes';
import PageTransition from '../components/PageTransition';
import { utils as XLSXUtils, write as XLSXWrite } from 'xlsx';

const AdminPage: React.FC = () => {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [bulkGenerating, setBulkGenerating] = useState(false);
  const [newCodeDescription, setNewCodeDescription] = useState('');
  const [showUsedCodes, setShowUsedCodes] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkQuantity, setBulkQuantity] = useState(1000);

  useEffect(() => {
    loadCodes();
  }, []);

  const loadCodes = async () => {
    try {
      setLoading(true);
      const allCodes = await getAllAccessCodes();
      setCodes(allCodes.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (error) {
      toast.error('Erro ao carregar códigos');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCode = async () => {
    if (creating) return;

    try {
      setCreating(true);
      const newCode = await createAccessCode(newCodeDescription || undefined);
      toast.success(`Código ${newCode} criado com sucesso!`);
      setNewCodeDescription('');
      await loadCodes();
    } catch (error) {
      toast.error('Erro ao criar código');
    } finally {
      setCreating(false);
    }
  };

  const handleBulkGenerate = async () => {
    if (bulkGenerating) return;

    const confirmMessage = `Tem certeza que deseja gerar ${bulkQuantity} códigos de uma vez? Esta operação pode demorar alguns minutos.`;
    if (!window.confirm(confirmMessage)) return;

    try {
      setBulkGenerating(true);
      toast.loading(`Gerando ${bulkQuantity} códigos...`, { id: 'bulk-generate' });
      
      const result = await bulkCreateAccessCodes(bulkQuantity);
      
      if (result.success) {
        toast.success(result.message, { id: 'bulk-generate' });
        
        // Perguntar se quer exportar os códigos
        if (result.codes && window.confirm('Códigos gerados com sucesso! Deseja baixar a lista em CSV?')) {
          exportCodesToCSV(result.codes);
        }
        
        await loadCodes();
      } else {
        toast.error(result.message, { id: 'bulk-generate' });
      }
    } catch (error) {
      toast.error('Erro ao gerar códigos em lote', { id: 'bulk-generate' });
    } finally {
      setBulkGenerating(false);
    }
  };
  const handleDeleteCode = async (codeId: string, code: string) => {
    if (window.confirm(`Tem certeza que deseja deletar o código ${code}?`)) {
      try {
        await deleteAccessCode(codeId);
        toast.success('Código deletado com sucesso!');
        await loadCodes();
      } catch (error) {
        toast.error('Erro ao deletar código');
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Código copiado!');
  };

  const exportCodes = () => {
    const availableCodes = codes.filter(code => !code.isUsed);
    
    // Formatar a data no estilo brasileiro
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    };

    // Preparar os dados para o Excel
    const excelData = availableCodes.map(code => ({
      'Código': code.code,
      'Descrição': code.description || 'Sem descrição',
      'Data de Criação': formatDate(code.createdAt),
      'Status': code.isUsed ? 'Utilizado' : 'Disponível'
    }));

    // Criar workbook e worksheet
    const ws = XLSXUtils.json_to_sheet(excelData);
    const wb = XLSXUtils.book_new();
    XLSXUtils.book_append_sheet(wb, ws, 'Códigos de Acesso');

    // Definir largura das colunas
    ws['!cols'] = [
      { wch: 10 },  // Código
      { wch: 40 },  // Descrição
      { wch: 20 },  // Data de Criação
      { wch: 12 }   // Status
    ];

    // Gerar arquivo Excel
    const excelBuffer = XLSXWrite(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codigos-acesso-${new Date().toISOString().split('T')[0]}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const filteredCodes = codes.filter(code => {
    const matchesSearch = code.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (code.description && code.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = showUsedCodes ? true : !code.isUsed;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: codes.length,
    available: codes.filter(c => !c.isUsed).length,
    used: codes.filter(c => c.isUsed).length
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
              Gerencie códigos de acesso para novos alunos da academia.
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Total de Códigos</p>
                  <p className="text-2xl font-bold text-neutral-800">{stats.total}</p>
                </div>
                <Key className="text-neutral-400" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Códigos Disponíveis</p>
                  <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                </div>
                <CheckCircle className="text-green-400" size={32} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Códigos Utilizados</p>
                  <p className="text-2xl font-bold text-red-600">{stats.used}</p>
                </div>
                <Users className="text-red-400" size={32} />
              </div>
            </div>
          </div>

          {/* Criar Novo Código */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-6">Gerenciar Códigos de Acesso</h2>
            
            {/* Geração em Lote */}
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-primary-800 mb-3 flex items-center gap-2">
                <Key size={18} />
                Geração em Lote (Recomendado)
              </h3>
              <p className="text-primary-700 text-sm mb-4">
                Gere múltiplos códigos de uma vez para distribuir aos alunos da academia.
              </p>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">
                    Quantidade de códigos
                  </label>
                  <input
                    type="number"
                    value={bulkQuantity}
                    onChange={(e) => setBulkQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    min="1"
                    max="2000"
                    className="w-32 px-3 py-2 border border-primary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleBulkGenerate}
                  disabled={bulkGenerating}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {bulkGenerating ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Gerando {bulkQuantity} códigos...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Gerar {bulkQuantity} Códigos
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {/* Criação Individual */}
            <div className="border-t border-neutral-200 pt-6">
              <h3 className="font-semibold text-neutral-800 mb-3">Criar Código Individual</h3>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    value={newCodeDescription}
                    onChange={(e) => setNewCodeDescription(e.target.value)}
                    placeholder="Descrição (opcional) - Ex: Aluno João Silva"
                    className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleCreateCode}
                  disabled={creating}
                  className="px-6 py-2 bg-neutral-600 text-white rounded-lg hover:bg-neutral-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {creating ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Plus size={18} />
                      Criar 1 Código
                    </>
                  )}
                </button>
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
                    placeholder="Buscar por código ou descrição..."
                    className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={18} />
                </div>
                <button
                  onClick={() => setShowUsedCodes(!showUsedCodes)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    showUsedCodes 
                      ? 'bg-primary-500 text-white' 
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {showUsedCodes ? <EyeOff size={18} /> : <Eye size={18} />}
                  {showUsedCodes ? 'Ocultar Usados' : 'Mostrar Usados'}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={loadCodes}
                  className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors flex items-center gap-2"
                >
                  <RefreshCw size={18} />
                  Atualizar
                </button>
                <button
                  onClick={exportCodes}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                >
                  <Download size={18} />
                  Exportar
                </button>
              </div>
            </div>
          </div>

          {/* Lista de Códigos */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold">
                Códigos de Acesso ({filteredCodes.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-8 text-center">
                <RefreshCw className="animate-spin mx-auto mb-4 text-neutral-400" size={32} />
                <p className="text-neutral-500">Carregando códigos...</p>
              </div>
            ) : filteredCodes.length === 0 ? (
              <div className="p-8 text-center">
                <Key className="mx-auto mb-4 text-neutral-300" size={48} />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">
                  {searchTerm ? 'Nenhum código encontrado' : 'Nenhum código criado ainda'}
                </h3>
                <p className="text-neutral-500">
                  {searchTerm ? 'Tente ajustar sua busca.' : 'Crie o primeiro código de acesso.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredCodes.map((code) => (
                  <motion.div
                    key={code.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`text-xl font-mono font-bold px-3 py-1 rounded-lg ${
                            code.isUsed 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {code.code}
                          </span>
                          {code.isUsed ? (
                            <span className="flex items-center gap-1 text-red-600 text-sm">
                              <XCircle size={16} />
                              Usado
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-green-600 text-sm">
                              <CheckCircle size={16} />
                              Disponível
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-neutral-600 space-y-1">
                          {code.description && (
                            <p><strong>Descrição:</strong> {code.description}</p>
                          )}
                          <p><strong>Criado em:</strong> {new Date(code.createdAt).toLocaleDateString('pt-BR')}</p>
                          {code.isUsed && code.usedAt && (
                            <p><strong>Usado em:</strong> {new Date(code.usedAt).toLocaleDateString('pt-BR')}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyToClipboard(code.code)}
                          className="p-2 text-neutral-500 hover:text-primary-500 transition-colors"
                          title="Copiar código"
                        >
                          <Copy size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCode(code.id, code.code)}
                          className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                          title="Deletar código"
                        >
                          <Trash2 size={18} />
                        </button>
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