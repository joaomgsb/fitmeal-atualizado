import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, User, Heart, MessageCircle, Share2, 
  Clock, Eye, TrendingUp, Search, Filter,
  ChevronRight, Bookmark, BookmarkCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  increment,
  addDoc,
  serverTimestamp,
  where,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import PageTransition from '../components/PageTransition';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: any;
  likes: string[];
}

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

const NewsPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { profile } = useProfile();
  const [posts, setPosts] = useState<NewsPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<NewsPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { id: 'nutricao', name: 'Nutrição', color: 'bg-green-500' },
    { id: 'treino', name: 'Treino', color: 'bg-blue-500' },
    { id: 'suplementacao', name: 'Suplementação', color: 'bg-purple-500' },
    { id: 'receitas', name: 'Receitas', color: 'bg-orange-500' },
    { id: 'lifestyle', name: 'Lifestyle', color: 'bg-pink-500' },
    { id: 'ciencia', name: 'Ciência', color: 'bg-indigo-500' }
  ];

  useEffect(() => {
    // Buscar posts em destaque
    const featuredQuery = query(
      collection(db, 'news_posts'),
      where('published', '==', true),
      where('featured', '==', true),
      orderBy('createdAt', 'desc'),
      limit(3)
    );

    const unsubscribeFeatured = onSnapshot(featuredQuery, (snapshot) => {
      const featuredData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsPost[];
      setFeaturedPosts(featuredData);
    });

    // Buscar todos os posts
    const postsQuery = query(
      collection(db, 'news_posts'),
      where('published', '==', true),
      orderBy('createdAt', 'desc')
    );

    const unsubscribePosts = onSnapshot(postsQuery, (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as NewsPost[];
      setPosts(postsData);
      setLoading(false);
    });

    return () => {
      unsubscribeFeatured();
      unsubscribePosts();
    };
  }, []);

  const handleLike = async (postId: string, currentLikes: string[]) => {
    if (!currentUser) {
      toast.error('Faça login para curtir posts');
      return;
    }

    const postRef = doc(db, 'news_posts', postId);
    const isLiked = currentLikes.includes(currentUser.uid);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      toast.error('Erro ao curtir post');
    }
  };

  const handleBookmark = async (postId: string, currentBookmarks: string[]) => {
    if (!currentUser) {
      toast.error('Faça login para salvar posts');
      return;
    }

    const postRef = doc(db, 'news_posts', postId);
    const isBookmarked = currentBookmarks.includes(currentUser.uid);

    try {
      if (isBookmarked) {
        await updateDoc(postRef, {
          bookmarks: arrayRemove(currentUser.uid)
        });
        toast.success('Post removido dos salvos');
      } else {
        await updateDoc(postRef, {
          bookmarks: arrayUnion(currentUser.uid)
        });
        toast.success('Post salvo com sucesso');
      }
    } catch (error) {
      toast.error('Erro ao salvar post');
    }
  };

  const incrementViews = async (postId: string) => {
    const postRef = doc(db, 'news_posts', postId);
    try {
      await updateDoc(postRef, {
        views: increment(1)
      });
    } catch (error) {
      console.error('Erro ao incrementar visualizações:', error);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory ? post.category === selectedCategory : true;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.color || 'bg-neutral-500';
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTimeAgo = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora há pouco';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return formatDate(timestamp);
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
          <div className="text-center mb-12">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold font-display mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              FitMeal News
            </motion.h1>
            <motion.p 
              className="text-neutral-600 text-lg max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Fique por dentro das últimas novidades em nutrição, treino e lifestyle fitness
            </motion.p>
          </div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.section 
              className="mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="text-primary-500" size={24} />
                <h2 className="text-2xl font-bold">Em Destaque</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className={`group cursor-pointer ${index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => incrementViews(post.id)}
                  >
                    <Link to={`/news/${post.id}`}>
                      <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full">
                        <div className={`relative ${index === 0 ? 'h-80' : 'h-48'}`}>
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          <div className="absolute top-4 left-4">
                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getCategoryColor(post.category)}`}>
                              {getCategoryName(post.category)}
                            </span>
                          </div>
                          <div className="absolute bottom-4 left-4 right-4">
                            <h3 className={`text-white font-bold leading-tight ${index === 0 ? 'text-2xl' : 'text-lg'}`}>
                              {post.title}
                            </h3>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <p className="text-neutral-600 mb-4 line-clamp-2">{post.excerpt}</p>
                          
                          <div className="flex items-center justify-between text-sm text-neutral-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Heart size={16} />
                                <span>{post.likes?.length || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle size={16} />
                                <span>{post.commentsCount || 0}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Eye size={16} />
                                <span>{post.views || 0}</span>
                              </div>
                            </div>
                            <span>{formatTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </motion.section>
          )}

          {/* Search and Filters */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Buscar artigos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                </div>
                
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-6 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  <Filter size={20} />
                  <span>Filtros</span>
                </button>
              </div>
              
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 pt-6 border-t border-neutral-200"
                >
                  <h3 className="font-medium mb-3">Categorias</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        !selectedCategory 
                          ? 'bg-primary-500 text-white' 
                          : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                      }`}
                    >
                      Todas
                    </button>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                          selectedCategory === category.id 
                            ? `${category.color} text-white` 
                            : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Posts Grid */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Últimos Artigos</h2>
              <span className="text-neutral-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'artigo' : 'artigos'}
              </span>
            </div>

            {filteredPosts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={32} className="text-neutral-400" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                  Nenhum artigo encontrado
                </h3>
                <p className="text-neutral-500">
                  Tente ajustar os filtros ou buscar por outros termos.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    className="group cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                    onClick={() => incrementViews(post.id)}
                  >
                    <Link to={`/news/${post.id}`}>
                      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                        <div className="relative h-48">
                          <img 
                            src={post.imageUrl} 
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getCategoryColor(post.category)}`}>
                              {getCategoryName(post.category)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-xs text-neutral-500">
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
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleLike(post.id, post.likes || []);
                                }}
                                className={`p-2 rounded-full transition-colors ${
                                  currentUser && post.likes?.includes(currentUser.uid)
                                    ? 'text-red-500 bg-red-50 hover:bg-red-100'
                                    : 'text-neutral-400 hover:text-red-500 hover:bg-red-50'
                                }`}
                              >
                                <Heart size={16} fill={currentUser && post.likes?.includes(currentUser.uid) ? 'currentColor' : 'none'} />
                              </button>
                              
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleBookmark(post.id, post.bookmarks || []);
                                }}
                                className={`p-2 rounded-full transition-colors ${
                                  currentUser && post.bookmarks?.includes(currentUser.uid)
                                    ? 'text-primary-500 bg-primary-50 hover:bg-primary-100'
                                    : 'text-neutral-400 hover:text-primary-500 hover:bg-primary-50'
                                }`}
                              >
                                {currentUser && post.bookmarks?.includes(currentUser.uid) ? (
                                  <BookmarkCheck size={16} />
                                ) : (
                                  <Bookmark size={16} />
                                )}
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-neutral-100">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                                <User size={12} className="text-primary-600" />
                              </div>
                              <span className="text-xs text-neutral-500">{post.authorName}</span>
                            </div>
                            <span className="text-xs text-neutral-500">{formatTimeAgo(post.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </motion.section>
        </div>
      </div>
    </PageTransition>
  );
};

export default NewsPage;