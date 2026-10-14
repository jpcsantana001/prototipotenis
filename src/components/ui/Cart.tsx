"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { formatBRL, type Product } from "@/lib/products";

export interface CartItem {
  product: Product;
  size: number;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  total: number;
  add: (product: Product, size: number) => void;
  remove: (slug: string, size: number) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}

/**
 * Carrinho em memória (demo). Em produção: Shopify Storefront Cart API
 * ou um checkout próprio; o estado deve persistir em cookie/localStorage.
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const add = useCallback((product: Product, size: number) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.product.slug === product.slug && i.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + 1 };
        return next;
      }
      return [...prev, { product, size, qty: 1 }];
    });
    setToast(`${product.name} · tam. ${size} adicionado`);
    setTimeout(() => setToast(null), 2600);
  }, []);

  const remove = useCallback((slug: string, size: number) => {
    setItems((prev) => prev.filter((i) => !(i.product.slug === slug && i.size === size)));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const total = items.reduce((n, i) => n + i.qty * i.product.price, 0);
    return { items, count, total, add, remove, open, setOpen };
  }, [items, add, remove, open]);

  return (
    <CartContext.Provider value={value}>
      {children}
      <CartDrawer />
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-bg-elev/90 px-5 py-3 text-sm shadow-2xl backdrop-blur"
          >
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-success" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

function CartDrawer() {
  const { items, total, open, setOpen, remove } = useCart();
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            aria-label="Fechar carrinho"
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.aside
            role="dialog"
            aria-label="Carrinho"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-line bg-bg-elev"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
          >
            <header className="flex items-center justify-between border-b border-line px-6 py-5">
              <h2 className="font-display text-lg font-semibold">Seu carrinho</h2>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-fg-muted hover:bg-white/5 hover:text-fg"
                aria-label="Fechar"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-fg-muted">
                  <div className="text-5xl">👟</div>
                  <p className="text-sm">Seu carrinho está vazio.</p>
                  <button onClick={() => setOpen(false)} className="text-sm text-accent underline-offset-4 hover:underline">
                    Ver catálogo
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-line">
                  {items.map((i) => (
                    <li key={`${i.product.slug}-${i.size}`} className="flex gap-4 py-4">
                      <div
                        className="h-20 w-20 shrink-0 rounded-xl"
                        style={{ background: `radial-gradient(circle at 40% 30%, ${i.product.colorway === "Street" ? "#3a3a40" : i.product.colorway === "Beach" ? "#f0cdd1" : "#2a9ae0"}, #111114 75%)` }}
                      />
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">{i.product.name}</span>
                        <span className="text-xs text-fg-muted">
                          Tam. {i.size} · {i.qty}×
                        </span>
                        <span className="mt-auto text-sm">{formatBRL(i.product.price * i.qty)}</span>
                      </div>
                      <button
                        onClick={() => remove(i.product.slug, i.size)}
                        className="self-start text-xs text-fg-faint hover:text-accent-2"
                      >
                        Remover
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <footer className="border-t border-line px-6 py-5">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-fg-muted">Subtotal</span>
                <span className="font-semibold">{formatBRL(total)}</span>
              </div>
              <button
                disabled={items.length === 0}
                className="w-full rounded-full bg-fg py-3.5 text-sm font-semibold text-bg transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Finalizar compra
              </button>
              <p className="mt-3 text-center text-[11px] text-fg-faint">Demo: o checkout não está conectado.</p>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
