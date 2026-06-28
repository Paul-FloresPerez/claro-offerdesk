import { rankingMock } from "@/data/ranking";

export default function RankingTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Ranking
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Asesores destacados del periodo.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-5 py-3">Puesto</th>
              <th className="px-5 py-3">Asesor</th>
              <th className="px-5 py-3">Sede</th>
              <th className="px-5 py-3">Ventas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rankingMock.slice(0, 5).map((advisor) => (
              <tr key={advisor.rankPosition} className="text-slate-200">
                <td className="px-5 py-4 font-semibold text-white">
                  #{advisor.rankPosition}
                </td>
                <td className="px-5 py-4">{advisor.fullName}</td>
                <td className="px-5 py-4">{advisor.branchName}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex h-7 items-center rounded-md bg-[#DA291C]/15 px-2.5 font-bold text-[#FFB4AC]">
                    {advisor.salesCount}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
