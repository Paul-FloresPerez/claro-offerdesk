export type EstadoOferta = "material-oficial" | "validar" | "incompleta";

export type CategoriaOferta = string;

export type TecnologiaOferta =
  | "HFC"
  | "HFC Plus"
  | "FTTH"
  | "Móvil"
  | "Por confirmar";

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
  "Catálogo general",
  "Hogar",
  "Tecnología / HFC",
  "Promociones especiales",
  "Línea Móvil",
] as const;

export const tecnologiasOferta: TecnologiaOferta[] = [
  "HFC",
  "HFC Plus",
  "FTTH",
  "Móvil",
  "Por confirmar",
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

export const ofertas: Oferta[] = [
  {
    id: "oferta-regular",
    nombre: "Oferta Regular",
    categoria: "Catálogo general",
    precio: "Catálogo oficial",
    detallePrecio:
      "Ver catálogo oficial de la imagen para precios One Play, Two Play y Three Play.",
    velocidad: "Según plan",
    tecnologia: ["HFC", "HFC Plus", "FTTH"],
    vigencia: "Junio 2026",
    estado: "material-oficial",
    resumen:
      "Catálogo general con precios oficiales para One Play, Two Play y Three Play.",
    media: {
      principal: "/ofertas/Oferta-Regular.png",
    },
    beneficios: [
      "Catálogo oficial para comparar One Play, Two Play y Three Play.",
      "Argumentos clave visibles en la imagen oficial.",
      "Material de uso interno para asesoría comercial.",
    ],
    aplicaPara: [
      "Clientes que requieren comparar planes del catálogo regular.",
      "One Play, Two Play y Three Play según catálogo oficial.",
    ],
    restricciones: [
      "Validar condiciones comerciales vigentes.",
      "No transcribir ni modificar precios fuera del catálogo oficial.",
      "Material de uso interno.",
    ],
    validaciones: [
      "Validar cobertura.",
      "Validar tecnología disponible.",
      "Validar vigencia.",
      "Validar tipo de plan: One Play, Two Play o Three Play.",
    ],
    fraseVenta:
      "Podemos revisar el catálogo regular oficial y elegir el tipo de plan que mejor calce con su necesidad, validando cobertura y tecnología antes de avanzar.",
  },
  {
    id: "oferta-basico",
    nombre: "Oferta Básico",
    categoria: "Hogar",
    precio: "S/39.50",
    detallePrecio: "Al mes x 4 meses. Precio regular: S/69.",
    velocidad: "200 Mbps",
    tecnologia: ["Por confirmar"],
    vigencia: "Por confirmar",
    estado: "material-oficial",
    resumen:
      "1 Play de 200 Mbps con precio promocional y beneficios Full Claro visibles en la imagen oficial.",
    media: {
      principal: "/ofertas/oferta-basico.png",
      ciudades: "/ofertas/oferta-basicociudades.png",
    },
    beneficios: [
      "400 Mbps x 12 meses y, si es Full Claro, para toda la vida.",
      "Más de 30 canales en vivo a través de Claro video.",
      "Universal+ incluido a través de Claro video.",
    ],
    aplicaPara: ["Zonas determinadas sujetas a cobertura."],
    restricciones: ["Sujeto a cobertura en las zonas oficiales indicadas."],
    validaciones: [
      "Validar dirección exacta.",
      "Confirmar cobertura de la zona oficial.",
      "Confirmar si el cliente califica como Full Claro.",
    ],
    fraseVenta:
      "Sr./Sra., esta opción puede convenirle si busca internet hogar de menor pago inicial; primero valido su cobertura para confirmarlo correctamente.",
  },
  {
    id: "oferta-medio",
    nombre: "Oferta Medio",
    categoria: "Hogar",
    precio: "S/55",
    detallePrecio: "Al mes x 6 meses. Precio regular: S/89.",
    velocidad: "400 Mbps",
    tecnologia: ["Por confirmar"],
    vigencia: "Por confirmar",
    estado: "material-oficial",
    resumen:
      "1 Play de 400 Mbps con repetidor y beneficios adicionales visibles en la imagen oficial.",
    media: {
      principal: "/ofertas/oferta-medio.png",
      ciudades: "/ofertas/oferta-mediociudades.png",
    },
    beneficios: [
      "1000 Mbps x 12 meses y, si es Full Claro, para toda la vida.",
      "1 repetidor incluido.",
      "Más de 30 canales en vivo a través de Claro video.",
      "Universal+ incluido a través de Claro video.",
    ],
    aplicaPara: ["Zonas determinadas sujetas a cobertura."],
    restricciones: ["Sujeto a disponibilidad técnica y cobertura."],
    validaciones: [
      "Validar dirección exacta.",
      "Confirmar cobertura de la zona oficial.",
      "Confirmar si el cliente califica como Full Claro.",
    ],
    fraseVenta:
      "Por la cantidad de dispositivos en casa, puedo validar una opción intermedia con repetidor y mayor beneficio de velocidad.",
  },
  {
    id: "promo-grande",
    nombre: "Promo Grande",
    categoria: "Hogar",
    precio: "Desde S/55",
    detallePrecio:
      "850 Mbps: S/55 x 4 meses. 1000 Mbps: S/59.90 x 6 meses.",
    velocidad: "850 Mbps / 1000 Mbps",
    tecnologia: ["Por confirmar"],
    vigencia: "Por confirmar",
    estado: "material-oficial",
    resumen:
      "Promoción de mayor velocidad con dos variantes y beneficios visibles en el material oficial.",
    media: {
      principal: "/ofertas/promo-grande.png",
      ciudades: "/ofertas/promo-grandeciudades.png",
    },
    variantes: [
      {
        nombre: "1 Play 850 Mbps",
        precio: "S/55",
        detalle: "Al mes x 4 meses.",
        velocidad: "850 Mbps",
        luego: "Precio regular: S/125.",
      },
      {
        nombre: "1 Play 1000 Mbps",
        precio: "S/59.90",
        detalle: "Al mes x 6 meses.",
        velocidad: "1000 Mbps",
        luego: "Precio regular: S/145.",
      },
    ],
    beneficios: [
      "1000 Mbps x 12 meses y, si es Full Claro, para toda la vida.",
      "2 repetidores incluidos.",
      "L1MAX incluido.",
      "Más de 30 canales en vivo a través de Claro video.",
      "Universal+ incluido a través de Claro video.",
    ],
    aplicaPara: ["Arequipa, La Libertad y Piura.", "Callao y Lima."],
    restricciones: ["Sujeto a cobertura en las zonas oficiales indicadas."],
    validaciones: [
      "Validar cobertura antes de ofrecer.",
      "Confirmar la variante disponible para la dirección.",
      "Confirmar si el cliente califica como Full Claro.",
    ],
    fraseVenta:
      "Por su necesidad de mayor velocidad, puedo validar Promo Grande y confirmar si aplica la variante de 850 o 1000 Mbps en su dirección.",
  },
  {
    id: "hfc-puro",
    nombre: "HFC Puro",
    categoria: "Tecnología / HFC",
    precio: "Desde S/30",
    detallePrecio: "Precio promocional por 12 meses según variante.",
    velocidad: "150 Mbps",
    tecnologia: ["HFC"],
    vigencia: "Por confirmar",
    estado: "material-oficial",
    resumen:
      "Oferta HFC con variantes de internet puro e internet más TV, ambas con beneficios Full Claro visibles.",
    media: {
      principal: "/ofertas/hfc-puro.png",
      ciudades: "/ofertas/hfc-puro-ciudades.png",
    },
    variantes: [
      {
        nombre: "Internet 150 Mbps",
        precio: "S/30",
        detalle: "Por 12 meses.",
        velocidad: "150 Mbps",
        luego: "Precio regular: S/44.",
      },
      {
        nombre: "Internet 150 Mbps + TV",
        precio: "S/69",
        detalle: "Por 12 meses.",
        velocidad: "150 Mbps",
        luego: "Precio regular: S/99.",
      },
    ],
    beneficios: [
      "300 Mbps x 12 meses y, si es Full Claro, para toda la vida.",
      "Más de 30 canales en vivo y Universal+ en la variante de internet.",
      "Más de 80 canales en vivo, Universal+ y L1MAX en la variante con TV.",
    ],
    aplicaPara: ["Distritos indicados en la imagen oficial de cobertura."],
    restricciones: [
      "La variante con TV indica decodificador DTA HD sin guía de programación.",
      "Sujeto a cobertura en los distritos oficiales indicados.",
    ],
    validaciones: [
      "Validar que la dirección esté dentro de los distritos indicados.",
      "Confirmar si el cliente requiere solo internet o internet más TV.",
      "Confirmar si el cliente califica como Full Claro.",
    ],
    fraseVenta:
      "Si consulta por HFC Puro, primero valido si su distrito aplica y luego le confirmo la variante disponible según su necesidad.",
  },
  {
    id: "oferta-relampago",
    nombre: "Oferta Relámpago",
    categoria: "Promociones especiales",
    precio: "Desde S/42",
    detallePrecio: "Precios promocionales x 3 primeros meses; luego según plan.",
    velocidad: "300 Mbps a 1500 Mbps Pro",
    tecnologia: ["FTTH", "Por confirmar"],
    vigencia: "Por confirmar",
    estado: "validar",
    resumen:
      "Oferta 2 Play con varias velocidades, telefonía incluida y precios posteriores visibles en la imagen oficial.",
    media: {
      principal: "/ofertas/oferta-relampago.png",
    },
    variantes: [
      {
        nombre: "1500 Mbps Pro",
        precio: "S/109",
        detalle: "x 3 primeros meses.",
        velocidad: "1500 Mbps Pro",
        luego: "Luego S/205. Solo en FTTH.",
      },
      {
        nombre: "1000 Mbps Pro",
        precio: "S/79",
        detalle: "x 3 primeros meses.",
        velocidad: "1000 Mbps Pro",
        luego: "Luego S/150.",
      },
      {
        nombre: "850 Mbps Pro",
        precio: "S/69",
        detalle: "x 3 primeros meses.",
        velocidad: "850 Mbps Pro",
        luego: "Luego S/130.",
      },
      {
        nombre: "800 Mbps",
        precio: "S/52.5",
        detalle: "x 3 primeros meses.",
        velocidad: "800 Mbps",
        luego: "Luego S/105.",
      },
      {
        nombre: "500 Mbps Pro",
        precio: "S/59",
        detalle: "x 3 primeros meses.",
        velocidad: "500 Mbps Pro",
        luego: "Luego S/115.",
      },
      {
        nombre: "400 Mbps",
        precio: "S/47",
        detalle: "x 3 primeros meses.",
        velocidad: "400 Mbps",
        luego: "Luego S/94.",
      },
      {
        nombre: "350 Mbps Pro",
        precio: "S/55",
        detalle: "x 3 primeros meses.",
        velocidad: "350 Mbps Pro",
        luego: "Luego S/105.",
      },
      {
        nombre: "300 Mbps",
        precio: "S/42",
        detalle: "x 3 primeros meses.",
        velocidad: "300 Mbps",
        luego: "Luego S/84.",
      },
    ],
    beneficios: [
      "Telefonía incluida.",
      "Minutos ilimitados a todo Claro.",
      "5000 minutos a cualquier operador del Perú.",
      "Los planes PRO incluyen acceso a L1 Max a través de Claro Video.",
    ],
    aplicaPara: ["Todas las ciudades."],
    restricciones: [
      "1500 Mbps Pro indica: solo en FTTH.",
      "Validar precio posterior antes de cerrar la venta.",
    ],
    validaciones: [
      "Confirmar velocidad disponible en la dirección.",
      "Confirmar si corresponde plan PRO.",
      "Informar precio promocional y precio posterior.",
    ],
    fraseVenta:
      "Tenemos una oferta relámpago con precio inicial por tres meses; valido su cobertura y le confirmo también el precio posterior para que tenga la información completa.",
  },
  {
    id: "promo-1-sol",
    nombre: "Promo 1 Sol",
    categoria: "Promociones especiales",
    precio: "S/1",
    detallePrecio: "x 2 meses. Precio regular: S/89.",
    velocidad: "Fibra 400 Mbps",
    tecnologia: ["FTTH"],
    vigencia: "Por confirmar",
    estado: "validar",
    resumen:
      "Promoción de fibra con ciudades incluidas dentro de la misma imagen oficial.",
    media: {
      principal: "/ofertas/promo-1-sol.png",
    },
    beneficios: [
      "1000+ Mbps para toda la vida mientras seas Full Claro.",
      "Repetidor incluido en el plan.",
      "+30 canales en vivo.",
      "Universal+ a través de Claro video.",
    ],
    aplicaPara: [
      "Santa (Ancash).",
      "Trujillo (La Libertad).",
      "Chiclayo y Lambayeque (Lambayeque).",
      "Piura (Piura).",
      "Huancayo (Junín).",
      "Departamentos de Lima y Arequipa.",
    ],
    restricciones: [
      "Solo en las provincias/departamentos indicados en la imagen oficial.",
    ],
    validaciones: [
      "Confirmar que la dirección corresponda a las zonas indicadas.",
      "Confirmar si el cliente califica como Full Claro.",
      "Confirmar condiciones vigentes antes de ofrecer.",
    ],
    fraseVenta:
      "Hay una promoción especial de fibra a S/1 por dos meses; primero valido si su zona está dentro de las ciudades indicadas.",
  },
  {
    id: "linea-movil",
    nombre: "Línea Móvil",
    categoria: "Línea Móvil",
    precio: "Desde S/29.90",
    detallePrecio: "Planes Max y Max Ilimitados según imágenes oficiales.",
    velocidad: "No aplica",
    tecnologia: ["Móvil"],
    vigencia: "Por confirmar",
    estado: "material-oficial",
    resumen:
      "Planes móviles con material adicional para Planes Max y Planes Max Ilimitados.",
    media: {
      adicionales: [
        {
          titulo: "Planes Max",
          descripcion: "Tabla oficial de componentes incluidos.",
          src: "/ofertas/linea-movil-MAX.png",
        },
        {
          titulo: "Planes Max Ilimitados",
          descripcion: "Tabla oficial de componentes incluidos.",
          src: "/ofertas/linea-movil-MAXILIMITADO.png",
        },
      ],
    },
    variantes: [
      { nombre: "Planes Max", precio: "Desde S/29.90" },
      { nombre: "Planes Max Ilimitados", precio: "Desde S/69.90" },
    ],
    beneficios: [
      "Minutos y SMS nacionales según plan.",
      "Cobertura internacional según plan.",
      "Apps ilimitadas y GB incluidos según tabla oficial.",
    ],
    aplicaPara: ["Líneas móviles nuevas o porta, según tabla oficial."],
    restricciones: [
      "No usa ciudades.",
      "Revisar condiciones específicas de cada plan en las imágenes oficiales.",
    ],
    validaciones: [
      "Confirmar si el cliente solicita línea nueva o portabilidad.",
      "Confirmar plan exacto antes de cotizar.",
      "Revisar la tabla oficial del plan elegido.",
    ],
    fraseVenta:
      "Para línea móvil, revisamos si necesita una línea nueva o portar su número y elegimos el plan exacto según la tabla oficial.",
  },
];

export function getOfertaById(id: string) {
  return ofertas.find((oferta) => oferta.id === id);
}

export function getOfertaCover(oferta: Oferta) {
  return oferta.media.principal ?? oferta.media.adicionales?.[0];
}
