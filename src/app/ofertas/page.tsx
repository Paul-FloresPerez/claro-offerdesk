import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<{
    q?: string | string[];
    tipo?: string | string[];
  }>;
};

export default async function OfertasLegacyPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  appendParam(query, "q", params.q);
  appendParam(query, "tipo", params.tipo);

  redirect(query.size ? `/promociones?${query.toString()}` : "/promociones");
}

function appendParam(
  query: URLSearchParams,
  key: string,
  value?: string | string[]
) {
  const firstValue = Array.isArray(value) ? value[0] : value;

  if (firstValue) {
    query.set(key, firstValue);
  }
}
