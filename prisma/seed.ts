async function main() {
  console.log("Seed sin cambios: promociones se leen desde src/data/ofertas.ts.");
}

main()
  .catch((error) => {
    console.error("No se pudo ejecutar el seed.", error);
    process.exitCode = 1;
  });
