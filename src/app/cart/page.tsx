"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CreditCard,
  LockKeyhole,
  Minus,
  Plus,
  ShoppingBag,
  Trash2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useShop } from "@/providers/ShopProvider";
import type { Product } from "@/types/product";

const categoryLabels: Record<Product["category"], string> = {
  vestidos: "Vestidos",
  conjuntos: "Conjuntos",
  blusas: "Blusas",
  calcas: "Calças",
  acessorios: "Acessórios"
};

export default function CartPage() {
  const {
    cartItems,
    cartTotal,
    clearCart,
    isCartReady,
    removeFromCart,
    updateCartItemQuantity
  } = useShop();

  return (
    <main className="min-h-screen bg-ink-950 px-5 py-8 text-pearl sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-gold"
        >
          <ArrowLeft size={16} />
          Voltar para a loja
        </Link>

        <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-noir md:p-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-gold">
                Sua seleção
              </p>
              <h1 className="mt-4 font-display text-5xl md:text-6xl">Seu carrinho</h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
                Os produtos escolhidos ficam salvos nesta página para a futura etapa de
                checkout, pagamento e entrega.
              </p>
            </div>
            {cartItems.length > 0 ? (
              <button
                type="button"
                onClick={clearCart}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 text-sm text-white/70 transition hover:border-gold/40 hover:text-gold"
              >
                <Trash2 size={16} />
                Limpar
              </button>
            ) : null}
          </div>

          {!isCartReady ? (
            <CartLoading />
          ) : cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_22rem]">
              <div className="grid gap-4">
                {cartItems.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-5 rounded-3xl border border-white/10 bg-black/28 p-4 sm:grid-cols-[7rem_1fr] md:p-5"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-white/5 sm:aspect-square">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="112px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                          {categoryLabels[item.category]}
                        </p>
                        <h2 className="mt-2 font-display text-3xl text-white">{item.name}</h2>
                        <p className="mt-2 max-w-xl text-sm leading-6 text-white/56">
                          {item.description}
                        </p>
                        <strong className="mt-3 block text-white">
                          {formatCurrency(item.price)}
                        </strong>
                      </div>
                      <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                        <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                          <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${item.name}`}
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity - 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-gold"
                          >
                            <Minus size={15} />
                          </button>
                          <span className="min-w-9 text-center text-sm font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${item.name}`}
                            onClick={() =>
                              updateCartItemQuantity(item.id, item.quantity + 1)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-gold"
                          >
                            <Plus size={15} />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="inline-flex items-center gap-2 text-sm text-white/46 transition hover:text-gold"
                        >
                          <Trash2 size={15} />
                          Remover
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <aside className="h-fit rounded-3xl border border-gold/20 bg-black/42 p-6 shadow-gold-soft">
                <p className="text-sm uppercase tracking-[0.24em] text-gold">Resumo</p>
                <div className="mt-6 space-y-4 border-b border-white/10 pb-6 text-sm text-white/62">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <strong className="text-white">{formatCurrency(cartTotal)}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Frete</span>
                    <strong className="text-gold">Grátis</strong>
                  </div>
                </div>
                <div className="mt-6 flex items-end justify-between">
                  <span className="text-sm text-white/58">Total</span>
                  <strong className="font-display text-4xl text-white">
                    {formatCurrency(cartTotal)}
                  </strong>
                </div>
                <button
                  type="button"
                  className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gold text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-gold-100"
                >
                  <CreditCard size={17} />
                  Finalizar
                </button>
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-xs leading-5 text-white/52">
                  <LockKeyhole className="shrink-0 text-gold" size={18} />
                  Checkout preparado para integração com pagamento seguro.
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function EmptyCart() {
  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-black/28 p-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold">
        <ShoppingBag size={32} />
      </div>
      <h2 className="mt-6 font-display text-4xl text-white">Seu carrinho está vazio</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-white/58">
        Escolha uma peça da coleção e ela aparecerá aqui automaticamente.
      </p>
      <Link
        href="/#produtos"
        className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-gold-100"
      >
        Ver coleção
      </Link>
    </div>
  );
}

function CartLoading() {
  return (
    <div className="mt-10 grid gap-4">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="grid gap-5 rounded-3xl border border-white/10 bg-black/28 p-4 sm:grid-cols-[7rem_1fr] md:p-5"
        >
          <div className="aspect-square animate-pulse rounded-2xl bg-white/10" />
          <div className="space-y-4">
            <div className="h-4 w-28 animate-pulse rounded-full bg-white/10" />
            <div className="h-8 w-64 max-w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-full animate-pulse rounded-full bg-white/10" />
            <div className="h-4 w-3/4 animate-pulse rounded-full bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}
