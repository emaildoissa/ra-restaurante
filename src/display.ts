// src/display.ts
import { buildSushiPlateGlb, buildHologramGlb } from './services/hologram';

const visor = document.getElementById('visor') as any;
const status = document.getElementById('status') as HTMLElement;
const btnAr = document.getElementById('btnAr') as HTMLButtonElement;

// 3 Botões de Opção
const btnOpcao1 = document.getElementById('btnOpcao1') as HTMLButtonElement;
const btnOpcao2 = document.getElementById('btnOpcao2') as HTMLButtonElement;
const btnOpcao3 = document.getElementById('btnOpcao3') as HTMLButtonElement;

const painelPersonalizar = document.getElementById('painelPersonalizar') as HTMLElement;
const fotoInput = document.getElementById('fotoInput') as HTMLInputElement;
const nomeInput = document.getElementById('nomeInput') as HTMLInputElement;
const precoInput = document.getElementById('precoInput') as HTMLInputElement;
const descInput = document.getElementById('descInput') as HTMLInputElement;
const btnAtualizar = document.getElementById('btnAtualizar') as HTMLButtonElement;

type ModoComparacao = 'glb' | 'foto-prato' | 'totem';
let modoAtual: ModoComparacao = 'glb'; // Inicia na Opção 1 que ele já tinha!
let imagemAtualUrl = '/models/Hot-Philadelfia.jpg';

// Cache para não re-gerar à toa
let cacheFotoPratoGlb: string | null = null;
let cacheTotemGlb: string | null = null;

function atualizarEstiloBotoes() {
  const estiloAtivo = 'flex-1 py-2.5 px-2 rounded-xl font-bold text-xs bg-rose-600 text-white shadow-lg transition text-center';
  const estiloInativo = 'flex-1 py-2.5 px-2 rounded-xl font-medium text-xs bg-zinc-900 text-zinc-400 hover:text-white transition text-center';

  if (btnOpcao1) btnOpcao1.className = modoAtual === 'glb' ? estiloAtivo : estiloInativo;
  if (btnOpcao2) btnOpcao2.className = modoAtual === 'foto-prato' ? estiloAtivo : estiloInativo;
  if (btnOpcao3) btnOpcao3.className = modoAtual === 'totem' ? estiloAtivo : estiloInativo;

  // Painel de textos só é necessário se estiver no Totem
  if (painelPersonalizar) {
    painelPersonalizar.style.display = modoAtual === 'totem' ? 'block' : 'none';
  }
}

async function carregarModo(modo: ModoComparacao) {
  modoAtual = modo;
  atualizarEstiloBotoes();

  if (!visor) return;

  if (modo === 'glb') {
    // OPÇÃO 1: O modelo 3D original que ele já tinha
    if (status) {
      status.innerText = '🍲 Carregando Prato 3D (.glb original)...';
      status.className = 'text-xs text-center text-amber-400 mt-2 font-medium';
    }
    visor.src = '/models/Hot-Philadelfia.glb';
    if (status) {
      status.innerText = '✅ Opção 1 pronta: Prato 3D original (.glb). Toque no botão de RA!';
      status.className = 'text-xs text-center text-emerald-400 mt-2 font-medium';
    }
    return;
  }

  if (modo === 'foto-prato') {
    // OPÇÃO 2: Apenas o prato com a foto original
    if (status) {
      status.innerText = '🍱 Gerando prato com a foto original em HD...';
      status.className = 'text-xs text-center text-amber-400 mt-2 font-medium';
    }

    try {
      if (!cacheFotoPratoGlb) {
        cacheFotoPratoGlb = await buildSushiPlateGlb(imagemAtualUrl);
      }
      visor.src = cacheFotoPratoGlb;
      if (status) {
        status.innerText = '✅ Opção 2 pronta: Foto original no prato. Toque no botão de RA!';
        status.className = 'text-xs text-center text-emerald-400 mt-2 font-medium';
      }
    } catch (e: any) {
      console.error(e);
      if (status) status.innerText = '❌ Erro ao gerar: ' + e.message;
    }
    return;
  }

  if (modo === 'totem') {
    // OPÇÃO 3: O totem em pé com preço e ingredientes
    if (status) {
      status.innerText = '🪞 Construindo Totem Display com Three.js...';
      status.className = 'text-xs text-center text-amber-400 mt-2 font-medium';
    }

    try {
      if (!cacheTotemGlb) {
        cacheTotemGlb = await buildHologramGlb({
          imageUrl: imagemAtualUrl,
          name: nomeInput?.value || 'Hot Philadélfia - 10 unidades',
          price: precoInput?.value || 'R$ 36,90',
          description: descInput?.value || 'Arroz, Salmão, Cream Cheese, Tarê e cebolinha.'
        });
      }
      visor.src = cacheTotemGlb;
      if (status) {
        status.innerText = '✅ Opção 3 pronta: Totem Display. Toque no botão de RA!';
        status.className = 'text-xs text-center text-emerald-400 mt-2 font-medium';
      }
    } catch (e: any) {
      console.error(e);
      if (status) status.innerText = '❌ Erro ao gerar totem: ' + e.message;
    }
    return;
  }
}

// Configuração dos 3 botões
if (btnOpcao1) btnOpcao1.addEventListener('click', () => carregarModo('glb'));
if (btnOpcao2) btnOpcao2.addEventListener('click', () => carregarModo('foto-prato'));
if (btnOpcao3) btnOpcao3.addEventListener('click', () => carregarModo('totem'));

// Disparo da Realidade Aumentada
if (btnAr) {
  btnAr.addEventListener('click', () => {
    if (visor && typeof visor.activateAR === 'function') {
      visor.activateAR();
    }
  });
}

// Upload de nova foto
if (fotoInput) {
  fotoInput.addEventListener('change', (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      imagemAtualUrl = URL.createObjectURL(file);
      cacheFotoPratoGlb = null;
      cacheTotemGlb = null;
      carregarModo(modoAtual);
    }
  });
}

if (btnAtualizar) {
  btnAtualizar.addEventListener('click', () => {
    cacheTotemGlb = null;
    carregarModo('totem');
  });
}

// Inicia na Opção 1 (.glb)
carregarModo('glb');
