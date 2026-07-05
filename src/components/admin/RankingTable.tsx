"use client";

import { useActionState } from "react";
import { Trophy, UserCheck, UserX } from "lucide-react";
import { setRankingStatusAction } from "@/actions/ranking";
import RankingForm, {
  getInitials,
  type AdminRankingRow,
  type AdminRankingUser,
} from "@/components/admin/RankingForm";
import { Button } from "@/components/ui/button";
import type { RankingActionState } from "@/lib/validations/ranking";

type RankingTableProps = {
  rankings: AdminRankingRow[];
  users: AdminRankingUser[];
};

const initialState: RankingActionState = {
  status: "idle",
  message: "",
};

export default function RankingTable({ rankings, users }: RankingTableProps) {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
      <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Ranking
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Registros ordenados por posicion. No se eliminan registros.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-md border border-white/10 bg-[#111827]/55 px-3 py-2 text-xs font-semibold text-slate-300">
          {rankings.length} registro{rankings.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1040px] text-left text-sm">
          <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-5 py-3">Puesto</th>
              <th className="px-5 py-3">Asesor</th>
              <th className="px-5 py-3">Sede</th>
              <th className="px-5 py-3">Ventas</th>
              <th className="px-5 py-3">Periodo</th>
              <th className="px-5 py-3">Estado</th>
              <th className="px-5 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rankings.map((ranking) => (
              <RankingRow key={ranking.id} ranking={ranking} users={users} />
            ))}
            {rankings.length === 0 ? (
              <tr>
                <td className="px-5 py-6 text-slate-300" colSpan={7}>
                  No hay registros de ranking.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function RankingRow({
  ranking,
  users,
}: {
  ranking: AdminRankingRow;
  users: AdminRankingUser[];
}) {
  return (
    <>
      <tr className="align-top text-slate-200">
        <td className="px-5 py-4">
          <span className="inline-flex h-8 items-center gap-2 rounded-md border border-[#DA291C]/25 bg-[#DA291C]/12 px-3 font-bold text-[#FFB4AC]">
            <Trophy className="h-4 w-4" />#{ranking.rankPosition}
          </span>
        </td>
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <RankingAvatar ranking={ranking} />
            <div className="min-w-0">
              <p className="font-semibold text-white">{ranking.fullName}</p>
              {ranking.hasActiveUser ? (
                <p className="mt-1 text-xs text-slate-500">Usuario activo vinculado</p>
              ) : (
                <p className="mt-1 text-xs text-[#FFB4AC]">
                  Usuario no disponible
                </p>
              )}
            </div>
          </div>
        </td>
        <td className="px-5 py-4">{ranking.branchName ?? "-"}</td>
        <td className="px-5 py-4">
          <span className="inline-flex h-7 items-center rounded-md bg-[#DA291C]/15 px-2.5 font-bold text-[#FFB4AC]">
            {ranking.salesCount}
          </span>
        </td>
        <td className="px-5 py-4">{ranking.periodLabel}</td>
        <td className="px-5 py-4">
          <StatusPill active={ranking.isActive}>
            {ranking.isActive ? "Activo" : "Inactivo"}
          </StatusPill>
        </td>
        <td className="px-5 py-4">
          <div className="grid gap-2">
            <StatusAction ranking={ranking} />
            {ranking.note ? (
              <p className="max-w-xs rounded-md border border-white/10 bg-[#111827]/55 px-3 py-2 text-xs leading-5 text-slate-300">
                {ranking.note}
              </p>
            ) : null}
          </div>
        </td>
      </tr>
      <tr className="bg-[#111827]/35">
        <td colSpan={7} className="px-5 pb-5">
          <details className="rounded-lg border border-white/10 bg-white/[0.035]">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#FFB4AC] transition hover:text-white">
              Editar registro de ranking
            </summary>
            <div className="border-t border-white/10 p-4">
              <RankingForm mode="edit" ranking={ranking} users={users} compact />
            </div>
          </details>
        </td>
      </tr>
    </>
  );
}

function StatusAction({ ranking }: { ranking: AdminRankingRow }) {
  const [state, formAction, isPending] = useActionState(
    setRankingStatusAction,
    initialState
  );
  const nextActiveState = !ranking.isActive;

  return (
    <form action={formAction} className="grid gap-1">
      <input type="hidden" name="id" value={ranking.id} />
      <input type="hidden" name="isActive" value={String(nextActiveState)} />
      <Button
        type="submit"
        disabled={isPending}
        className="h-8 w-fit border border-white/10 bg-white/[0.06] px-2 text-xs text-slate-200 hover:bg-white/[0.1]"
      >
        {nextActiveState ? (
          <UserCheck className="h-3.5 w-3.5" />
        ) : (
          <UserX className="h-3.5 w-3.5" />
        )}
        {nextActiveState ? "Activar" : "Desactivar"}
      </Button>
      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "success"
              ? "text-xs font-semibold text-emerald-200"
              : "text-xs font-semibold text-[#FFB4AC]"
          }
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}

function RankingAvatar({ ranking }: { ranking: AdminRankingRow }) {
  if (ranking.photoUrl) {
    return (
      <img
        src={ranking.photoUrl}
        alt={ranking.fullName}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-white/10"
      />
    );
  }

  return (
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#DA291C] text-sm font-black text-white">
      {getInitials(ranking.fullName)}
    </span>
  );
}

function StatusPill({
  active,
  children,
}: {
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        active
          ? "inline-flex h-7 w-fit items-center rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2.5 text-xs font-semibold text-emerald-200"
          : "inline-flex h-7 w-fit items-center rounded-md border border-slate-500/20 bg-slate-500/10 px-2.5 text-xs font-semibold text-slate-300"
      }
    >
      {children}
    </span>
  );
}
