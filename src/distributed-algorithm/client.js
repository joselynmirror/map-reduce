import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { getData } from "./get-data.js";

const packageDefinition = loadSync("./mapReduce.proto", {});
const mapReducePackage =
  loadPackageDefinition(packageDefinition).mapReducePackage;

const workers = [
  new mapReducePackage.MapReduce(
    "localhost:30001",
    credentials.createInsecure()
  ),
  new mapReducePackage.MapReduce(
    "localhost:30002",
    credentials.createInsecure()
  ),
];

const chunkArray = (array, numChunks) => {
  const chunks = [];
  const chunkSize = Math.ceil(array.length / numChunks);
  for (let i = 0; i < numChunks; i++) {
    chunks.push(array.slice(i * chunkSize, (i + 1) * chunkSize));
  }
  return chunks;
};

const main = async () => {
  // Obtenemos la data desde el servicio de Redalyc ([description, description, description...])
  const data = await getData();

  // Medimos el tiempo inicial de la ejecución del algoritmo
  const start = performance.now();
  let end = null;

  chunkArray(data, workers.length).forEach((descriptions, i) => {
    descriptions.forEach((description) => {
      workers[i].map({ description }, (err, response) => {
        const { results } = response;

        workers[i].reduce({ results }, (err, response) => {
          // Medimos el tiempo final de la ejecución del algoritmo
          end = performance.now();

          // Imprimimos el tiempo de ejecución del algoritmo
          console.log(
            `${end - start} milisegundos se tardó el algoritmo distribuido`
          );
        });
      });
    });
  });
};
main();
