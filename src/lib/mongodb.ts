// Interface para as receitas do TudoGostoso
export interface MongoRecipe {
    _id: string;
    name: string;
    url: string;
    image: {
      src?: string;
      alt?: string;
    };
    author: {
      name?: string;
      url?: string;
    };
    datePublished: string;
    description: string;
    aggregateRating: {
      ratingValue?: number;
      reviewCount?: number;
    };
    keywords: string;
    prepTime: string;
    totalTime: string;
    recipeYield: string;
    recipeCategory: string;
    recipeIngredient: string[];
    recipeInstructions: string[];
    __v: number;
  }
  
  // Interface adaptada para o sistema atual
  export interface AdaptedRecipe {
    id: string;
    title: string;
    imageUrl: string;
    category: 'pre-treino' | 'pos-treino' | 'low-carb' | 'proteica' | 'cafe-da-manha' | 'snack' | 'almoco' | 'jantar';
    prepTime: number;
    cookTime: number;
    servings: number;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    difficulty: 'fácil' | 'médio' | 'difícil';
    description: string;
    tags: string[];
    ingredients: Array<{
      name: string;
      amount: string;
    }>;
    instructions: string[];
    rating: number;
    reviews: number;
    isFavorite?: boolean;
    source: 'tudogostoso' | 'internal';
    originalUrl?: string;
  }
  
  export type Recipe = {
    _id: string;
    "@context": string;
    "@type": "Recipe";
    name: string;
    url: string;
    image: {
      "@context": string;
      "@type": "ImageObject";
      url: string;
    };
    author: {
      "@context": string;
      "@type": string;
      name: string;
    };
    datePublished: string; // formato ISO: "2025-02-27"
    description: string;
    aggregateRating: {
      "@type": "AggregateRating";
      ratingValue: string; // vem como string: "5"
      ratingCount: string; // vem como string: "1"
      bestRating: number;
      worstRating: number;
    };
    keywords: string;
    prepTime: string;     // formato ISO 8601 de duração: "PT20M"
    totalTime: string;    // mesmo formato
    recipeYield: string;
    recipeCategory: string;
    recipeIngredient: string[];
    recipeInstructions: {
      "@type": "HowToStep";
      text: string;
      url: string;
    }[];
    __v: number;
  };
  
  export type FetchedRecipesType = {
    page: number,
    pages: number,
    recipes: Recipe[],
    total: number,
  }
  
  
  class MongoDBService {
    private isConnected = false;
  
    async connect(): Promise<void> {
      // MongoDB não disponível no navegador - implementação dummy
      console.warn('MongoDB não está disponível no ambiente do navegador');
      this.isConnected = false;
    }
  
    async disconnect(): Promise<void> {
      // Implementação dummy
      this.isConnected = false;
    }
  
    private ensureConnection(): void {
      if (!this.isConnected) {
        throw new Error('MongoDB não está disponível no ambiente do navegador');
      }
    }
  
    // Função para mapear categoria do TudoGostoso para nossas categorias
    private mapCategory(originalCategory: string, keywords: string, name: string): AdaptedRecipe['category'] {
      const categoryLower = originalCategory.toLowerCase();
      const keywordsLower = keywords.toLowerCase();
      const nameLower = name.toLowerCase();
      
      // Mapeamento baseado em palavras-chave
      if (keywordsLower.includes('café da manhã') || nameLower.includes('café da manhã') || 
          keywordsLower.includes('breakfast') || categoryLower.includes('café')) {
        return 'cafe-da-manha';
      }
      
      if (keywordsLower.includes('lanche') || keywordsLower.includes('snack') || 
          categoryLower.includes('lanche') || keywordsLower.includes('biscoito') ||
          keywordsLower.includes('bolo') || keywordsLower.includes('doce')) {
        return 'snack';
      }
      
      if (keywordsLower.includes('jantar') || categoryLower.includes('jantar') ||
          keywordsLower.includes('dinner')) {
        return 'jantar';
      }
      
      if (keywordsLower.includes('proteína') || keywordsLower.includes('protein') ||
          keywordsLower.includes('frango') || keywordsLower.includes('carne') ||
          keywordsLower.includes('peixe') || keywordsLower.includes('ovo')) {
        return 'proteica';
      }
      
      if (keywordsLower.includes('low carb') || keywordsLower.includes('lowcarb') ||
          keywordsLower.includes('sem carboidrato') || keywordsLower.includes('keto')) {
        return 'low-carb';
      }
      
      if (keywordsLower.includes('pré-treino') || keywordsLower.includes('pre treino') ||
          keywordsLower.includes('energia') || keywordsLower.includes('energético')) {
        return 'pre-treino';
      }
      
      if (keywordsLower.includes('pós-treino') || keywordsLower.includes('pos treino') ||
          keywordsLower.includes('recuperação') || keywordsLower.includes('whey')) {
        return 'pos-treino';
      }
      
      // Padrão para almoço
      return 'almoco';
    }
  
    // Função para estimar macronutrientes baseado nos ingredientes
    private estimateMacros(ingredients: string[], servings: number): { calories: number; protein: number; carbs: number; fat: number } {
      let calories = 0;
      let protein = 0;
      let carbs = 0;
      let fat = 0;
  
      // Estimativas básicas baseadas em ingredientes comuns
      const ingredientMacros: Record<string, { cal: number; prot: number; carb: number; fat: number }> = {
        'frango': { cal: 165, prot: 31, carb: 0, fat: 3.6 },
        'carne': { cal: 250, prot: 26, carb: 0, fat: 15 },
        'peixe': { cal: 130, prot: 26, carb: 0, fat: 3 },
        'ovo': { cal: 155, prot: 13, carb: 1, fat: 11 },
        'arroz': { cal: 130, prot: 2.7, carb: 28, fat: 0.3 },
        'batata': { cal: 77, prot: 2, carb: 17, fat: 0.1 },
        'feijão': { cal: 127, prot: 9, carb: 23, fat: 0.5 },
        'leite': { cal: 42, prot: 3.4, carb: 5, fat: 1 },
        'queijo': { cal: 113, prot: 7, carb: 1, fat: 9 },
        'óleo': { cal: 884, prot: 0, carb: 0, fat: 100 },
        'açúcar': { cal: 387, prot: 0, carb: 100, fat: 0 },
        'farinha': { cal: 364, prot: 10, carb: 76, fat: 1 },
      };
  
      ingredients.forEach(ingredient => {
        const ingredientLower = ingredient.toLowerCase();
        
        Object.keys(ingredientMacros).forEach(key => {
          if (ingredientLower.includes(key)) {
            const macro = ingredientMacros[key];
            // Estimativa baseada em porção média (100g)
            const portion = 0.5; // Fator de ajuste para porção média
            calories += macro.cal * portion;
            protein += macro.prot * portion;
            carbs += macro.carb * portion;
            fat += macro.fat * portion;
          }
        });
      });
  
      // Se não encontrou ingredientes conhecidos, usar valores padrão
      if (calories === 0) {
        calories = 300;
        protein = 15;
        carbs = 35;
        fat = 10;
      }
  
      // Ajustar por porção
      const portionFactor = servings > 0 ? 1 / servings : 1;
      
      return {
        calories: Math.round(calories * portionFactor),
        protein: Math.round(protein * portionFactor),
        carbs: Math.round(carbs * portionFactor),
        fat: Math.round(fat * portionFactor)
      };
    }
  
    // Função para extrair tempo em minutos
    private parseTime(timeString: string): number {
      if (!timeString) return 30; // Padrão
      
      const hourMatch = timeString.match(/(\d+)h/);
      const minuteMatch = timeString.match(/(\d+)min/);
      
      let totalMinutes = 0;
      if (hourMatch) totalMinutes += parseInt(hourMatch[1]) * 60;
      if (minuteMatch) totalMinutes += parseInt(minuteMatch[1]);
      
      return totalMinutes || 30; // Padrão se não conseguir extrair
    }
  
    // Função para extrair número de porções
    private parseServings(yieldString: string): number {
      if (!yieldString) return 4; // Padrão
      
      const match = yieldString.match(/(\d+)/);
      return match ? parseInt(match[1]) : 4;
    }
  
    // Função para determinar dificuldade
    private determineDifficulty(instructions: string[], totalTime: number): AdaptedRecipe['difficulty'] {
      const instructionCount = instructions.length;
      
      if (instructionCount <= 3 && totalTime <= 30) return 'fácil';
      if (instructionCount <= 6 && totalTime <= 60) return 'médio';
      return 'difícil';
    }
  
    // Função para gerar tags baseadas no conteúdo
    private generateTags(recipe: MongoRecipe): string[] {
      const tags: string[] = [];
      const content = `${recipe.name} ${recipe.description} ${recipe.keywords}`.toLowerCase();
      
      const tagMap = {
        'rápido': ['rápid', 'quick', 'fácil'],
        'saudável': ['saudável', 'healthy', 'light'],
        'proteico': ['proteína', 'protein', 'frango', 'carne', 'peixe'],
        'vegetariano': ['vegetarian', 'vegetal', 'verdura'],
        'doce': ['doce', 'sweet', 'açúcar', 'sobremesa'],
        'fitness': ['fitness', 'diet', 'low carb', 'integral'],
        'tradicional': ['tradicional', 'caseiro', 'família'],
        'gourmet': ['gourmet', 'especial', 'sofisticad']
      };
  
      Object.entries(tagMap).forEach(([tag, keywords]) => {
        if (keywords.some(keyword => content.includes(keyword))) {
          tags.push(tag);
        }
      });
  
      return tags.slice(0, 5); // Máximo 5 tags
    }
  
    // Função para adaptar receita do MongoDB para o formato do sistema
    private adaptRecipe(mongoRecipe: MongoRecipe): AdaptedRecipe {
      const totalTime = this.parseTime(mongoRecipe.totalTime);
      const prepTime = this.parseTime(mongoRecipe.prepTime);
      const cookTime = Math.max(0, totalTime - prepTime);
      const servings = this.parseServings(mongoRecipe.recipeYield);
      const macros = this.estimateMacros(mongoRecipe.recipeIngredient || [], servings);
  
      return {
        id: mongoRecipe._id,
        title: mongoRecipe.name,
        imageUrl: mongoRecipe.image?.src || 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
        category: this.mapCategory(mongoRecipe.recipeCategory || '', mongoRecipe.keywords || '', mongoRecipe.name),
        prepTime,
        cookTime,
        servings,
        calories: macros.calories,
        protein: macros.protein,
        carbs: macros.carbs,
        fat: macros.fat,
        difficulty: this.determineDifficulty(mongoRecipe.recipeInstructions || [], totalTime),
        description: mongoRecipe.description || 'Receita deliciosa do TudoGostoso',
        tags: this.generateTags(mongoRecipe),
        ingredients: (mongoRecipe.recipeIngredient || []).map(ingredient => ({
          name: ingredient.replace(/^\d+\s*/, '').replace(/^(g|kg|ml|l|xícara|colher|pitada)\s+/, ''),
          amount: ingredient.match(/^[\d\s\/]+\s*(g|kg|ml|l|xícara|colher|pitada|unidade|dente|ramo)?/)?.[0] || '1 unidade'
        })),
        instructions: mongoRecipe.recipeInstructions || ['Siga as instruções da receita original'],
        rating: mongoRecipe.aggregateRating?.ratingValue || 4.5,
        reviews: mongoRecipe.aggregateRating?.reviewCount || 0,
        source: 'tudogostoso',
        originalUrl: mongoRecipe.url
      };
    }
  
    // Buscar todas as receitas com paginação
    async getRecipes(page: number = 1, limit: number = 50): Promise<{ recipes: AdaptedRecipe[]; total: number }> {
      // Retorna dados vazios - o hook useRecipes vai usar dados estáticos
      return {
        recipes: [],
        total: 0
      };
    }
  
    // Buscar receita por ID
    async getRecipeById(id: string): Promise<AdaptedRecipe | null> {
      // Retorna null - o hook useRecipes vai usar dados estáticos
      return null;
    }
  
    // Buscar receitas por categoria
    async getRecipesByCategory(category: string, limit: number = 20): Promise<AdaptedRecipe[]> {
      // Retorna array vazio - o hook useRecipes vai usar dados estáticos
      return [];
    }
  
    // Buscar receitas por texto
    async searchRecipes(searchTerm: string, limit: number = 50): Promise<AdaptedRecipe[]> {
      // Retorna array vazio - o hook useRecipes vai usar dados estáticos
      return [];
    }
  
    // Buscar receitas aleatórias para destaque
    async getFeaturedRecipes(limit: number = 8): Promise<AdaptedRecipe[]> {
      // Retorna array vazio - o hook useRecipes vai usar dados estáticos
      return [];
    }
  }
  
  // Instância singleton
  export const mongoDBService = new MongoDBService();
  
  // Função para inicializar a conexão
  export const initializeMongoDB = async (): Promise<void> => {
    // MongoDB não disponível no navegador - implementação dummy
    console.warn('MongoDB não está disponível no ambiente do navegador');
  };
  
  // Função para limpar a conexão
  export const cleanupMongoDB = async (): Promise<void> => {
    // Implementação dummy
    await mongoDBService.disconnect();
  };