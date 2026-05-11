import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ces Fashion | Moda feminina premium",
  description:
    "E-commerce premium de moda feminina com vestidos, conjuntos, blusas, calças e acessórios sofisticados.",
  openGraph: {
    title: "C&S Fashion | Moda feminina premium",
    description:
      "Uma experiência digital elegante para uma loja de roupas femininas premium.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
