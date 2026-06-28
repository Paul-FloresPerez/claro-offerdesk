export type RankingAdvisor = {
  rankPosition: number;
  fullName: string;
  branchName: string;
  salesCount: number;
  periodLabel: string;
  photoUrl?: string;
  note?: string;
};

export const rankingMock: RankingAdvisor[] = [
  {
    rankPosition: 1,
    fullName: "Valeria Rojas",
    branchName: "Miraflores",
    salesCount: 42,
    periodLabel: "Semana 26 - 2026",
    note: "Mayor cierre de planes hogar",
  },
  {
    rankPosition: 2,
    fullName: "Diego Salazar",
    branchName: "San Isidro",
    salesCount: 38,
    periodLabel: "Semana 26 - 2026",
  },
  {
    rankPosition: 3,
    fullName: "Camila Torres",
    branchName: "Surco",
    salesCount: 35,
    periodLabel: "Semana 26 - 2026",
  },
  {
    rankPosition: 4,
    fullName: "Mateo Vargas",
    branchName: "Los Olivos",
    salesCount: 31,
    periodLabel: "Semana 26 - 2026",
  },
  {
    rankPosition: 5,
    fullName: "Lucia Campos",
    branchName: "La Molina",
    salesCount: 29,
    periodLabel: "Semana 26 - 2026",
  },
  {
    rankPosition: 6,
    fullName: "Renato Silva",
    branchName: "Callao",
    salesCount: 27,
    periodLabel: "Semana 26 - 2026",
  },
];
