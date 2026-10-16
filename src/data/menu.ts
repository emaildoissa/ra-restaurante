// src/data/menu.ts
export type Category = 'Hot Rolls' | 'Combinados' | 'Temakis' | 'Sashimis & Niguiris' | 'Bebidas & Saquês';

export interface Dish {
  id: string;
  name: string;
  category: Category;
  price: number; // em reais
  description: string;
  calories: number;
  ingredients: string[];
  pairings: string; // sugestão de harmonização (saquê, chá, cerveja japonesa)
  glbUrl: string;
  imageUrl?: string; // foto real do prato
  usdzUrl?: string; // opcional, para iOS AR
  pieces?: string;
  badge?: string;
}

export const menu: Dish[] = [
  {
    id: 'hot-philadelfia',
    name: 'Hot Philadélfia - 10 unidades',
    category: 'Hot Rolls',
    price: 36.9,
    description: 'Arroz, Salmão, Cream Cheese, Tarê e cebolinha.',
    calories: 420,
    pieces: '10 unidades',
    badge: 'Mais Pedido 🔥',
    ingredients: [
      'Arroz especial para sushi',
      'Salmão fresco selecionado',
      'Cream Cheese Philadelphia original',
      'Molho Tarê artesanal',
      'Cebolinha fresca picada'
    ],
    pairings: 'Saquê Junmai seco, Cerveja japonesa Kirin Ichiban ou Chá Verde Gelado.',
    glbUrl: '/models/Hot-Philadelfia.glb',
    imageUrl: '/models/Hot-Philadelfia.jpg',
    usdzUrl: undefined
  },
  {
    id: 'combinado-salmao',
    name: 'Combinado Salmão Premium - 16 peças',
    category: 'Combinados',
    price: 68.0,
    description: 'Seleção especial com 6 sashimis de salmão, 4 niguiris, 4 uramakis philadélfia e 2 jhows com geleia de pimenta.',
    calories: 490,
    pieces: '16 peças',
    badge: 'Chef Especial',
    ingredients: [
      'Salmão fresco',
      'Arroz temperado',
      'Cream Cheese',
      'Geleia de pimenta doce',
      'Gergelim tostado'
    ],
    pairings: 'Espumante Brut ou Saquê Dourado Hakutsuru.',
    glbUrl: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb', // fallback até subir o .glb
    imageUrl: undefined,
    usdzUrl: undefined
  },
  {
    id: 'temaki-salmao-completo',
    name: 'Temaki Salmão Especial',
    category: 'Temakis',
    price: 32.5,
    description: 'Cone de alga crocante nori recheado generosamente com salmão fresco em cubos, cream cheese e cebolinha.',
    calories: 340,
    pieces: '1 unidade',
    badge: 'Crocante',
    ingredients: [
      'Nori premium crocante',
      'Salmão fresco em cubos',
      'Cream Cheese cremoso',
      'Cebolinha'
    ],
    pairings: 'Cerveja Sapporo ou Chá gelado de jasmim.',
    glbUrl: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
    imageUrl: undefined,
    usdzUrl: undefined
  },
  {
    id: 'sashimi-salmao-trufado',
    name: 'Sashimi Salmão Trufado - 8 cortes',
    category: 'Sashimis & Niguiris',
    price: 45.0,
    description: 'Fatias nobres de salmão maçaricado com azeite de trufas brancas, flor de sal e raspas de limão siciliano.',
    calories: 280,
    pieces: '8 cortes',
    badge: 'Gourmet 🌟',
    ingredients: [
      'Salmão fresco alto padrão',
      'Azeite trufado',
      'Flor de sal',
      'Raspas de limão siciliano'
    ],
    pairings: 'Vinho branco Sauvignon Blanc ou Saquê Premium Daiginjo.',
    glbUrl: 'https://modelviewer.dev/shared-assets/models/shishkebab.glb',
    imageUrl: undefined,
    usdzUrl: undefined
  }
];
