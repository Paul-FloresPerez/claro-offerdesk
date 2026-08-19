export type PromotionEditorAsset = {
  id: string;
  kind: "FLYER" | "COVERAGE" | "OFFICIAL_TABLE" | "OFFICIAL_DOCUMENT" | "INTERNAL";
  displayName: string;
  mimeType: string;
  altText: string | null;
  sortOrder: number;
  sizeBytes: number | null;
  width: number | null;
  height: number | null;
  createdAt: string;
};

export type PromotionEditorValue = {
  id: string;
  title: string;
  slug: string;
  shortDescription: string | null;
  kind: "CAMPAIGN" | "REGULAR_OFFER";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  category: string | null;
  tags: string[];
  featured: boolean;
  sortOrder: number;
  validFrom: string;
  validUntil: string;
  technologies: string[];
  playTypes: string[];
  zoneSummary: string | null;
  benefits: string[];
  conditions: string[];
  validations: string[];
  commercialText: string | null;
  publishedAt: string | null;
  assets: PromotionEditorAsset[];
};
