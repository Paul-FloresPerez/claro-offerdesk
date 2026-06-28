import AdminShell from "@/components/admin/AdminShell";
import RankingForm from "@/components/admin/RankingForm";
import RankingTable from "@/components/admin/RankingTable";

export default function AdminRankingPage() {
  return (
    <AdminShell
      title="Ranking"
      description="Maqueta para mantener el ranking de ventas que luego alimentará Top ventas."
    >
      <div className="grid gap-5">
        <RankingForm />
        <RankingTable />
      </div>
    </AdminShell>
  );
}
