"use client";

import { motion } from "framer-motion";
import { Headphones, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";

const highlights = [
  {
    icon: Truck,
    title: "Envio rápido",
    description: "Postagem organizada para compras aprovadas."
  },
  {
    icon: RotateCcw,
    title: "Troca fácil",
    description: "Apoio para tamanho, caimento e substituição."
  },
  {
    icon: Headphones,
    title: "Atendimento",
    description: "Suporte direto antes e depois da compra."
  },
  {
    icon: ShieldCheck,
    title: "Compra segura",
    description: "Carrinho preparado para checkout protegido."
  }
];

export function Highlights() {
  return (
    <section id="destaques" className="bg-ink-950 px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <div className="mb-7 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                Compra
              </p>
              <h2 className="mt-2 font-display text-3xl text-white md:text-4xl">
                Informações úteis da loja
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-white/60">
              O essencial para decidir e finalizar a compra sem desviar da vitrine.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.04}>
              <motion.div
                whileHover={{ y: -3 }}
                className="grid h-full grid-cols-[2.75rem_1fr] gap-4 rounded-lg border border-white/10 bg-white/[0.045] p-4"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-gold/10 text-gold">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/58">{item.description}</p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
