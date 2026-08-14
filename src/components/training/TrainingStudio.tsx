import { CheckCircle2, Clapperboard, Video } from "lucide-react";
import { NativeVideoPlayer } from "@/components/training/NativeVideoPlayer";
import type { TrainingMediaFile } from "@/lib/training-media";

type TrainingStudioProps = {
  video?: TrainingMediaFile;
};

export function TrainingStudio({ video }: TrainingStudioProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_24px_80px_rgba(0,0,0,0.28),0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur">
      <div className="flex flex-col gap-3 border-b border-border bg-[linear-gradient(135deg,rgba(17,24,39,0.92),rgba(68,14,18,0.42))] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/18 text-brand-emphasis ring-1 ring-ring/25">
            <Clapperboard className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis">
              Training Studio
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              Video base de entrenamiento
            </h2>
          </div>
        </div>
        <span className="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-brand-emphasis" />
          {video ? "Archivo detectado" : "Pendiente"}
        </span>
      </div>

      <div className="p-3 sm:p-4">
        <div className="overflow-hidden rounded-lg border border-border bg-[#070B13] shadow-[0_18px_54px_rgba(0,0,0,0.32)]">
          <div className="aspect-video">
            {video ? (
              <NativeVideoPlayer
                className="h-full w-full"
                src={video.fileUrl}
                title={video.title}
              />
            ) : (
              <PendingMedia icon={Video} path="/capacitacion/videos/" />
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium leading-6 text-muted-foreground">
            Observa el flujo recomendado antes de revisar promociones.
          </p>
          {video ? (
            <p className="max-w-full truncate text-xs font-medium text-muted-foreground">
              {video.fileName}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function PendingMedia({
  icon: Icon,
  path,
}: {
  icon: typeof Video;
  path: string;
}) {
  return (
    <div className="grid h-full min-h-56 place-items-center p-5 text-center">
      <div>
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-lg border border-dashed border-border bg-card text-muted-foreground">
          <Icon className="h-5 w-5" />
        </span>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Archivo pendiente de cargar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{path}</p>
      </div>
    </div>
  );
}
