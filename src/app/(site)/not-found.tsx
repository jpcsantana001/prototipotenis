import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 pt-16 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">404</span>
      <h1 className="mt-3 font-display text-4xl font-bold tracking-tight">Esse par não existe.</h1>
      <p className="mt-3 max-w-sm text-fg-muted">O link pode ter mudado ou o produto saiu de linha.</p>
      <Link href="/catalogo" className="mt-8 rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg hover:bg-white">
        Ver catálogo
      </Link>
    </div>
  );
}
