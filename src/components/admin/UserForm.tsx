import { Save, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function UserForm() {
  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
      <div className="mb-5 flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-md bg-[#DA291C]/15 text-[#FFB4AC]">
          <UserPlus className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-white">
            Nuevo usuario
          </h2>
          <p className="text-sm text-slate-400">Preparado para alta de asesores.</p>
        </div>
      </div>

      <form className="grid gap-4 sm:grid-cols-2">
        <MockField label="Nombre completo" placeholder="Nombre del asesor" />
        <MockField label="Correo" placeholder="asesor@claro.pe" type="email" />
        <MockField label="Sede" placeholder="Sede comercial" />
        <MockField label="Rol" placeholder="Asesor / Administrador" />
        <div className="sm:col-span-2">
          <Button type="button" disabled className="h-10 bg-[#DA291C] text-white">
            <Save className="h-4 w-4" />
            Guardar usuario
          </Button>
        </div>
      </form>
    </section>
  );
}

function MockField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-slate-200">
      {label}
      <Input
        disabled
        type={type}
        placeholder={placeholder}
        className="h-10 border-white/10 bg-[#111827]/55 text-white placeholder:text-slate-500"
      />
    </label>
  );
}
