import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-ink-950 px-5 py-8 text-pearl sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-gold"
        >
          <ArrowLeft size={16} />
          Voltar para a loja
        </Link>

        <div className="mt-8 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.22em] text-gold">
              <ShieldCheck size={17} />
              Administração
            </p>
            <h1 className="mt-4 font-display text-5xl text-white md:text-6xl">
              Controle da loja
            </h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-white/58">
            Cadastre e gerencie clientes, categorias, produtos, imagens, variações e
            estoque direto pelo site.
          </p>
        </div>
      </section>

      <div className="mt-8">
        <AdminDashboard />
      </div>
    </main>
  );
}
