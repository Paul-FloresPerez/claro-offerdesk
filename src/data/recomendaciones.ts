export type RecomendacionNecesidad =
  | "pagar-menos"
  | "familia"
  | "trabajo-remoto"
  | "gaming-streaming"
  | "fibra"
  | "hfc-puro"
  | "linea-movil"
  | "promocion-especial";

export type Recomendacion = {
  id: RecomendacionNecesidad;
  titulo: string;
  descripcion: string;
  ofertaId: string;
  motivo: string;
  advertencia: string;
};

export const recomendaciones: Recomendacion[] = [
  {
    id: "pagar-menos",
    titulo: "Quiere pagar menos",
    descripcion: "Priorizar precio inicial bajo y validar zona antes de ofrecer.",
    ofertaId: "promo-1-sol",
    motivo:
      "Promo 1 Sol muestra S/1 x 2 meses en la imagen oficial, pero solo aplica en zonas indicadas.",
    advertencia:
      "Si la zona no aplica, revisar Oferta Básico u otra alternativa con cobertura confirmada.",
  },
  {
    id: "familia",
    titulo: "Familia con varios dispositivos",
    descripcion: "Buscar mayor capacidad y beneficios de conectividad.",
    ofertaId: "oferta-medio",
    motivo:
      "Oferta Medio muestra 400 Mbps, repetidor y beneficio de 1000 Mbps x 12 meses en la imagen oficial.",
    advertencia: "Confirmar cobertura y condición Full Claro antes de ofrecer beneficios.",
  },
  {
    id: "trabajo-remoto",
    titulo: "Trabajo remoto",
    descripcion: "Priorizar velocidad, estabilidad y cobertura de la dirección.",
    ofertaId: "promo-grande",
    motivo:
      "Promo Grande presenta variantes de 850 Mbps y 1000 Mbps con repetidores incluidos.",
    advertencia: "Confirmar la variante disponible para la dirección del cliente.",
  },
  {
    id: "gaming-streaming",
    titulo: "Gaming o streaming",
    descripcion: "Priorizar mayor velocidad y beneficios de entretenimiento.",
    ofertaId: "promo-grande",
    motivo:
      "Promo Grande concentra las velocidades más altas visibles entre las ofertas hogar cargadas.",
    advertencia: "Validar cobertura y explicar precio regular de la variante elegida.",
  },
  {
    id: "fibra",
    titulo: "Quiere fibra óptica",
    descripcion: "Validar cobertura FTTH o material que indique fibra.",
    ofertaId: "promo-1-sol",
    motivo: "Promo 1 Sol indica Fibra de 400 Mbps en la imagen oficial.",
    advertencia: "Solo ofrecer si la zona figura en la imagen oficial y la cobertura confirma.",
  },
  {
    id: "hfc-puro",
    titulo: "Pregunta por HFC Puro",
    descripcion: "Resolver consulta directa sobre HFC y sus variantes.",
    ofertaId: "hfc-puro",
    motivo:
      "HFC Puro tiene material específico con variantes de internet e internet más TV.",
    advertencia: "Validar distrito aplicable y variante exacta antes de cotizar.",
  },
  {
    id: "linea-movil",
    titulo: "Pregunta por línea móvil",
    descripcion: "Revisar planes Max y Max Ilimitados.",
    ofertaId: "linea-movil",
    motivo:
      "Línea Móvil cuenta con tablas oficiales separadas para Planes Max y Planes Max Ilimitados.",
    advertencia: "Confirmar línea nueva o porta y plan exacto antes de cerrar.",
  },
  {
    id: "promocion-especial",
    titulo: "Quiere promoción especial",
    descripcion: "Mostrar campañas con condiciones más sensibles.",
    ofertaId: "oferta-relampago",
    motivo:
      "Oferta Relámpago presenta precios por los 3 primeros meses y precios posteriores visibles.",
    advertencia: "Informar siempre precio inicial y precio posterior.",
  },
];
