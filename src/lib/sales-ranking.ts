import "server-only";

import { prisma } from "@/lib/prisma";

export type RankingBranchOption = {
  id: string;
  name: string;
  isActive: boolean;
};

export type InstalledSalesAdvisor = {
  advisorId: string;
  position: number;
  fullName: string;
  photoUrl: string | null;
  installedSales: number;
  branchContext: string;
};

export type BranchSalesLeader = {
  branchId: string;
  branchName: string;
  advisorId: string;
  fullName: string;
  photoUrl: string | null;
  installedSales: number;
};

export type AutomaticSalesRanking = {
  advisors: InstalledSalesAdvisor[];
  branches: RankingBranchOption[];
  leadersByBranch: BranchSalesLeader[];
  selectedBranch: RankingBranchOption | null;
  selectionValid: boolean;
};

export type RankingAccessScope =
  | { kind: "GLOBAL" }
  | { kind: "BRANCH"; branchId: string }
  | { kind: "NONE" };

type AutomaticSalesRankingOptions = {
  requestedBranchId?: string | null;
  scope: RankingAccessScope;
};

const nameCollator = new Intl.Collator("es", {
  sensitivity: "base",
  usage: "sort",
});

export async function getAutomaticSalesRanking(
  options: AutomaticSalesRankingOptions
): Promise<AutomaticSalesRanking> {
  if (options.scope.kind === "NONE") {
    return emptyRanking(!options.requestedBranchId);
  }

  const scopedBranchId =
    options.scope.kind === "BRANCH"
      ? normalizeUuid(options.scope.branchId)
      : null;

  if (options.scope.kind === "BRANCH" && !scopedBranchId) {
    return emptyRanking(false);
  }

  const requestedBranchId =
    options.scope.kind === "BRANCH"
      ? scopedBranchId
      : options.requestedBranchId;
  const normalizedBranchId = normalizeUuid(requestedBranchId);

  const [branchGroups, allBranches] = await Promise.all([
    prisma.sale.groupBy({
      by: ["advisorId", "branchId"],
      where: {
        status: "INSTALADA",
        ...(scopedBranchId ? { branchId: scopedBranchId } : {}),
      },
      _count: { _all: true },
    }),
    prisma.branch.findMany({
      where: scopedBranchId ? { id: scopedBranchId } : undefined,
      orderBy: [{ isActive: "desc" }, { name: "asc" }],
      select: { id: true, name: true, isActive: true },
    }),
  ]);

  const branchIdsWithHistory = new Set(
    branchGroups.map((group) => group.branchId)
  );
  const branches = allBranches.filter(
    (branch) => branch.isActive || branchIdsWithHistory.has(branch.id)
  );
  const selectedBranch = normalizedBranchId
    ? branches.find((branch) => branch.id === normalizedBranchId) ?? null
    : null;
  const selectionValid = !requestedBranchId || Boolean(selectedBranch);
  const visibleGroups = selectedBranch
    ? branchGroups.filter((group) => group.branchId === selectedBranch.id)
    : branchGroups;
  const advisorIds = Array.from(
    new Set(
      (selectedBranch ? visibleGroups : branchGroups).map(
        (group) => group.advisorId
      )
    )
  );

  const [users, legacyMetadata] = await Promise.all([
    advisorIds.length > 0
      ? prisma.user.findMany({
          where: {
            id: { in: advisorIds },
            isActive: true,
            role: "ADVISOR",
          },
          select: {
            id: true,
            fullName: true,
            photoUrl: true,
          },
        })
      : Promise.resolve([]),
    advisorIds.length > 0
      ? prisma.salesRanking.findMany({
          where: {
            userId: { in: advisorIds },
            photoUrl: { not: null },
            isActive: true,
          },
          orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
          select: {
            userId: true,
            photoUrl: true,
          },
        })
      : Promise.resolve([]),
  ]);

  const branchById = new Map(branches.map((branch) => [branch.id, branch]));
  const legacyPhotoByUserId = new Map<string, string>();

  for (const metadata of legacyMetadata) {
    if (
      metadata.userId &&
      metadata.photoUrl &&
      !legacyPhotoByUserId.has(metadata.userId)
    ) {
      legacyPhotoByUserId.set(metadata.userId, metadata.photoUrl);
    }
  }

  const userById = new Map(
    users.map((user) => [
      user.id,
      {
        ...user,
        photoUrl: user.photoUrl ?? legacyPhotoByUserId.get(user.id) ?? null,
      },
    ])
  );
  const advisors = buildAdvisorRanking(
    visibleGroups,
    userById,
    branchById,
    selectedBranch
  );
  const leadersByBranch = selectedBranch
    ? []
    : buildBranchLeaders(branchGroups, branches, userById);

  return {
    advisors,
    branches,
    leadersByBranch,
    selectedBranch,
    selectionValid,
  };
}

