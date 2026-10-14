import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { ProductCardSkeleton } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Catálogo",
  description: `${PRODUCTS.length} produtos: tênis, camisetas, moletons, conjuntos, calças, shorts, bonés e acessórios. Filtre por modelo, marca, tamanho e preço.`,
};

function Fallback() {
  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8">
      <div className="skeleton mb-8 h-16 w-72 rounded-sm" />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    numberOfItems: PRODUCTS.length,
    itemListElement: PRODUCTS.slice(0, 50).map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/produto/${p.handle}`,
      name: p.title,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <Suspense fallback={<Fallback />}>
        <Catalog />
      </Suspense>
    </>
  );
}
