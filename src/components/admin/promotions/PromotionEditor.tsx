"use client";

import { AlertCircle, ArrowLeft, Eye, Info, Save } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useRef, useState } from "react";
import {
  createPromotionDraftAction,
  initialPromotionActionState,
  updatePromotionAction,
} from "@/actions/promotions";
import { PromotionAssetManager } from "@/components/admin/promotions/PromotionAssetManager";
import { PromotionChipInput } from "@/components/admin/promotions/PromotionChipInput";
import { PromotionLifecycleAction } from "@/components/admin/promotions/PromotionLifecycleAction";
import { PromotionListEditor } from "@/components/admin/promotions/PromotionListEditor";
import { PromotionStatusBadge } from "@/components/admin/promotions/PromotionStatusBadge";
import type { PromotionEditorValue } from "@/components/admin/promotions/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { slugifyPromotionTitle } from "@/lib/validations/promotions";

const emptyPromotion: Omit<PromotionEditorValue, "id"> = {
  title: "",
  slug: "",
  shortDescription: null,
  kind: "CAMPAIGN",
  status: "DRAFT",
  category: null,
  tags: [],
  featured: false,
  sortOrder: 0,
  validFrom: "",
  validUntil: "",
  technologies: [],
  playTypes: [],
  zoneSummary: null,
  benefits: [],
  conditions: [],
  validations: [],
  commercialText: null,
  publishedAt: null,
  assets: [],
};

