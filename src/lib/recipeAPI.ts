// Integração com API de receitas Spoonacular
const SPOONACULAR_API_KEY = 'f0172f53db264189884b6bc7a6e891df'; // Você pode usar uma chave gratuita real

export interface APIRecipe {
  id: number;
  title: string;
  image: string;
  imageType: string;
  nutrition: {
    nutrients: Array<{
      name: string;
      amount: number;
      unit: string;
    }>;
  };
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: Array<{
    name: string;
    amount: number;
    unit: string;
    original: string;
  }>;
  diets: string[];
  dishTypes: string[];
  cuisines: string[];
  occasions: string[];
}

export interface RecipeSearchParams {
  query?: string;
  diet?: string;
  type?: string;
  maxReadyTime?: number;
  minProtein?: number;
  maxCalories?: number;
  number?: number;
  offset?: number;
}

// Função para buscar receitas da API
export const searchRecipes = async (params: RecipeSearchParams = {}): Promise<APIRecipe[]> => {
  try {
    const {
      query = '',
      diet = '',
      type = '',
      maxReadyTime = 60,
      minProtein = 10,
      maxCalories = 800,
      number = 50,
      offset = 0
    } = params;

    // Construir URL da API
    const baseUrl = 'https://api.spoonacular.com/recipes/complexSearch';
    const searchParams = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      addRecipeInformation: 'true',
      addRecipeNutrition: 'true',
      fillIngredients: 'true',
      number: number.toString(),
      offset: offset.toString(),
      ...(query && { query }),
      ...(diet && { diet }),
      ...(type && { type }),
      maxReadyTime: maxReadyTime.toString(),
      minProtein: minProtein.toString(),
      maxCalories: maxCalories.toString(),
      sort: 'popularity',
      sortDirection: 'desc'
    });

    const response = await fetch(`${baseUrl}?${searchParams}`);
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];

  } catch (error) {
    console.error('Erro ao buscar receitas da API:', error);
    // Retorna receitas mock em caso de erro
    return getMockRecipes(params);
  }
};

