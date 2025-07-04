import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { 
  Clock, Flame, Beef, Wheat, Droplet, Heart, ChevronLeft,
  Share2, Printer, Users, Star, ExternalLink
} from 'lucide-react';
import { useRecipe, useRecipes } from '../hooks/useRecipes';
import { toast } from 'react-hot-toast';

const RecipeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { recipe, loading, error } = useRecipe(id || '');
  const { recipes: similarRecipes } = useRecipes({ 
    category: recipe?.category, 
    limit: 4 
  });
  
  const [servings, setServings] = useState(recipe?.servings || 1);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<number>>(new Set());
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    if (recipe) {
      setServings(recipe.servings);
    }
  }, [recipe]);
  
  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const addToShoppingList = () => {
    if (!recipe) return;
    
    const currentList = JSON.parse(localStorage.getItem('shopping-list') || '[]');
    const newItems = recipe.ingredients
      .filter((_, index) => selectedIngredients.has(index))
      .map(ingredient => ({
        id: Math.random().toString(36).substr(2, 9),
        name: ingredient.name,
        amount: ingredient.amount,
        checked: false,
        recipe: recipe.title
      }));
    
    if (newItems.length > 0) {
      localStorage.setItem('shopping-list', JSON.stringify([...currentList, ...newItems]));
      toast.success('Ingredientes selecionados adicionados à lista de compras!');
      setSelectedIngredients(new Set());
    } else {
      toast.error('Selecione pelo menos um ingrediente!');
    }
  };

  const toggleIngredient = (index: number) => {
    setSelectedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };
  
  if (error || !recipe) {
    return (
      <div className="pt-24 pb-16 container mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {error || 'Receita não encontrada'}
        </h1>
        <p className="mb-6">
          {error ? 'Ocorreu um erro ao carregar a receita.' : 'A receita que você está procurando não existe ou foi removida.'}
        </p>
        <Link 
          to="/receitas" 
          className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors"
        >
          <ChevronLeft size={18} className="mr-1" /> Voltar para receitas
        </Link>
      </div>
    );
  }
  
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center text-sm text-neutral-500">
            <Link to="/" className="hover:text-primary-500 transition-colors">Início</Link>
            <span className="mx-2">/</span>
            <Link to="/receitas" className="hover:text-primary-500 transition-colors">Receitas</Link>
            <span className="mx-2">/</span>
            <span className="text-neutral-800 font-medium">{recipe.title}</span>
          </nav>
        </div>
        
        {/* Recipe Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-primary-100 text-primary-800 text-sm font-medium rounded-full">
              {recipe.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold font-display mb-6">{recipe.title}</h1>
          
          <p className="text-neutral-600 text-lg mb-6">{recipe.description}</p>
          
          {/* Link para receita original se for do TudoGostoso */}
          {recipe.source === 'tudogostoso' && recipe.originalUrl && (
            <div className="mb-6">
              <a
                href={recipe.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 transition-colors"
              >
                <ExternalLink size={16} />
                Ver receita original no TudoGostoso
              </a>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8">
            {/* Recipe Image */}
            <div className="mb-10">
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title}
                className="w-full h-auto rounded-xl object-cover aspect-video"
              />
            </div>
            
            {/* Recipe Info Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-white p-4 rounded-lg border border-neutral-200 text-center">
                <Clock className="mx-auto text-primary-500 mb-2" size={24} />
                <p className="text-sm text-neutral-500">Tempo Total</p>
                <p className="font-semibold">{totalTime} min</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-neutral-200 text-center">
                <Flame className="mx-auto text-energy-500 mb-2" size={24} />
                <p className="text-sm text-neutral-500">Calorias</p>
                <p className="font-semibold">{recipe.calories} kcal</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-neutral-200 text-center">
                <Beef className="mx-auto text-red-500 mb-2" size={24} />
                <p className="text-sm text-neutral-500">Proteínas</p>
                <p className="font-semibold">{recipe.protein}g</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-neutral-200 text-center">
                <Users className="mx-auto text-blue-500 mb-2" size={24} />
                <p className="text-sm text-neutral-500">Porções</p>
                <p className="font-semibold">{recipe.servings}</p>
              </div>
            </div>
            
            {/* Macros */}
            <div className="mb-10">
              <h2 className="text-xl font-bold mb-4">Macronutrientes</h2>
              <div className="bg-white p-6 rounded-lg border border-neutral-200">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full" 
                        style={{ width: `${(recipe.protein / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Beef size={16} className="text-red-500" />
                      <span className="font-semibold">{recipe.protein}g</span>
                    </div>
                    <p className="text-sm text-neutral-500">Proteínas</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${(recipe.carbs / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Wheat size={16} className="text-yellow-500" />
                      <span className="font-semibold">{recipe.carbs}g</span>
                    </div>
                    <p className="text-sm text-neutral-500">Carboidratos</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(recipe.fat / (recipe.protein + recipe.carbs + recipe.fat)) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Droplet size={16} className="text-blue-500" />
                      <span className="font-semibold">{recipe.fat}g</span>
                    </div>
                    <p className="text-sm text-neutral-500">Gorduras</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Ingredients & Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-xl font-bold mb-4">Ingredientes</h2>
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-neutral-600">
                      Para <span className="font-medium">{servings}</span> {servings > 1 ? 'porções' : 'porção'}
                    </p>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => setServings(prev => Math.max(1, prev - 1))}
                        className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-700 hover:bg-neutral-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="mx-2 font-medium">{servings}</span>
                      <button 
                        onClick={() => setServings(prev => prev + 1)}
                        className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 hover:bg-primary-200 transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`ingredient-${index}`}
                          checked={selectedIngredients.has(index)}
                          onChange={() => toggleIngredient(index)}
                          className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                        />
                        <label htmlFor={`ingredient-${index}`} className="flex-grow">
                          <span className="font-medium">{ingredient.amount}</span> {ingredient.name}
                        </label>
                      </li>
                    ))}
                  </ul>
                  <button 
                    onClick={addToShoppingList}
                    className="mt-6 w-full py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                  >
                    Adicionar à Lista de Compras
                  </button>
                </div>
              </div>
              
              {/* Instructions */}
              <div>
                <h2 className="text-xl font-bold mb-4">Modo de Preparo</h2>
                <div className="bg-white p-6 rounded-lg border border-neutral-200">
                  <div className="flex items-center gap-3 text-sm text-neutral-500 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>Preparo: {recipe.prepTime} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Flame size={14} />
                      <span>Cozimento: {recipe.cookTime} min</span>
                    </div>
                  </div>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex gap-4">
                        <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex-shrink-0 flex items-center justify-center font-medium text-sm">
                          {index + 1}
                        </div>
                        <p className="flex-grow">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              {/* Nutrition Tips */}
              <div className="bg-primary-50 p-6 rounded-lg border border-primary-100 mb-6">
                <h3 className="text-lg font-bold text-primary-800 mb-3">Dicas Nutricionais</h3>
                <p className="text-primary-700 mb-4">
                  Esta receita é ideal para {recipe.category === 'pre-treino' ? 'consumo antes do treino, proporcionando energia sustentável' : recipe.category === 'pos-treino' ? 'recuperação muscular após o treino, com boa quantidade de proteínas' : 'sua dieta fitness, com boa distribuição de macronutrientes'}.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <p className="text-sm text-primary-700">Rica em proteínas para recuperação muscular</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <p className="text-sm text-primary-700">Carboidratos complexos para energia duradoura</p>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary-500 mt-1">•</span>
                    <p className="text-sm text-primary-700">Gorduras saudáveis para funções hormonais</p>
                  </li>
                </ul>
                <div className="mt-4">
                  <Link 
                    to="/planos" 
                    className="text-sm text-primary-600 font-medium hover:text-primary-700 transition-colors"
                  >
                    Ver planos alimentares relacionados →
                  </Link>
                </div>
              </div>
              
              {/* Similar Recipes */}
              <div>
                <h3 className="text-lg font-bold mb-4">Receitas Similares</h3>
                <div className="space-y-4">
                  {similarRecipes
                    .filter(r => r.id !== recipe.id)
                    .slice(0, 3)
                    .map(similarRecipe => (
                      <Link 
                        key={similarRecipe.id} 
                        to={`/receitas/${similarRecipe.id}`}
                        className="flex gap-3 group"
                      >
                        <img 
                          src={similarRecipe.imageUrl} 
                          alt={similarRecipe.title} 
                          className="w-20 h-20 object-cover rounded-md"
                        />
                        <div>
                          <h4 className="font-medium group-hover:text-primary-500 transition-colors">{similarRecipe.title}</h4>
                          <div className="flex items-center text-sm text-neutral-500 mt-1">
                            <Clock size={14} className="mr-1" />
                            <span>{similarRecipe.prepTime + similarRecipe.cookTime} min</span>
                            <span className="mx-2">•</span>
                            <Flame size={14} className="mr-1" />
                            <span>{similarRecipe.calories} kcal</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;