export function PromotionEditor({ promotion }: { promotion?: PromotionEditorValue }) {
  const router = useRouter();
  const mode = promotion ? "edit" : "create";
  const initial = promotion ?? emptyPromotion;
  const action = mode === "create" ? createPromotionDraftAction : updatePromotionAction;
  const [state, formAction, pending] = useActionState(action, initialPromotionActionState);
  const [revision, setRevision] = useState(0);
  const savedRevision = useRef(0);
  const submittedRevision = useRef(0);
  const dirty = revision !== savedRevision.current;
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [slugTouched, setSlugTouched] = useState(mode === "edit");
  const [kind, setKind] = useState(initial.kind);
  const [category, setCategory] = useState(initial.category ?? "NONE");
  const [featured, setFeatured] = useState(initial.featured);
  const [tags, setTags] = useState(initial.tags);
  const [technologies, setTechnologies] = useState(initial.technologies);
  const [playTypes, setPlayTypes] = useState(initial.playTypes);
  const [benefits, setBenefits] = useState(initial.benefits);
  const [conditions, setConditions] = useState(initial.conditions);
  const [validations, setValidations] = useState(initial.validations);

  useEffect(() => {
    if (state.status !== "success") return;
    savedRevision.current = submittedRevision.current;
    if (state.promotionId) {
      router.replace(`/admin/promociones/${state.promotionId}/editar?created=1`);
      return;
    }
    router.refresh();
  }, [router, state]);

  useEffect(() => {
    if (!dirty) return;

    function beforeUnload(event: BeforeUnloadEvent) {
      event.preventDefault();
    }

    function confirmLink(event: MouseEvent) {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest("a");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (!window.confirm("Hay cambios sin guardar. ¿Quieres salir de esta página?")) {
        event.preventDefault();
        event.stopPropagation();
      }
    }

    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", confirmLink, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", confirmLink, true);
    };
  }, [dirty]);

  function updateTitle(nextTitle: string) {
    setTitle(nextTitle);
    if (!slugTouched) setSlug(slugifyPromotionTitle(nextTitle));
  }

  function updateArray(setter: (value: string[]) => void, value: string[]) {
    setter(value);
    markDirty();
  }

  function markDirty() {
    setRevision((current) => current + 1);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button asChild variant="ghost" className="w-fit">
          <Link href="/admin/promociones"><ArrowLeft /> Volver al catálogo</Link>
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          {promotion ? <PromotionStatusBadge status={promotion.status} /> : null}
          {promotion ? (
            <Button asChild variant="outline">
              <Link href={`/admin/promociones/${promotion.id}/preview`}><Eye /> Ver preview</Link>
            </Button>
          ) : null}
        </div>
      </div>

      {promotion?.status === "ARCHIVED" ? (
        <Alert><Info /><AlertTitle>Promoción archivada</AlertTitle><AlertDescription>Puedes editar sus datos, pero primero debes restaurarla para volver a publicarla.</AlertDescription></Alert>
      ) : null}
      {promotion?.status === "PUBLISHED" ? (
        <Alert><Info /><AlertTitle>Edición protegida</AlertTitle><AlertDescription>Los cambios se guardarán solo si la promoción continúa cumpliendo las reglas de publicación.</AlertDescription></Alert>
      ) : null}
      {kind === "REGULAR_OFFER" ? (
        <Alert><Info /><AlertTitle>Oferta Regular</AlertTitle><AlertDescription>Oferta Regular se administra como una única entrada del catálogo. No crees una promoción por cada plan o velocidad. Para publicarla necesitarás al menos un Cuadro oficial o Documento oficial; el borrador puede guardarse incompleto.</AlertDescription></Alert>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <form
            id="promotion-editor-form"
            action={formAction}
            onChange={markDirty}
            onSubmit={() => {
              submittedRevision.current = revision;
            }}
            className="space-y-5"
          >
            {promotion ? <input type="hidden" name="promotionId" value={promotion.id} /> : null}
            <input type="hidden" name="kind" value={kind} />
            <input type="hidden" name="category" value={category === "NONE" ? "" : category} />
            <input type="hidden" name="featured" value={String(featured)} />
            <input type="hidden" name="tags" value={serializeList(tags)} />
            <input type="hidden" name="technologies" value={serializeList(technologies)} />
            <input type="hidden" name="playTypes" value={serializeList(playTypes)} />
            <input type="hidden" name="benefits" value={serializeList(benefits)} />
            <input type="hidden" name="conditions" value={serializeList(conditions)} />
            <input type="hidden" name="validations" value={serializeList(validations)} />

            <FormSection
              title="Información principal"
              description="Completa primero la información que identifica la promoción."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  className="md:col-span-2"
                  data-invalid={Boolean(state.fieldErrors?.title)}
                >
                  <FieldLabel htmlFor="promotion-title">Título *</FieldLabel>
                  <Input
                    id="promotion-title"
                    name="title"
                    value={title}
                    onChange={(event) => updateTitle(event.target.value)}
                    maxLength={160}
                    aria-invalid={Boolean(state.fieldErrors?.title)}
                    placeholder="Ej. Promo 1 Sol"
                    required
                  />
                  <FieldError>{state.fieldErrors?.title?.[0]}</FieldError>
                </Field>
                <Field>
                  <FieldLabel htmlFor="promotion-kind">Tipo</FieldLabel>
                  <Select
                    value={kind}
                    onValueChange={(value) => {
                      setKind(value as typeof kind);
                      markDirty();
                    }}
                  >
                    <SelectTrigger id="promotion-kind" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="CAMPAIGN">Campaña</SelectItem>
                      <SelectItem value="REGULAR_OFFER">
                        Oferta regular
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="promotion-category">Categoría</FieldLabel>
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      markDirty();
                    }}
                  >
                    <SelectTrigger id="promotion-category" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="NONE">Sin categoría</SelectItem>
                      <SelectItem value="Hogar">Hogar</SelectItem>
                      <SelectItem value="Convergencia">Convergencia</SelectItem>
                      <SelectItem value="Móvil">Móvil</SelectItem>
                      <SelectItem value="Negocios">Negocios</SelectItem>
                    </SelectContent>
                  </Select>
                  <FieldDescription>
                    Convergencia agrupa campañas de servicios fijos y móviles.
                  </FieldDescription>
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel htmlFor="promotion-description">
                    Descripción breve
                  </FieldLabel>
                  <Textarea
                    id="promotion-description"
                    name="shortDescription"
                    defaultValue={initial.shortDescription ?? ""}
                    maxLength={500}
                    rows={3}
                    placeholder="Explica brevemente para quién y para qué sirve la promoción."
                  />
                  <FieldDescription>Será obligatoria al publicar.</FieldDescription>
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Vigencia"
              description="Define el periodo de disponibilidad usando hora de Lima."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field data-invalid={Boolean(state.fieldErrors?.validFrom)}>
                  <FieldLabel htmlFor="promotion-valid-from">
                    Válida desde
                  </FieldLabel>
                  <Input
                    id="promotion-valid-from"
                    name="validFrom"
                    type="datetime-local"
                    defaultValue={initial.validFrom}
                    aria-invalid={Boolean(state.fieldErrors?.validFrom)}
                  />
                  <FieldError>{state.fieldErrors?.validFrom?.[0]}</FieldError>
                </Field>
                <Field data-invalid={Boolean(state.fieldErrors?.validUntil)}>
                  <FieldLabel htmlFor="promotion-valid-until">
                    Válida hasta
                  </FieldLabel>
                  <Input
                    id="promotion-valid-until"
                    name="validUntil"
                    type="datetime-local"
                    defaultValue={initial.validUntil}
                    aria-invalid={Boolean(state.fieldErrors?.validUntil)}
                  />
                  <FieldDescription>
                    Si no defines fecha final, permanecerá vigente hasta que sea
                    despublicada o archivada.
                  </FieldDescription>
                  <FieldError>{state.fieldErrors?.validUntil?.[0]}</FieldError>
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Clasificación"
              description="Selecciona todas las opciones que correspondan a la campaña."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field>
                  <FieldLabel>Tecnologías</FieldLabel>
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    value={technologies}
                    onValueChange={(value) =>
                      updateArray(setTechnologies, value)
                    }
                    className="w-full flex-wrap justify-start"
                    aria-label="Tecnologías de la promoción"
                  >
                    <ToggleGroupItem value="FTTH">FTTH</ToggleGroupItem>
                    <ToggleGroupItem value="HFC">HFC</ToggleGroupItem>
                  </ToggleGroup>
                  <FieldDescription>
                    Puedes seleccionar una o ambas tecnologías.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>Tipo de Play</FieldLabel>
                  <ToggleGroup
                    type="multiple"
                    variant="outline"
                    value={playTypes}
                    onValueChange={(value) => updateArray(setPlayTypes, value)}
                    className="w-full flex-wrap justify-start"
                    aria-label="Tipos de Play de la promoción"
                  >
                    {["1 Play", "2 Play", "3 Play"].map((item) => (
                      <ToggleGroupItem key={item} value={item}>
                        {item}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                  <FieldDescription>
                    La selección es múltiple y opcional.
                  </FieldDescription>
                </Field>
                <Field className="md:col-span-2">
                  <FieldLabel>Clasificación adicional</FieldLabel>
                  <PromotionChipInput
                    value={tags}
                    onChange={(value) => updateArray(setTags, value)}
                    placeholder="Ej. Full Claro, Focalizada, Universitario, Postpago, Prepago"
                  />
                  <FieldDescription>
                    Opcional. Sirven para organizar y buscar promociones.
                  </FieldDescription>
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Información comercial"
              description="Resume la cobertura y el mensaje que utilizará el asesor."
            >
              <div className="flex flex-col gap-5">
                <Field>
                  <FieldLabel htmlFor="promotion-zone">
                    Resumen de cobertura
                  </FieldLabel>
                  <Textarea
                    id="promotion-zone"
                    name="zoneSummary"
                    defaultValue={initial.zoneSummary ?? ""}
                    maxLength={2000}
                    rows={3}
                    placeholder="Ej. Chiclayo, Lambayeque, Trujillo y Piura."
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="promotion-commercial-text">
                    Texto sugerido para ofrecer al cliente
                  </FieldLabel>
                  <Textarea
                    id="promotion-commercial-text"
                    name="commercialText"
                    defaultValue={initial.commercialText ?? ""}
                    maxLength={10000}
                    rows={7}
                    placeholder="Escribe una guía breve y clara para el asesor…"
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Beneficios y condiciones"
              description="Organiza la información que el asesor necesita para ofrecer correctamente."
            >
              <div className="grid gap-6 lg:grid-cols-3">
                <Field>
                  <FieldLabel>Beneficios para mostrar</FieldLabel>
                  <FieldDescription>
                    Agrega los principales beneficios que debe conocer el asesor.
                  </FieldDescription>
                  <PromotionListEditor
                    value={benefits}
                    onChange={(value) => updateArray(setBenefits, value)}
                    emptyLabel="Sin beneficios agregados."
                    addLabel="Agregar beneficio"
                    placeholder="Ej. 1 Repetidor Mesh gratis"
                  />
                </Field>
                <Field>
                  <FieldLabel>Condiciones de la promoción</FieldLabel>
                  <FieldDescription>
                    Condiciones comerciales importantes para ofrecer correctamente
                    la campaña.
                  </FieldDescription>
                  <PromotionListEditor
                    value={conditions}
                    onChange={(value) => updateArray(setConditions, value)}
                    emptyLabel="Sin condiciones agregadas."
                    addLabel="Agregar condición"
                    placeholder="Ej. Sujeto a evaluación crediticia."
                  />
                </Field>
                <Field>
                  <FieldLabel>Qué debe validar el asesor</FieldLabel>
                  <FieldDescription>
                    Indica qué debe comprobar el asesor antes de ofrecer o registrar
                    la venta.
                  </FieldDescription>
                  <PromotionListEditor
                    value={validations}
                    onChange={(value) => updateArray(setValidations, value)}
                    emptyLabel="Sin validaciones agregadas."
                    addLabel="Agregar validación"
                    placeholder="Ej. Validar cobertura o confirmar vigencia en Vendamos."
                  />
                </Field>
              </div>
            </FormSection>

            <FormSection
              title="Material comercial"
              description="Administra flyers, coberturas, cuadros y documentos privados."
            >
              {promotion ? (
                <PromotionAssetManager
                  promotionId={promotion.id}
                  assets={promotion.assets}
                />
              ) : (
                <Alert>
                  <Info />
                  <AlertTitle>Materiales después del primer guardado</AlertTitle>
                  <AlertDescription>
                    Guarda el borrador para obtener su identificador y habilitar la
                    carga privada de archivos.
                  </AlertDescription>
                </Alert>
              )}
            </FormSection>

            <FormSection
              title="Opciones avanzadas"
              description="Ajustes que normalmente no necesitas modificar."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  className="md:col-span-2"
                  data-invalid={Boolean(state.fieldErrors?.slug)}
                >
                  <FieldLabel htmlFor="promotion-slug">
                    Identificador URL (slug)
                  </FieldLabel>
                  <Input
                    id="promotion-slug"
                    name="slug"
                    value={slug}
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(slugifyPromotionTitle(event.target.value));
                    }}
                    maxLength={180}
                    aria-invalid={Boolean(state.fieldErrors?.slug)}
                    required
                  />
                  <FieldDescription>
                    Se genera automáticamente desde el título. Edítalo solo si
                    necesitas una URL diferente.
                  </FieldDescription>
                  <FieldError>{state.fieldErrors?.slug?.[0]}</FieldError>
                </Field>
                <Field
                  orientation="horizontal"
                  className="rounded-lg border border-border p-4"
                >
                  <div className="flex-1">
                    <FieldLabel htmlFor="promotion-featured">
                      Promoción destacada
                    </FieldLabel>
                    <FieldDescription>
                      Prioriza la promoción en listados futuros.
                    </FieldDescription>
                  </div>
                  <Switch
                    id="promotion-featured"
                    checked={featured}
                    onCheckedChange={(checked) => {
                      setFeatured(checked);
                      markDirty();
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="promotion-sort-order">Orden</FieldLabel>
                  <Input
                    id="promotion-sort-order"
                    name="sortOrder"
                    type="number"
                    min={0}
                    max={10000}
                    defaultValue={initial.sortOrder}
                  />
                  <FieldDescription>
                    Déjalo en 0 salvo que necesites controlar la prioridad manual.
                  </FieldDescription>
                </Field>
              </div>
            </FormSection>
          </form>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-24 xl:self-start">
          <Card>
            <CardHeader><CardTitle>Guardar</CardTitle><CardDescription>El título es obligatorio; el identificador se genera automáticamente.</CardDescription></CardHeader>
            <CardContent className="space-y-3">
              <Button type="submit" form="promotion-editor-form" className="w-full" disabled={pending}><Save /> {pending ? "Guardando…" : mode === "create" ? "Guardar borrador" : "Guardar cambios"}</Button>
              {dirty ? <p className="text-xs font-medium text-amber-700 dark:text-amber-300">Hay cambios sin guardar.</p> : null}
              {state.status !== "idle" ? (
                <Alert variant={state.status === "error" ? "destructive" : "default"}>
                  {state.status === "error" ? <AlertCircle /> : null}
                  <AlertTitle>{state.status === "error" ? "No se guardó" : "Cambios guardados"}</AlertTitle>
                  <AlertDescription>{state.message}{state.details?.length ? <ul className="mt-2 list-disc space-y-1 pl-4">{state.details.map((detail) => <li key={detail}>{detail}</li>)}</ul> : null}</AlertDescription>
                </Alert>
              ) : null}
            </CardContent>
          </Card>

          {promotion ? (
            <Card>
              <CardHeader><CardTitle>Estado editorial</CardTitle><CardDescription>Las transiciones no eliminan la promoción.</CardDescription></CardHeader>
              <CardContent className="flex flex-col items-stretch gap-2">
                {promotion.status === "DRAFT" ? <PromotionLifecycleAction promotionId={promotion.id} transition="publish" /> : null}
                {promotion.status === "PUBLISHED" ? <PromotionLifecycleAction promotionId={promotion.id} transition="unpublish" /> : null}
                {promotion.status === "ARCHIVED" ? <PromotionLifecycleAction promotionId={promotion.id} transition="restore" /> : null}
                {promotion.status !== "ARCHIVED" ? <PromotionLifecycleAction promotionId={promotion.id} transition="archive" /> : null}
              </CardContent>
            </Card>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function FormSection({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
  );
}

function serializeList(value: string[]) {
  return JSON.stringify(value.map((item) => item.trim()).filter(Boolean));
}