function emptyRanking(selectionValid: boolean): AutomaticSalesRanking {
  return {
    advisors: [],
    branches: [],
    leadersByBranch: [],
    selectedBranch: null,
    selectionValid,
  };
}

function buildAdvisorRanking(
  groups: Array<{
    advisorId: string;
    branchId: string;
    _count: { _all: number };
  }>,
  userById: Map<
    string,
    { id: string; fullName: string; photoUrl: string | null }
  >,
  branchById: Map<string, RankingBranchOption>,
  selectedBranch: RankingBranchOption | null
) {
  const totals = new Map<
    string,
    { installedSales: number; branchIds: Set<string> }
  >();

  for (const group of groups) {
    const current = totals.get(group.advisorId) ?? {
      installedSales: 0,
      branchIds: new Set<string>(),
    };
    current.installedSales += group._count._all;
    current.branchIds.add(group.branchId);
    totals.set(group.advisorId, current);
  }

  const sorted = Array.from(totals.entries())
    .flatMap(([advisorId, total]) => {
      const user = userById.get(advisorId);

      if (!user) {
        return [];
      }

      const branchContext = selectedBranch
        ? `${selectedBranch.name}${selectedBranch.isActive ? "" : " · histórica"}`
        : getGlobalBranchContext(total.branchIds, branchById);

      return [
        {
          advisorId,
          fullName: user.fullName,
          photoUrl: user.photoUrl,
          installedSales: total.installedSales,
          branchContext,
        },
      ];
    })
    .sort(compareAdvisors);

  return sorted.map((advisor, index) => ({
    ...advisor,
    position: index + 1,
  }));
}

function buildBranchLeaders(
  groups: Array<{
    advisorId: string;
    branchId: string;
    _count: { _all: number };
  }>,
  branches: RankingBranchOption[],
  userById: Map<
    string,
    { id: string; fullName: string; photoUrl: string | null }
  >
) {
  return branches.flatMap((branch) => {
    if (!branch.isActive) {
      return [];
    }

    const leader = groups
      .filter((group) => group.branchId === branch.id)
      .flatMap((group) => {
        const user = userById.get(group.advisorId);

        return user
          ? [
              {
                advisorId: group.advisorId,
                fullName: user.fullName,
                photoUrl: user.photoUrl,
                installedSales: group._count._all,
              },
            ]
          : [];
      })
      .sort(compareAdvisors)[0];

    return leader
      ? [
          {
            ...leader,
            branchId: branch.id,
            branchName: branch.name,
          },
        ]
      : [];
  });
}

function getGlobalBranchContext(
  branchIds: Set<string>,
  branchById: Map<string, RankingBranchOption>
) {
  const branchNames = Array.from(branchIds)
    .map((branchId) => branchById.get(branchId)?.name)
    .filter((name): name is string => Boolean(name));

  if (branchNames.length === 1) {
    return branchNames[0];
  }

  return `${branchNames.length} sedes históricas`;
}

function compareAdvisors(
  left: { installedSales: number; fullName: string; advisorId: string },
  right: { installedSales: number; fullName: string; advisorId: string }
) {
  return (
    right.installedSales - left.installedSales ||
    nameCollator.compare(left.fullName, right.fullName) ||
    left.advisorId.localeCompare(right.advisorId)
  );
}

function normalizeUuid(value?: string | null) {
  if (!value) {
    return null;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  )
    ? value
    : null;
}
