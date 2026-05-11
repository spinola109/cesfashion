"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Crown, Scissors, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const pillars = [
  {
    icon: Crown,
    title: "Curadoria autoral",
    description: "Cada peça entra na coleção por caimento, textura e potencial de composição."
  },
  {
    icon: Scissors,
    title: "Acabamento premium",
    description: "Costuras, forros e ferragens pensados para vestir bem por muitas temporadas."
  },
  {
    icon: Sparkles,
    title: "Elegância essencial",
    description: "Linhas limpas, tons sofisticados e detalhes que valorizam sem excessos."
  }
];

export function BrandStory() {
  return (
    <section id="sobre" className="relative overflow-hidden bg-black px-5 py-20 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-luxury-radial opacity-80" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <Reveal>
          <div className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-white/10 shadow-noir">
            <Image
              src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1500&q=88"
              alt="Mulher usando roupa elegante da coleção Ces Fashion"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/8 to-transparent" />
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/12 bg-black/42 p-5 backdrop-blur-xl"
            >
              <p className="text-sm uppercase tracking-[0.28em] text-gold">Desde 2026</p>
              <p className="mt-2 font-display text-3xl text-white">Ateliê digital de moda feminina</p>
            </motion.div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold">
              Sobre a marca
            </p>
            <h2 className="mt-4 font-display text-5xl leading-tight text-white md:text-7xl">
              Luxo silencioso para uma rotina extraordinária.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/64">
              A Ces Fashion nasceu para traduzir moda premium em escolhas inteligentes:
              peças de impacto, versáteis, com acabamento sofisticado e uma experiência
              de compra que respeita o tempo da cliente.
            </p>
            <div className="mt-10 grid gap-4">
              {pillars.map((pillar) => (
                <div
                  key={pillar.title}
                  className="grid gap-4 rounded-3xl border border-white/10 bg-white/[0.045] p-5 backdrop-blur-sm sm:grid-cols-[3rem_1fr]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold/12 text-gold">
                    <pillar.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-white">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/58">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
