import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://boneti-3d.vercel.app"),
  title: {
    default: "Boneti Store — Tênis em 3D interativo",
    template: "%s · Boneti Store",
  },
  description:
    "Explore cada tênis em 360°, troque de cor em tempo real e escolha seu tamanho. Entrega para todo o Brasil em até 12x.",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Boneti Store",
    title: "Boneti Store — Tênis em 3D interativo",
    description: "Explore cada tênis em 360°, troque de cor em tempo real e escolha seu tamanho.",
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
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
