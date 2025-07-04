import React, { useState, useEffect } from 'react';
import { useProfile, UserProfile } from '../hooks/useProfile';
import PageTransition from '../components/PageTransition';
import { toast } from 'react-hot-toast';
import { generateRecipeSuggestions, RecipeSuggestion } from '../lib/openai';
// Precisaremos de um componente para exibir a receita, talvez o existente RecipeCard ou algo similar
// import RecipeCard from '../components/recipes/RecipeCard'; 

const SuggestedRecipesPage: React.FC = () => {
  const { profile, loading, error } = useProfile();
  const [suggestedRecipes, setSuggestedRecipes] = useState<RecipeSuggestion[]>([]); // Tipo provisório, definir interface depois
  const [generating, setGenerating] = useState(false);

  // Removemos o useEffect inicial para gerar automaticamente, agora é manual pelo botão

  // Função para gerar sugestões
  const handleGenerateSuggestions = async () => {
    if (generating || !profile) return;

    console.log('Iniciando geração de sugestões...'); // Log 1
    setGenerating(true);
    toast.loading('Gerando sugestões de receitas...', { id: 'generate-toast' });

    try {
      console.log('Chamando generateRecipeSuggestions com perfil:', profile); // Log 2
      const recipes = await generateRecipeSuggestions(profile as UserProfile); // Chamar a API de IA
      console.log('Resposta da generateRecipeSuggestions (recipes):', recipes); // Log 3

      if (recipes && recipes.recipes && recipes.recipes.length > 0) {
          console.log('Receitas recebidas. Atualizando estado...'); // Log 4
          console.log('Conteúdo de recipes ANTES de setSuggestedRecipes:', recipes); // NOVO LOG
          try {
            setSuggestedRecipes(recipes.recipes); // Corrigindo a atualização do estado
            console.log('Estado atualizado.'); // Log 5
            toast.success('Sugestões geradas!', { id: 'generate-toast' });
          } catch (renderError) {
             console.error('Erro durante ou após setSuggestedRecipes:', renderError); // NOVO LOG DE ERRO
             toast.error('Erro ao exibir sugestões.', { id: 'generate-toast' });
          }

      } else {
           console.log('API retornou lista de receitas vazia ou nula.'); // Log 6
           setSuggestedRecipes([]); // Limpa sugestões se a lista for vazia
           toast('Nenhuma sugestão encontrada com suas preferências.', { icon: '😕', id: 'generate-toast' });
      }


    } catch (err) {
      console.error('Erro no processamento da sugestão:', err); // Log 7
      toast.error('Erro ao gerar sugestões. Por favor, tente novamente.', { id: 'generate-toast' });
      setSuggestedRecipes([]); // Limpa sugestões em caso de erro
    } finally {
      console.log('Finalizando geração.'); // Log 8
      setGenerating(false);
    }
  };

  useEffect(() => {
    // Limpa as sugestões ao sair ou carregar um novo perfil/erro
    setSuggestedRecipes([]);
  }, [profile, error]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16 text-center">
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
     return (
      <div className="pt-24 pb-16 text-center">
        <p>Por favor, faça login para ver sugestões de receitas.</p>
        {/* Adicionar link para login */}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold font-display mb-8 text-center">Sugestões de Receitas</h1>

          {/* Botão para gerar/atualizar sugestões */}
          <div className="flex justify-center mb-8">
            <button
              onClick={handleGenerateSuggestions}
              disabled={generating}
              className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {generating ? 'Gerando...' : 'Gerar Sugestões Personalizadas'}
            </button>
          </div>

          {/* Lista de receitas sugeridas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suggestedRecipes.length > 0 ? (
              suggestedRecipes.map((recipe, index) => (
                <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-neutral-200 flex flex-col transform transition duration-300 hover:scale-105 hover:shadow-2xl">
                  {/* Podemos adicionar uma imagem de placeholder ou gerada pela IA aqui */}
                  {/* <div className="h-40 bg-gray-200 w-full flex items-center justify-center text-neutral-500">Imagem da Receita</div> */}
                  <div className="p-6 flex-grow">
                    <h3 className="text-2xl font-semibold text-neutral-800 mb-3 border-b border-neutral-200 pb-2">{recipe.title}</h3>
                    <p className="text-neutral-700 text-base mb-4 leading-relaxed">{recipe.description}</p>

                    {/* Macros em linha */}
                    <div className="flex items-center justify-around text-sm text-neutral-700 mb-4 p-3 bg-neutral-100 rounded-md">
                        <span className="flex flex-col items-center gap-1"><span className="font-bold text-neutral-800 text-base">{recipe.macros.calories}</span> kcal</span>
                        <span className="flex flex-col items-center gap-1"><span className="font-bold text-neutral-800 text-base">{recipe.macros.protein}</span>g P</span>
                        <span className="flex flex-col items-center gap-1"><span className="font-bold text-neutral-800 text-base">{recipe.macros.carbs}</span>g C</span>
                        <span className="flex flex-col items-center gap-1"><span className="font-bold text-neutral-800 text-base">{recipe.macros.fat}</span>g G</span>
                    </div>

                    {/* Tags */}
                    {recipe.tags && recipe.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 pt-4 border-t border-neutral-200">
                           {recipe.tags.map((tag, i) => (
                             <span key={i} className="px-3 py-1 bg-primary-100 text-primary-800 text-xs rounded-full font-medium">{tag}</span>
                           ))}
                        </div>
                    )}

                    {/* Ingredientes */}
                    <div className="mb-4 pt-4 border-t border-neutral-200">
                      <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Ingredientes:</h4>
                      <ul className="list-disc list-inside text-sm text-neutral-700 space-y-2">
                        {recipe.ingredients.map((ing, i) => (
                          <li key={i}><span className="font-medium text-neutral-800">{ing.amount}</span> de <span className="font-medium text-neutral-800">{ing.name}</span></li>
                        ))}
                      </ul>
                    </div>

                     {/* Modo de Preparo */}
                     <div className="pt-4 border-t border-neutral-200">
                      <h4 className="font-semibold text-neutral-800 mb-3 text-lg">Modo de Preparo:</h4>
                       <ol className="list-decimal list-inside text-sm text-neutral-700 space-y-2">
                         {recipe.instructions.map((inst, i) => (
                           <li key={i}>{inst}</li>
                         ))}
                       </ol>
                     </div>
                  </div>
                  {/* Botão de Ação - Opcional, dependendo do que você quer fazer com a receita (ex: ver detalhes, salvar) */}
                  {/* <div className="p-6 bg-neutral-50 border-t border-neutral-100">
                    <button className="w-full bg-neutral-200 text-neutral-800 py-2 rounded-lg font-medium hover:bg-neutral-300 transition-colors">Ver Detalhes</button>
                  </div> */}
                </div>
              ))
            ) : (
              !generating && <p className="text-center text-neutral-600 col-span-full">Nenhuma sugestão de receita disponível no momento. Gere sugestões personalizadas!</p>
            )}
             {/* Mensagem quando estiver gerando */}
            {generating && (
                <div className="text-center text-neutral-600 col-span-full flex flex-col items-center">
                     <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mb-3"></div>
                    <p>Gerando sugestões...</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default SuggestedRecipesPage; 