import { Headphones, MessageSquareText, Waves } from "lucide-react";
import type { TrainingMediaFile } from "@/lib/training-media";

type AudioComparisonPanelProps = {
  audios: TrainingMediaFile[];
};

export function AudioComparisonPanel({ audios }: AudioComparisonPanelProps) {
  const primaryAudio = audios[0];
  const extraAudios = audios.slice(1);

  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-[0_20px_62px_rgba(0,0,0,0.22)] backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/18 text-brand-emphasis ring-1 ring-ring/25">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-emphasis">
              Practica auditiva
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
              Comparador de llamadas
            </h2>
          </div>
        </div>
      </div>

      <div className="grid gap-3">
        {primaryAudio ? (
          <AudioCard
            item={primaryAudio}
            label="Referencia"
            title="Venta de referencia correcta"
            featured
          />
        ) : (
          <PendingAudio />
        )}

        {extraAudios.length > 0 ? (
          <div className="grid gap-3">
            {extraAudios.map((item, index) => (
              <AudioCard
                key={item.id}
                item={item}
                label={`Referencia adicional ${index + 1}`}
                title={item.title}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function AudioCard({
  item,
  label,
  title,
  featured = false,
}: {
  item: TrainingMediaFile;
  label: string;
  title: string;
  featured?: boolean;
}) {
  return (
    <article
      className={
        featured
          ? "rounded-lg border border-primary/25 bg-[linear-gradient(135deg,rgba(218,41,28,0.16),rgba(17,24,39,0.72))] p-3 shadow-[0_12px_32px_rgba(218,41,28,0.10)]"
          : "rounded-lg border border-border bg-background/62 p-3"
      }
    >
      <div className="mb-3 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-card text-brand-emphasis ring-1 ring-border">
          <Headphones className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-emphasis">
            {label}
          </p>
          <h3 className="mt-1 text-sm font-semibold leading-5 text-foreground">
            {title}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">{item.fileName}</p>
        </div>
      </div>
      <audio controls preload="metadata" className="w-full" src={item.fileUrl}>
        Tu navegador no puede reproducir este audio.
      </audio>
    </article>
  );
}

function PendingAudio() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-background/55 p-4">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-dashed border-border text-muted-foreground">
        <Waves className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">
          Archivo pendiente de cargar
        </p>
        <p className="mt-1 text-xs text-muted-foreground">/capacitacion/audios/</p>
      </div>
    </div>
  );
}
