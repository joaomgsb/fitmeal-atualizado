// Serviço de Nutrição Precisa
// Usando Nutritionix e FatSecret APIs para dados nutricionais confiáveis

const NUTRITIONIX_APP_ID = import.meta.env.VITE_NUTRITIONIX_APP_ID;
const NUTRITIONIX_APP_KEY = import.meta.env.VITE_NUTRITIONIX_APP_KEY;
const FATSECRET_CLIENT_ID = import.meta.env.VITE_FATSECRET_CLIENT_ID;
const FATSECRET_CLIENT_SECRET = import.meta.env.VITE_FATSECRET_CLIENT_SECRET;

export interface PreciseNutritionData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  source: 'nutritionix' | 'fatsecret' | 'fallback';
}

// Função para buscar dados nutricionais no Nutritionix
async function searchNutritionix(foodName: string, amount: string = "100g"): Promise<PreciseNutritionData | null> {
  try {
    const response = await fetch('https://trackapi.nutritionix.com/v2/search/instant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_APP_KEY,
      },
      body: JSON.stringify({
        query: foodName,
        detailed: true
      })
    });

    if (!response.ok) {
      console.warn('Nutritionix API error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.common && data.common.length > 0) {
      const food = data.common[0];
      
      // Extrair quantidade numérica
      const amountMatch = amount.match(/(\d+(?:\.\d+)?)/);
      const quantity = amountMatch ? parseFloat(amountMatch[1]) : 100;
      const ratio = quantity / 100; // Nutritionix retorna por 100g
      
      return {
        name: food.food_name,
        calories: Math.round(food.full_nutrients.find((n: any) => n.attr_id === 208)?.value * ratio || 0),
        protein: Math.round((food.full_nutrients.find((n: any) => n.attr_id === 203)?.value || 0) * ratio * 10) / 10,
        carbs: Math.round((food.full_nutrients.find((n: any) => n.attr_id === 205)?.value || 0) * ratio * 10) / 10,
        fat: Math.round((food.full_nutrients.find((n: any) => n.attr_id === 204)?.value || 0) * ratio * 10) / 10,
        fiber: food.full_nutrients.find((n: any) => n.attr_id === 291)?.value ? 
               Math.round((food.full_nutrients.find((n: any) => n.attr_id === 291)?.value || 0) * ratio * 10) / 10 : undefined,
        sugar: food.full_nutrients.find((n: any) => n.attr_id === 269)?.value ? 
               Math.round((food.full_nutrients.find((n: any) => n.attr_id === 269)?.value || 0) * ratio * 10) / 10 : undefined,
        sodium: food.full_nutrients.find((n: any) => n.attr_id === 307)?.value ? 
                Math.round((food.full_nutrients.find((n: any) => n.attr_id === 307)?.value || 0) * ratio) : undefined,
        source: 'nutritionix'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar no Nutritionix:', error);
    return null;
  }
}

// Função para buscar dados nutricionais no FatSecret
async function searchFatSecret(foodName: string, amount: string = "100g"): Promise<PreciseNutritionData | null> {
  try {
    // Primeiro, obter token de acesso
    const tokenResponse = await fetch('https://oauth.fatsecret.com/connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: FATSECRET_CLIENT_ID,
        client_secret: FATSECRET_CLIENT_SECRET,
        scope: 'basic'
      })
    });

    if (!tokenResponse.ok) {
      console.warn('FatSecret token error:', tokenResponse.status);
      return null;
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Buscar alimento
    const searchResponse = await fetch(`https://platform.fatsecret.com/rest/server.api?method=foods.search&search_expression=${encodeURIComponent(foodName)}&format=json`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!searchResponse.ok) {
      console.warn('FatSecret search error:', searchResponse.status);
      return null;
    }

    const searchData = await searchResponse.json();
    
    if (searchData.foods && searchData.foods.food && searchData.foods.food.length > 0) {
      const food = searchData.foods.food[0];
      
      // Obter detalhes nutricionais
      const detailResponse = await fetch(`https://platform.fatsecret.com/rest/server.api?method=food.get.v2&food_id=${food.food_id}&format=json`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!detailResponse.ok) {
        return null;
      }

      const detailData = await detailResponse.json();
      const nutrition = detailData.food.servings.serving[0];
      
      // Extrair quantidade numérica
      const amountMatch = amount.match(/(\d+(?:\.\d+)?)/);
      const quantity = amountMatch ? parseFloat(amountMatch[1]) : 100;
      const ratio = quantity / parseFloat(nutrition.metric_serving_amount || 100);
      
      return {
        name: food.food_name,
        calories: Math.round(parseFloat(nutrition.calories || 0) * ratio),
        protein: Math.round(parseFloat(nutrition.protein || 0) * ratio * 10) / 10,
        carbs: Math.round(parseFloat(nutrition.carbohydrate || 0) * ratio * 10) / 10,
        fat: Math.round(parseFloat(nutrition.fat || 0) * ratio * 10) / 10,
        fiber: nutrition.fiber ? Math.round(parseFloat(nutrition.fiber) * ratio * 10) / 10 : undefined,
        sugar: nutrition.sugar ? Math.round(parseFloat(nutrition.sugar) * ratio * 10) / 10 : undefined,
        sodium: nutrition.sodium ? Math.round(parseFloat(nutrition.sodium) * ratio) : undefined,
        source: 'fatsecret'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Erro ao buscar no FatSecret:', error);
    return null;
  }
}

// Função principal que busca dados nutricionais precisos
export async function getPreciseNutritionInfo(foodName: string, amount: string = "100g"): Promise<PreciseNutritionData> {
  // Tentar Nutritionix primeiro
  let result = await searchNutritionix(foodName, amount);
  
  if (result) {
    console.log(`✅ Dados nutricionais precisos obtidos do Nutritionix: ${foodName}`);
    return result;
  }
  
  // Se Nutritionix falhar, tentar FatSecret
  result = await searchFatSecret(foodName, amount);
  
  if (result) {
    console.log(`✅ Dados nutricionais precisos obtidos do FatSecret: ${foodName}`);
    return result;
  }
  
  // Fallback com valores realistas baseados no tipo de alimento
  console.warn(`⚠️ Alimento não encontrado nas APIs: ${foodName}. Usando valores padrão.`);
  
  const normalizedName = foodName.toLowerCase();
  
  // Valores padrão baseados no tipo de alimento
  if (normalizedName.includes('frango') || normalizedName.includes('frango')) {
    return {
      name: foodName,
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
      source: 'fallback'
    };
  } else if (normalizedName.includes('arroz')) {
    return {
      name: foodName,
      calories: 130,
      protein: 2.7,
      carbs: 28,
      fat: 0.3,
      source: 'fallback'
    };
  } else if (normalizedName.includes('batata')) {
    return {
      name: foodName,
      calories: 77,
      protein: 2,
      carbs: 17,
      fat: 0.1,
      source: 'fallback'
    };
  } else if (normalizedName.includes('ovo')) {
    return {
      name: foodName,
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
      source: 'fallback'
    };
  } else {
    // Valor genérico realista
    return {
      name: foodName,
      calories: 100,
      protein: 5,
      carbs: 15,
      fat: 2,
      source: 'fallback'
    };
  }
}

// Função para validar se os valores nutricionais fazem sentido
export function validateNutritionValues(
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): { isValid: boolean; issues: string[] } {
  const issues: string[] = [];
  
  // Verificar se os valores são números válidos
  if (isNaN(calories) || isNaN(protein) || isNaN(carbs) || isNaN(fat)) {
    issues.push('Valores nutricionais devem ser números válidos');
  }
  
  // Verificar se não são negativos
  if (calories < 0 || protein < 0 || carbs < 0 || fat < 0) {
    issues.push('Valores nutricionais não podem ser negativos');
  }
  
  // Verificar calorias vs macronutrientes (1g proteína = 4 cal, 1g carb = 4 cal, 1g gordura = 9 cal)
  const calculatedCalories = (protein * 4) + (carbs * 4) + (fat * 9);
  const calorieDifference = Math.abs(calories - calculatedCalories);
  const calorieTolerance = calories * 0.1; // 10% de tolerância (mais rigoroso)
  
  if (calorieDifference > calorieTolerance) {
    issues.push(`Calorias não correspondem aos macronutrientes (diferença: ${Math.round(calorieDifference)} cal)`);
  }
  
  return {
    isValid: issues.length === 0,
    issues
  };
}

// Função para corrigir valores nutricionais automaticamente
export function correctNutritionValues(
  calories: number,
  protein: number,
  carbs: number,
  fat: number
): { calories: number; protein: number; carbs: number; fat: number } {
  // Recalcular calorias baseado nos macronutrientes
  const correctedCalories = Math.round((protein * 4) + (carbs * 4) + (fat * 9));
  
  // Garantir que não há valores negativos
  const correctedProtein = Math.max(0, protein);
  const correctedCarbs = Math.max(0, carbs);
  const correctedFat = Math.max(0, fat);
  
  return {
    calories: correctedCalories,
    protein: Math.round(correctedProtein * 10) / 10,
    carbs: Math.round(correctedCarbs * 10) / 10,
    fat: Math.round(correctedFat * 10) / 10
  };
} 