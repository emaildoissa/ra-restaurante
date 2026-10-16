// src/App.tsx
import { useState, useEffect, useRef } from 'react';
import { menu, type Dish, type Category } from '@/data/menu';
import { 
  Phone, 
  Bot, 
  Box, 
  Image as ImageIcon,
  Send,
  Loader2,
  X,
  Rotate3d,
  Wine
} from 'lucide-react';
import { askChefAI } from '@/services/gemini';
import '@/index.css';

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<Category | 'Todos'>('Todos');
  const [activeDish, setActiveDish] = useState<Dish>(menu[0]);
  const [viewMode, setViewMode] = useState<'3d' | 'photo'>('3d');
  const [modelLoading, setModelLoading] = useState(true);

  // Referência direta ao elemento DOM <model-viewer>
  const modelViewerRef = useRef<HTMLElement | null>(null);

  // Modal Sommelier IA
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const categories: (Category | 'Todos')[] = [
    'Todos',
    'Hot Rolls',
    'Combinados',
    'Temakis',
    'Sashimis & Niguiris'
  ];

  const filteredDishes = selectedCategory === 'Todos'
    ? menu
    : menu.filter((d) => d.category === selectedCategory);

  useEffect(() => {
    if (filteredDishes.length > 0 && !filteredDishes.some(d => d.id === activeDish.id)) {
      selectDish(filteredDishes[0]);
    }
  }, [selectedCategory]);

  // Listener nativo do elemento DOM <model-viewer> (Web Component)
  useEffect(() => {
    if (viewMode !== '3d') return;

    const viewer = modelViewerRef.current;
    if (!viewer) return;

    setModelLoading(true);

    const handleLoad = () => {
      setModelLoading(false);
    };

    const handleError = () => {
      // Se houver erro ou timeout, libera a interface para não travar
      setModelLoading(false);
    };

    viewer.addEventListener('load', handleLoad);
    viewer.addEventListener('error', handleError);

    // Timeout de segurança: após 2 segundos sempre libera
    const safetyTimer = setTimeout(() => {
      setModelLoading(false);
    }, 2000);

    return () => {
      viewer.removeEventListener('load', handleLoad);
      viewer.removeEventListener('error', handleError);
      clearTimeout(safetyTimer);
    };
  }, [activeDish.glbUrl, viewMode]);

  const selectDish = (dish: Dish) => {
    setActiveDish(dish);
    setModelLoading(true);
    setViewMode('3d');
    setAiAnswer(null);
  };

  const handleOpenAR = () => {
    const viewer = modelViewerRef.current as any;
    if (viewer && typeof viewer.activateAR === 'function') {
      viewer.activateAR();
    }
  };

  const handleAskChef = async (queryText: string) => {
    if (!queryText.trim()) return;
    setAiLoading(true);
    const answer = await askChefAI(activeDish, queryText);
    setAiAnswer(answer);
    setAiLoading(false);
  };

  const whatsappLink = `https://wa.me/5551999999999?text=${encodeURIComponent(
    `Olá! Gostaria de pedir: ${activeDish.name} (R$ ${activeDish.price.toFixed(2)})`
  )}`;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-24 font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Bar Minimalista */}
      <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-900 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍣</span>
            <div>
              <h1 className="text-base font-black tracking-widest uppercase text-white font-serif">
                KURA <span className="text-rose-500 font-sans text-xs tracking-normal font-bold">SUSHI</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setAiModalOpen(true)}
            className="flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-800 transition active:scale-95"
          >
            <Bot size={14} className="text-rose-400" />
            <span className="font-medium">Sommelier IA</span>
          </button>
        </div>

        {/* Categorias em Pílulas Limpas */}
        <div className="max-w-md mx-auto pt-2.5">
          <nav className="flex gap-2 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={classNames(
                  'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-150',
                  selectedCategory === cat
                    ? 'bg-white text-zinc-950 shadow-sm'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                )}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Botão de Comparação de Modos RA */}
          <div className="mt-2">
            <a
              href="/display.html"
              className="w-full bg-zinc-900 hover:bg-zinc-800 border border-rose-500/40 text-rose-300 hover:text-white font-bold py-1.5 px-3 rounded-xl transition flex items-center justify-center gap-1.5 text-xs shadow-sm"
            >
              <span>⚖️</span>
              <span>Comparar 3 Opções de RA (3D vs Foto no Prato vs Totem)</span>
            </a>
          </div>
        </div>
      </header>

      {/* Container Principal Mobile-First */}
      <main className="max-w-md mx-auto w-full flex flex-col">
        {/* ÁREA HERO: 3D / Realidade Aumentada ou Foto */}
        <div className="relative w-full aspect-square max-h-[420px] bg-gradient-to-b from-zinc-900 to-zinc-950 flex items-center justify-center overflow-hidden">
          {/* Seletor Flutuante 3D vs Foto */}
          <div className="absolute top-3 right-3 z-30 flex bg-black/50 backdrop-blur-md p-1 rounded-full border border-white/10 shadow-lg">
            <button
              onClick={() => setViewMode('3d')}
              className={classNames(
                'flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all',
                viewMode === '3d'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              )}
            >
              <Box size={13} />
              <span>3D</span>
            </button>

            {activeDish.imageUrl && (
              <button
                onClick={() => setViewMode('photo')}
                className={classNames(
                  'flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold transition-all',
                  viewMode === 'photo'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                )}
              >
                <ImageIcon size={13} />
                <span>Foto</span>
              </button>
            )}
          </div>

          {/* Badge de Destaque */}
          {activeDish.badge && (
            <div className="absolute top-3 left-3 z-30">
              <span className="bg-rose-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md">
                {activeDish.badge}
              </span>
            </div>
          )}

          {viewMode === '3d' ? (
            <>
              {/* Spinner com POINTER-EVENTS-NONE (NUNCA bloqueia toque na tela) */}
              {modelLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-rose-500 z-10 pointer-events-none transition-opacity duration-300">
                  <div className="bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-2xl flex items-center gap-2 border border-white/10 shadow-xl">
                    <Loader2 size={18} className="animate-spin text-rose-500" />
                    <span className="text-[11px] font-medium text-zinc-200 tracking-wide">
                      Carregando 3D...
                    </span>
                  </div>
                </div>
              )}

              {/* Componente <model-viewer> com touch-action e ref */}
              <model-viewer
                ref={modelViewerRef}
                src={activeDish.glbUrl}
                poster={activeDish.imageUrl}
                alt={activeDish.name}
                ar
                ar-modes="webxr scene-viewer quick-look"
                ar-scale="auto"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                rotation-per-second="25deg"
                shadow-intensity="1.5"
                shadow-softness="0.5"
                style={{ width: '100%', height: '100%' }}
              >
                {/* Botão de RA Elegante e Flutuante */}
                <button
                  slot="ar-button"
                  onClick={handleOpenAR}
                  className="ar-pulse-btn absolute bottom-4 left-1/2 -translate-x-1/2 bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white font-black text-xs py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 border border-rose-400/40 z-30 cursor-pointer transition-all"
                >
                  <Rotate3d size={16} />
                  <span>VER NA MINHA MESA (RA)</span>
                </button>
              </model-viewer>

              {/* Dica interativa no canto */}
              <div className="absolute bottom-4 right-3 pointer-events-none text-[10px] text-zinc-400 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10 z-20">
                Gire em 360°
              </div>
            </>
          ) : (
            /* Foto Real */
            <div className="w-full h-full p-4 flex items-center justify-center">
              <img
                src={activeDish.imageUrl}
                alt={activeDish.name}
                className="max-h-full max-w-full object-contain rounded-2xl shadow-xl"
              />
            </div>
          )}
        </div>

        {/* INFORMAÇÕES DO PRATO */}
        <div className="p-5 flex flex-col gap-4 bg-zinc-950">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
                {activeDish.name}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                <span>{activeDish.category}</span>
                {activeDish.pieces && (
                  <>
                    <span>•</span>
                    <span className="text-rose-400 font-semibold">{activeDish.pieces}</span>
                  </>
                )}
                <span>•</span>
                <span>{activeDish.calories} kcal</span>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-zinc-500 font-semibold block">Preço</span>
              <span className="text-xl font-black text-rose-500">
                R$ {activeDish.price.toFixed(2).replace('.', ',')}
              </span>
            </div>
          </div>

          {/* Descrição */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {activeDish.description}
          </p>

          {/* Ingredientes */}
          <div className="pt-1">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Ingredientes
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeDish.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1 rounded-full text-xs"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Card de Harmonização */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-3.5 flex items-start gap-3 mt-1">
            <div className="bg-amber-950/40 p-2 rounded-xl text-amber-400 shrink-0">
              <Wine size={16} />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-300">
                Sugestão do Sommelier
              </h5>
              <p className="text-xs text-zinc-400 leading-relaxed mt-0.5">
                {activeDish.pairings}
              </p>
            </div>
          </div>

          {/* Carrossel Horizontal de Pratos */}
          <div className="pt-4 border-t border-zinc-900">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Mais opções de sushi
              </h3>
              <span className="text-[11px] text-zinc-500">Toque para ver em 3D</span>
            </div>

            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {filteredDishes.map((dish) => {
                const isSelected = dish.id === activeDish.id;
                return (
                  <button
                    key={dish.id}
                    onClick={() => selectDish(dish)}
                    className={classNames(
                      'shrink-0 w-40 p-2.5 rounded-2xl border text-left transition-all duration-150 flex flex-col gap-2',
                      isSelected
                        ? 'bg-zinc-900 border-rose-500 shadow-md ring-1 ring-rose-500/30'
                        : 'bg-zinc-900/40 hover:bg-zinc-900 border-zinc-800/60'
                    )}
                  >
                    <div className="w-full h-24 rounded-xl overflow-hidden bg-zinc-950 flex items-center justify-center">
                      {dish.imageUrl ? (
                        <img
                          src={dish.imageUrl}
                          alt={dish.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🍣</span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white truncate">
                        {dish.name}
                      </h4>
                      <span className="text-xs font-black text-rose-500 mt-1 block">
                        R$ {dish.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* BARRA INFERIOR FIXA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 p-3 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">
              Total do Item
            </span>
            <span className="text-lg font-black text-white">
              R$ {activeDish.price.toFixed(2).replace('.', ',')}
            </span>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-sm py-3 px-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all"
          >
            <Phone size={16} />
            <span>Pedir via WhatsApp</span>
          </a>
        </div>
      </div>

      {/* MODAL DO SOMMELIER IA */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-6 duration-200">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-950/50 rounded-xl text-rose-400">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Sommelier Sushiman IA</h3>
                  <p className="text-[11px] text-zinc-400">Tire dúvidas sobre {activeDish.name}</p>
                </div>
              </div>

              <button
                onClick={() => setAiModalOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-full hover:bg-zinc-800 transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Perguntas rápidas */}
            <div className="flex flex-wrap gap-1.5">
              {[
                'Qual bebida combina?',
                'Tem lactose?',
                'O que é o molho Tarê?'
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => handleAskChef(q)}
                  className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full border border-zinc-700/60 transition"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Resposta do Chef */}
            {aiAnswer && (
              <div className="bg-zinc-950 border border-zinc-800 p-3.5 rounded-2xl text-xs text-zinc-200 leading-relaxed">
                <span className="font-bold text-rose-400 block mb-1">Resposta do Sushiman:</span>
                {aiAnswer}
              </div>
            )}

            {/* Input de Pergunta */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAskChef(aiQuery);
              }}
              className="flex gap-2 pt-1"
            >
              <input
                type="text"
                placeholder="Pergunte sobre ingredientes, preparo..."
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                className="flex-1 bg-zinc-950 border border-zinc-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition"
              >
                {aiLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
