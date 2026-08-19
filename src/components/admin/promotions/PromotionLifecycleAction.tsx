"use client";

import { Archive, ArchiveRestore, EyeOff, Send, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import {
  archivePromotionAction,
  initialPromotionActionState,
  publishPromotionAction,
  restorePromotionAction,
  setPromotionFeaturedAction,
  unpublishPromotionAction,
  type PromotionActionState,
} from "@/actions/promotions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Transition = "archive" | "publish" | "restore" | "unpublish";

const transitionConfig = {
  publish: {
    label: "Publicar",
    title: "¿Publicar esta promoción?",
    description:
      "Se comprobarán los campos editoriales y los materiales requeridos antes de publicarla.",
    icon: Send,
    action: publishPromotionAction,
    variant: "default" as const,
  },
  unpublish: {
    label: "Despublicar",
    title: "¿Despublicar esta promoción?",
    description:
      "La promoción dejará de ser visible para asesores y supervisores. Volverá a borrador y conservará la fecha de primera publicación.",
    icon: EyeOff,
    action: unpublishPromotionAction,
    variant: "outline" as const,
  },
  archive: {
    label: "Archivar",
    title: "¿Archivar esta promoción?",
    description:
      "Dejará de estar operativa. Podrás restaurarla después como borrador.",
    icon: Archive,
    action: archivePromotionAction,
    variant: "destructive" as const,
  },
  restore: {
    label: "Restaurar",
    title: "¿Restaurar esta promoción?",
    description: "La promoción volverá al estado Borrador para poder editarla.",
    icon: ArchiveRestore,
    action: restorePromotionAction,
    variant: "outline" as const,
  },
};

export function PromotionLifecycleAction({
  promotionId,
  transition,
  compact = false,
}: {
  promotionId: string;
  transition: Transition;
  compact?: boolean;
}) {
  const config = transitionConfig[transition];
  const router = useRouter();
  const [state, formAction, pending] = useActionState<
    PromotionActionState,
    FormData
  >(config.action, initialPromotionActionState);
  const Icon = config.icon;

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [router, state.status]);

  return (
    <div className={cn("space-y-1", compact && "inline-block")}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            type="button"
            size={compact ? "sm" : "default"}
            variant={config.variant}
          >
            <Icon />
            {config.label}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{config.title}</AlertDialogTitle>
            <AlertDialogDescription>{config.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <form action={formAction}>
            <input type="hidden" name="promotionId" value={promotionId} />
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                variant={config.variant}
                disabled={pending}
              >
                {pending ? "Procesando…" : config.label}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
      {state.status === "error" ? (
        <div role="alert" className="max-w-72 text-xs text-destructive">
          <p>{state.message}</p>
          {state.details?.length ? (
            <ul className="mt-1 list-disc space-y-0.5 pl-4">
              {state.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function PromotionFeaturedAction({
  promotionId,
  featured,
}: {
  promotionId: string;
  featured: boolean;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    setPromotionFeaturedAction,
    initialPromotionActionState
  );

  useEffect(() => {
    if (state.status === "success") router.refresh();
  }, [router, state.status]);

  return (
    <div>
      <form action={formAction}>
        <input type="hidden" name="promotionId" value={promotionId} />
        <input type="hidden" name="featured" value={featured ? "false" : "true"} />
        <Button
          type="submit"
          size="icon-sm"
          variant="ghost"
          disabled={pending}
          aria-label={featured ? "Quitar de destacados" : "Marcar como destacada"}
          title={featured ? "Quitar de destacados" : "Marcar como destacada"}
        >
          <Star className={cn(featured && "fill-amber-400 text-amber-500")} />
        </Button>
      </form>
      {state.status === "error" ? (
        <span role="alert" className="mt-1 block max-w-40 text-xs text-destructive">{state.message}</span>
      ) : null}
    </div>
  );
}
