export type EstadoOferta = "material-oficial" | "validar" | "incompleta";

export type CategoriaOferta = string;

export type TecnologiaOferta =
  | "HFC"
  | "HFC Plus"
  | "FTTH"
  | "Movil"
  | "Validar tecnologia";

export type OfertaMediaAdicional = {
  titulo: string;
  descripcion?: string;
  src: string;
};

export type OfertaMedia = {
  principal?: string;
  ciudades?: string;
  adicionales?: OfertaMediaAdicional[];
};

export type OfertaVariante = {
  nombre: string;
  precio: string;
  detalle?: string;
  velocidad?: string;
  luego?: string;
};

export type Oferta = {
  id: string;
  nombre: string;
  categoria: CategoriaOferta;
  precio: string;
  detallePrecio: string;
  velocidad: string;
  tecnologia: TecnologiaOferta[];
  vigencia: string;
  estado: EstadoOferta;
  resumen: string;
  media: OfertaMedia;
  variantes?: OfertaVariante[];
  beneficios: string[];
  aplicaPara: string[];
  restricciones: string[];
  validaciones: string[];
  fraseVenta: string;
};

export const categoriasOferta = [
  "Oferta base",
  "Hogar",
  "Tecnologia / HFC",
  "Promociones especiales",
  "Linea Movil",
] as const;

export const tecnologiasOferta: TecnologiaOferta[] = [
  "HFC",
  "HFC Plus",
  "FTTH",
  "Movil",
  "Validar tecnologia",
];

export const estadosOferta: EstadoOferta[] = [
  "material-oficial",
  "validar",
  "incompleta",
];

export const estadoOfertaLabel: Record<EstadoOferta, string> = {
  "material-oficial": "Material oficial",
  validar: "Validar",
  incompleta: "Datos pendientes",
};

export function getOfertaCover(oferta: Oferta) {
  return oferta.media.principal ?? oferta.media.adicionales?.[0];
}

export function normalizeEstadoOferta(value?: string | null): EstadoOferta {
  if (value === "validar" || value === "incompleta") {
    return value;
  }

  return "material-oficial";
}

export function normalizeTecnologia(value: string): TecnologiaOferta {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

  if (normalized === "movil" || normalized.includes("vil")) {
    return "Movil";
  }

  if (normalized === "validar tecnologia" || normalized.includes("validar")) {
    return "Validar tecnologia";
  }

  if (value === "HFC" || value === "HFC Plus" || value === "FTTH") {
    return value;
  }

  return "Validar tecnologia";
}

export function createSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}
