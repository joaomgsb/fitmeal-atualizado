export interface Recipe {
  id: string;
  title: string;
  imageUrl: string;
  category: 'pre-treino' | 'pos-treino' | 'low-carb' | 'proteica' | 'cafe-da-manha' | 'snack' | 'almoco' | 'jantar';
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  difficulty: 'fácil' | 'médio' | 'difícil';
  description: string;
  tags: string[];
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  instructions: string[];
  rating: number; // 1-5
  reviews: number;
  isFavorite?: boolean;
}

// Receitas originais mantidas
export const featuredRecipes: Recipe[] = [
  {
    id: '1',
    title: 'Bowl de Frango com Quinoa',
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'almoco',
    prepTime: 10,
    cookTime: 20,
    servings: 1,
    calories: 450,
    protein: 40,
    carbs: 35,
    fat: 15,
    difficulty: 'fácil',
    description: 'Bowl proteico perfeito para pós-treino com frango grelhado, quinoa e legumes.',
    tags: ['proteína', 'pós-treino', 'completo'],
    ingredients: [
      { name: 'Peito de frango', amount: '150g' },
      { name: 'Quinoa', amount: '50g' },
      { name: 'Brócolis', amount: '80g' },
      { name: 'Cenoura', amount: '1 média' },
      { name: 'Azeite de oliva', amount: '1 colher de sopa' },
      { name: 'Limão', amount: '1/2 unidade' },
      { name: 'Sal e pimenta', amount: 'a gosto' }
    ],
    instructions: [
      'Cozinhe a quinoa em água de acordo com as instruções da embalagem.',
      'Tempere o peito de frango com sal, pimenta e suco de limão.',
      'Grelhe o frango em uma frigideira com um pouco de azeite até ficar dourado.',
      'Cozinhe o brócolis no vapor por 5 minutos.',
      'Rale a cenoura.',
      'Monte o bowl com a quinoa na base, acrescente o frango fatiado, brócolis e cenoura.',
      'Regue com azeite e finalize com pimenta se desejar.'
    ],
    rating: 4.8,
    reviews: 35
  },
  {
    id: '2',
    title: 'Smoothie Proteico de Frutas',
    imageUrl: 'https://images.pexels.com/photos/775031/pexels-photo-775031.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'pos-treino',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 320,
    protein: 30,
    carbs: 40,
    fat: 5,
    difficulty: 'fácil',
    description: 'Smoothie rápido e nutritivo, ideal para reposição pós-treino.',
    tags: ['proteína', 'pós-treino', 'rápido'],
    ingredients: [
      { name: 'Whey protein', amount: '1 scoop' },
      { name: 'Banana', amount: '1 unidade' },
      { name: 'Morango', amount: '5 unidades' },
      { name: 'Espinafre', amount: '1 punhado' },
      { name: 'Leite desnatado', amount: '200ml' },
      { name: 'Gelo', amount: 'a gosto' }
    ],
    instructions: [
      'Adicione todos os ingredientes no liquidificador.',
      'Bata até obter uma mistura homogênea.',
      'Ajuste a consistência com água ou gelo se necessário.',
      'Sirva imediatamente.'
    ],
    rating: 4.5,
    reviews: 28
  },
  {
    id: '3',
    title: 'Omelete de Claras com Vegetais',
    imageUrl: 'https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=1498&auto=format&fit=crop',
    category: 'cafe-da-manha',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    calories: 250,
    protein: 25,
    carbs: 10,
    fat: 12,
    difficulty: 'fácil',
    description: 'Omelete proteico baixo em carboidratos, perfeito para início do dia.',
    tags: ['proteína', 'low-carb', 'café da manhã'],
    ingredients: [
      { name: 'Claras de ovo', amount: '4 unidades' },
      { name: 'Espinafre', amount: '1/2 xícara' },
      { name: 'Tomate cereja', amount: '5 unidades' },
      { name: 'Cebola roxa', amount: '1/4 unidade' },
      { name: 'Queijo cottage', amount: '2 colheres de sopa' },
      { name: 'Azeite', amount: '1/2 colher de chá' },
      { name: 'Sal e pimenta', amount: 'a gosto' }
    ],
    instructions: [
      'Bata as claras com um garfo e tempere com sal e pimenta.',
      'Pique os vegetais em pedaços pequenos.',
      'Aqueça uma frigideira antiaderente com o azeite.',
      'Despeje as claras e cozinhe em fogo médio por 2 minutos.',
      'Adicione os vegetais e o queijo cottage por cima.',
      'Continue cozinhando até as claras estarem firmes.',
      'Dobre ao meio e sirva quente.'
    ],
    rating: 4.6,
    reviews: 42
  },
  {
    id: '4',
    title: 'Wrap de Frango e Abacate',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=1470&auto=format&fit=crop',
    category: 'almoco',
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    calories: 420,
    protein: 35,
    carbs: 30,
    fat: 20,
    difficulty: 'fácil',
    description: 'Wrap proteico equilibrado, perfeito para almoços rápidos e nutritivos.',
    tags: ['proteína', 'almoço', 'rápido'],
    ingredients: [
      { name: 'Peito de frango', amount: '120g' },
      { name: 'Tortilha integral', amount: '1 unidade' },
      { name: 'Abacate', amount: '1/2 unidade' },
      { name: 'Alface', amount: '2 folhas' },
      { name: 'Tomate', amount: '1/2 unidade' },
      { name: 'Queijo cottage', amount: '2 colheres de sopa' },
      { name: 'Limão', amount: '1/2 unidade' },
      { name: 'Sal e pimenta', amount: 'a gosto' }
    ],
    instructions: [
      'Tempere o frango com sal, pimenta e suco de limão.',
      'Grelhe o frango até ficar dourado e cozido por completo.',
      'Desfie o frango em pedaços pequenos.',
      'Amasse o abacate com um garfo e tempere com limão e sal.',
      'Aqueça levemente a tortilha.',
      'Espalhe o abacate amassado na tortilha.',
      'Adicione o frango desfiado, alface, tomate e queijo cottage.',
      'Enrole firmemente e corte ao meio para servir.'
    ],
    rating: 4.7,
    reviews: 31
  }
];

