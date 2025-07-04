import { useState, useEffect } from 'react';
import { mongoDBService, AdaptedRecipe } from '../lib/mongodb';
import { allRecipes as staticRecipes } from '../data/recipeData';

interface UseRecipesOptions {
  searchTerm?: string;
  category?: string;
  limit?: number;
  page?: number;
  useStaticFallback?: boolean;
}

interface UseRecipesReturn {
  recipes: AdaptedRecipe[];
  loading: boolean;
  error: string | null;
  total: number;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export const useRecipes = (options: UseRecipesOptions = {}): UseRecipesReturn => {
  const {
    searchTerm = '',
    category = '',
    limit = 50,
    page = 1,
    useStaticFallback = true
  } = options;

  const [recipes, setRecipes] = useState<AdaptedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(page);

  const loadRecipes = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      let result: { recipes: AdaptedRecipe[]; total: number };

      // Tentar buscar do MongoDB primeiro
      try {
        if (searchTerm) {
          const searchResults = await mongoDBService.searchRecipes(searchTerm, limit);
          result = { recipes: searchResults, total: searchResults.length };
        } else if (category) {
          const categoryResults = await mongoDBService.getRecipesByCategory(category, limit);
          result = { recipes: categoryResults, total: categoryResults.length };
        } else {
          result = await mongoDBService.getRecipes(pageNum, limit);
        }
      } catch (mongoError) {
        console.warn('Erro ao buscar receitas do MongoDB, usando fallback:', mongoError);
        
        if (!useStaticFallback) {
          throw mongoError;
        }

        // Fallback para receitas estáticas
        let filteredRecipes = staticRecipes.map(recipe => ({
          ...recipe,
          source: 'internal' as const
        }));

        if (searchTerm) {
          filteredRecipes = filteredRecipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }

        if (category) {
          filteredRecipes = filteredRecipes.filter(recipe => recipe.category === category);
        }

        const startIndex = (pageNum - 1) * limit;
        const endIndex = startIndex + limit;
        
        result = {
          recipes: filteredRecipes.slice(startIndex, endIndex),
          total: filteredRecipes.length
        };
      }

      if (append) {
        setRecipes(prev => [...prev, ...result.recipes]);
      } else {
        setRecipes(result.recipes);
      }
      
      setTotal(result.total);
      setCurrentPage(pageNum);

    } catch (err) {
      console.error('Erro ao carregar receitas:', err);
      setError('Erro ao carregar receitas. Tente novamente.');
      
      // Em caso de erro total, usar receitas estáticas se permitido
      if (useStaticFallback && recipes.length === 0) {
        setRecipes(staticRecipes.map(recipe => ({ ...recipe, source: 'internal' as const })));
        setTotal(staticRecipes.length);
      }
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      loadRecipes(currentPage + 1, true);
    }
  };

  const refresh = () => {
    setCurrentPage(1);
    loadRecipes(1, false);
  };

  const hasMore = recipes.length < total;

  useEffect(() => {
    loadRecipes(1, false);
  }, [searchTerm, category, limit]);

  return {
    recipes,
    loading,
    error,
    total,
    hasMore,
    loadMore,
    refresh
  };
};

// Hook específico para buscar uma receita por ID
export const useRecipe = (id: string) => {
  const [recipe, setRecipe] = useState<AdaptedRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadRecipe = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Tentar buscar do MongoDB primeiro
        let foundRecipe: AdaptedRecipe | null = null;
        
        try {
          foundRecipe = await mongoDBService.getRecipeById(id);
        } catch (mongoError) {
          console.warn('Erro ao buscar receita do MongoDB, usando fallback:', mongoError);
        }

        // Fallback para receitas estáticas
        if (!foundRecipe) {
          const staticRecipe = staticRecipes.find(r => r.id === id);
          if (staticRecipe) {
            foundRecipe = { ...staticRecipe, source: 'internal' as const };
          }
        }

        setRecipe(foundRecipe);

        if (!foundRecipe) {
          setError('Receita não encontrada');
        }

      } catch (err) {
        console.error('Erro ao carregar receita:', err);
        setError('Erro ao carregar receita');
      } finally {
        setLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

  return { recipe, loading, error };
};

// Hook para receitas em destaque
export const useFeaturedRecipes = (limit: number = 8) => {
  const [recipes, setRecipes] = useState<AdaptedRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        setLoading(true);
        setError(null);

        let featuredRecipes: AdaptedRecipe[] = [];

        try {
          featuredRecipes = await mongoDBService.getFeaturedRecipes(limit);
        } catch (mongoError) {
          console.warn('Erro ao buscar receitas em destaque do MongoDB, usando fallback:', mongoError);
          // Fallback para receitas estáticas
          featuredRecipes = staticRecipes
            .slice(0, limit)
            .map(recipe => ({ ...recipe, source: 'internal' as const }));
        }

        setRecipes(featuredRecipes);

      } catch (err) {
        console.error('Erro ao carregar receitas em destaque:', err);
        setError('Erro ao carregar receitas em destaque');
        
        // Fallback final
        setRecipes(staticRecipes.slice(0, limit).map(recipe => ({ ...recipe, source: 'internal' as const })));
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedRecipes();
  }, [limit]);

  return { recipes, loading, error };
};