"use client";

import { Download, Eye, FileImage, FileText, Plus, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PromotionEditorAsset } from "@/components/admin/promotions/types";

const assetLabels = {
  FLYER: "Flyer principal",
  COVERAGE: "Cobertura",
  OFFICIAL_TABLE: "Cuadro oficial",
  OFFICIAL_DOCUMENT: "Documento oficial",
  INTERNAL: "Material interno",
} as const;

export function PromotionAssetManager({
  promotionId,
  assets,
}: {
  promotionId: string;
  assets: PromotionEditorAsset[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<keyof typeof assetLabels>("FLYER");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function uploadAsset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setFeedback(null);
    const formData = new FormData(event.currentTarget);
    formData.set("kind", kind);

    try {
      const response = await fetch(`/api/admin/promotions/${promotionId}/assets`, {
        method: "POST",
        body: formData,
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(result?.message ?? "No se pudo subir el material.");

      formRef.current?.reset();
      setKind("FLYER");
      setOpen(false);
      setFeedback({ type: "success", message: "Material subido correctamente." });
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "No se pudo subir el material.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function deleteAsset(assetId: string) {
    setBusy(true);
    setFeedback(null);

    try {
      const response = await fetch(`/api/admin/promotions/assets/${assetId}`, {
        method: "DELETE",
      });
      const result = (await response.json().catch(() => null)) as { message?: string } | null;
      if (!response.ok) throw new Error(result?.message ?? "No se pudo eliminar el material.");

      setFeedback({ type: "success", message: "Material eliminado correctamente." });
      router.refresh();
    } catch (error) {
      setFeedback({
        type: "error",
        message: error instanceof Error ? error.message : "No se pudo eliminar el material.",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Materiales privados</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            PNG, JPEG, WebP o PDF. Máximo 4 MB por archivo.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button type="button"><Plus /> Agregar material</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Agregar material</DialogTitle>
              <DialogDescription>
                El archivo se guardará en el Blob privado de Promociones.
              </DialogDescription>
            </DialogHeader>
            <form ref={formRef} onSubmit={uploadAsset} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="asset-kind">Tipo de material</FieldLabel>
                <Select value={kind} onValueChange={(value) => setKind(value as keyof typeof assetLabels)}>
                  <SelectTrigger id="asset-kind" className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent position="popper">
                    {Object.entries(assetLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-display-name">Nombre visible</FieldLabel>
                <Input id="asset-display-name" name="displayName" maxLength={160} placeholder="Ej. Flyer agosto" required />
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-file">Archivo</FieldLabel>
                <Input id="asset-file" name="file" type="file" accept="image/png,image/jpeg,image/webp,application/pdf" required />
                <FieldDescription>El servidor valida tamaño, MIME y firma real.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-alt-text">Texto alternativo</FieldLabel>
                <Input id="asset-alt-text" name="altText" maxLength={300} placeholder="Describe la información relevante de la imagen" />
              </Field>
              <Field>
                <FieldLabel htmlFor="asset-sort-order">Orden</FieldLabel>
                <Input id="asset-sort-order" name="sortOrder" type="number" min={0} max={10000} defaultValue={assets.length} />
              </Field>
              {feedback?.type === "error" ? (
                <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{feedback.message}</AlertDescription></Alert>
              ) : null}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={busy}>Cancelar</Button>
                <Button type="submit" disabled={busy}><Upload /> {busy ? "Subiendo…" : "Subir material"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {feedback?.type === "success" ? (
        <Alert><AlertTitle>Listo</AlertTitle><AlertDescription>{feedback.message}</AlertDescription></Alert>
      ) : null}
      {feedback?.type === "error" && !open ? (
        <Alert variant="destructive"><AlertTitle>No se completó la operación</AlertTitle><AlertDescription>{feedback.message}</AlertDescription></Alert>
      ) : null}

      {assets.length ? (
        <div className="grid gap-3">
          {assets.map((asset) => {
            const AssetIcon = asset.mimeType === "application/pdf" ? FileText : FileImage;
            const assetUrl = `/api/promotions/assets/${asset.id}`;
            return (
              <article key={asset.id} className="flex flex-col gap-3 rounded-lg border border-border bg-background/50 p-4 md:flex-row md:items-center">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground"><AssetIcon className="size-5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{asset.displayName}</p>
                    <Badge variant="outline">{assetLabels[asset.kind]}</Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {asset.mimeType} · {formatBytes(asset.sizeBytes)} · Orden {asset.sortOrder}
                  </p>
                  {asset.altText ? <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{asset.altText}</p> : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline"><a href={assetUrl} target="_blank" rel="noreferrer"><Eye /> Ver</a></Button>
                  <Button asChild size="sm" variant="ghost"><a href={`${assetUrl}?download=1`}><Download /> Descargar</a></Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button type="button" size="sm" variant="destructive" disabled={busy}><Trash2 /> Eliminar</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>¿Eliminar este material?</AlertDialogTitle><AlertDialogDescription>Se eliminarán el archivo privado y su metadata. Esta acción no se puede deshacer.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel disabled={busy}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction type="button" variant="destructive" disabled={busy} onClick={() => deleteAsset(asset.id)}>{busy ? "Eliminando…" : "Eliminar"}</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border px-5 py-8 text-center">
          <FileImage className="mx-auto size-7 text-muted-foreground" />
          <p className="mt-3 font-medium text-foreground">Aún no hay materiales</p>
          <p className="mt-1 text-sm text-muted-foreground">Agrega los archivos necesarios antes de publicar.</p>
        </div>
      )}
    </div>
  );
}

function formatBytes(value: number | null) {
  if (value === null) return "Tamaño no disponible";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}
