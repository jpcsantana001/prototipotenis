import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/ProductDetail";
import { PRODUCTS, getProduct, img } from "@/lib/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({ params }: PageProps<"/produto/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return { title: "Produto não encontrado" };
  const desc = `${product.title} por ${product.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} em até 12x. ${product.available ? "Em estoque" : "Esgotado"} na Boneti Store.`;
  return {
    title: product.title,
    description: desc,
    openGraph: { title: product.title, description: desc, images: product.images[0] ? [img(product.images[0], 1200)] : [] },
  };
}

export default async function ProductPage({ params }: PageProps<"/produto/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images,
    sku: product.handle,
    brand: { "@type": "Brand", name: "Boneti Store" },
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: product.price.toFixed(2),
      availability: product.available ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `/produto/${product.handle}`,
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductDetail key={product.handle} product={product} />
    </>
  );
}
