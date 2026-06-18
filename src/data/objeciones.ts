export type Objecion = {
  objecion: string;
  respuesta: string;
  validacion: string;
};

export const objeciones: Objecion[] = [
  {
    objecion: "Está caro.",
    respuesta:
      "Entiendo. Primero revisemos si aplica alguna promoción con precio inicial menor y luego le indico el precio regular para que compare con información completa.",
    validacion: "Validar zona, cobertura y precio posterior.",
  },
  {
    objecion: "Quiero más velocidad.",
    respuesta:
      "Podemos revisar opciones de mayor velocidad, pero debo confirmar qué variante está disponible en su dirección antes de ofrecérsela.",
    validacion: "Validar cobertura y tecnología disponible.",
  },
  {
    objecion: "Solo quiero fibra.",
    respuesta:
      "Lo correcto es validar cobertura de fibra para su dirección. Si aplica, le presento la opción que corresponda según el material oficial.",
    validacion: "Confirmar FTTH o material que indique fibra.",
  },
  {
    objecion: "Vi una promoción a menor precio.",
    respuesta:
      "La revisamos, pero necesito confirmar si esa promoción aplica a su ciudad, zona y condiciones antes de tomarla como disponible.",
    validacion: "Validar imagen oficial, zona aplicable y vigencia.",
  },
  {
    objecion: "No quiero sorpresas después.",
    respuesta:
      "Le indicaré precio promocional, duración y precio regular o posterior cuando el material lo muestre, antes de avanzar.",
    validacion: "Confirmar precio inicial, meses y precio posterior.",
  },
  {
    objecion: "Quiero línea móvil ilimitada.",
    respuesta:
      "Revisamos la tabla de Planes Max Ilimitados y confirmamos el plan exacto según lo que necesite en datos, minutos y cobertura internacional.",
    validacion: "Confirmar línea nueva o porta y plan exacto.",
  },
];
