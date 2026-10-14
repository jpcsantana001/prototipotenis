"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Em produção: enviar para Sentry/observabilidade.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-16 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent-2">Algo deu errado</span>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight">Não conseguimos carregar esta página.</h1>
      <p className="mt-3 max-w-sm text-fg-muted">Tente novamente. Se persistir, fale com a gente pelo WhatsApp.</p>
      <button onClick={reset} className="mt-8 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg hover:bg-white">
        Tentar de novo
      </button>
    </div>
  );
}
