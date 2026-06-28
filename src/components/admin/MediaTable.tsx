import { getTrainingMedia } from "@/lib/training-media";

export default function MediaTable() {
  const { audios, videos } = getTrainingMedia();
  const mediaItems = [...videos, ...audios];

  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Biblioteca
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Materiales detectados en la carpeta de capacitacion.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-5 py-3">Titulo</th>
              <th className="px-5 py-3">Tipo</th>
              <th className="px-5 py-3">Archivo</th>
              <th className="px-5 py-3">Ruta publica</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {mediaItems.map((item) => (
              <tr key={item.id} className="text-slate-200">
                <td className="px-5 py-4 font-semibold text-white">
                  {item.title}
                </td>
                <td className="px-5 py-4 capitalize">{item.mediaType}</td>
                <td className="px-5 py-4">{item.fileName}</td>
                <td className="px-5 py-4">{item.fileUrl}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex h-7 items-center rounded-md border border-white/10 bg-white/[0.06] px-2.5 text-xs font-semibold text-[#FFB4AC]">
                    Detectado
                  </span>
                </td>
              </tr>
            ))}
            {mediaItems.length === 0 ? (
              <tr className="text-slate-300">
                <td className="px-5 py-4" colSpan={5}>
                  Archivo pendiente de cargar
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
