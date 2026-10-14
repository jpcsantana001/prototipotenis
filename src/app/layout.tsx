import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://prototipotenis.vercel.app"),
  title: {
    default: "Boneti Store — Sneakers e streetwear em 3D",
    template: "%s · Boneti Store",
  },
  description:
    "Tênis, camisetas, moletons, conjuntos e acessórios com visualização 3D. +600 produtos, até 12x, envio para todo o Brasil.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Boneti Store",
    title: "Boneti Store — Sneakers e streetwear em 3D",
    description: "Tênis, camisetas, moletons e acessórios com visualização 3D.",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="grain flex min-h-full flex-col">{children}</body>
    </html>
  );
}
