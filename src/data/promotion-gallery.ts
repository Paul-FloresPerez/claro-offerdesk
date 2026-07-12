export type PromotionGalleryImage = {
  src: string;
  label: string;
  alt: string;
};

export type PromotionGalleryItem = {
  offerId: string;
  name: string;
  category: string;
  images: PromotionGalleryImage[];
};

export type PromotionGallerySection = {
  id: string;
  title: string;
  items: PromotionGalleryItem[];
};

export const promotionGallerySections: PromotionGallerySection[] = [
  {
    id: "destacadas",
    title: "Promociones destacadas",
    items: [
      {
        offerId: "oferta-basico",
        name: "Promo Básico",
        category: "Internet hogar",
        images: [
          {
            src: "/ofertas/oferta-basico.png",
            label: "Oferta",
            alt: "Oferta oficial de Promo Básico",
          },
          {
            src: "/ofertas/oferta-basicociudades.png",
            label: "Cobertura",
            alt: "Cobertura oficial de Promo Básico",
          },
        ],
      },
      {
        offerId: "oferta-medio",
        name: "Promo Medio",
        category: "Internet hogar",
        images: [
          {
            src: "/ofertas/oferta-medio.png",
            label: "Oferta",
            alt: "Oferta oficial de Promo Medio",
          },
          {
            src: "/ofertas/oferta-mediociudades.png",
            label: "Cobertura",
            alt: "Cobertura oficial de Promo Medio",
          },
        ],
      },
      {
        offerId: "promo-grande",
        name: "Promo Grande",
        category: "Internet hogar",
        images: [
          {
            src: "/ofertas/promo-grande.png",
            label: "Oferta",
            alt: "Oferta oficial de Promo Grande",
          },
          {
            src: "/ofertas/promo-grandeciudades.png",
            label: "Cobertura",
            alt: "Cobertura oficial de Promo Grande",
          },
        ],
      },
      {
        offerId: "hfc-puro",
        name: "HFC Puro",
        category: "Internet HFC",
        images: [
          {
            src: "/ofertas/hfc-puro.png",
            label: "Oferta",
            alt: "Oferta oficial de HFC Puro",
          },
          {
            src: "/ofertas/hfc-puro-ciudades.png",
            label: "Cobertura",
            alt: "Cobertura oficial de HFC Puro",
          },
        ],
      },
      {
        offerId: "oferta-relampago",
        name: "Oferta Relámpago",
        category: "Promoción especial",
        images: [
          {
            src: "/ofertas/oferta-relampago.png",
            label: "Oferta",
            alt: "Oferta oficial de Oferta Relámpago",
          },
        ],
      },
      {
        offerId: "promo-1-sol",
        name: "Promo S/1",
        category: "Promoción especial",
        images: [
          {
            src: "/ofertas/promo-1-sol.png",
            label: "Oferta",
            alt: "Oferta oficial de Promo S/1",
          },
        ],
      },
    ],
  },
  {
    id: "linea-movil",
    title: "Línea móvil",
    items: [
      {
        offerId: "linea-movil",
        name: "Línea móvil MAX",
        category: "Línea móvil",
        images: [
          {
            src: "/ofertas/linea-movil-MAX.png",
            label: "MAX",
            alt: "Planes oficiales Línea móvil MAX",
          },
          {
            src: "/ofertas/linea-movil-MAXILIMITADO.png",
            label: "MAX Ilimitado",
            alt: "Planes oficiales Línea móvil MAX Ilimitado",
          },
        ],
      },
    ],
  },
  {
    id: "regulares",
    title: "Planes regulares y adicionales",
    items: [
      {
        offerId: "oferta-regular",
        name: "Oferta regular",
        category: "Oferta base",
        images: [
          {
            src: "/ofertas/Oferta-Regular.png",
            label: "Planes regulares",
            alt: "Planes oficiales de Oferta regular",
          },
          {
            // El archivo real contiene un espacio antes de la extensión.
            src: "/ofertas/canales-tecnologias%20.png",
            label: "Canales y tecnologías",
            alt: "Canales y tecnologías de Oferta regular",
          },
        ],
      },
    ],
  },
];
