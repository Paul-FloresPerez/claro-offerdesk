export type GuionBloque = {
  etapa: string;
  objetivo: string;
  texto: string;
  puntosClave: string[];
};

export const guiones: GuionBloque[] = [
  {
    etapa: "Apertura",
    objetivo: "Ubicar la necesidad sin adelantar una promoción.",
    texto:
      "Buenos días/tardes, le saluda un asesor de Claro. Para ayudarle correctamente, primero validaré qué servicio necesita y en qué zona se encuentra.",
    puntosClave: [
      "Confirmar nombre del cliente.",
      "Confirmar servicio consultado: hogar, HFC o móvil.",
      "Evitar mencionar precios antes de validar cobertura.",
    ],
  },
  {
    etapa: "Diagnóstico",
    objetivo: "Entender uso, presupuesto y cobertura.",
    texto:
      "¿El servicio lo usaría para trabajo, estudios, streaming, videojuegos o uso familiar? También necesito validar su dirección para confirmar cobertura.",
    puntosClave: [
      "Cantidad de usuarios y dispositivos.",
      "Uso principal del servicio.",
      "Dirección o zona para validación.",
    ],
  },
  {
    etapa: "Presentación de oferta",
    objetivo: "Ofrecer solo después de validar condiciones.",
    texto:
      "Con la validación realizada, la opción que puedo presentarle es esta. Le indico precio promocional, precio regular, velocidad y condiciones para que tenga la información completa.",
    puntosClave: [
      "Mencionar nombre exacto de la promoción.",
      "Mencionar precio promocional y precio posterior si existe.",
      "No prometer beneficios no visibles en el material oficial.",
    ],
  },
  {
    etapa: "Validación",
    objetivo: "Evitar errores antes del cierre.",
    texto:
      "Antes de avanzar, confirmo nuevamente cobertura, tecnología, datos del titular y condiciones de la promoción.",
    puntosClave: [
      "DNI o datos requeridos por el flujo comercial.",
      "Dirección y cobertura.",
      "Vigencia y restricciones por confirmar.",
    ],
  },
  {
    etapa: "Cierre",
    objetivo: "Cerrar con datos claros y sin presión indebida.",
    texto:
      "Si está conforme con las condiciones confirmadas, avanzamos con el registro. Le resumo nuevamente lo contratado para evitar cualquier diferencia.",
    puntosClave: [
      "Resumen de plan, precio y condiciones.",
      "Confirmación verbal del cliente.",
      "Registrar observaciones necesarias.",
    ],
  },
];