// Coleção expandida de receitas fitness
export const expandedRecipes: Recipe[] = [
  ...featuredRecipes,
  // Receitas de Café da Manhã
  {
    id: '101',
    title: 'Panquecas de Aveia e Banana',
    imageUrl: 'https://images.pexels.com/photos/357573/pexels-photo-357573.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'cafe-da-manha',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    calories: 280,
    protein: 18,
    carbs: 35,
    fat: 8,
    difficulty: 'fácil',
    description: 'Panquecas saudáveis e proteicas feitas com ingredientes naturais.',
    tags: ['proteína', 'natural', 'sem açúcar'],
    ingredients: [
      { name: 'Aveia em flocos', amount: '1/2 xícara' },
      { name: 'Banana madura', amount: '1 unidade' },
      { name: 'Ovos', amount: '2 unidades' },
      { name: 'Whey protein', amount: '1 scoop' },
      { name: 'Canela', amount: '1 colher de chá' },
      { name: 'Óleo de coco', amount: '1 colher de chá' }
    ],
    instructions: [
      'Amasse a banana em uma tigela.',
      'Adicione os ovos e misture bem.',
      'Acrescente a aveia, whey protein e canela.',
      'Misture até formar uma massa homogênea.',
      'Aqueça uma frigideira com óleo de coco.',
      'Despeje porções da massa e cozinhe até dourar.',
      'Vire e cozinhe do outro lado.',
      'Sirva com frutas frescas.'
    ],
    rating: 4.7,
    reviews: 89
  },
  {
    id: '102',
    title: 'Overnight Oats Proteico',
    imageUrl: 'https://images.pexels.com/photos/1099680/pexels-photo-1099680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'cafe-da-manha',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 350,
    protein: 25,
    carbs: 40,
    fat: 10,
    difficulty: 'fácil',
    description: 'Café da manhã prático preparado na noite anterior.',
    tags: ['prep meal', 'proteína', 'pratico'],
    ingredients: [
      { name: 'Aveia em flocos', amount: '1/2 xícara' },
      { name: 'Whey protein', amount: '1 scoop' },
      { name: 'Iogurte grego', amount: '1/2 xícara' },
      { name: 'Leite de amêndoas', amount: '1/2 xícara' },
      { name: 'Chia', amount: '1 colher de sopa' },
      { name: 'Frutas vermelhas', amount: '1/4 xícara' },
      { name: 'Mel', amount: '1 colher de chá' }
    ],
    instructions: [
      'Misture aveia, whey protein e chia em um pote.',
      'Adicione iogurte grego e leite de amêndoas.',
      'Misture bem todos os ingredientes.',
      'Tampe e deixe na geladeira durante a noite.',
      'Pela manhã, adicione frutas vermelhas e mel.',
      'Misture e sirva.'
    ],
    rating: 4.8,
    reviews: 156
  },
  // Receitas Pré-Treino
  {
    id: '201',
    title: 'Toast de Batata Doce com Pasta de Amendoim',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'pre-treino',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    calories: 320,
    protein: 12,
    carbs: 45,
    fat: 12,
    difficulty: 'fácil',
    description: 'Energia sustentável para treinos intensos.',
    tags: ['energia', 'carboidrato', 'pré-treino'],
    ingredients: [
      { name: 'Batata doce', amount: '1 média' },
      { name: 'Pasta de amendoim natural', amount: '2 colheres de sopa' },
      { name: 'Banana', amount: '1/2 unidade' },
      { name: 'Canela', amount: 'a gosto' },
      { name: 'Mel', amount: '1 colher de chá' }
    ],
    instructions: [
      'Corte a batata doce em fatias de 1cm.',
      'Asse no forno ou torradeira até ficar macia.',
      'Espalhe a pasta de amendoim sobre as fatias.',
      'Adicione rodelas de banana por cima.',
      'Polvilhe canela e regue com mel.',
      'Sirva imediatamente.'
    ],
    rating: 4.6,
    reviews: 73
  },
  {
    id: '202',
    title: 'Smoothie Energético de Açaí',
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'pre-treino',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    calories: 380,
    protein: 15,
    carbs: 55,
    fat: 12,
    difficulty: 'fácil',
    description: 'Smoothie antioxidante para energia e performance.',
    tags: ['antioxidante', 'energia', 'natural'],
    ingredients: [
      { name: 'Polpa de açaí', amount: '100g' },
      { name: 'Banana', amount: '1 unidade' },
      { name: 'Aveia', amount: '2 colheres de sopa' },
      { name: 'Leite de coco', amount: '200ml' },
      { name: 'Mel', amount: '1 colher de sopa' },
      { name: 'Gelo', amount: 'a gosto' }
    ],
    instructions: [
      'Adicione todos os ingredientes no liquidificador.',
      'Bata até obter consistência cremosa.',
      'Ajuste doçura com mel se necessário.',
      'Sirva imediatamente em copo gelado.'
    ],
    rating: 4.9,
    reviews: 124
  },
  // Receitas Pós-Treino
  {
    id: '301',
    title: 'Shake de Chocolate com Banana',
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'pos-treino',
    prepTime: 3,
    cookTime: 0,
    servings: 1,
    calories: 290,
    protein: 35,
    carbs: 30,
    fat: 3,
    difficulty: 'fácil',
    description: 'Recuperação muscular rápida e saborosa.',
    tags: ['recuperação', 'proteína', 'rápido'],
    ingredients: [
      { name: 'Whey protein chocolate', amount: '1 scoop' },
      { name: 'Banana', amount: '1 unidade' },
      { name: 'Leite desnatado', amount: '300ml' },
      { name: 'Cacau em pó', amount: '1 colher de chá' },
      { name: 'Gelo', amount: '5 cubos' }
    ],
    instructions: [
      'Adicione todos os ingredientes no liquidificador.',
      'Bata por 30 segundos até ficar homogêneo.',
      'Sirva imediatamente após o treino.'
    ],
    rating: 4.7,
    reviews: 98
  },
  // Receitas Low-Carb
  {
    id: '401',
    title: 'Salmão Grelhado com Aspargos',
    imageUrl: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'low-carb',
    prepTime: 10,
    cookTime: 15,
    servings: 1,
    calories: 420,
    protein: 38,
    carbs: 8,
    fat: 26,
    difficulty: 'médio',
    description: 'Refeição rica em ômega-3 e baixa em carboidratos.',
    tags: ['ômega-3', 'low-carb', 'gourmet'],
    ingredients: [
      { name: 'Filé de salmão', amount: '180g' },
      { name: 'Aspargos', amount: '200g' },
      { name: 'Azeite de oliva', amount: '2 colheres de sopa' },
      { name: 'Limão', amount: '1 unidade' },
      { name: 'Alho', amount: '2 dentes' },
      { name: 'Ervas finas', amount: 'a gosto' },
      { name: 'Sal e pimenta', amount: 'a gosto' }
    ],
    instructions: [
      'Tempere o salmão com sal, pimenta e suco de limão.',
      'Corte os aspargos e tempere com alho picado.',
      'Aqueça uma frigideira com azeite.',
      'Grelhe o salmão por 4 minutos de cada lado.',
      'Na mesma frigideira, refogue os aspargos.',
      'Finalize com ervas finas e sirva.'
    ],
    rating: 4.8,
    reviews: 67
  },
  // Receitas Proteicas
  {
    id: '501',
    title: 'Hambúrguer de Frango Fit',
    imageUrl: 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'proteica',
    prepTime: 15,
    cookTime: 12,
    servings: 2,
    calories: 380,
    protein: 42,
    carbs: 25,
    fat: 12,
    difficulty: 'médio',
    description: 'Hambúrguer caseiro rico em proteínas e sabor.',
    tags: ['proteína', 'caseiro', 'saudável'],
    ingredients: [
      { name: 'Peito de frango moído', amount: '300g' },
      { name: 'Aveia em flocos', amount: '3 colheres de sopa' },
      { name: 'Ovo', amount: '1 unidade' },
      { name: 'Cebola', amount: '1/2 unidade' },
      { name: 'Alho', amount: '2 dentes' },
      { name: 'Pão integral', amount: '2 unidades' },
      { name: 'Alface', amount: '4 folhas' },
      { name: 'Tomate', amount: '1 unidade' }
    ],
    instructions: [
      'Misture o frango moído com aveia, ovo, cebola e alho picados.',
      'Tempere com sal e pimenta.',
      'Forme 2 hambúrgueres com a mistura.',
      'Grelhe em frigideira por 6 minutos de cada lado.',
      'Torre levemente os pães.',
      'Monte o hambúrguer com alface e tomate.',
      'Sirva imediatamente.'
    ],
    rating: 4.6,
    reviews: 112
  },
  // Receitas de Snack
  {
    id: '601',
    title: 'Bolinha de Tâmara com Castanhas',
    imageUrl: 'https://images.pexels.com/photos/1092730/pexels-photo-1092730.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'snack',
    prepTime: 15,
    cookTime: 0,
    servings: 8,
    calories: 120,
    protein: 4,
    carbs: 18,
    fat: 5,
    difficulty: 'fácil',
    description: 'Snack natural e energético sem açúcar adicionado.',
    tags: ['natural', 'sem açúcar', 'energia'],
    ingredients: [
      { name: 'Tâmaras sem caroço', amount: '200g' },
      { name: 'Castanha do Pará', amount: '100g' },
      { name: 'Amêndoas', amount: '50g' },
      { name: 'Cacau em pó', amount: '2 colheres de sopa' },
      { name: 'Coco ralado', amount: '3 colheres de sopa' }
    ],
    instructions: [
      'Deixe as tâmaras de molho por 10 minutos.',
      'Processe as castanhas até formar uma farinha.',
      'Adicione as tâmaras e processe até formar uma pasta.',
      'Acrescente cacau em pó e misture.',
      'Forme bolinhas com as mãos.',
      'Passe no coco ralado.',
      'Leve à geladeira por 30 minutos.'
    ],
    rating: 4.5,
    reviews: 89
  },
  // Receitas de Almoço
  {
    id: '701',
    title: 'Poke Bowl de Atum',
    imageUrl: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'almoco',
    prepTime: 20,
    cookTime: 15,
    servings: 1,
    calories: 480,
    protein: 35,
    carbs: 45,
    fat: 18,
    difficulty: 'médio',
    description: 'Bowl hawaiano nutritivo e colorido.',
    tags: ['completo', 'colorido', 'saudável'],
    ingredients: [
      { name: 'Atum fresco', amount: '150g' },
      { name: 'Arroz integral', amount: '1/2 xícara' },
      { name: 'Abacate', amount: '1/2 unidade' },
      { name: 'Pepino', amount: '1/2 unidade' },
      { name: 'Cenoura', amount: '1 pequena' },
      { name: 'Edamame', amount: '1/4 xícara' },
      { name: 'Molho shoyu', amount: '2 colheres de sopa' },
      { name: 'Gergelim', amount: '1 colher de chá' }
    ],
    instructions: [
      'Cozinhe o arroz integral conforme instruções.',
      'Corte o atum em cubos e tempere com shoyu.',
      'Corte o abacate, pepino e cenoura em fatias.',
      'Monte o bowl com arroz na base.',
      'Distribua os ingredientes coloridamente.',
      'Finalize com gergelim e molho shoyu.'
    ],
    rating: 4.9,
    reviews: 145
  },
  // Receitas de Jantar
  {
    id: '801',
    title: 'Peito de Peru com Batata Doce Assada',
    imageUrl: 'https://images.pexels.com/photos/1640771/pexels-photo-1640771.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    category: 'jantar',
    prepTime: 15,
    cookTime: 35,
    servings: 1,
    calories: 420,
    protein: 38,
    carbs: 35,
    fat: 12,
    difficulty: 'médio',
    description: 'Jantar completo e reconfortante.',
    tags: ['completo', 'reconfortante', 'assado'],
    ingredients: [
      { name: 'Peito de peru', amount: '180g' },
      { name: 'Batata doce', amount: '200g' },
      { name: 'Brócolis', amount: '150g' },
      { name: 'Azeite de oliva', amount: '2 colheres de sopa' },
      { name: 'Alecrim', amount: '2 ramos' },
      { name: 'Alho', amount: '3 dentes' },
      { name: 'Sal e pimenta', amount: 'a gosto' }
    ],
    instructions: [
      'Pré-aqueça o forno a 200°C.',
      'Corte a batata doce em fatias grossas.',
      'Tempere o peru com sal, pimenta e alho.',
      'Coloque tudo em uma assadeira com azeite.',
      'Asse por 25 minutos.',
      'Adicione o brócolis e asse por mais 10 minutos.',
      'Finalize com alecrim e sirva.'
    ],
    rating: 4.7,
    reviews: 78
  }
];

// Função para buscar receitas (agora inclui as expandidas)
export const allRecipes: Recipe[] = expandedRecipes;

// Função para buscar receitas por categoria
export const getRecipesByCategory = (category: string): Recipe[] => {
  return allRecipes.filter(recipe => recipe.category === category);
};

// Função para buscar receitas por tags
export const getRecipesByTags = (tags: string[]): Recipe[] => {
  return allRecipes.filter(recipe => 
    tags.some(tag => recipe.tags.includes(tag))
  );
};

// Função para buscar receitas por macronutrientes
export const getRecipesByMacros = (minProtein?: number, maxCarbs?: number, maxCalories?: number): Recipe[] => {
  return allRecipes.filter(recipe => {
    if (minProtein && recipe.protein < minProtein) return false;
    if (maxCarbs && recipe.carbs > maxCarbs) return false;
    if (maxCalories && recipe.calories > maxCalories) return false;
    return true;
  });
};