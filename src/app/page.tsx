import { Gerador } from "@/components/Gerador";

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:py-10">
      <header className="mb-6 sm:mb-10 sm:text-center">
        <h1 className="font-display text-3xl font-black text-stone-900 sm:text-5xl">
          Amigos da <span className="text-orange-500">Adoção</span>
        </h1>
        <p className="mt-2 text-stone-600 sm:text-lg">Card pronto para postar em 1 minuto.</p>
      </header>
      <Gerador />
      <footer className="mt-12 border-t border-stone-200 pt-6 pb-28 text-center text-sm text-stone-500 lg:pb-6">
        Feito por{" "}
        <a href="https://eokinha.com.br" target="_blank" rel="noopener" className="font-semibold text-orange-600 underline-offset-2 hover:underline">
          eokinha.com.br
        </a>
      </footer>
    </main>
  );
}
