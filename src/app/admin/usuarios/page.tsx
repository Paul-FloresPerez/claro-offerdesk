import AdminShell from "@/components/admin/AdminShell";
import UserForm from "@/components/admin/UserForm";
import UserTable from "@/components/admin/UserTable";

export default function AdminUsuariosPage() {
  return (
    <AdminShell
      title="Usuarios"
      description="Maqueta para crear, revisar y administrar asesores autorizados."
    >
      <div className="grid gap-5">
        <UserForm />
        <UserTable />
      </div>
    </AdminShell>
  );
}