// Função para obter detalhes de uma receita específica
export const getRecipeDetails = async (id: number): Promise<APIRecipe | null> => {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${SPOONACULAR_API_KEY}&includeNutrition=true`
    );
    
    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar detalhes da receita:', error);
    return null;
  }
};

// Função para converter receita da API para o formato interno
export const convertAPIRecipeToInternal = (apiRecipe: APIRecipe) => {
  const nutrition = apiRecipe.nutrition?.nutrients || [];
  
  const getNutrient = (name: string) => {
    const nutrient = nutrition.find(n => n.name.toLowerCase().includes(name.toLowerCase()));
    return nutrient ? Math.round(nutrient.amount) : 0;
  };

  const calories = getNutrient('calories');
  const protein = getNutrient('protein');
  const carbs = getNutrient('carbohydrates');
  const fat = getNutrient('fat');

  // Traduzir e determinar categoria baseada nos tipos de prato e dietas
  let category = 'almoco'; // padrão
  
  if (apiRecipe.dishTypes?.includes('breakfast')) category = 'cafe-da-manha';
  else if (apiRecipe.dishTypes?.includes('snack')) category = 'snack';
  else if (apiRecipe.dishTypes?.includes('dinner')) category = 'jantar';
  else if (apiRecipe.diets?.includes('ketogenic') || carbs < 10) category = 'low-carb';
  else if (protein > 25) category = 'proteica';

  // Determinar dificuldade baseada no tempo
  let difficulty: 'fácil' | 'médio' | 'difícil' = 'médio';
  if (apiRecipe.readyInMinutes <= 15) difficulty = 'fácil';
  else if (apiRecipe.readyInMinutes >= 45) difficulty = 'difícil';

  // Traduzir título e descrição
  const translatedTitle = translateRecipeTitle(apiRecipe.title);
  const translatedDescription = translateRecipeDescription(apiRecipe.summary);
  const translatedInstructions = translateInstructions(apiRecipe.instructions);
  const translatedIngredients = translateIngredients(apiRecipe.extendedIngredients || []);

  return {
    id: apiRecipe.id.toString(),
    title: translatedTitle,
    imageUrl: apiRecipe.image || 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
    category: category as any,
    prepTime: Math.max(5, Math.round(apiRecipe.readyInMinutes * 0.3)),
    cookTime: Math.max(5, Math.round(apiRecipe.readyInMinutes * 0.7)),
    servings: apiRecipe.servings || 1,
    calories,
    protein,
    carbs,
    fat,
    difficulty,
    description: translatedDescription,
    tags: translateTags([
      ...(apiRecipe.diets || []),
      ...(apiRecipe.dishTypes || []),
      ...(apiRecipe.cuisines || [])
    ]).slice(0, 5),
    ingredients: translatedIngredients,
    instructions: translatedInstructions,
    rating: 4.5,
    reviews: Math.floor(Math.random() * 100) + 10
  };
};

// Funções de tradução
const translateRecipeTitle = (title: string): string => {
  const translations: Record<string, string> = {
    // Proteínas
    'chicken': 'frango',
    'chicken breast': 'peito de frango',
    'chicken stock': 'caldo de frango',
    'beef': 'carne',
    'pork': 'porco',
    'fish': 'peixe',
    'salmon': 'salmão',
    'tuna': 'atum',
    'turkey': 'peru',
    'egg': 'ovo',
    'eggs': 'ovos',
    
    // Laticínios
    'cheese': 'queijo',
    'milk': 'leite',
    'yogurt': 'iogurte',
    
    // Carboidratos
    'rice': 'arroz',
    'fried rice': 'arroz frito',
    'mango fried rice': 'arroz frito com manga',
    'pasta': 'macarrão',
    'bread': 'pão',
    'potato': 'batata',
    'sweet potato': 'batata doce',
    'quinoa': 'quinoa',
    'oats': 'aveia',
    
    // Frutas
    'banana': 'banana',
    'mango': 'manga',
    'apple': 'maçã',
    'berry': 'frutas vermelhas',
    'berries': 'frutas vermelhas',
    'strawberry': 'morango',
    'blueberry': 'mirtilo',
    'avocado': 'abacate',
    
    // Vegetais
    'spinach': 'espinafre',
    'broccoli': 'brócolis',
    'carrot': 'cenoura',
    'tomato': 'tomate',
    'onion': 'cebola',
    'garlic': 'alho',
    'vegetables': 'vegetais',
    'chopped vegetables': 'vegetais picados',
    'cubed': 'em cubos',
    'slices': 'fatias',
    'pepper': 'pimentão',
    'scotch bonnet pepper': 'pimenta scotch bonnet',
    
    // Métodos de preparo
    'salad': 'salada',
    'soup': 'sopa',
    'smoothie': 'smoothie',
    'shake': 'shake',
    'bowl': 'bowl',
    'grilled': 'grelhado',
    'baked': 'assado',
    'roasted': 'assado',
    'fried': 'frito',
    'steamed': 'no vapor',
    
    // Características
    'healthy': 'saudável',
    'protein': 'proteína',
    'low carb': 'low carb',
    'keto': 'cetogênico',
    'vegetarian': 'vegetariano',
    'vegan': 'vegano',
    
    // Refeições
    'breakfast': 'café da manhã',
    'lunch': 'almoço',
    'dinner': 'jantar',
    'snack': 'lanche',
    
    // Temperos e condimentos
    'seasoning': 'tempero',
    'seasoning cubes': 'cubos de tempero',
    'stock': 'caldo',
    'cups': 'xícaras',
    'cup': 'xícara',
    'of': 'de'
  };

  let translatedTitle = title.toLowerCase();
  
  // Aplicar traduções em ordem de prioridade (frases maiores primeiro)
  const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  
  sortedTranslations.forEach(([english, portuguese]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translatedTitle = translatedTitle.replace(regex, portuguese);
  });

  // Capitalizar primeira letra de cada palavra
  return translatedTitle.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const translateRecipeDescription = (summary: string): string => {
  if (!summary) return 'Receita deliciosa e nutritiva, perfeita para uma alimentação saudável.';
  
  // Remove HTML tags
  const cleanSummary = summary.replace(/<[^>]*>/g, '');
  
  // Traduções básicas
  const translations: Record<string, string> = {
    // Frases comuns
    'This recipe': 'Esta receita',
    'makes': 'rende',
    'servings': 'porções',
    'with': 'com',
    'calories': 'calorias',
    'of protein': 'de proteína',
    'of fat': 'de gordura',
    'each': 'cada',
    'per serving': 'por porção',
    'covers': 'cobre',
    'of your daily requirement': 'da sua necessidade diária',
    'main course': 'prato principal',
    'Chinese': 'chinês',
    'Esta receita': 'Esta receita',
    
    // Palavras básicas
    'is perfect': 'é perfeita',
    'for': 'para',
    'healthy': 'saudável',
    'delicious': 'deliciosa',
    'nutritious': 'nutritiva',
    'protein': 'proteína',
    'low carb': 'baixo carboidrato',
    'high protein': 'rica em proteína',
    'breakfast': 'café da manhã',
    'lunch': 'almoço',
    'dinner': 'jantar',
    'snack': 'lanche',
    'meal': 'refeição',
    'dish': 'prato',
    'recipe': 'receita',
    'ingredients': 'ingredientes',
    'minutes': 'minutos',
    'easy': 'fácil',
    'quick': 'rápida',
    'simple': 'simples',
    'and': 'e',
    'the': 'o',
    'a': 'uma',
    'an': 'um'
  };

  let translatedDescription = cleanSummary;
  
  // Aplicar traduções em ordem de prioridade (frases maiores primeiro)
  const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
  
  sortedTranslations.forEach(([english, portuguese]) => {
    const regex = new RegExp(`\\b${english}\\b`, 'gi');
    translatedDescription = translatedDescription.replace(regex, portuguese);
  });

  // Limitar tamanho e adicionar reticências
  if (translatedDescription.length > 200) {
    translatedDescription = translatedDescription.substring(0, 200) + '...';
  }

  return translatedDescription || 'Receita deliciosa e nutritiva, perfeita para uma alimentação saudável.';
};

const translateInstructions = (instructions: string): string[] => {
  if (!instructions) {
    return [
      'Prepare todos os ingredientes conforme indicado.',
      'Siga as técnicas de preparo adequadas para cada ingrediente.',
      'Combine os ingredientes de acordo com a receita.',
      'Cozinhe pelo tempo necessário até atingir o ponto ideal.',
      'Sirva quente e aproveite!'
    ];
  }

  // Remove HTML tags e divide em passos
  const cleanInstructions = instructions.replace(/<[^>]*>/g, '');
  const steps = cleanInstructions.split(/[.!]/).filter(s => s.trim().length > 10);

  // Traduções básicas para instruções
  const translations: Record<string, string> = {
    // Ações de cozinha
    'wash your': 'lave seu',
    'bring to': 'leve para',
    'medium': 'médio',
    'very little water': 'muito pouca água',
    'as you are still going to': 'pois você ainda vai',
    'once the': 'quando o',
    'is slightly soft': 'estiver ligeiramente macio',
    'initial water has dried up': 'água inicial tiver secado',
    'reduce the': 'reduza a',
    'pour in the': 'despeje o',
    'till the': 'até que o',
    'is all absorbed': 'seja todo absorvido',
    'has dried up': 'tenha secado',
    'if freshly made will have': 'se feito na hora terá',
    'some oil from': 'um pouco de óleo do',
    'so your': 'então seu',
    'does not need': 'não precisa de',
    'increase the': 'aumente o',
    'and': 'e',
    'in the': 'no',
    'finally': 'finalmente',
    'in your': 'no seu',
    'and serve warm': 'e sirva quente',
    'with any': 'com qualquer',
    'of your choice': 'de sua escolha',
    'but it\'s up to you': 'mas fica a seu critério',
    
    // Verbos básicos
    'heat': 'aqueça',
    'cook': 'cozinhe',
    'cozinhe': 'cozinhe',
    'bake': 'asse',
    'grill': 'grelhe',
    'fry': 'frite',
    'boil': 'ferva',
    'simmer': 'deixe ferver em fogo baixo',
    'mix': 'misture',
    'mexa': 'mexa',
    'stir': 'mexa',
    'add': 'adicione',
    'adicione': 'adicione',
    'season': 'tempere',
    'serve': 'sirva',
    'garnish': 'decore',
    'chop': 'pique',
    'chopped': 'picado',
    'slice': 'fatie',
    'dice': 'corte em cubos',
    'mince': 'pique finamente',
    'preheat': 'pré-aqueça',
    'wash': 'lave',
    'bring': 'leve',
    'reduce': 'reduza',
    'pour': 'despeje',
    'increase': 'aumente',
    
    // Substantivos
    'oven': 'forno',
    'pan': 'frigideira',
    'pot': 'panela',
    'bowl': 'tigela',
    'rice': 'arroz',
    'chicken stock': 'caldo de frango',
    'vegetables': 'vegetais',
    'pepper': 'pimenta',
    'oil': 'óleo',
    'protein': 'proteína',
    
    // Adjetivos e advérbios
    'minutes': 'minutos',
    'until': 'até',
    'golden': 'dourado',
    'tender': 'macio',
    'hot': 'quente',
    'cold': 'frio',
    'soft': 'macio',
    'warm': 'quente',
    'freshly': 'fresco',
    'little': 'pouco',
    'slightly': 'ligeiramente'
  };

  const translatedSteps = steps.map(step => {
    let translatedStep = step.trim();
    
    // Aplicar traduções em ordem de prioridade (frases maiores primeiro)
    const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
    
    sortedTranslations.forEach(([english, portuguese]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedStep = translatedStep.replace(regex, portuguese);
    });

    // Capitalizar primeira letra
    return translatedStep.charAt(0).toUpperCase() + translatedStep.slice(1) + '.';
  });

  return translatedSteps.length > 0 ? translatedSteps : [
    'Prepare todos os ingredientes conforme indicado.',
    'Siga as técnicas de preparo adequadas.',
    'Sirva e aproveite!'
  ];
};

const translateIngredients = (ingredients: any[]): Array<{name: string, amount: string}> => {
  const translations: Record<string, string> = {
    // Proteínas
    'chicken breast': 'peito de frango',
    'chicken': 'frango',
    'chicken stock': 'caldo de frango',
    'beef': 'carne bovina',
    'ground beef': 'carne moída',
    'salmon': 'salmão',
    'tuna': 'atum',
    'eggs': 'ovos',
    'egg': 'ovo',
    
    // Laticínios
    'milk': 'leite',
    'cheese': 'queijo',
    'yogurt': 'iogurte',
    'butter': 'manteiga',
    
    // Óleos e gorduras
    'olive oil': 'azeite de oliva',
    'oil': 'óleo',
    
    // Carboidratos
    'rice': 'arroz',
    'brown rice': 'arroz integral',
    'quinoa': 'quinoa',
    'oats': 'aveia',
    'bread': 'pão',
    'pasta': 'macarrão',
    
    // Vegetais
    'potato': 'batata',
    'sweet potato': 'batata doce',
    'onion': 'cebola',
    'garlic': 'alho',
    'tomato': 'tomate',
    'carrot': 'cenoura',
    'broccoli': 'brócolis',
    'spinach': 'espinafre',
    'lettuce': 'alface',
    'bell pepper': 'pimentão',
    'pepper': 'pimenta',
    'scotch bonnet pepper': 'pimenta scotch bonnet',
    'cucumber': 'pepino',
    'vegetables': 'vegetais',
    'chopped vegetables': 'vegetais picados',
    
    // Frutas
    'avocado': 'abacate',
    'banana': 'banana',
    'mango': 'manga',
    'mango cubed': 'manga em cubos',
    'slices of mango': 'fatias de manga',
    'apple': 'maçã',
    'berries': 'frutas vermelhas',
    'strawberries': 'morangos',
    'blueberries': 'mirtilos',
    'lemon': 'limão',
    'lime': 'lima',
    
    // Temperos e condimentos
    'salt': 'sal',
    'pepper': 'pimenta',
    'black pepper': 'pimenta preta',
    'paprika': 'páprica',
    'cumin': 'cominho',
    'oregano': 'orégano',
    'basil': 'manjericão',
    'parsley': 'salsa',
    'cilantro': 'coentro',
    'thyme': 'tomilho',
    'rosemary': 'alecrim',
    'ginger': 'gengibre',
    'seasoning cubes': 'cubos de tempero',
    'seasoning': 'tempero',
    
    // Doces e adoçantes
    'honey': 'mel',
    'sugar': 'açúcar',
    
    // Farinhas e fermentos
    'flour': 'farinha',
    'baking powder': 'fermento em pó',
    'vanilla': 'baunilha',
    'cinnamon': 'canela',
    
    // Nozes e sementes
    'nuts': 'nozes',
    'almonds': 'amêndoas',
    'walnuts': 'nozes',
    'cashews': 'castanha de caju',
    'peanuts': 'amendoim',
    
    // Leguminosas
    'beans': 'feijão',
    'black beans': 'feijão preto',
    'chickpeas': 'grão de bico',
    'lentils': 'lentilhas',
    
    // Medidas
    'cups': 'xícaras',
    'cup': 'xícara',
    'slices': 'fatias',
    'cubed': 'em cubos',
    'chopped': 'picado',
    'of': 'de'
  };

  return ingredients.map(ing => {
    let translatedName = ing.name.toLowerCase();
    
    // Aplicar traduções em ordem de prioridade (frases maiores primeiro)
    const sortedTranslations = Object.entries(translations).sort((a, b) => b[0].length - a[0].length);
    
    sortedTranslations.forEach(([english, portuguese]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedName = translatedName.replace(regex, portuguese);
    });

    // Capitalizar primeira letra
    translatedName = translatedName.charAt(0).toUpperCase() + translatedName.slice(1);

    // Traduzir também a quantidade/medida
    let translatedAmount = ing.original || `${ing.amount} ${ing.unit || ''}`;
    
    const measureTranslations: Record<string, string> = {
      'cups': 'xícaras',
      'cup': 'xícara',
      'slices': 'fatias',
      'cubed': 'em cubos',
      'chopped': 'picado',
      'of': 'de'
    };
    
    Object.entries(measureTranslations).forEach(([english, portuguese]) => {
      const regex = new RegExp(`\\b${english}\\b`, 'gi');
      translatedAmount = translatedAmount.replace(regex, portuguese);
    });
    return {
      name: translatedName,
      amount: translatedAmount
    };
  });
};

const translateTags = (tags: string[]): string[] => {
  const translations: Record<string, string> = {
    'high-protein': 'rica em proteína',
    'ketogenic': 'cetogênica',
    'keto': 'cetogênica',
    'paleo': 'paleo',
    'vegetarian': 'vegetariana',
    'vegan': 'vegana',
    'gluten-free': 'sem glúten',
    'dairy-free': 'sem lactose',
    'low-carb': 'low carb',
    'healthy': 'saudável',
    'breakfast': 'café da manhã',
    'lunch': 'almoço',
    'dinner': 'jantar',
    'snack': 'lanche',
    'appetizer': 'aperitivo',
    'dessert': 'sobremesa',
    'main course': 'prato principal',
    'side dish': 'acompanhamento',
    'salad': 'salada',
    'soup': 'sopa',
    'american': 'americana',
    'italian': 'italiana',
    'mexican': 'mexicana',
    'asian': 'asiática',
    'mediterranean': 'mediterrânea',
    'quick': 'rápida',
    'easy': 'fácil',
    'comfort food': 'comida caseira'
  };

  return tags.map(tag => {
    const lowerTag = tag.toLowerCase();
    return translations[lowerTag] || tag;
  }).filter(tag => tag.length > 0);
};

// Receitas mock para fallback
const getMockRecipes = (params: RecipeSearchParams): APIRecipe[] => {
  const mockRecipes = [
    {
      id: 1001,
      title: 'Frango Grelhado com Batata Doce',
      image: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg',
      imageType: 'jpg',
      nutrition: {
        nutrients: [
          { name: 'Calories', amount: 420, unit: 'kcal' },
          { name: 'Protein', amount: 35, unit: 'g' },
          { name: 'Carbohydrates', amount: 30, unit: 'g' },
          { name: 'Fat', amount: 15, unit: 'g' }
        ]
      },
      readyInMinutes: 25,
      servings: 1,
      summary: 'Refeição completa e balanceada, perfeita para pós-treino.',
      instructions: 'Tempere o frango e grelhe por 8 minutos de cada lado. Asse a batata doce por 20 minutos.',
      extendedIngredients: [
        { name: 'Peito de frango', amount: 150, unit: 'g', original: '150g de peito de frango' },
        { name: 'Batata doce', amount: 200, unit: 'g', original: '200g de batata doce' }
      ],
      diets: ['high-protein'],
      dishTypes: ['lunch', 'dinner'],
      cuisines: ['brazilian'],
      occasions: ['post-workout']
    },
    {
      id: 1002,
      title: 'Smoothie Proteico de Frutas Vermelhas',
      image: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg',
      imageType: 'jpg',
      nutrition: {
        nutrients: [
          { name: 'Calories', amount: 280, unit: 'kcal' },
          { name: 'Protein', amount: 25, unit: 'g' },
          { name: 'Carbohydrates', amount: 35, unit: 'g' },
          { name: 'Fat', amount: 5, unit: 'g' }
        ]
      },
      readyInMinutes: 5,
      servings: 1,
      summary: 'Smoothie refrescante rico em antioxidantes e proteínas.',
      instructions: 'Bata todos os ingredientes no liquidificador até ficar homogêneo.',
      extendedIngredients: [
        { name: 'Whey protein', amount: 30, unit: 'g', original: '1 scoop de whey protein' },
        { name: 'Frutas vermelhas', amount: 100, unit: 'g', original: '100g de frutas vermelhas' },
        { name: 'Leite desnatado', amount: 200, unit: 'ml', original: '200ml de leite desnatado' }
      ],
      diets: ['high-protein', 'gluten-free'],
      dishTypes: ['breakfast', 'snack'],
      cuisines: [],
      occasions: ['pre-workout', 'post-workout']
    },
    {
      id: 1003,
      title: 'Salada de Quinoa com Legumes',
      image: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg',
      imageType: 'jpg',
      nutrition: {
        nutrients: [
          { name: 'Calories', amount: 350, unit: 'kcal' },
          { name: 'Protein', amount: 15, unit: 'g' },
          { name: 'Carbohydrates', amount: 45, unit: 'g' },
          { name: 'Fat', amount: 12, unit: 'g' }
        ]
      },
      readyInMinutes: 20,
      servings: 1,
      summary: 'Salada nutritiva e colorida, rica em fibras e proteínas vegetais.',
      instructions: 'Cozinhe a quinoa, corte os legumes e misture com temperos.',
      extendedIngredients: [
        { name: 'Quinoa', amount: 80, unit: 'g', original: '80g de quinoa' },
        { name: 'Mix de legumes', amount: 150, unit: 'g', original: '150g de mix de legumes' },
        { name: 'Azeite de oliva', amount: 15, unit: 'ml', original: '1 colher de sopa de azeite' }
      ],
      diets: ['vegetarian', 'vegan', 'gluten-free'],
      dishTypes: ['lunch', 'dinner', 'salad'],
      cuisines: ['mediterranean'],
      occasions: ['healthy']
    }
  ];

  // Filtrar baseado nos parâmetros
  return mockRecipes.filter(recipe => {
    if (params.query && !recipe.title.toLowerCase().includes(params.query.toLowerCase())) {
      return false;
    }
    if (params.diet && !recipe.diets.includes(params.diet)) {
      return false;
    }
    if (params.maxReadyTime && recipe.readyInMinutes > params.maxReadyTime) {
      return false;
    }
    return true;
  });
};

// Categorias de dieta disponíveis
export const dietCategories = [
  { id: 'high-protein', name: 'Rica em Proteína', description: 'Receitas com alto teor proteico' },
  { id: 'ketogenic', name: 'Cetogênica', description: 'Baixo carboidrato, alta gordura' },
  { id: 'paleo', name: 'Paleo', description: 'Baseada em alimentos naturais' },
  { id: 'vegetarian', name: 'Vegetariana', description: 'Sem carne' },
  { id: 'vegan', name: 'Vegana', description: 'Sem produtos animais' },
  { id: 'gluten-free', name: 'Sem Glúten', description: 'Para intolerantes ao glúten' },
  { id: 'dairy-free', name: 'Sem Lactose', description: 'Para intolerantes à lactose' }
];

// Tipos de refeição
export const mealTypes = [
  { id: 'breakfast', name: 'Café da Manhã' },
  { id: 'lunch', name: 'Almoço' },
  { id: 'dinner', name: 'Jantar' },
  { id: 'snack', name: 'Lanche' },
  { id: 'appetizer', name: 'Aperitivo' },
  { id: 'dessert', name: 'Sobremesa' }
];