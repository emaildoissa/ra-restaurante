// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Dish } from '@/data/menu';

const GEMINI_MODEL = 'gemini-2.5-flash';

function createClient() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
}

export async function askChefAI(dish: Dish, query: string = ''): Promise<string> {
  const client = createClient();

  const systemPrompt = `
Você é um Sushiman & Sommelier IA de alta gastronomia japonesa.
Forneça respostas elegantes, concisas (máximo 2 a 3 frases) e envolventes que valorizem o frescor dos ingredientes e o corte oriental.
Sempre sugira uma bebida harmonizada japonesa (ex: Saquê Junmai, cerveja Kirin/Sapporo, chá verde sencha ou espumante).
Dados do prato atual:
- Nome: ${dish.name}
- Descrição: ${dish.description}
- Ingredientes: ${dish.ingredients.join(', ')}
- Calorias aproximadas: ${dish.calories} kcal
- Harmonização sugerida: ${dish.pairings}
`;

  if (!client) {
    const mockResponses = [
      `O ${dish.name} é preparado com ingredientes frescos selecionados e harmoniza perfeitamente com ${dish.pairings.split(' ou ')[0]}. Uma experiência japonesa autêntica!`,
      `Para valorizar a textura crocante e o sabor do ${dish.name}, recomendo degustar junto de ${dish.pairings.split(', ')[0]}.`,
      `Excelente escolha! A combinação do salmão fresco com o molho tarê equilibra divinamente com um bom saquê ou cerveja japonesa gelada.`
    ];
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  }

  const model = client.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent([systemPrompt, query].filter(Boolean));
  const text = await result.response.text();
  return text.trim();
}
