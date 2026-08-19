"use client";

import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type PromotionFiltersProps = {
  initial: {
    query: string;
    status: string;
    category: string;
    kind: string;
  };
};

export function PromotionFilters({ initial }: PromotionFiltersProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initial.query);
  const [status, setStatus] = useState(initial.status);
  const [category, setCategory] = useState(initial.category);
  const [kind, setKind] = useState(initial.kind);
  const hasFilters = Boolean(
    query || status !== "ALL" || category !== "ALL" || kind !== "ALL"
  );

  function applyFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (status !== "ALL") params.set("status", status);
    if (category !== "ALL") params.set("category", category);
    if (kind !== "ALL") params.set("kind", kind);
    const search = params.toString();
    router.push(search ? `/admin/promociones?${search}` : "/admin/promociones");
  }

  function clearFilters() {
    setQuery("");
    setStatus("ALL");
    setCategory("ALL");
    setKind("ALL");
    router.push("/admin/promociones");
  }

  return (
    <form
      onSubmit={applyFilters}
      className="grid gap-3 rounded-xl border border-border bg-card p-4 shadow-xs md:grid-cols-2 xl:grid-cols-[minmax(14rem,1fr)_12rem_12rem_12rem_auto]"
    >
      <label className="relative md:col-span-2 xl:col-span-1">
        <span className="sr-only">Buscar promociones</span>
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título o slug"
          className="pl-9"
        />
      </label>

      <FilterSelect
        label="Estado"
        value={status}
        onValueChange={setStatus}
        options={[
          ["ALL", "Todos los estados"],
          ["DRAFT", "Borrador"],
          ["PUBLISHED", "Publicada"],
          ["ARCHIVED", "Archivada"],
        ]}
      />
      <FilterSelect
        label="Categoría"
        value={category}
        onValueChange={setCategory}
        options={[
          ["ALL", "Todas las categorías"],
          ["Hogar", "Hogar"],
          ["Convergencia", "Convergencia"],
          ["Móvil", "Móvil"],
          ["Negocios", "Negocios"],
        ]}
      />
      <FilterSelect
        label="Tipo"
        value={kind}
        onValueChange={setKind}
        options={[
          ["ALL", "Todos los tipos"],
          ["CAMPAIGN", "Campaña"],
          ["REGULAR_OFFER", "Oferta regular"],
        ]}
      />

      <div className="flex gap-2">
        <Button type="submit" className="flex-1 xl:flex-none">
          Filtrar
        </Button>
        {hasFilters ? (
          <Button type="button" variant="ghost" size="icon" onClick={clearFilters}>
            <X />
            <span className="sr-only">Limpiar filtros</span>
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function FilterSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full" aria-label={label}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map(([optionValue, optionLabel]) => (
          <SelectItem key={optionValue} value={optionValue}>
            {optionLabel}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
