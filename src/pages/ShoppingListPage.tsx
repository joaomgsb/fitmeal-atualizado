import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Trash2, Check, Plus, X, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PageTransition from '../components/PageTransition';
import ShoppingListPDF from '../components/shopping/ShoppingListPDF';

interface ShoppingItem {
  id: string;
  name: string;
  amount: string;
  checked: boolean;
  recipe?: string;
}

const ShoppingListPage: React.FC = () => {
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('shopping-list');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newItem, setNewItem] = useState({ name: '', amount: '' });
  
  useEffect(() => {
    localStorage.setItem('shopping-list', JSON.stringify(items));
  }, [items]);

  const addItem = (item: Omit<ShoppingItem, 'id' | 'checked'>) => {
    const newId = Math.random().toString(36).substr(2, 9);
    setItems(prev => [...prev, { ...item, id: newId, checked: false }]);
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleItem = (id: string) => {
    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const clearChecked = () => {
    setItems(prev => prev.filter(item => !item.checked));
  };

  const clearAll = () => {
    setItems([]);
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display mb-2">
              Lista de <span className="text-primary-500">Compras</span>
            </h1>
            <p className="text-neutral-600">
              Organize seus ingredientes e mantenha suas compras em dia.
            </p>
          </div>

          {/* Add New Item Form */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Adicionar Item</h2>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (newItem.name && newItem.amount) {
                  addItem(newItem);
                  setNewItem({ name: '', amount: '' });
                }
              }}
              className="flex flex-wrap gap-4"
            >
              <div className="flex-grow min-w-[200px]">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Item
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nome do item"
                />
              </div>
              <div className="w-32">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Quantidade
                </label>
                <input
                  type="text"
                  value={newItem.amount}
                  onChange={(e) => setNewItem(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="2 kg"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Shopping List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Sua Lista</h2>
              <div className="flex flex-wrap gap-2">
                {items.length > 0 && (
                  <PDFDownloadLink
                    document={<ShoppingListPDF items={items} />}
                    fileName={`lista-compras-${new Date().toISOString().split('T')[0]}.pdf`}
                  >
                    {({ loading }) => (
                      <button
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          loading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-red-500 text-white hover:bg-red-600'
                        }`}
                        disabled={loading}
                      >
                        <Download size={16} />
                        <span className="hidden sm:inline">
                          {loading ? 'Gerando PDF...' : 'Exportar PDF'}
                        </span>
                        <span className="sm:hidden">PDF</span>
                      </button>
                    )}
                  </PDFDownloadLink>
                )}
                <button
                  onClick={clearChecked}
                  className="px-3 py-2 text-sm border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <span className="hidden sm:inline">Limpar Marcados</span>
                  <span className="sm:hidden">Marcados</span>
                </button>
                <button
                  onClick={clearAll}
                  className="px-3 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <span className="hidden sm:inline">Limpar Tudo</span>
                  <span className="sm:hidden">Tudo</span>
                </button>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag size={48} className="mx-auto text-neutral-300 mb-4" />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">
                  Sua lista está vazia
                </h3>
                <p className="text-neutral-500">
                  Adicione itens usando o formulário acima ou a partir das receitas.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-3 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3 flex-grow">
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${
                          item.checked
                            ? 'bg-primary-500 border-primary-500 text-white'
                            : 'border-neutral-300 hover:border-primary-500'
                        }`}
                      >
                        {item.checked && <Check size={14} />}
                      </button>
                      <div className={item.checked ? 'line-through text-neutral-400' : ''}>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-neutral-500">{item.amount}</div>
                      </div>
                    </div>
                    {item.recipe && (
                      <span className="text-sm text-neutral-500">
                        De: {item.recipe}
                      </span>
                    )}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
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

export default ShoppingListPage;