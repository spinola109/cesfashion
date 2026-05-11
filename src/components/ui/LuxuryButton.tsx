import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type LuxuryButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string;
  children: ReactNode;
  variant?: "gold" | "ghost";
};

export function LuxuryButton({
  href,
  children,
  variant = "gold",
  className,
  ...props
}: LuxuryButtonProps) {
  const classes = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-semibold uppercase tracking-[0.16em] transition duration-300",
    variant === "gold" &&
      "bg-gold text-black shadow-gold-soft hover:bg-gold-100 hover:shadow-[0_18px_52px_rgba(212,175,55,0.28)]",
    variant === "ghost" &&
      "border border-white/15 bg-white/5 text-white backdrop-blur-md hover:border-gold/50 hover:text-gold",
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
