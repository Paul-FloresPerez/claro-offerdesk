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
          ? "border-b border-white/10 bg-[#111827]"
          : "border-b border-neutral-200 bg-white"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-6">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p
              className={
                isDark
                  ? "mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#FF8D83]"
                  : "mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-[#DA291C]"
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={
              isDark
                ? "text-2xl font-semibold tracking-tight text-white sm:text-[2rem]"
                : "text-2xl font-semibold tracking-tight text-neutral-950 sm:text-[2rem]"
            }
          >
            {title}
          </h1>
          <p
            className={
              isDark
                ? "mt-1.5 max-w-2xl text-sm leading-6 text-slate-300"
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
