"use client";

import { useState } from "react";

interface SketchfabEmbedProps {
  /** ID do modelo no Sketchfab (o trecho depois de /models/). */
  modelId: string;
  title: string;
  /** Página do modelo e do autor, para o crédito obrigatório. */
  modelUrl: string;
  author: string;
  authorUrl: string;
  className?: string;
}

/**
 * Incorporação oficial do Sketchfab (iframe), com "clique para carregar":
 * o player pesa vários MB, então só é baixado quando o visitante pede.
 * O modelo continua hospedado no Sketchfab e o crédito ao autor fica visível,
 * como o próprio código de incorporação do Sketchfab exige.
 */
export function SketchfabEmbed({ modelId, title, modelUrl, author, authorUrl, className = "" }: SketchfabEmbedProps) {
  const [active, setActive] = useState(false);
  const params = "autostart=1&ui_theme=dark&ui_hint=2&dnt=1";

  return (
    <figure className={className}>
      <div className="relative aspect-square overflow-hidden rounded-card border border-line bg-bg-card sm:aspect-[4/3]">
        {active ? (
          <iframe
            title={title}
            src={`https://sketchfab.com/models/${modelId}/embed?${params}`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
          />
        ) : (
          <button
            onClick={() => setActive(true)}
            className="group absolute inset-0 flex flex-col items-center justify-center gap-4 text-center"
            aria-label={`Carregar o modelo 3D ${title}`}
          >
            <div className="glow absolute inset-0" aria-hidden />
            <span className="relative flex h-20 w-20 items-center justify-center rounded-full border border-white/30 transition group-hover:scale-110 group-hover:border-accent">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <path d="M12 3 3 7.5v9L12 21l9-4.5v-9L12 3Z" />
                <path d="M3 7.5 12 12l9-4.5M12 12v9" />
              </svg>
            </span>
            <span className="display relative text-3xl">Carregar 3D</span>
            <span className="relative text-xs text-fg-muted">Arraste para girar · pinça ou scroll para zoom</span>
          </button>
        )}
      </div>
      <figcaption className="mt-2 text-[11px] text-fg-faint">
        <a href={modelUrl} target="_blank" rel="nofollow noreferrer" className="font-semibold text-fg-muted hover:text-fg">
          {title}
        </a>{" "}
        por{" "}
        <a href={authorUrl} target="_blank" rel="nofollow noreferrer" className="font-semibold text-fg-muted hover:text-fg">
          {author}
        </a>{" "}
        no{" "}
        <a href="https://sketchfab.com" target="_blank" rel="nofollow noreferrer" className="font-semibold text-fg-muted hover:text-fg">
          Sketchfab
        </a>{" "}
        · exemplo de referência, não é um produto à venda nesta loja.
      </figcaption>
    </figure>
  );
}
