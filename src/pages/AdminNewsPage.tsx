import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, EyeOff, Search, Filter,
  Calendar, User, Heart, MessageCircle, TrendingUp,
  Save, X, Upload, Image as ImageIcon, Loader2
} from 'lucide-react';
import RichContentEditor from '../components/news/RichContentEditor';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { toast } from 'react-hot-toast';
import { uploadImage } from '../lib/imageUpload';
import PageTransition from '../components/PageTransition';

interface NewsPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  category: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: any;
  updatedAt: any;
  likes: string[];
  bookmarks: string[];
  views: number;
  commentsCount: number;
  featured: boolean;
  published: boolean;
}

const AdminNewsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile } = useProfile();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    imageUrl: '',
    category: '',
    tags: '',
    featured: false,
    published: true
  });

  const categories = [
    { id: 'nutricao', name: 'Nutrição', color: 'bg-green-500' },
    { id: 'treino', name: 'Treino', color: 'bg-blue-500' },
    { id: 'suplementacao', name: 'Suplementação', color: 'bg-purple-500' },
    { id: 'receitas', name: 'Receitas', color: 'bg-orange-500' },
    { id: 'lifestyle', name: 'Lifestyle', color: 'bg-pink-500' },
    { id: 'ciencia', name: 'Ciência', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    const postsQuery = query(
      collection(db, 'news_posts'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsPost[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !profile?.name) {
      toast.error('Erro de autenticação');
      return;
    }

    if (!formData.title || !formData.content || !formData.excerpt || !formData.category) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      const postData = {
        title: formData.title,
        content: formData.content,
        excerpt: formData.excerpt,
        imageUrl: formData.imageUrl || 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        authorId: currentUser.uid,
        authorName: profile.name,
        authorAvatar: profile.avatar || '',
        featured: formData.featured,
        published: formData.published,
        likes: [],
        bookmarks: [],
        views: 0,
        commentsCount: 0,
        updatedAt: serverTimestamp()
      };

      if (editingPost) {
        await updateDoc(doc(db, 'news_posts', editingPost.id), postData);
        toast.success('Post atualizado com sucesso!');
      } else {
        await addDoc(collection(db, 'news_posts'), {
          ...postData,
          createdAt: serverTimestamp()
        });
        toast.success('Post criado com sucesso!');
      }

      resetForm();
      setShowCreateModal(false);
      setEditingPost(null);
    } catch (error) {
      toast.error('Erro ao salvar post');
    }
  };

  const handleEdit = (post: NewsPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      imageUrl: post.imageUrl,
      category: post.category,
      tags: post.tags.join(', '),
      featured: post.featured,
      published: post.published
    });
    setShowCreateModal(true);
  };

  const handleDelete = async (postId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deleteDoc(doc(db, 'news_posts', postId));
        toast.success('Post excluído com sucesso!');
      } catch (error) {
        toast.error('Erro ao excluir post');
      }
    }
  };

  const togglePublished = async (post: NewsPost) => {
    try {
      await updateDoc(doc(db, 'news_posts', post.id), {
        published: !post.published,
        updatedAt: serverTimestamp()
      });
      toast.success(`Post ${!post.published ? 'publicado' : 'despublicado'} com sucesso!`);
    } catch (error) {
      toast.error('Erro ao alterar status do post');
    }
  };

  const toggleFeatured = async (post: NewsPost) => {
    try {
      await updateDoc(doc(db, 'news_posts', post.id), {
        featured: !post.featured,
        updatedAt: serverTimestamp()
      });
      toast.success(`Post ${!post.featured ? 'destacado' : 'removido dos destaques'}!`);
    } catch (error) {
      toast.error('Erro ao alterar destaque do post');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('Arquivo selecionado:', file);
    setUploadingImage(true);
    
    try {
      const imageUrl = await uploadImage(file);
      console.log('Upload bem-sucedido, URL:', imageUrl);
      setFormData(prev => ({ ...prev, imageUrl }));
      toast.success('Imagem enviada com sucesso!');
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(error.message || 'Erro ao enviar imagem');
    } finally {
      setUploadingImage(false);
      // Limpar o input para permitir upload do mesmo arquivo novamente
      event.target.value = '';
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      imageUrl: '',
      category: '',
      tags: '',
      featured: false,
      published: true
    });
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    const matchesPublished = showUnpublished ? true : post.published;
    
    return matchesSearch && matchesCategory && matchesPublished;
  });

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-neutral-500';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="pt-24 pb-16 bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold font-display mb-2">
                Gerenciar <span className="text-primary-500">News</span>
              </h1>
              <p className="text-neutral-600">
                Crie e gerencie artigos para a plataforma
              </p>
            </div>
            
            <button
              onClick={() => {
                resetForm();
                setEditingPost(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-md"
            >
              <Plus size={20} />
              Novo Post
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Total de Posts</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Edit size={24} className="text-primary-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Publicados</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.published).length}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye size={24} className="text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Em Destaque</p>
                  <p className="text-2xl font-bold">{posts.filter(p => p.featured).length}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp size={24} className="text-orange-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-neutral-500 text-sm">Total de Curtidas</p>
                  <p className="text-2xl font-bold">{posts.reduce((acc, p) => acc + (p.likes?.length || 0), 0)}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart size={24} className="text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Buscar posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
              </div>
              
              <select
                value={selectedCategory || ''}
                onChange={(e) => setSelectedCategory(e.target.value || null)}
                className="px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
              
              <button
                onClick={() => setShowUnpublished(!showUnpublished)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  showUnpublished 
                    ? 'bg-primary-500 text-white' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {showUnpublished ? <Eye size={20} /> : <EyeOff size={20} />}
                {showUnpublished ? 'Mostrar Todos' : 'Mostrar Rascunhos'}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-neutral-200">
              <h2 className="text-xl font-bold">
                Posts ({filteredPosts.length})
              </h2>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="p-8 text-center">
                <Edit className="mx-auto mb-4 text-neutral-300" size={48} />
                <h3 className="text-lg font-medium text-neutral-600 mb-2">
                  Nenhum post encontrado
                </h3>
                <p className="text-neutral-500">
                  Crie seu primeiro post ou ajuste os filtros.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredPosts.map((post) => (
                  <div key={post.id} className="p-6 hover:bg-neutral-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <img 
                        src={post.imageUrl} 
                        alt={post.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      
                      <div className="flex-grow">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(post.category)}`}>
                                {getCategoryName(post.category)}
                              </span>
                              {post.featured && (
                                <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-medium">
                                  Destaque
                                </span>
                              )}
                              {!post.published && (
                                <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium">
                                  Rascunho
                                </span>
                              )}
                            </div>
                            <h3 className="font-bold text-lg mb-1">{post.title}</h3>
                            <p className="text-neutral-600 text-sm line-clamp-2">{post.excerpt}</p>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleFeatured(post)}
                              className={`p-2 rounded-lg transition-colors ${
                                post.featured 
                                  ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' 
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-orange-100 hover:text-orange-600'
                              }`}
                              title={post.featured ? 'Remover destaque' : 'Destacar post'}
                            >
                              <TrendingUp size={16} />
                            </button>
                            
                            <button
                              onClick={() => togglePublished(post)}
                              className={`p-2 rounded-lg transition-colors ${
                                post.published 
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200' 
                                  : 'bg-neutral-100 text-neutral-600 hover:bg-green-100 hover:text-green-600'
                              }`}
                              title={post.published ? 'Despublicar' : 'Publicar'}
                            >
                              {post.published ? <Eye size={16} /> : <EyeOff size={16} />}
                            </button>
                            
                            <button
                              onClick={() => handleEdit(post)}
                              className="p-2 bg-primary-100 text-primary-600 rounded-lg hover:bg-primary-200 transition-colors"
                              title="Editar post"
                            >
                              <Edit size={16} />
                            </button>
                            
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Excluir post"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-neutral-500">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Heart size={14} />
                              <span>{post.likes?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageCircle size={14} />
                              <span>{post.commentsCount || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye size={14} />
                              <span>{post.views || 0}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>{post.authorName}</span>
                            <span>•</span>
                            <span>{formatDate(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Create/Edit Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div 
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">
                    {editingPost ? 'Editar Post' : 'Novo Post'}
                  </h2>
                  <button
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Título *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      Categoria *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    >
                      <option value="">Selecione uma categoria</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Resumo *
                  </label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    rows={3}
                    placeholder="Breve descrição do artigo..."
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Imagem do Post
                  </label>
                  
                  {/* Preview da imagem */}
                  {formData.imageUrl && (
                    <div className="mb-4">
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg border border-neutral-200"
                      />
                    </div>
                  )}
                  
                  {/* Opções de upload */}
                  <div className="space-y-4">
                    {/* Upload de arquivo */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        Enviar do computador
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="image-upload"
                          className={`flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors ${
                            uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {uploadingImage ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Upload size={18} />
                          )}
                          <span className="text-sm">
                            {uploadingImage ? 'Enviando...' : 'Escolher arquivo'}
                          </span>
                        </label>
                        <span className="text-xs text-neutral-500">
                          JPEG, PNG ou WebP (máx. 32MB)
                        </span>
                      </div>
                    </div>
                    
                    {/* Divisor */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-neutral-200"></div>
                      <span className="text-xs text-neutral-500">OU</span>
                      <div className="flex-1 h-px bg-neutral-200"></div>
                    </div>
                    
                    {/* URL da imagem */}
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-2">
                        URL da imagem
                      </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    </div>
                    </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Conteúdo *
                  </label>
                  <RichContentEditor
                    value={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                    placeholder="Escreva o conteúdo completo do artigo..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="tag1, tag2, tag3..."
                  />
                  <p className="text-sm text-neutral-500 mt-1">Separe as tags por vírgula</p>
                </div>
                
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                      className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-neutral-700">Post em destaque</span>
                  </label>
                  
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.published}
                      onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                      className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-neutral-700">Publicar imediatamente</span>
                  </label>
                </div>
                
                <div className="flex justify-end gap-4 pt-6 border-t border-neutral-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setEditingPost(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Save size={20} />
                    {editingPost ? 'Atualizar' : 'Criar'} Post
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminNewsPage;

