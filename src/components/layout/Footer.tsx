"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Camera, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";

const footerLinks = [
  "Trocas e devoluções",
  "Guia de medidas",
  "Política de privacidade",
  "Programa VIP"
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:px-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="relative h-14 w-14 overflow-hidden rounded-full border border-gold/45 bg-black shadow-gold-soft ring-1 ring-white/10">
              <Image
                src="/brand/cs-fashion-logo.jpg"
                alt="Logo C&S Fashion"
                fill
                sizes="56px"
                className="object-cover"
              />
            </span>
            <span>
              <span className="block font-display text-3xl">C&S Fashion</span>
              <span className="text-xs uppercase tracking-[0.34em] text-gold">Luxury wear</span>
            </span>
          </Link>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/58">
            Moda feminina premium para mulheres que escolhem elegância com presença,
            conforto e acabamento impecável.
          </p>
          <div className="mt-7 flex gap-3">
            {[Camera, MessageCircle, Mail].map((Icon, index) => (
              <a
                key={index}
                href="#"
                aria-label="Rede social C&S Fashion"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:border-gold/50 hover:text-gold"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            Links úteis
          </h3>
          <div className="mt-6 grid gap-4">
            {footerLinks.map((item) => (
              <a
                href="#"
                key={item}
                className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-gold"
              >
                {item}
                <ArrowUpRight size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            Newsletter
          </h3>
          <p className="mt-6 text-sm leading-7 text-white/58">
            Receba lançamentos, preview de coleções e condições exclusivas.
          </p>
          <form className="mt-5 flex overflow-hidden rounded-full border border-white/12 bg-white/6">
            <input
              type="email"
              aria-label="E-mail para newsletter"
              placeholder="seuemail@exemplo.com"
              className="min-w-0 flex-1 bg-transparent px-5 py-4 text-sm text-white outline-none placeholder:text-white/35"
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="submit"
              aria-label="Enviar e-mail"
              className="m-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-black transition hover:bg-gold-100"
            >
              <Send size={18} />
            </motion.button>
          </form>
          <div className="mt-7 grid gap-3 text-sm text-white/56">
            <span className="inline-flex items-center gap-3">
              <Phone size={16} className="text-gold" />
              (11) 99999-2026
            </span>
            <span className="inline-flex items-center gap-3">
              <Mail size={16} className="text-gold" />
              contato@cesfashion.com
            </span>
            <span className="inline-flex items-center gap-3">
              <MapPin size={16} className="text-gold" />
              São Paulo, Brasil
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-5 py-6 text-center text-xs text-white/42">
        © 2026 C&S Fashion. Todos os direitos reservados.
      </div>
    </footer>
  );
}
