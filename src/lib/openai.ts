import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Apenas para desenvolvimento
});

interface UserData {
  goal: string;
  weight: number;
  height: number;
  age: number;
  gender: string;
  activityLevel: string;
  workoutFrequency: string;
  workoutIntensity: string;
  workoutDuration: string;
  basalMetabolicRate: number;
  totalDailyEnergyExpenditure: number;
  knowsCalorieNeeds: boolean;
  customCalorieNeeds: number;
  customProteinNeeds: number;
  customCarbNeeds: number;
  customFatNeeds: number;
  dietPreferences: string[];
  allergies: string[];
}

export interface RecipeSuggestion {
  title: string;
  description: string;
  ingredients: Array<{
    name: string;
    amount: string;
  }>;
  instructions: string[];
  macros: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  tags: string[]; // Para ajudar na filtragem e exibição
}

export async function generateMealPlan(userData: UserData) {
  const prompt = `Gere um plano alimentar detalhado em português para uma pessoa com as seguintes características:

Dados pessoais:
- Objetivo: ${userData.goal === 'emagrecimento' ? 'Perda de peso' : userData.goal === 'hipertrofia' ? 'Ganho muscular' : 'Definição muscular'}
- Peso: ${userData.weight} kg
- Altura: ${userData.height} cm
- Idade: ${userData.age} anos
- Gênero: ${userData.gender}

Informações de Atividade Física e Metabolismo:
- Nível de atividade: ${userData.activityLevel}
- Frequência de treinos: ${userData.workoutFrequency} vezes por semana
- Intensidade dos treinos: ${userData.workoutIntensity}
- Duração dos treinos: ${userData.workoutDuration}
- Taxa Metabólica Basal (TMB): ${userData.basalMetabolicRate} calorias/dia
- Gasto Energético Total Diário (TDEE): ${userData.totalDailyEnergyExpenditure} calorias/dia
- Conhece necessidades calóricas específicas: ${userData.knowsCalorieNeeds ? 'Sim' : 'Não'}
${userData.knowsCalorieNeeds ? `
- Necessidades Calóricas Específicas do Usuário:
  * Calorias Diárias: ${userData.customCalorieNeeds} kcal
  * Proteínas: ${userData.customProteinNeeds}g
  * Carboidratos: ${userData.customCarbNeeds}g
  * Gorduras: ${userData.customFatNeeds}g` : ''}

${userData.dietPreferences.length > 0 ? `- Preferências alimentares: ${userData.dietPreferences.join(', ')}` : ''}
${userData.allergies.length > 0 ? `- Alergias/Intolerâncias: ${userData.allergies.join(', ')}` : ''}

IMPORTANTE: ${userData.knowsCalorieNeeds ? 
  'O usuário forneceu necessidades calóricas específicas. Use EXATAMENTE essas informações para gerar o plano, ignorando os cálculos automáticos de TMB e TDEE.' : 
  'Use as informações de TMB e TDEE fornecidas para calcular as calorias do plano de forma mais precisa.'}

Por favor, gere um plano alimentar completo que inclua:

1. Visão geral do plano:
   - Cálculo detalhado:
     * TDEE do usuário: [valor] kcal/dia
     * Objetivo: [perda/ganho/manutenção] de peso
     * Meta calórica diária: [valor] kcal (baseado no TDEE e objetivo)
     * Distribuição de macronutrientes específica para o objetivo e nível de atividade
   - Número de refeições por dia (considerando frequência e intensidade dos treinos)
   - Duração recomendada do plano
   - OBS: O total calórico diário DEVE ser exatamente o valor calculado para o objetivo do usuário, conforme especificado

2. Refeições detalhadas para um dia, incluindo:
   - Horário sugerido (considerando horários de treino)
   - Nome da refeição
   - Lista completa de alimentos com:
     * Quantidade exata em gramas ou medidas caseiras
     * Modo de preparo específico (ex: "200g de frango grelhado com temperos naturais")
     * Combinações e acompanhamentos
   - Calorias e macronutrientes por alimento e total da refeição

3. Características específicas do plano:
   - OBRIGATÓRIO: Incluir TODAS as refeições noturnas (jantar e ceia se necessário)
   - NUNCA incluir 'Pré-treino' à noite - este termo só deve ser usado no período da tarde
   - O plano deve cobrir TODO o dia, do café da manhã até a ceia (se necessário)
   - Garantir que o horário das refeições seja realista e adequado à rotina do usuário
   - BALANÇO CALÓRICO: É ESSENCIAL que o total calórico do plano esteja de acordo com o objetivo:
     * Para PERDA DE PESO: Déficit de 15-25% do TDEE (faixa ideal para perda de gordura sustentável e preservação muscular)
     * Para GANHO DE MASSA: Superávit de 10-20% do TDEE (ótimo para ganho muscular com mínimo de gordura)
     * Para MANUTENÇÃO: Manter calorias dentro de ±5% do TDEE (para peso estável)
   - OBSERVAÇÕES IMPORTANTES:
     * Déficits acima de 25% podem comprometer a massa muscular e o metabolismo
     * Superávits acima de 20% tendem a resultar em acúmulo excessivo de gordura
     * A consistência no consumo calórico diário é fundamental para prever e alcançar resultados
   - O total calórico diário DEVE ser respeitado com consistência, conforme calculado para o objetivo do usuário
   - 5 pontos principais focados no objetivo do usuário
   - Dicas práticas de preparação e organização
   - Lista de substituições para cada grupo de alimentos
   - Considerações especiais para dias de treino vs dias de descanso

Por favor, formate a resposta em JSON com a seguinte estrutura:

{
  "overview": {
    "calories": number,
    "protein": number,
    "carbs": number,
    "fat": number,
    "meals": number,
    "duration": string
  },
  "features": string[],
  "meals": [
    {
      "time": string,
      "name": string,
      "description": string,
      "foods": [
        {
          "name": string,
          "amount": string,
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "preparation": string
        }
      ],
      "totalCalories": number,
      "totalProtein": number,
      "totalCarbs": number,
      "totalFat": number
    }
  ],
  "tips": string[],
  "substitutions": [
    {
      "food": string,
      "alternatives": string[]
    }
  ]
}`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um nutricionista esportivo especializado, com vasta experiência em criar planos alimentares personalizados. Você deve fornecer planos detalhados e práticos, com medidas exatas e instruções claras de preparação. Foque em refeições realistas e fáceis de preparar, mantendo o rigor nutricional necessário para atingir os objetivos do usuário. Use sempre as informações de TMB e TDEE fornecidas para cálculos precisos de calorias."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "o3-mini",
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error('Resposta vazia da API');
    }

    return JSON.parse(response);
  } catch (error) {
    console.error('Erro ao gerar plano alimentar:', error);
    throw error;
  }
}

