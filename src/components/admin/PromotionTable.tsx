"use client";

import { useActionState, useState } from "react";
import { Edit3, ExternalLink, Eye, EyeOff, ImageIcon } from "lucide-react";
import { setPromotionStatusAction } from "@/actions/promotions";
import PromotionForm, {
  type AdminPromotionRow,
} from "@/components/admin/PromotionForm";
import { Button } from "@/components/ui/button";
import type { PromotionActionState } from "@/lib/validations/promotion";

type PromotionTableProps = {
  promotions: AdminPromotionRow[];
};

const initialState: PromotionActionState = {
  status: "idle",
  message: "",
};

export default function PromotionTable({ promotions }: PromotionTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Promociones registradas
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            {promotions.length} registro{promotions.length === 1 ? "" : "s"} en
            base de datos.
          </p>
        </div>
        <span className="w-fit rounded-md border border-white/10 bg-[#111827]/55 px-3 py-2 text-xs font-semibold text-[#FFB4AC]">
          Solo activas se muestran en /promociones
        </span>
      </div>

      <div className="grid gap-3">
        {promotions.map((promotion) => (
          <article
            key={promotion.id}
            className="rounded-lg border border-white/10 bg-[#111827]/55 p-4"
          >
            <div className="grid gap-4 lg:grid-cols-[72px_1fr_auto] lg:items-start">
              <PromotionImage imageUrl={promotion.imageUrl} title={promotion.title} />

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight text-white">
                    {promotion.title}
                  </h3>
                  <span
                    className={
                      promotion.isActive
                        ? "rounded-md border border-emerald-400/25 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-200"
                        : "rounded-md border border-slate-500/25 bg-slate-500/10 px-2 py-1 text-xs font-semibold text-slate-300"
                    }
                  >
                    {promotion.isActive ? "Activa" : "Inactiva"}
                  </span>
                  <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-1 text-xs font-semibold text-slate-300">
                    Orden {promotion.sortOrder}
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold text-[#FFB4AC]">
                  {promotion.category} - {promotion.price}
                </p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-300">
                  {promotion.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                  <span>Vigencia: {promotion.validity}</span>
                  <span>Beneficios: {promotion.benefits.length}</span>
                  <span>Condiciones: {promotion.conditions.length}</span>
                  <span>Slug: {promotion.slug}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 lg:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setEditingId((current) =>
                      current === promotion.id ? null : promotion.id
                    )
                  }
                  className="border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                >
                  <Edit3 className="h-4 w-4" />
                  Editar
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]"
                >
                  <a href={`/ofertas/${promotion.slug}`} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4" />
                    Ver
                  </a>
                </Button>
                <StatusAction promotion={promotion} />
              </div>
            </div>

            {editingId === promotion.id ? (
              <div className="mt-4 border-t border-white/10 pt-4">
                <PromotionForm mode="edit" promotion={promotion} compact />
              </div>
            ) : null}
          </article>
        ))}
      </div>

      {promotions.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/15 bg-[#111827]/55 p-6 text-center">
          <p className="text-sm font-semibold text-white">
            Aun no hay promociones en base de datos.
          </p>
          <p className="mt-1 text-sm text-slate-400">
            Ejecuta el seed inicial o crea una promocion manualmente.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function PromotionImage({
  imageUrl,
  title,
}: {
  imageUrl: string | null;
  title: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-lg border border-white/10 bg-white/[0.06] text-[#FFB4AC]">
      {imageUrl && !failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <ImageIcon className="h-5 w-5" />
      )}
    </div>
  );
}

function StatusAction({ promotion }: { promotion: AdminPromotionRow }) {
  const [state, action, isPending] = useActionState(
    setPromotionStatusAction,
    initialState
  );
  const nextState = !promotion.isActive;

  return (
    <form action={action} className="grid gap-2">
      <input type="hidden" name="id" value={promotion.id} />
      <input type="hidden" name="isActive" value={String(nextState)} />
      <Button
        type="submit"
        variant="outline"
        size="sm"
        disabled={isPending}
        className={
          promotion.isActive
            ? "border-yellow-300/20 bg-yellow-500/10 text-yellow-100 hover:bg-yellow-500/15"
            : "border-emerald-300/20 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/15"
        }
      >
        {promotion.isActive ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
        {isPending
          ? "Guardando..."
          : promotion.isActive
            ? "Desactivar"
            : "Activar"}
      </Button>
      {state.message ? (
        <span
          className={
            state.status === "success"
              ? "text-xs font-semibold text-emerald-200"
              : "text-xs font-semibold text-[#FFB4AC]"
          }
        >
          {state.message}
        </span>
      ) : null}
    </form>
  );
}
