"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LuxuryButton } from "@/components/ui/LuxuryButton";

export function Hero() {
  return (
    <section className="relative flex min-h-[86svh] items-end overflow-hidden bg-black px-5 pb-12 pt-28 sm:px-6 lg:px-8">
      <Image
        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=2200&q=90"
        alt="Editorial de moda feminina premium"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.56)_42%,rgba(0,0,0,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_34%,rgba(212,175,55,0.2),transparent_32%)]" />
      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="absolute bottom-10 right-8 hidden h-48 w-48 rounded-full border border-gold/25 lg:block"
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/28 bg-black/28 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur-xl">
            <Sparkles size={15} />
            Nova coleção
          </span>
          <h1 className="mt-6 font-display text-6xl leading-[0.98] text-white sm:text-7xl lg:text-8xl">
            C&S Fashion
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/72 md:text-xl">
            Moda feminina premium para mulheres que transformam presença em assinatura.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LuxuryButton href="#produtos">
              Comprar agora
              <ArrowRight size={17} />
            </LuxuryButton>
            <LuxuryButton href="#sobre" variant="ghost">
              Conhecer a marca
            </LuxuryButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 grid max-w-3xl grid-cols-3 gap-3 text-center sm:gap-4"
        >
          {[
            ["12k+", "clientes"],
            ["4.9", "avaliação"],
            ["48h", "envio"]
          ].map(([value, label]) => (
            <div
              key={label}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-4 backdrop-blur-xl"
            >
              <strong className="block font-display text-2xl text-gold md:text-3xl">
                {value}
              </strong>
              <span className="text-[11px] uppercase tracking-[0.2em] text-white/56">
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
