import { getData } from "./get-data.js";
import { mapString } from "./map-string.js";
import { reduceWords } from "./reduce-words.js";
import { shuffleMaps } from "./shuffle-maps.js";

const main = async () => {
  // Obtenemos la data desde el servicio de Redalyc ([description, description, description...])
  const data = await getData();

  // Medimos el tiempo inicial de la ejecución del algoritmo
  const start = performance.now();

  // Transformamos las descripciones de texto ("...") a formato clave-valor ({ key: value })
  const maps = await Promise.all(
    data.map(async (description, index) => {
      const map = await mapString(description, index);
      return map;
    })
  );

  // Barajamos los mapas para dividir las palabras
  const words = await shuffleMaps(maps);

  // Reducimos las palabras para contar el numero de ocurrencias
  await reduceWords(words);

  // Medimos el tiempo final de la ejecución del algoritmo
  const end = performance.now();

  // Imprimimos el tiempo de ejecución del algoritmo
  console.log(`${end - start} milisegundos se tardó el algoritmo secuencial`);
};
main();
