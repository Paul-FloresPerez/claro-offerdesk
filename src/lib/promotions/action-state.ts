export type PromotionActionState = {
  status: "idle" | "success" | "error";
  message: string;
  fieldErrors?: Record<string, string[]>;
  details?: string[];
  promotionId?: string;
};

export const initialPromotionActionState: PromotionActionState = {
  status: "idle",
  message: "",
};
