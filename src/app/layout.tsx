import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });
const fredoka = Fredoka({ variable: "--font-fredoka", subsets: ["latin"], weight: ["500", "600", "700"] });

export const metadata: Metadata = {
  title: "Amigos da Adoção · Gerador de cards de adoção e procura-se",
  description: "Crie cards de adoção e de animal perdido prontos para compartilhar nas redes sociais.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${nunito.variable} ${fredoka.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-50 font-sans text-stone-900">{children}</body>
    </html>
  );
}
