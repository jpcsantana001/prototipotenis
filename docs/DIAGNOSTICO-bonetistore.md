# Diagnóstico técnico — bonetistore.com

**Página auditada:** `/collections/todos-os-tenis` · **Data:** 14/10/2026 · **Plataforma:** Shopify, tema customizado "tema-v11"
**Método:** inspeção em Chrome desktop (1328×877), Performance API, console e DOM. Números são de uma única carga em conexão rápida; em 4G mobile os tempos tendem a ser 3–5× maiores.

## Resumo executivo

O site funciona, mas entrega uma experiência genérica e pesada: 13,5 MB por página, 102 scripts, erro de JavaScript recorrente, nenhum `<h1>` e filtros que não refletem como o público compra tênis (modelo e cor). O servidor (CDN Shopify) responde em 24 ms — todo o custo está no front-end e nos apps de terceiros.

## Desempenho

| Métrica | Valor | Referência |
| --- | --- | --- |
| Peso total transferido | **13,5 MB** (471 requisições) | < 2 MB para e-commerce mobile |
| Imagens | **11,2 MB** em 123 arquivos | WebP/AVIF + `srcset` cortaria 60–80% |
| Scripts | **102** arquivos, 565 KB | Shopify base + ~6 apps de terceiros |
| `<link>` (preload/prefetch) | **164** | Excesso anula o benefício do preload |
| TTFB | 24 ms | Excelente (CDN) |
| DOMContentLoaded | 1,4 s | — |
| Load | 2,3 s (desktop, banda larga) | Estimativa mobile 4G: 6–10 s |
| Cards carregados com infinite scroll | 144 (de 380) | Sem virtualização; a página só cresce |

Terceiros detectados: areviewsapp, sabinovision, shop.app, Google Ads/Analytics (doubleclick, stats.g). Vários carregam antes do conteúdo principal.

## Bugs

- `TypeError: e.target.closest is not a function` — disparado 3× no carregamento, em um listener global em `document` (linha ~6378 do HTML inline). O handler assume que `event.target` é sempre um `Element`; falha quando o alvo é nó de texto ou SVG. Correção: `const el = e.target instanceof Element ? e.target : e.target?.parentElement`.

## SEO e semântica

- **Nenhum `<h1>`** na página de coleção. "TODOS OS TÊNIS" é um elemento visual sem papel semântico.
- Meta description: `"Boneti Store | Oficial"` — não descreve a página; desperdiça o snippet de busca.
- JSON-LD presente só para `Organization`. Faltam `ItemList` (coleção) e `Product`/`Offer` (produto), que habilitam preço e disponibilidade nos resultados do Google.
- 1 imagem sem `alt`; as demais usam o nome do produto (ok).
- `lang="pt-BR"` e `viewport` corretos.

## UX e design

- Navegação principal quebra em duas linhas no desktop ("QUEM SOMOS?" cai sozinho).
- Zero diferenciação: cards idênticos, fundo preto chapado, fotos no mesmo piso de madeira. Nada sinaliza destaque, lançamento ou best-seller além de um badge de "% OFF".
- Filtros disponíveis: disponibilidade, preço, tamanho. **Faltam modelo/linha, cor e marca** — os três critérios pelos quais esse público busca.
- Infinite scroll sem indicador de carregamento, sem estado vazio e sem contagem de "exibindo X de 380".
- Rodapé e políticas só aparecem após rolar os 380 itens, o que prejudica confiança (política de troca, CNPJ, contato).

## Observação legal

Os produtos são anunciados com nomes e grafismos de modelos de terceiros ("NK Air Force 1", "NK Dunk", "ADD"). Qualquer redesign deve usar identidade e catálogo próprios da Boneti; este protótipo não reproduz marcas ou designs de terceiros e usa um modelo 3D genérico com licença CC BY 4.0.

## O que o protótipo já resolve

| Problema | Protótipo |
| --- | --- |
| 13,5 MB / 471 requisições | Página de produto completa com modelo 3D: ~1 MB (GLB 485 KB + JS) |
| Fotos estáticas, sem diferenciação | Modelo 3D real em 360°, troca de cor instantânea, hero com storytelling |
| Sem `<h1>`, sem JSON-LD de produto | `<h1>` em todas as páginas, `ItemList` + `Product/Offer` |
| Filtros insuficientes | Linha, cor, tamanho (respeitando esgotados), preço, destaque + ordenação |
| Sem estados de loading/vazio | Skeletons, estado vazio com ação, erro de tamanho não escolhido, toast de carrinho |
| Nav quebrada | Navbar fixa com blur, menu mobile |
| Fonts/HDR externos | Tudo self-hosted; iluminação procedural |

## Próximos passos sugeridos

1. Apresentar o protótipo e validar direção visual com a Boneti.
2. Levantar o catálogo real (quantos SKUs, quais cores) para dimensionar a produção dos modelos 3D.
3. Definir integração: tema Shopify (Hydrogen/headless) ou Next + Storefront API.
4. Rodar Lighthouse no site atual em mobile para ter um baseline numérico oficial antes/depois.
