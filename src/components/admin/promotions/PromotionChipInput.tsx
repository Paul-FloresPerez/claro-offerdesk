"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PromotionChipInput({
  value,
  onChange,
  placeholder = "Escribe y presiona Enter",
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  function addDraft() {
    const next = draft.trim();
    if (!next) return;
    if (!value.some((item) => item.toLowerCase() === next.toLowerCase())) {
      onChange([...value, next]);
    }
    setDraft("");
  }

  return (
    <div className="space-y-2">
      {value.length ? (
        <div className="flex flex-wrap gap-2">
          {value.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1 py-1 pl-2.5 pr-1">
              {item}
              <button
                type="button"
                onClick={() => onChange(value.filter((candidate) => candidate !== item))}
                className="rounded-sm p-0.5 hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Quitar ${item}`}
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addDraft();
            }
          }}
          placeholder={placeholder}
        />
        <Button type="button" variant="outline" size="icon" onClick={addDraft}>
          <Plus />
          <span className="sr-only">Agregar etiqueta</span>
        </Button>
      </div>
    </div>
  );
}
