import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function MediaForm() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
          <Upload className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Nuevo material
          </h2>
          <p className="text-sm text-slate-400">Preparado para audios y videos.</p>
        </div>
      </div>
      <form className="grid gap-4 sm:grid-cols-2">
        <MockField label="Título" placeholder="Nombre del material" />
        <MockField label="Tipo" placeholder="Audio / Video" />
        <MockField label="Etiqueta" placeholder="Audio / Video" />
        <MockField label="Ruta" placeholder="/capacitacion/videos/nombre-del-video.mp4" />
        <div className="sm:col-span-2">
          <Button type="button" disabled className="h-10 bg-[#DA291C] text-white">
            Guardar material
          </Button>
        </div>
      </form>
    </section>
  );
}

function MockField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        disabled
        placeholder={placeholder}
        className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
      />
    </label>
  );
}
