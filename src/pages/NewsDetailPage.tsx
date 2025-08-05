import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, User, Heart, MessageCircle, Share2, 
  Clock, Eye, ChevronLeft, Bookmark, BookmarkCheck,
  Send, MoreVertical, Flag, Edit, Trash2
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../hooks/useProfile';
import { 
  doc, 
  getDoc, 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  arrayUnion, 
  arrayRemove,
  increment,
  serverTimestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { toast } from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import NewsContentRenderer from '../components/news/NewsContentRenderer';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: any;
  likes: string[];
  replies?: Comment[];
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

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const { profile } = useProfile();
  const [post, setPost] = useState<NewsPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  const categories = {
    'nutricao': { name: 'Nutrição', color: 'bg-green-500' },
    'treino': { name: 'Treino', color: 'bg-blue-500' },
    'suplementacao': { name: 'Suplementação', color: 'bg-purple-500' },
    'receitas': { name: 'Receitas', color: 'bg-orange-500' },
    'lifestyle': { name: 'Lifestyle', color: 'bg-pink-500' },
    'ciencia': { name: 'Ciência', color: 'bg-indigo-500' }
  };

  useEffect(() => {
    if (!id) return;

    // Buscar o post
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'news_posts', id));
        if (postDoc.exists()) {
          const postData = { id: postDoc.id, ...postDoc.data() } as NewsPost;
          setPost(postData);
          
          // Incrementar visualizações
          await updateDoc(doc(db, 'news_posts', id), {
            views: increment(1)
          });
        }
      } catch (error) {
        console.error('Erro ao buscar post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // Buscar comentários em tempo real
    const commentsQuery = query(
      collection(db, 'news_posts', id, 'comments'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [id]);

  const handleLike = async () => {
    if (!currentUser || !post) {
      toast.error('Faça login para curtir posts');
      return;
    }

    const postRef = doc(db, 'news_posts', post.id);
    const isLiked = post.likes?.includes(currentUser.uid);

    try {
      if (isLiked) {
        await updateDoc(postRef, {
          likes: arrayRemove(currentUser.uid)
        });
        setPost(prev => prev ? {
          ...prev,
          likes: prev.likes.filter(uid => uid !== currentUser.uid)
        } : null);
      } else {
        await updateDoc(postRef, {
          likes: arrayUnion(currentUser.uid)
        });
        setPost(prev => prev ? {
          ...prev,
          likes: [...(prev.likes || []), currentUser.uid]
        } : null);
      }
    } catch (error) {
      toast.error('Erro ao curtir post');
    }
  };

  const handleBookmark = async () => {
    if (!currentUser || !post) {
      toast.error('Faça login para salvar posts');
      return;
    }

    const postRef = doc(db, 'news_posts', post.id);
    const isBookmarked = post.bookmarks?.includes(currentUser.uid);

    try {
      if (isBookmarked) {
        await updateDoc(postRef, {
          bookmarks: arrayRemove(currentUser.uid)
        });
        setPost(prev => prev ? {
          ...prev,
          bookmarks: prev.bookmarks.filter(uid => uid !== currentUser.uid)
        } : null);
        toast.success('Post removido dos salvos');
      } else {
        await updateDoc(postRef, {
          bookmarks: arrayUnion(currentUser.uid)
        });
        setPost(prev => prev ? {
          ...prev,
          bookmarks: [...(prev.bookmarks || []), currentUser.uid]
        } : null);
        toast.success('Post salvo com sucesso');
      }
    } catch (error) {
      toast.error('Erro ao salvar post');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !post || !newComment.trim()) {
      toast.error('Faça login para comentar');
      return;
    }

    if (!profile?.name) {
      toast.error('Complete seu perfil para comentar');
      return;
    }

    setSubmittingComment(true);

    try {
      await addDoc(collection(db, 'news_posts', post.id, 'comments'), {
        userId: currentUser.uid,
        userName: profile.name,
        userAvatar: profile.avatar || '',
        content: newComment.trim(),
        createdAt: serverTimestamp(),
        likes: []
      });

      // Incrementar contador de comentários
      await updateDoc(doc(db, 'news_posts', post.id), {
        commentsCount: increment(1)
      });

      setNewComment('');
      toast.success('Comentário adicionado!');
    } catch (error) {
      toast.error('Erro ao adicionar comentário');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = async (commentId: string, currentLikes: string[]) => {
    if (!currentUser || !post) {
      toast.error('Faça login para curtir comentários');
      return;
    }

    const commentRef = doc(db, 'news_posts', post.id, 'comments', commentId);
    const isLiked = currentLikes.includes(currentUser.uid);

    try {
      if (isLiked) {
        await updateDoc(commentRef, {
          likes: arrayRemove(currentUser.uid)
        });
      } else {
        await updateDoc(commentRef, {
          likes: arrayUnion(currentUser.uid)
        });
      }
    } catch (error) {
      toast.error('Erro ao curtir comentário');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!currentUser || !post) return;

    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      try {
        await deleteDoc(doc(db, 'news_posts', post.id, 'comments', commentId));
        
        // Decrementar contador de comentários
        await updateDoc(doc(db, 'news_posts', post.id), {
          commentsCount: increment(-1)
        });

        toast.success('Comentário excluído');
      } catch (error) {
        toast.error('Erro ao excluir comentário');
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback para clipboard
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copiado para a área de transferência!');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copiado para a área de transferência!');
    }
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
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora há pouco';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return formatDate(timestamp);
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-24 pb-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Post não encontrado</h1>
        <Link to="/news" className="text-primary-500 hover:text-primary-600">
          ← Voltar para News
        </Link>
      </div>
    );
  }

  const categoryInfo = categories[post.category as keyof typeof categories];

  return (
    <PageTransition>
      <div className="pt-24 pb-16 bg-neutral-50 min-h-screen">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link 
              to="/news" 
              className="inline-flex items-center text-neutral-600 hover:text-primary-600 transition-colors"
            >
              <ChevronLeft size={20} className="mr-1" />
              Voltar para News
            </Link>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <motion.header 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="mb-4">
                <span className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${categoryInfo?.color || 'bg-neutral-500'}`}>
                  {categoryInfo?.name || post.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-xl text-neutral-600 mb-6 leading-relaxed">
                {post.excerpt}
              </p>

              {/* Article Meta */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-neutral-200">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium">{post.authorName}</p>
                      <p className="text-sm text-neutral-500">{formatDate(post.createdAt)}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-neutral-500">
                  <div className="flex items-center gap-1">
                    <Eye size={16} />
                    <span>{post.views || 0} visualizações</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} />
                    <span>5 min de leitura</span>
                  </div>
                </div>
              </div>
            </motion.header>

            {/* Featured Image */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </motion.div>

            {/* Article Content */}
            <motion.article 
              className="prose prose-lg max-w-none mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <NewsContentRenderer 
                content={post.content}
                className="text-neutral-700 leading-relaxed"
              />
            </motion.article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h3 className="font-semibold mb-3">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center justify-between py-6 border-y border-neutral-200 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    currentUser && post.likes?.includes(currentUser.uid)
                      ? 'bg-red-50 text-red-600 hover:bg-red-100'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-red-50 hover:text-red-600'
                  }`}
                >
                  <Heart 
                    size={20} 
                    fill={currentUser && post.likes?.includes(currentUser.uid) ? 'currentColor' : 'none'} 
                  />
                  <span>{post.likes?.length || 0}</span>
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    currentUser && post.bookmarks?.includes(currentUser.uid)
                      ? 'bg-primary-50 text-primary-600 hover:bg-primary-100'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  {currentUser && post.bookmarks?.includes(currentUser.uid) ? (
                    <BookmarkCheck size={20} />
                  ) : (
                    <Bookmark size={20} />
                  )}
                  <span>Salvar</span>
                </button>
              </div>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-600 rounded-full hover:bg-neutral-200 transition-colors"
              >
                <Share2 size={20} />
                <span>Compartilhar</span>
              </button>
            </motion.div>

            {/* Comments Section */}
            <motion.section 
              className="bg-white rounded-2xl p-8 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold mb-6">
                Comentários ({comments.length})
              </h2>

              {/* Comment Form */}
              {currentUser ? (
                <form onSubmit={handleSubmitComment} className="mb-8">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User size={20} className="text-primary-600" />
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Escreva seu comentário..."
                        className="w-full p-4 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          type="submit"
                          disabled={!newComment.trim() || submittingComment}
                          className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                          {submittingComment ? 'Enviando...' : 'Comentar'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-center py-8 bg-neutral-50 rounded-lg mb-8">
                  <p className="text-neutral-600 mb-4">Faça login para comentar</p>
                  <Link 
                    to="/login" 
                    className="inline-block px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    Fazer Login
                  </Link>
                </div>
              )}

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle size={48} className="mx-auto text-neutral-300 mb-4" />
                    <p className="text-neutral-500">Seja o primeiro a comentar!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={20} className="text-primary-600" />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="bg-neutral-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{comment.userName}</span>
                              <span className="text-sm text-neutral-500">
                                {formatTimeAgo(comment.createdAt)}
                              </span>
                            </div>
                            
                            {currentUser && (currentUser.uid === comment.userId || profile?.isAdmin) && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-neutral-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                          
                          <p className="text-neutral-700 mb-3">{comment.content}</p>
                          
                          <button
                            onClick={() => handleLikeComment(comment.id, comment.likes || [])}
                            className={`flex items-center gap-1 text-sm transition-colors ${
                              currentUser && comment.likes?.includes(currentUser.uid)
                                ? 'text-red-500'
                                : 'text-neutral-500 hover:text-red-500'
                            }`}
                          >
                            <Heart 
                              size={14} 
                              fill={currentUser && comment.likes?.includes(currentUser.uid) ? 'currentColor' : 'none'} 
                            />
                            <span>{comment.likes?.length || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NewsDetailPage;