import Link from "next/link";
import { ArrowLeft, Crown, UserRound } from "lucide-react";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-ink-950 px-6 py-10 text-pearl">
      <section className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-noir md:p-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-gold"
        >
          <ArrowLeft size={16} />
          Voltar para a loja
        </Link>
        <div className="mt-12 flex flex-col items-start gap-8 md:flex-row md:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
            <UserRound size={32} />
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold">Área exclusiva</p>
            <h1 className="mt-4 font-display text-5xl">Minha conta</h1>
            <p className="mt-4 max-w-2xl text-white/64">
              Espaço estruturado para login, histórico de pedidos, wishlist,
              endereços e benefícios de clientes VIP.
            </p>
          </div>
        </div>
        <div className="mt-10 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-white/60">
          <Crown className="text-gold" size={20} />
          Pronto para conectar autenticação e programas de fidelidade.
        </div>
      </section>
    </main>
  );
}
