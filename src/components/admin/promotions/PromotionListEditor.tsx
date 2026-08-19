"use client";

import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function PromotionListEditor({
  value,
  onChange,
  emptyLabel,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  emptyLabel: string;
}) {
  function addItem() {
    onChange([...value, ""]);
  }

  function updateItem(index: number, nextValue: string) {
    onChange(value.map((item, itemIndex) => (itemIndex === index ? nextValue : item)));
  }

  function removeItem(index: number) {
    onChange(value.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-3">
      {value.length ? (
        value.map((item, index) => (
          <div key={index} className="flex items-start gap-2">
            <GripVertical className="mt-2.5 size-4 shrink-0 text-muted-foreground" />
            <Textarea
              value={item}
              onChange={(event) => updateItem(index, event.target.value)}
              rows={2}
              aria-label={`Elemento ${index + 1}`}
            />
            <Button
              type="button"
              size="icon"
              variant="ghost"
              onClick={() => removeItem(index)}
              aria-label={`Eliminar elemento ${index + 1}`}
            >
              <Trash2 />
            </Button>
          </div>
        ))
      ) : (
        <p className="rounded-lg border border-dashed border-border px-4 py-3 text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      )}
      <Button type="button" variant="outline" size="sm" onClick={addItem}>
        <Plus /> Agregar elemento
      </Button>
    </div>
  );
}
