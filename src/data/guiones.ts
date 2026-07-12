export type GuionBloque = {
  etapa: string;
  objetivo: string;
  texto: string;
  puntosClave: string[];
};

export const guiones: GuionBloque[] = [
  {
    etapa: "Apertura",
    objetivo: "Abrir la llamada saliente y detectar interés en internet hogar.",
    texto:
      "Hola, buenos días/tardes, ¿me comunico con el titular de la línea? Mi nombre es [NOMBRE] y le llamo de parte de Claro Hogar. Actualmente contamos con opciones de internet hogar disponibles para su zona, con beneficios y promociones vigentes. Para orientarle brevemente, ¿hoy cuenta con internet en casa o está evaluando mejorar su conexión?",
    puntosClave: [
      "Confirmar que conversa con el titular.",
      "Presentarse como asesor de Claro Hogar.",
      "Detectar si ya tiene internet o busca mejorar su conexión.",
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
