warning: in the working copy of 'src/app/promociones/page.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/offers/OfficialImage.tsx', LF will be replaced by CRLF the next time Git touches it
warning: in the working copy of 'src/components/offers/PromoCatalog.tsx', LF will be replaced by CRLF the next time Git touches it
[1mdiff --git a/public/ofertas/Oferta-Regular.png b/public/ofertas/Oferta-Regular.png[m
[1mindex f30a6d5..49494ca 100644[m
Binary files a/public/ofertas/Oferta-Regular.png and b/public/ofertas/Oferta-Regular.png differ
[1mdiff --git a/public/ofertas/hfc-puro.png b/public/ofertas/hfc-puro.png[m
[1mindex 87d9b8f..92ac820 100644[m
Binary files a/public/ofertas/hfc-puro.png and b/public/ofertas/hfc-puro.png differ
[1mdiff --git a/public/ofertas/oferta-basico.png b/public/ofertas/oferta-basico.png[m
[1mindex 8e73076..93d224f 100644[m
Binary files a/public/ofertas/oferta-basico.png and b/public/ofertas/oferta-basico.png differ
[1mdiff --git a/public/ofertas/oferta-medio.png b/public/ofertas/oferta-medio.png[m
[1mindex 31cf8ae..85fbde1 100644[m
Binary files a/public/ofertas/oferta-medio.png and b/public/ofertas/oferta-medio.png differ
[1mdiff --git a/public/ofertas/promo-grande.png b/public/ofertas/promo-grande.png[m
[1mindex c6d1e37..78eaedb 100644[m
Binary files a/public/ofertas/promo-grande.png and b/public/ofertas/promo-grande.png differ
[1mdiff --git a/src/app/promociones/page.tsx b/src/app/promociones/page.tsx[m
[1mindex ffae59c..5ddf8f2 100644[m
[1m--- a/src/app/promociones/page.tsx[m
[1m+++ b/src/app/promociones/page.tsx[m
[36m@@ -4,16 +4,8 @@[m [mimport { getActivePromotionOffers } from "@/lib/promotions";[m
 [m
 export const runtime = "nodejs";[m
 [m
[31m-type PageProps = {[m
[31m-  searchParams: Promise<{[m
[31m-    q?: string | string[];[m
[31m-    tipo?: string | string[];[m
[31m-  }>;[m
[31m-};[m
[31m-[m
[31m-export default async function PromocionesPage({ searchParams }: PageProps) {[m
[32m+[m[32mexport default async function PromocionesPage() {[m
   await connection();[m
[31m-  const params = await searchParams;[m
   const ofertas = await getActivePromotionOffers();[m
 [m
   return ([m
[36m@@ -32,8 +24,8 @@[m [mexport default async function PromocionesPage({ searchParams }: PageProps) {[m
               Promociones Claro[m
             </h1>[m
             <p className="mt-3 max-w-xl text-base leading-7 text-slate-300">[m
[31m-              Herramienta interna para revisar campañas, condiciones y material[m
[31m-              oficial antes de ofrecer.[m
[32m+[m[32m              Galería interna organizada por promoción para consultar el material[m
[32m+[m[32m              oficial y sus anexos en un solo lugar.[m
             </p>[m
           </div>[m
 [m
[36m@@ -49,20 +41,12 @@[m [mexport default async function PromocionesPage({ searchParams }: PageProps) {[m
       </section>[m
 [m
       <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">[m
[31m-        <PromoCatalog[m
[31m-          activeFilter={getParam(params.tipo)}[m
[31m-          ofertas={ofertas}[m
[31m-          query={getParam(params.q)}[m
[31m-        />[m
[32m+[m[32m        <PromoCatalog ofertas={ofertas} />[m
       </div>[m
     </main>[m
   );[m
 }[m
 [m
[31m-function getParam(value?: string | string[]) {[m
[31m-  return Array.isArray(value) ? value[0] ?? "" : value ?? "";[m
[31m-}[m
[31m-[m
 function HeroSignal({ text }: { text: string }) {[m
   return ([m
     <div className="rounded-lg border border-white/10 bg-[#111827]/55 px-4 py-3">[m
[1mdiff --git a/src/components/offers/OfficialImage.tsx b/src/components/offers/OfficialImage.tsx[m
[1mindex 979ed8d..264e541 100644[m
[1m--- a/src/components/offers/OfficialImage.tsx[m
[1m+++ b/src/components/offers/OfficialImage.tsx[m
[36m@@ -17,17 +17,18 @@[m [mtype OfficialImageProps = {[m
 [m
 const imageDimensions: Record<string, { width: number; height: number }> = {[m
   "/ofertas/hfc-puro-ciudades.png": { width: 966, height: 390 },[m
[31m-  "/ofertas/hfc-puro.png": { width: 965, height: 696 },[m
[32m+[m[32m  "/ofertas/hfc-puro.png": { width: 722, height: 692 },[m
   "/ofertas/linea-movil-MAX.png": { width: 1082, height: 650 },[m
   "/ofertas/linea-movil-MAXILIMITADO.png": { width: 1085, height: 552 },[m
[31m-  "/ofertas/oferta-basico.png": { width: 722, height: 552 },[m
[32m+[m[32m  "/ofertas/oferta-basico.png": { width: 957, height: 717 },[m
   "/ofertas/oferta-basicociudades.png": { width: 966, height: 495 },[m
[31m-  "/ofertas/oferta-medio.png": { width: 962, height: 612 },[m
[32m+[m[32m  "/ofertas/oferta-medio.png": { width: 960, height: 695 },[m
   "/ofertas/oferta-mediociudades.png": { width: 962, height: 462 },[m
[31m-  "/ofertas/Oferta-Regular.png": { width: 1085, height: 751 },[m
[32m+[m[32m  "/ofertas/Oferta-Regular.png": { width: 1050, height: 747 },[m
[32m+[m[32m  "/ofertas/canales-tecnologias%20.png": { width: 985, height: 697 },[m
   "/ofertas/oferta-relampago.png": { width: 725, height: 740 },[m
   "/ofertas/promo-1-sol.png": { width: 721, height: 765 },[m
[31m-  "/ofertas/promo-grande.png": { width: 965, height: 567 },[m
[32m+[m[32m  "/ofertas/promo-grande.png": { width: 957, height: 731 },[m
   "/ofertas/promo-grandeciudades.png": { width: 965, height: 112 },[m
 };[m
 [m
[1mdiff --git a/src/components/offers/PromoCatalog.tsx b/src/components/offers/PromoCatalog.tsx[m
[1mindex 1b4e9e0..b674ccf 100644[m
[1m--- a/src/components/offers/PromoCatalog.tsx[m
[1m+++ b/src/components/offers/PromoCatalog.tsx[m
[36m@@ -1,370 +1,127 @@[m
 "use client";[m
 [m
[32m+[m[32mimport { ArrowUpRight, Images } from "lucide-react";[m
[32m+[m[32mimport Image from "next/image";[m
[32m+[m[32mimport { useMemo, useState } from "react";[m
[32m+[m[32mimport { PromotionImageViewer } from "@/components/promotions/PromotionImageViewer";[m
 import {[m
[31m-  Database,[m
[31m-  Flame,[m
[31m-  Home,[m
[31m-  ListFilter,[m
[31m-  RotateCcw,[m
[31m-  Search,[m
[31m-  Smartphone,[m
[31m-  type LucideIcon,[m
[31m-  Wifi,[m
[31m-} from "lucide-react";[m
[31m-import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";[m
[31m-import { PromoCard } from "@/components/offers/PromoCard";[m
[31m-import { RegularOfferBanner } from "@/components/offers/RegularOfferBanner";[m
[32m+[m[32m  promotionGallerySections,[m
[32m+[m[32m  type PromotionGalleryItem,[m
[32m+[m[32m} from "@/data/promotion-gallery";[m
 import type { Oferta } from "@/lib/offer-utils";[m
[31m-import { cn } from "@/lib/utils";[m
[31m-[m
[31m-export type CatalogFilter =[m
[31m-  | "Todas"[m
[31m-  | "Oferta base"[m
[31m-  | "Internet hogar"[m
[31m-  | "HFC"[m
[31m-  | "Especiales"[m
[31m-  | "Linea movil";[m
 [m
 type PromoCatalogProps = {[m
[31m-  activeFilter?: string;[m
   ofertas: Oferta[];[m
[31m-  query?: string;[m
 };[m
 [m
[31m-type ScrollRequest =[m
[31m-  | { id: number; kind: "filter" }[m
[31m-  | { id: number; kind: "offer"; offerId: string };[m
[31m-[m
[31m-const filterOptions: { label: CatalogFilter; icon: LucideIcon }[] = [[m
[31m-  { label: "Todas", icon: ListFilter },[m
[31m-  { label: "Oferta base", icon: Database },[m
[31m-  { label: "Internet hogar", icon: Home },[m
[31m-  { label: "HFC", icon: Wifi },[m
[31m-  { label: "Especiales", icon: Flame },[m
[31m-  { label: "Linea movil", icon: Smartphone },[m
[31m-];[m
[31m-[m
[31m-const preferredOrderRank: Record<string, number> = {[m
[31m-  "oferta-regular": 0,[m
[31m-  "oferta-medio": 1,[m
[31m-  "oferta-basico": 2,[m
[31m-  "promo-grande": 3,[m
[31m-  "hfc-puro": 4,[m
[31m-  "oferta-relampago": 5,[m
[31m-  "promo-1-sol": 6,[m
[31m-  "linea-movil": 7,[m
[31m-};[m
[31m-[m
[31m-const searchableText = (oferta: Oferta) =>[m
[31m-  [[m
[31m-    oferta.nombre,[m
[31m-    oferta.categoria,[m
[31m-    oferta.precio,[m
[31m-    oferta.detallePrecio,[m
[31m-    oferta.velocidad,[m
[31m-    o