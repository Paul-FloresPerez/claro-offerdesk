export type ValidacionGrupo = {
  titulo: string;
  severidad: "critica" | "alerta" | "operativa";
  reglas: string[];
};

export const validaciones: ValidacionGrupo[] = [
  {
    titulo: "Reglas comerciales obligatorias",
    severidad: "critica",
    reglas: [
      "No ofrecer una promoción si falta precio, velocidad, cobertura o condición obligatoria.",
      "No inventar vigencias. Si no está en el material o sistema, indicar Validar vigencia.",
      "No modificar ni reinterpretar el contenido de las imágenes oficiales.",
      "Informar precio posterior cuando la imagen lo muestre.",
    ],
  },
  {
    titulo: "Cobertura y zona",
    severidad: "critica",
    reglas: [
      "Validar dirección exacta antes de cerrar.",
      "Usar la imagen de ciudades o zonas cuando exista.",
      "Oferta Relámpago no tiene imagen separada de ciudades en este proyecto.",
      "Promo 1 Sol incluye ciudades dentro de la misma imagen oficial.",
    ],
  },
  {
    titulo: "Tecnología",
    severidad: "alerta",
    reglas: [
      "Confirmar tecnología disponible antes de ofrecer HFC, HFC Plus, FTTH o móvil.",
      "HFC Puro debe tratarse como categoría específica.",
      "Si la tecnología no está confirmada en datos locales, mantener Validar tecnología.",
    ],
  },
  {
    titulo: "Antes de vender",
    severidad: "operativa",
    reglas: [
      "Confirmar documento o datos del titular según flujo comercial.",
      "Confirmar necesidad principal del cliente.",
      "Repetir al cliente nombre de la oferta, precio, velocidad y restricciones.",
      "Registrar dudas o casos no cubiertos para supervisor.",
    ],
  },
];
