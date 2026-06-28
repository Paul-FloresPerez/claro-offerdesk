const usersMock = [
  {
    fullName: "Valeria Rojas",
    email: "valeria.rojas@claro.pe",
    branchName: "Miraflores",
    role: "Administradora",
    status: "Activo",
  },
  {
    fullName: "Diego Salazar",
    email: "diego.salazar@claro.pe",
    branchName: "San Isidro",
    role: "Asesor",
    status: "Activo",
  },
  {
    fullName: "Camila Torres",
    email: "camila.torres@claro.pe",
    branchName: "Surco",
    role: "Asesora",
    status: "Pendiente",
  },
];

export default function UserTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-white/10 bg-white/[0.07]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-xl font-semibold tracking-tight text-white">
          Usuarios
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Vista previa de la gestión de asesores.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#111827]/70 text-xs uppercase tracking-[0.12em] text-slate-400">
            <tr>
              <th className="px-5 py-3">Usuario</th>
              <th className="px-5 py-3">Correo</th>
              <th className="px-5 py-3">Sede</th>
              <th className="px-5 py-3">Rol</th>
              <th className="px-5 py-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {usersMock.map((user) => (
              <tr key={user.email} className="text-slate-200">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full bg-[#DA291C] text-sm font-black text-white">
                      {getInitials(user.fullName)}
                    </span>
                    <span className="font-semibold text-white">{user.fullName}</span>
                  </div>
                </td>
                <td className="px-5 py-4">{user.email}</td>
                <td className="px-5 py-4">{user.branchName}</td>
                <td className="px-5 py-4">{user.role}</td>
                <td className="px-5 py-4">
                  <span className="inline-flex h-7 items-center rounded-md border border-white/10 bg-white/[0.06] px-2.5 text-xs font-semibold text-[#FFB4AC]">
                    {user.status}
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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
