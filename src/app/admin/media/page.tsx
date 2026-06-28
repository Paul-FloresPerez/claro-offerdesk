import AdminShell from "@/components/admin/AdminShell";
import MediaForm from "@/components/admin/MediaForm";
import MediaTable from "@/components/admin/MediaTable";

export default function AdminMediaPage() {
  return (
    <AdminShell
      title="Media"
      description="Maqueta para organizar audios y videos de capacitación antes de conectar almacenamiento real."
    >
      <div className="grid gap-5">
        <MediaForm />
        <MediaTable />
      </div>
    </AdminShell>
  );
}
