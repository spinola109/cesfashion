import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-center text-pearl">
      <div className="max-w-lg">
        <p className="text-sm uppercase tracking-[0.34em] text-gold">404</p>
        <h1 className="mt-5 font-display text-5xl">Página não encontrada</h1>
        <p className="mt-5 text-white/64">
          A peça que você procurava saiu da vitrine. Volte para a coleção principal.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-gold-100"
        >
          Voltar para a loja
        </Link>
      </div>
    </main>
  );
}
