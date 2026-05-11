"use client";

import { motion } from "framer-motion";
import { Gem, Headphones, ShieldCheck, Truck } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

const highlights = [
  {
    icon: Truck,
    title: "Frete grátis",
    description: "Envio grátis em compras selecionadas e postagem rápida para capitais."
  },
  {
    icon: Gem,
    title: "Qualidade premium",
    description: "Tecidos nobres, caimento testado e acabamento com padrão de boutique."
  },
  {
    icon: Headphones,
    title: "Atendimento exclusivo",
    description: "Consultoria de estilo para escolher tamanho, composição e ocasião."
  },
  {
    icon: ShieldCheck,
    title: "Pagamento seguro",
    description: "Fluxo preparado para checkout protegido, antifraude e múltiplos meios."
  }
];

export function Highlights() {
  return (
    <section id="destaques" className="bg-ink-950 px-5 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionHeading eyebrow="Experiencia Ces" title="Detalhes que elevam a compra">
            Do primeiro clique ao pós-venda, a jornada foi desenhada para parecer tão
            refinada quanto as peças da coleção.
          </SectionHeading>
        </Reveal>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06}>
              <motion.div
                whileHover={{ y: -6 }}
                className="h-full rounded-3xl border border-white/10 bg-noir-glow p-6 shadow-noir backdrop-blur-sm"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/28 bg-gold/10 text-gold">
                  <item.icon size={24} />
                </div>
                <h3 className="mt-7 font-display text-3xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/58">{item.description}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
