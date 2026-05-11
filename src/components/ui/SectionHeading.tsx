import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  children?: ReactNode;
};

export function SectionHeading({ eyebrow, title, children }: SectionHeadingProps) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.34em] text-gold">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-display text-4xl leading-tight text-pearl md:text-6xl">
        {title}
      </h2>
      {children ? (
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/62 md:text-base">
          {children}
        </p>
      ) : null}
    </div>
  );
}
