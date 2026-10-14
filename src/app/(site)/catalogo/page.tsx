import type { Metadata } from "next";
import { Suspense } from "react";
import { Catalog } from "@/components/Catalog";
import { ProductCardSkeleton } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/products";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Todos os tênis Boneti com visualização 3D, filtros por linha, cor, tamanho e preço.",
};

function Fallback() {
  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8">
      <div className="skeleton mb-8 h-12 w-64 rounded-lg" />
      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
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
    itemListElement: PRODUCTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `/produto/${p.slug}`,
      name: p.name,
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
