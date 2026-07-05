import { PrismaClient } from "@prisma/client";
import { ofertas } from "../src/data/ofertas";

const prisma = new PrismaClient();

async function main() {
  for (const [index, oferta] of ofertas.entries()) {
    const imageUrl = oferta.media.principal ?? oferta.media.adicionales?.[0]?.src ?? null;

    await prisma.promotion.upsert({
      where: {
        slug: oferta.id,
      },
      create: {
        id: oferta.id,
        slug: oferta.id,
        title: oferta.nombre,
        category: oferta.categoria,
        description: oferta.resumen,
        price: oferta.precio,
        benefits: oferta.beneficios,
        conditions: oferta.restricciones,
        validity: oferta.vigencia,
        imageUrl,
        isActive: true,
        sortOrder: index,
        status: oferta.estado,
        detailPrice: oferta.detallePrecio,
        speed: oferta.velocidad,
        technologies: oferta.tecnologia,
        appliesTo: oferta.aplicaPara,
        restrictions: oferta.restricciones,
        validations: oferta.validaciones,
        salesPhrase: oferta.fraseVenta,
        cityImageUrl: oferta.media.ciudades ?? null,
        additionalMedia: oferta.media.adicionales ?? undefined,
        variants: oferta.variantes ?? undefined,
      },
      update: {
        title: oferta.nombre,
        category: oferta.categoria,
        description: oferta.resumen,
        price: oferta.precio,
        benefits: oferta.beneficios,
        conditions: oferta.restricciones,
        validity: oferta.vigencia,
        imageUrl,
        sortOrder: index,
        status: oferta.estado,
        detailPrice: oferta.detallePrecio,
        speed: oferta.velocidad,
        technologies: oferta.tecnologia,
        appliesTo: oferta.aplicaPara,
        restrictions: oferta.restricciones,
        validations: oferta.validaciones,
        salesPhrase: oferta.fraseVenta,
        cityImageUrl: oferta.media.ciudades ?? null,
        additionalMedia: oferta.media.adicionales ?? undefined,
        variants: oferta.variantes ?? undefined,
        updatedAt: new Date(),
      },
    });
  }
}

main()
  .catch((error) => {
    console.error("No se pudo sembrar promociones.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
