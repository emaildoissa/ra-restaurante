// src/services/hologram.ts
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

interface HologramOptions {
  imageUrl: string;
  name: string;
  price: string;
  description: string;
}

/**
 * 🍱 OPÇÃO 2: Apenas o Prato Limpo com a Foto Original (Sem hashis, sem enfeites)
 */
export async function buildSushiPlateGlb(imageUrl: string): Promise<string> {
  const scene = new THREE.Scene();

  // 1. Carrega a foto original em alta resolução
  const textureLoader = new THREE.TextureLoader();
  const foodTexture = await new Promise<THREE.Texture>((resolve) => {
    textureLoader.load(
      imageUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.flipY = false;
        resolve(tex);
      },
      undefined,
      () => {
        const canvas = document.createElement('canvas');
        canvas.width = 512; canvas.height = 512;
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#18181b';
        ctx.fillRect(0, 0, 512, 512);
        const fallbackTex = new THREE.CanvasTexture(canvas);
        fallbackTex.colorSpace = THREE.SRGBColorSpace;
        fallbackTex.flipY = false;
        resolve(fallbackTex);
      }
    );
  });

  // 2. Dimensões do prato quadrado: 24cm x 24cm com 1.2cm de espessura
  const tamanho = 0.24;
  const espessura = 0.012;

  // Cerâmica preta lisa para laterais e fundo do prato
  const matPrato = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.3,
    metalness: 0.1
  });

  // Topo com a foto original
  const matFoto = new THREE.MeshStandardMaterial({
    map: foodTexture,
    roughness: 0.25,
    metalness: 0.05
  });

  const geoPrato = new THREE.BoxGeometry(tamanho, espessura, tamanho);
  const uv = geoPrato.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setY(i, 1 - uv.getY(i));
  }

  // [ +X, -X, +Y (topo com a foto), -Y, +Z, -Z ]
  const materiais = [
    matPrato,
    matPrato,
    matFoto,  // Apenas a foto original em alta definição no topo
    matPrato,
    matPrato,
    matPrato
  ];

  const prato = new THREE.Mesh(geoPrato, materiais);
  prato.position.y = espessura / 2; // Repousa na mesa (Y = 0)
  scene.add(prato);

  // Iluminação limpa e natural
  const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
  dirLight.position.set(0, 2, 1);
  scene.add(dirLight);

  const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambLight);

  return new Promise<string>((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (glbBuffer) => {
        const blob = new Blob([glbBuffer as ArrayBuffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      },
      (error) => {
        console.error('Erro ao exportar Prato com Foto:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}

/**
 * 🪞 OPÇÃO 3: Totem/Card Display em Pé com Preço e Ingredientes
 */
export async function buildHologramGlb(options: HologramOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#09090b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 12;
  ctx.strokeRect(18, 18, canvas.width - 36, canvas.height - 36);

  const img = new Image();
  img.crossOrigin = 'anonymous';

  await new Promise<void>((resolve) => {
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = options.imageUrl;
  });

  const areaX = 40, areaY = 40, areaW = canvas.width - 80, areaH = 820;

  if (img.width && img.height) {
    const imgRatio = img.width / img.height;
    const areaRatio = areaW / areaH;
    let sx = 0, sy = 0, sw = img.width, sh = img.height;

    if (imgRatio > areaRatio) {
      sh = img.height;
      sw = img.height * areaRatio;
      sx = (img.width - sw) / 2;
      sy = 0;
    } else {
      sw = img.width;
      sh = img.width / areaRatio;
      sx = 0;
      sy = (img.height - sh) / 2;
    }

    ctx.drawImage(img, sx, sy, sw, sh, areaX, areaY, areaW, areaH);
  }

  // Preço
  ctx.fillStyle = '#e11d48';
  ctx.beginPath();
  if (ctx.roundRect) {
    ctx.roundRect(canvas.width - 300, 755, 240, 80, 20);
  } else {
    ctx.rect(canvas.width - 300, 755, 240, 80);
  }
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(options.price, canvas.width - 180, 812);

  // Nome
  ctx.textAlign = 'left';
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px sans-serif';
  ctx.fillText(options.name, 50, 950);

  ctx.fillStyle = '#e11d48';
  ctx.fillRect(50, 980, 160, 5);

  // Descrição
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '34px sans-serif';
  const palavras = options.description.split(' ');
  let linha = '';
  let y = 1045;
  for (let n = 0; n < palavras.length; n++) {
    const testeLinha = linha + palavras[n] + ' ';
    if (ctx.measureText(testeLinha).width > canvas.width - 100 && n > 0) {
      ctx.fillText(linha, 50, y);
      linha = palavras[n] + ' ';
      y += 46;
    } else {
      linha = testeLinha;
    }
  }
  ctx.fillText(linha, 50, y);

  ctx.fillStyle = '#e11d48';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText('✨ DISPLAY HOLOGRÁFICO • ESCALA REAL DE MESA (RA)', 50, 1210);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.flipY = false;

  const scene = new THREE.Scene();
  const group = new THREE.Group();

  const largura = 0.22;
  const altura = 0.275;
  const espessura = 0.012;

  const matCorpo = new THREE.MeshStandardMaterial({
    color: 0x18181b,
    roughness: 0.2,
    metalness: 0.8
  });

  const matFrente = new THREE.MeshStandardMaterial({
    map: texture,
    roughness: 0.15,
    metalness: 0.05
  });

  const geoPlaca = new THREE.BoxGeometry(largura, altura, espessura);
  const uv = geoPlaca.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    uv.setY(i, 1 - uv.getY(i));
  }

  const materiais = [matCorpo, matCorpo, matCorpo, matCorpo, matFrente, matCorpo];
  const placa = new THREE.Mesh(geoPlaca, materiais);
  placa.position.y = altura / 2 + 0.012;
  placa.rotation.x = -0.12;

  const geoBase = new THREE.CylinderGeometry(0.08, 0.10, 0.015, 32);
  const matBase = new THREE.MeshStandardMaterial({
    color: 0xbe123c,
    roughness: 0.3,
    metalness: 0.6
  });
  const base = new THREE.Mesh(geoBase, matBase);
  base.position.y = 0.0075;

  group.add(placa);
  group.add(base);
  scene.add(group);

  const light = new THREE.DirectionalLight(0xffffff, 1.2);
  light.position.set(0, 1, 2);
  scene.add(light);
  const ambient = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambient);

  return new Promise<string>((resolve, reject) => {
    const exporter = new GLTFExporter();
    exporter.parse(
      scene,
      (glbBuffer) => {
        const blob = new Blob([glbBuffer as ArrayBuffer], { type: 'model/gltf-binary' });
        const url = URL.createObjectURL(blob);
        resolve(url);
      },
      (error) => {
        console.error('Erro ao exportar Totem GLB:', error);
        reject(error);
      },
      { binary: true }
    );
  });
}
