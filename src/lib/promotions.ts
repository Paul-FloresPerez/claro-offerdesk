import "server-only";

import { ofertas as sourceOffers, type Oferta as SourceOferta } from "@/data/ofertas";
import {
  normalizeEstadoOferta,
  normalizeTecnologia,
  type Oferta,
} from "@/lib/offer-utils";

export async function getActivePromotionOffers() {
  return getCodePromotionOffers();
}

export async function getPromotionOfferByIdOrSlug(identifier: string) {
  return getCodePromotionOffers().find((oferta) => oferta.id === identifier) ?? null;
}

export function getPromotionMetrics() {
  return {
    total: sourceOffers.length,
    active: sourceOffers.length,
    inactive: 0,
  };
}

export function getCodePromotionOffers(): Oferta[] {
  return sourceOffers.map(normalizeOffer);
}

function normalizeOffer(oferta: SourceOferta): Oferta {
  return {
    id: oferta.id,
    nombre: oferta.nombre,
    categoria: normalizeCategory(oferta.categoria),
    precio: oferta.precio,
    detallePrecio: oferta.detallePrecio,
    velocidad: oferta.velocidad,
    tecnologia: oferta.tecnologia.map(normalizeTecnologia),
    vigencia: oferta.vigencia,
    estado: normalizeEstadoOferta(oferta.estado),
    resumen: oferta.resumen,
    media: {
      principal: oferta.media.principal,
      ciudades: oferta.media.ciudades,
      adicionales: oferta.media.adicionales?.map((item) => ({ ...item })),
    },
    variantes: oferta.variantes?.map((variante) => ({ ...variante })),
    beneficios: [...oferta.beneficios],
    aplicaPara: [...oferta.aplicaPara],
    restricciones: [...oferta.restricciones],
    validaciones: [...oferta.validaciones],
    fraseVenta: oferta.fraseVenta,
  };
}

function normalizeCategory(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized.includes("oferta base")) return "Oferta base";
  if (normalized.includes("hfc")) return "Tecnologia / HFC";
  if (normalized.includes("especial")) return "Promociones especiales";
  if (normalized.includes("movil") || normalized.includes("vil")) {
    return "Linea Movil";
  }
  if (normalized.includes("hogar")) return "Hogar";

  return value;
}
