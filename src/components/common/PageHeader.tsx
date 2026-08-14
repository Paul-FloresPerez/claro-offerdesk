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
          ? "border-b border-border bg-background"
          : "border-b border-border bg-card"
      }
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:py-6">
        <div className="max-w-3xl">
          {eyebrow ? (
            <p
              className={
                isDark
                  ? "mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-brand-emphasis"
                  : "mb-1.5 text-xs font-semibold uppercase tracking-[0.08em] text-primary"
              }
            >
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={
              isDark
                ? "text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]"
                : "text-2xl font-semibold tracking-tight text-foreground sm:text-[2rem]"
            }
          >
            {title}
          </h1>
          <p
            className={
              isDark
                ? "mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground"
                : "mt-2 text-sm leading-6 text-muted-foreground"
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
