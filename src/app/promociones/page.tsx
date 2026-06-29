import OfertasPage from "@/app/ofertas/page";

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    tipo?: string | string[];
  }>;
};

export default function PromocionesPage(props: PageProps) {
  return <OfertasPage {...props} />;
}
