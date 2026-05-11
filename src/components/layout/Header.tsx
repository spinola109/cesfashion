"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useShop } from "@/providers/ShopProvider";

const navItems = [
  { label: "Coleção", href: "#produtos" },
  { label: "Vestidos", href: "#produtos" },
  { label: "Marca", href: "#sobre" },
  { label: "Atelier", href: "#destaques" }
];

export function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { cartCount, searchQuery, setSearchQuery } = useShop();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  function handleSearchToggle() {
    setIsSearchOpen((value) => !value);
  }

  function handleSearchChange(query: string) {
    setSearchQuery(query);
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleLogoClick(event: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") {
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <header
      className={cn(
        "fixed left-0 right-0 top-0 z-50 transition duration-300",
        scrolled
          ? "border-b border-white/10 bg-black/78 shadow-noir backdrop-blur-2xl"
          : "bg-gradient-to-b from-black/68 to-transparent"
      )}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" onClick={handleLogoClick} className="group inline-flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-full border border-gold/45 bg-black shadow-gold-soft ring-1 ring-white/10 transition duration-300 group-hover:border-gold group-hover:shadow-[0_18px_42px_rgba(212,175,55,0.22)]">
            <Image
              src="/brand/cs-fashion-logo.jpg"
              alt="Logo C&S Fashion"
              fill
              priority
              sizes="48px"
              className="object-cover"
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl text-white">C&S</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.36em] text-gold">
              Fashion
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-white/68 transition hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Buscar produtos"
              onClick={handleSearchToggle}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-full border text-white/72 transition hover:border-gold/40 hover:text-gold",
                isSearchOpen || searchQuery
                  ? "border-gold/45 bg-gold/10 text-gold"
                  : "border-white/10 bg-white/5"
              )}
            >
              <Search size={18} />
            </button>
            <AnimatePresence>
              {isSearchOpen ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 270, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="relative overflow-hidden"
                >
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(event) => handleSearchChange(event.target.value)}
                    placeholder="Buscar produto..."
                    className="h-11 w-[270px] rounded-full border border-white/10 bg-black/48 px-5 pr-11 text-sm text-white outline-none backdrop-blur-xl placeholder:text-white/36 focus:border-gold/50"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      aria-label="Limpar busca"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white/50 transition hover:bg-white/10 hover:text-gold"
                    >
                      <X size={15} />
                    </button>
                  ) : null}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <Link
            href="/account"
            aria-label="Minha conta"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/72 transition hover:border-gold/40 hover:text-gold"
          >
            <UserRound size={18} />
          </Link>
          <Link
            href="/cart"
            aria-label="Carrinho"
            className="relative flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold transition hover:bg-gold hover:text-black"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-black">
                {cartCount}
              </span>
            ) : null}
          </Link>
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          onClick={() => setIsOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/6 text-white md:hidden"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}
            className="md:hidden"
          >
            <div className="mx-4 mb-4 rounded-3xl border border-white/10 bg-black/92 p-5 shadow-noir backdrop-blur-2xl">
              <nav className="grid gap-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl px-4 py-3 text-white/76 transition hover:bg-white/8 hover:text-gold"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="relative mt-4">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gold"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  placeholder="Buscar produto..."
                  className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/36 focus:border-gold/50"
                />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  href="/account"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/76"
                >
                  <UserRound size={17} />
                  Conta
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-4 py-3 text-sm font-semibold text-black"
                >
                  <ShoppingBag size={17} />
                  Carrinho {cartCount > 0 ? `(${cartCount})` : ""}
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