export async function generateRecipeSuggestions(userData: UserData): Promise<{ recipes: RecipeSuggestion[] }> {
  const prompt = `Gere uma lista de 5 a 7 sugestões de receitas individuais em português para uma pessoa com as seguintes características, focando em atender ao objetivo fitness e preferências alimentares, e evitando alergias/intolerâncias:

Dados pessoais:
- Objetivo: ${userData.goal === 'emagrecimento' ? 'Perda de peso' : userData.goal === 'hipertrofia' ? 'Ganho muscular' : 'Definição muscular'}
- Peso: ${userData.weight} kg
- Altura: ${userData.height} cm
- Idade: ${userData.age} anos
- Gênero: ${userData.gender}

Informações de Atividade Física e Metabolismo:
- Nível de atividade: ${userData.activityLevel}
- Frequência de treinos: ${userData.workoutFrequency} vezes por semana
- Intensidade dos treinos: ${userData.workoutIntensity}
- Duração dos treinos: ${userData.workoutDuration}
- Taxa Metabólica Basal (TMB): ${userData.basalMetabolicRate} calorias/dia
- Gasto Energético Total Diário (TDEE): ${userData.totalDailyEnergyExpenditure} calorias/dia

- Preferências alimentares: ${userData.dietPreferences.length > 0 ? userData.dietPreferences.join(', ') : 'Nenhuma especificada'}
- Alergias/Intolerâncias: ${userData.allergies.length > 0 ? userData.allergies.join(', ') : 'Nenhuma especificada'}

IMPORTANTE: Gere receitas DIFERENTES e VARIADAS a cada chamada. Evite repetir receitas comuns.
Considere os seguintes aspectos para garantir variedade:
- Alterne entre diferentes tipos de proteínas (frango, peixe, carne vermelha, ovos, proteínas vegetais)
- Varie os métodos de preparo (grelhado, assado, cozido, vapor)
- Inclua diferentes grupos de carboidratos (arroz, batata, quinoa, aveia)
- Use diferentes combinações de vegetais e legumes
- Alterne entre refeições quentes e frias
- Inclua opções para diferentes horários do dia
- Considere receitas de diferentes culturas culinárias

Além disso, para cada receita:
- Inclua uma descrição única e detalhada
- Adicione dicas específicas de preparo
- Sugira variações possíveis da receita
- Inclua tags específicas e variadas
Para cada receita, forneça:
- Título
- Descrição curta
- Lista de ingredientes com quantidade
- Modo de preparo passo a passo
- Estimativa de macronutrientes (calorias, proteínas, carboidratos, gorduras)
- Algumas tags relevantes (ex: #rápido, #proteico, #vegetariano)

Por favor, formate a resposta em um array JSON com a seguinte estrutura, onde cada objeto no array representa uma receita:

[
  {
    "title": string,
    "description": string,
    "ingredients": [
      {
        "name": string,
        "amount": string
      }
    ],
    "instructions": string[],
    "macros": {
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number
    },
    "tags": string[]
  }
]`;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um chef criativo especializado em nutrição esportiva, com vasto conhecimento de diferentes culinárias e técnicas de preparo. Sua missão é criar receitas únicas, variadas e inovadoras que se encaixem nos objetivos do usuário. Evite sugerir receitas óbvias ou repetitivas - busque sempre surpreender com combinações interessantes e saudáveis. Use seu conhecimento de diferentes culturas culinárias para trazer variedade às sugestões."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4.1-nano",
      response_format: { type: "json_object" }
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Resposta vazia da API ou conteúdo inesperado');
    }

    return JSON.parse(responseContent) as { recipes: RecipeSuggestion[] };
  } catch (error) {
    console.error('Erro ao gerar sugestões de receitas:', error);
    throw error;
  }
}

