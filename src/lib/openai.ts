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
- Nível de atividade: ${userData.activityLevel}
${userData.dietPreferences.length > 0 ? `- Preferências alimentares: ${userData.dietPreferences.join(', ')}` : ''}
${userData.allergies.length > 0 ? `- Alergias/Intolerâncias: ${userData.allergies.join(', ')}` : ''}

Por favor, gere um plano alimentar completo que inclua:

1. Visão geral do plano:
   - Calorias diárias totais (calculadas com base no objetivo, peso e nível de atividade)
   - Distribuição de macronutrientes específica para o objetivo
   - Número de refeições por dia
   - Duração recomendada do plano

2. Refeições detalhadas para um dia, incluindo:
   - Horário sugerido
   - Nome da refeição
   - Lista completa de alimentos com:
     * Quantidade exata em gramas ou medidas caseiras
     * Modo de preparo específico (ex: "200g de frango grelhado com temperos naturais")
     * Combinações e acompanhamentos
   - Calorias e macronutrientes por alimento e total da refeição

3. Características específicas do plano:
   - 5 pontos principais focados no objetivo do usuário
   - Dicas práticas de preparação e organização
   - Lista de substituições para cada grupo de alimentos

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
          content: "Você é um nutricionista esportivo especializado, com vasta experiência em criar planos alimentares personalizados. Você deve fornecer planos detalhados e práticos, com medidas exatas e instruções claras de preparação. Foque em refeições realistas e fáceis de preparar, mantendo o rigor nutricional necessário para atingir os objetivos do usuário."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gpt-4o-mini",
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
      model: "gpt-4o-mini",
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