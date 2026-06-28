import { TrainingLibrary } from "@/components/training/TrainingLibrary";
import { getTrainingMedia } from "@/lib/training-media";

export default function CapacitacionPage() {
  const { videos, audios } = getTrainingMedia();

  return (
    <main className="relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(17,24,39,0.98)_0%,rgba(31,41,55,0.95)_52%,rgba(77,18,24,0.68)_100%)]" />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-5 rounded-xl border border-white/10 bg-white/[0.065] px-4 py-5 shadow-[0_20px_70px_rgba(0,0,0,0.24)] backdrop-blur sm:px-5">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
            Biblioteca interna
          </p>
          <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Entrenamiento Comercial
              </h1>
              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-300">
                Videos y audios listos para practicar el flujo de venta antes de
                atender nuevas oportunidades.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:flex">
              <Metric label="Videos" value={videos.length} />
              <Metric label="Audios" value={audios.length} />
            </div>
          </div>
        </div>

        <TrainingLibrary videos={videos} audios={audios} />
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#111827]/55 px-4 py-3 text-right">
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
    </div>
  );
}
