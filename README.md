# Boneti 3D — protótipo de redesign

Loja de tênis com **3D interativo**: hero com scroll storytelling, catálogo com cards em tilt 3D e página de produto com visualizador 360° e troca de cor em tempo real.

Protótipo de proposta comercial da **HUB33 Inteligência Criativa** para a Boneti Store. O diagnóstico do site atual está em [`docs/DIAGNOSTICO-bonetistore.md`](docs/DIAGNOSTICO-bonetistore.md).

## Stack

| Camada | Escolha | Por quê |
| --- | --- | --- |
| Framework | **Next.js 16** (App Router, Cache Components) | Páginas estáticas pré-renderizadas, deploy direto na Vercel |
| 3D | **three.js + React Three Fiber 9 + drei** | Declarativo, integra com React 19, ecossistema maduro |
| Animação | **motion** (ex-Framer Motion) | `useScroll` acelerado por ScrollTimeline, transições de layout |
| Estilo | **Tailwind 4** + tokens CSS em `globals.css` | Tema escuro consistente, fácil de ajustar à identidade final |
| Fontes | `@fontsource-variable` (Space Grotesk + Inter) | Self-hosted — sem dependência do Google Fonts |

## Rodando

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run lint
```

## Estrutura

```
src/
  app/
    layout.tsx              # html/body + CSS global
    (site)/                 # rotas públicas com navbar/rodapé/carrinho
      page.tsx              # home: hero 3D + storytelling, destaques, marca, CTA
      catalogo/page.tsx     # grid com filtros (linha, cor, tamanho, preço, destaque)
      produto/[slug]/       # visualizador 360°, cores, tamanhos, carrinho
      error.tsx · not-found.tsx
    dev/thumb/page.tsx      # utilitário: renderiza thumbs do modelo (não linkado)
  components/
    three/ShoeModel.tsx     # carrega o GLB e aplica KHR_materials_variants
    three/HeroScene.tsx     # keyframes do scroll, parallax do mouse
    three/ProductViewer.tsx # OrbitControls, auto-rotação, zoom
    three/Lighting.tsx      # estúdio procedural (sem HDR externo)
    Hero.tsx · Catalog.tsx · ProductDetail.tsx
    ui/                     # Navbar, Footer, Cart, ProductCard, TiltCard
  lib/products.ts           # dados de demonstração (9 SKUs = 3 linhas × 3 cores)
public/
  models/shoe.glb           # 485 KB (Draco + WebP) — original tinha 7,8 MB
  draco/                    # decoder servido localmente
  thumbs/*.webp             # pré-renderizadas a partir do GLB
scripts/render-thumbs.mjs   # gera as thumbs com Playwright
```

## Como o 3D funciona

- **Um único modelo** (`shoe.glb`) alimenta hero, viewer e thumbs. Ele usa a extensão `KHR_materials_variants`: três materiais (Street, Beach, Midnight) compartilham a mesma geometria, e a troca de cor é só uma troca de `mesh.material` — instantânea, sem novo download.
- **Hero**: o `Canvas` fica `sticky` dentro de uma seção de `480vh`. O progresso do scroll (0→1) é interpolado entre keyframes de rotação/posição/escala em `HeroScene.tsx` (`KEYS`); a cor muda em faixas definidas em `variantForProgress`. O mouse adiciona parallax num grupo "pivot" separado para não brigar com o scroll. `prefers-reduced-motion` desliga flutuação e parallax.
- **Viewer**: `OrbitControls` com limites de zoom/ângulo; auto-rotação pausa ao interagir e volta após 4 s.
- **Cards**: tilt via CSS custom properties (`--rx/--ry/--mx/--my`) atualizadas em `pointermove` — sem re-render do React; camadas com `translateZ` dão profundidade.
- **Iluminação** é 100% procedural (`<Environment>` + `<Lightformer>`), então não há HDR de 2–8 MB para baixar.

## Regenerar thumbs

```bash
npm run build && npm run start &
npm i -D playwright sharp
node scripts/render-thumbs.mjs            # usa o Chromium do Playwright
# ou: CHROMIUM_PATH=/caminho/chrome node scripts/render-thumbs.mjs
```

## Deploy na Vercel

Projeto padrão Next — `vercel` ou importar o repositório. Sem variáveis de ambiente obrigatórias. Recomendado após o deploy: ajustar `metadataBase` em `src/app/layout.tsx` para o domínio final.

## O que falta para virar loja real

1. **Catálogo e checkout**: trocar `lib/products.ts` por Shopify Storefront API (a loja atual já está no Shopify) e o carrinho em memória pela Cart API; o botão "Finalizar compra" redireciona para o checkout Shopify.
2. **Modelos 3D dos produtos reais**: fotogrametria ou modelagem por SKU, exportados em GLB com `KHR_materials_variants` por cor. O pipeline de otimização (`gltf-transform optimize --compress draco --texture-compress webp`) já está validado: 7,8 MB → 485 KB.
3. **Identidade visual definitiva** (logo, paleta): os tokens estão centralizados em `globals.css`.
4. **Analytics/observabilidade**: Vercel Analytics + Sentry em `error.tsx`.
5. **Rota `/dev/thumb`**: remover ou proteger antes de ir para produção.

## Créditos

Modelo 3D "Materials Variants Shoe" © 2021 Shopify, distribuído em [Khronos glTF Sample Assets](https://github.com/KhronosGroup/glTF-Sample-Assets) sob [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). O crédito está no rodapé do site e deve ser mantido enquanto o modelo for usado.
