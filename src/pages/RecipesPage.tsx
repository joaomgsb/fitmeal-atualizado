import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import RecipeCard from "../components/recipe/RecipeCard";
import PageTransition from "../components/PageTransition";
import { Recipe } from "../lib/mongodb";

type FetchedRecipesType = {
  page: number;
  pages: number;
  recipes: Recipe[];
  total: number;
};

const RecipesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);

  const [fetchedRecipes, setFetchedRecipes] = useState<FetchedRecipesType>();
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadMoreButtonRef = useRef<HTMLDivElement | null>(null);

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );

  // Usar o hook para buscar receitas do MongoDB
  /* const { recipes: allRecipes, loading, error, total, hasMore, loadMore } = useRecipes({
    searchTerm,
    category: selectedCategory || undefined,
    limit: 100
  }); */

  const difficulties = [
    { id: "fácil", name: "Fácil" },
    { id: "médio", name: "Médio" },
    { id: "difícil", name: "Difícil" },
  ];

  useEffect(() => {
    const fetchRecipes = async () => {
      setFetchLoading(true);
      try {
        const response = await fetch("https://api.receitasnutri.com.br/recipes");
        if (!response.ok) {
          throw new Error("Erro ao buscar receitas");
        }
        const data = await response.json();
        setFetchedRecipes(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setFetchError(error.message);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
    if (newSearchTerm) {
      setSearchParams({ search: newSearchTerm });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    if (!fetchedRecipes?.recipes) return;

    // Extrair todas as categorias
    const allCategories = fetchedRecipes.recipes
      .map((r) => r.recipeCategory?.trim())
      .filter(Boolean); // remove undefined/null

    // Remover duplicatas
    const uniqueCategories = Array.from(new Set(allCategories));

    // Mapear para o formato necessário
    const formatted = uniqueCategories.map((category) => ({
      id: category.toLowerCase().replace(/\s+/g, "-"),
      name: category,
    }));

    setCategories(formatted);
  }, [fetchedRecipes]);

  const loadMoreRecipes = async () => {
    if (!fetchedRecipes) return;

    const nextPage = fetchedRecipes.page + 1;
    setFetchLoading(true);

    try {
      const response = await fetch(
        `https://api.receitasnutri.com.br/recipes?page=${nextPage}`
      );
      if (!response.ok) {
        throw new Error("Erro ao carregar mais receitas");
      }
      const data: FetchedRecipesType = await response.json();

      setFetchedRecipes((prev) => {
        if (!prev) return data;

        const existingIds = new Set(prev.recipes.map((r) => r._id));
        const newRecipes = data.recipes.filter((r) => !existingIds.has(r._id));

        return {
          ...prev,
          page: data.page,
          recipes: [...prev.recipes, ...newRecipes],
        };
      });

      setTimeout(() => {
        loadMoreButtonRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setFetchError(error.message);
    } finally {
      setFetchLoading(false);
    }
  };

  function inferDifficulty(recipe: Recipe): "fácil" | "médio" | "difícil" {
    const totalSteps = recipe.recipeInstructions.length;
    const time = recipe.totalTime;

    const minutes = parseInt(time.replace(/\D/g, ""));

    if (totalSteps <= 3 && minutes <= 20) return "fácil";
    if (totalSteps <= 5 && minutes <= 40) return "médio";
    return "difícil";
  }

  /* const filterRecipes = (): AdaptedRecipe[] => {
    return allRecipes.filter(recipe => {
      const matchesDifficulty = selectedDifficulty ? recipe.difficulty === selectedDifficulty : true;
      return matchesDifficulty;
    });
  }; */

  /* const filteredRecipes = filterRecipes(); */

  const resetFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setSearchTerm("");
  };

  return (
    <PageTransition>
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Nossas <span className="text-primary-500">Receitas Fitness</span>
            </h1>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Descubra mais de {fetchedRecipes?.total ?? 0} receitas deliciosas
              e nutritivas do TudoGostoso, adaptadas para seus objetivos
              fitness.
            </p>
            {fetchedRecipes && fetchedRecipes.total > 0 && (
              <p className="text-primary-600 font-medium mt-2">
                {fetchedRecipes.total} receitas disponíveis
              </p>
            )}
          </div>

          {/* Search & Filters */}
          <div className="mb-8">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Buscar receitas, ingredientes ou tags..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-neutral-400" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 text-neutral-600 hover:text-primary-500 transition-colors mb-4 md:mb-0"
              >
                <Filter size={18} />
                <span>Filtros</span>
                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* {filteredRecipes.length > 0 && (
              <p className="text-neutral-500 text-sm">
                Mostrando <span className="font-medium">{filteredRecipes.length}</span> receitas
                {total > filteredRecipes.length && (
                  <span> de <span className="font-medium">{total}</span> total</span>
                )}
              </p>
            )} */}
            </div>

            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-4 bg-neutral-50 p-4 rounded-lg border border-neutral-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h3 className="font-medium mb-2">Categoria</h3>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() =>
                            setSelectedCategory(
                              selectedCategory === category.id
                                ? null
                                : category.id
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedCategory === category.id
                              ? "bg-primary-500 text-white"
                              : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary-500"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Dificuldade</h3>
                    <div className="flex flex-wrap gap-2">
                      {difficulties.map((difficulty) => (
                        <button
                          key={difficulty.id}
                          onClick={() =>
                            setSelectedDifficulty(
                              selectedDifficulty === difficulty.id
                                ? null
                                : difficulty.id
                            )
                          }
                          className={`px-3 py-1 rounded-full text-sm ${
                            selectedDifficulty === difficulty.id
                              ? "bg-primary-500 text-white"
                              : "bg-white border border-neutral-200 text-neutral-600 hover:border-primary-500"
                          }`}
                        >
                          {difficulty.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={resetFilters}
                      className="text-sm text-neutral-600 hover:text-primary-500 transition-colors"
                    >
                      Limpar filtros
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Recipes Grid */}
          {fetchLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
              <span className="ml-3 text-neutral-600">
                Carregando receitas...
              </span>
            </div>
          ) : fetchError ? (
            <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
              <h3 className="text-lg font-medium text-red-800 mb-2">
                Erro ao carregar receitas
              </h3>
              <p className="text-red-600 mb-4">{fetchError}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-red-600 font-medium hover:text-red-700 transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : fetchedRecipes && fetchedRecipes?.recipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {fetchedRecipes?.recipes
                .filter((recipe) => {
                  const matchDifficulty = selectedDifficulty
                    ? inferDifficulty(recipe) ===
                      selectedDifficulty.toLowerCase()
                    : true;

                  const matchCategory = selectedCategory
                    ? recipe.recipeCategory
                        ?.toLowerCase()
                        .replace(/\s+/g, "-") === selectedCategory
                    : true;

                  return matchDifficulty && matchCategory;
                })
                .map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
            </div>
          ) : fetchedRecipes?.total === 0 ? (
            <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                Nenhuma receita encontrada
              </h3>
              <p className="text-neutral-500 mb-4">
                Não foi possível carregar as receitas. Verifique sua conexão com
                a internet.
              </p>
            </div>
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-lg border border-neutral-200">
              <h3 className="text-xl font-semibold mb-2">
                Nenhuma receita encontrada
              </h3>
              <p className="text-neutral-600 mb-4">
                Tente ajustar os filtros ou buscar por outros termos.
              </p>
              <button
                onClick={resetFilters}
                className="text-primary-500 font-medium hover:text-primary-600 transition-colors"
              >
                Limpar todos os filtros
              </button>
            </div>
          )}

          {/* Load More Button */}
          {fetchedRecipes &&
            fetchedRecipes?.page < fetchedRecipes?.pages &&
            !fetchLoading && (
              <div ref={loadMoreButtonRef} className="text-center mt-8">
                <button
                  onClick={loadMoreRecipes}
                  className="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 transition-colors"
                >
                  Carregar mais receitas
                </button>
              </div>
            )}
        </div>
      </div>
    </PageTransition>
  );
};

export default RecipesPage;