export interface FoodNutritionInfo {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export async function getFoodNutritionInfo(foodName: string, amount: string = "100g"): Promise<FoodNutritionInfo> {
  try {
    console.log(`🔍 Buscando informações nutricionais para: ${foodName} (${amount})`);
    
    // Extrair a quantidade numérica (padrão: 100g)
    const amountMatch = amount.match(/(\d+(\.\d+)?)/);
    const quantity = amountMatch ? parseFloat(amountMatch[1]) : 100;
    const unit = amount.toLowerCase().includes('ml') ? 'ml' : 'g';
    
    // Construir o prompt para a OpenAI
    const prompt = `Por favor, forneça as informações nutricionais para ${quantity}${unit} de ${foodName}.
    
    Responda APENAS com um objeto JSON contendo os seguintes campos:
    - name: Nome do alimento
    - calories: Total de calorias
    - protein: Quantidade de proteínas em gramas
    - carbs: Quantidade de carboidratos em gramas
    - fat: Quantidade de gorduras em gramas
    - fiber: Quantidade de fibras em gramas (opcional)
    - sugar: Quantidade de açúcares em gramas (opcional)
    - sodium: Quantidade de sódio em miligramas (opcional)
    
    Exemplo de resposta:
    {
      "name": "${foodName}",
      "calories": 150,
      "protein": 25.5,
      "carbs": 5.2,
      "fat": 3.1,
      "fiber": 2.5,
      "sugar": 1.8,
      "sodium": 300
    }`;

    // Chamar a API da OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Você é um especialista em nutrição esportiva. Forneça informações nutricionais precisas e realistas para os alimentos solicitados. Se não souber um valor exato, faça uma estimativa realista baseada em alimentos similares."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4.1-nano",
      response_format: { type: "json_object" },
      temperature: 0.3, // Mais determinístico
      max_tokens: 500
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) {
      throw new Error('Resposta vazia da API');
    }

    // Parse e validação básica da resposta
    const result = JSON.parse(responseContent);
    
    // Garantir que os campos obrigatórios existam
    if (!result.calories || !result.protein || !result.carbs || !result.fat) {
      throw new Error('Resposta incompleta da API');
    }

    console.log('✅ Dados nutricionais obtidos com sucesso:', result);
    
    return {
      name: result.name || foodName,
      calories: Math.round(Number(result.calories) || 0),
      protein: parseFloat(result.protein) || 0,
      carbs: parseFloat(result.carbs) || 0,
      fat: parseFloat(result.fat) || 0,
      fiber: result.fiber ? parseFloat(result.fiber) : undefined,
      sugar: result.sugar ? parseFloat(result.sugar) : undefined,
      sodium: result.sodium ? parseFloat(result.sodium) : undefined
    };
    
  } catch (error) {
    console.error('❌ Erro ao buscar informações nutricionais:', error);
    
    // Fallback para valores padrão em caso de erro
    return {
      name: foodName,
      calories: 100,
      protein: 5,
      carbs: 15,
      fat: 2
    };
  }
}