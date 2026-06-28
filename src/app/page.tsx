import { AudioComparisonPanel } from "@/components/training/AudioComparisonPanel";
import { TrainingQuickActions } from "@/components/training/TrainingQuickActions";
import { TrainingStudio } from "@/components/training/TrainingStudio";
import { getTrainingMedia } from "@/lib/training-media";

export default function HomePage() {
  const { featuredVideo, featuredAudios } = getTrainingMedia();

  return (
    <main className="relative">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(17,24,39,0.98)_0%,rgba(29,37,53,0.94)_46%,rgba(64,17,22,0.72)_100%)]" />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="mb-5 flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#FFB4AC]">
              Claro OfferDesk
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Entrenamiento Comercial
            </h1>
            <p className="mt-2 max-w-2xl text-base leading-7 text-slate-300">
              Practica el discurso, escucha referencias y entra preparado a
              vender.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-lg border border-[#DA291C]/30 bg-[#DA291C]/12 px-4 py-2 text-sm font-semibold text-[#FFB4AC] shadow-[0_0_34px_rgba(218,41,28,0.10)]">
            Sesion de practica
          </span>
        </div>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(330px,0.65fr)] lg:items-start">
          <TrainingStudio video={featuredVideo} />
          <AudioComparisonPanel audios={featuredAudios} />
        </div>

        <div className="mt-5">
          <TrainingQuickActions />
        </div>
      </section>
    </main>
  );
}
