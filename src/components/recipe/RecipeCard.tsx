import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Flame, Beef, ExternalLink } from "lucide-react";
import { Recipe } from "../../lib/mongodb";
import { decode } from "he";

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const getTotalTime = () => {
    const match = recipe.totalTime?.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);

    if (!match) return 0;

    const hours = parseInt(match[1] || "0", 10);
    const minutes = parseInt(match[2] || "0", 10);

    return hours * 60 + minutes;
  };

  function replaceHtmlEntities(str: string): string {
    const entitiesMap: { [key: string]: string } = {
      "atilde;": "ã",
      "ecirc;": "ê",
      "eacute;": "é",
      "ccedil;": "ç",
      "uacute;": "ú",
      "oacute;": "ó",
      "acirc;": "â",
      "agrave;": "à",
      "iuml;": "ï",
      "ocirc;": "ô",
      "nbsp;": " ",
    };

    return Object.entries(entitiesMap).reduce(
      (acc, [entity, char]) => acc.split(entity).join(char),
      str
    );
  }

  const getCategoryBadgeColor = (category: string) => {
    const colors = {
      "pre-treino": "bg-blue-100 text-blue-800",
      "pos-treino": "bg-green-100 text-green-800",
      "low-carb": "bg-purple-100 text-purple-800",
      proteica: "bg-red-100 text-red-800",
      "cafe-da-manha": "bg-yellow-100 text-yellow-800",
      snack: "bg-orange-100 text-orange-800",
      almoco: "bg-primary-100 text-primary-800",
      jantar: "bg-indigo-100 text-indigo-800",
      "Doces e sobremesas": "bg-pink-100 text-pink-800",
    };

    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  function inferDifficulty(recipe: Recipe): "fácil" | "médio" | "difícil" {
    const totalSteps = recipe.recipeInstructions?.length || 0;
    const time = recipe.totalTime || "";

    const minutes = parseInt(time.replace(/\D/g, "")) || 0;

    if (totalSteps <= 3 && minutes <= 20) return "fácil";
    if (totalSteps <= 5 && minutes <= 40) return "médio";
    return "difícil";
  }

  // Valores padrão para evitar erros
  const imageUrl = recipe.image?.url || 'https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg';
  const recipeUrl = recipe.url || '#';
  const recipeName = recipe.name || 'Nome da receita não disponível';
  const recipeDescription = recipe.description || 'Descrição não disponível';
  const recipeCategory = recipe.recipeCategory || 'Categoria não definida';
  const authorName = recipe.author?.name || '';

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all"
    >
      <Link to={recipeUrl} target="_blank">
        <div className="relative">
          <img
            src={imageUrl}
            alt={recipeName}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-3 left-3">
            <span
              className={`text-xs font-medium px-2 py-1 rounded-md ${getCategoryBadgeColor(
                recipeCategory
              )}`}
            >
              {recipeCategory}
            </span>
          </div>
          {authorName === "TudoGostoso" && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-medium px-2 py-1 rounded-md bg-orange-100 text-orange-800">
                Tudo Gostoso
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 line-clamp-1">
            {recipeName}
          </h3>
          <p className="text-neutral-600 text-sm mb-4 line-clamp-2">
            {decode(recipeDescription)}
          </p>

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{getTotalTime()} min</span>
            </div>
          </div>

          <span className="mt-4 block text-xs font-medium px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 text-center">
            {inferDifficulty(recipe)}
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
