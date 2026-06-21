import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  tone?: "light" | "dark";
};

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  tone = "light",
}: PageHeaderProps) {
  const isDark = tone === "dark";

  return (
    <section
      className={
        isDark
          ? "relative overflow-hidden border-b border-white/10 bg-[#111827]"
          : "border-b border-neutral-200 bg-white"
      }
    >
      {isDark ? (
        <>
          <div className="pointer-events-none absolute right-12 top-8 h-36 w-36 rounded-full border border-[#DA291C]/20" />
          <div className="pointer-events-none absolute right-24 top-14 h-44 w-44 rounded-full bg-[#DA291C]/10 blur-3xl" />
        </>
      ) : null}

      <div className="relative mx-auto flex max-w-7xl flex-col gap-5 px-4 py-7 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p
              className={
                isDark
                  ? "mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#FFB4AC]"
                  : "mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-[#DA291C]"
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={
              isDark
                ? "text-2xl font-semibold tracking-tight text-white sm:text-3xl"
                : "text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl"
            }
          >
            {title}
          </h1>
          <p
            className={
              isDark
                ? "mt-2 text-sm leading-6 text-slate-300"
                : "mt-2 text-sm leading-6 text-neutral-600"
            }
          >
            {description}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </section>
  );
}
