import {
  loadPackageDefinition,
  Server,
  ServerCredentials,
} from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

import { increment } from "./db.js";

const map = (call, callback) => {
  const { description } = call.request;

  const words = description.split(" ");
  const map = new Map();
  words.forEach((word) => {
    const ocurrence = map.get(word);
    if (!ocurrence) {
      return map.set(word, 1);
    }
    map.set(word, ocurrence + 1);
  });
  const results = Array.from(map, ([key, value]) => ({ key, value }));

  callback(null, { results });
};

const reduce = (call, callback) => {
  const { results } = call.request;

  results.forEach((result) => {
    increment(result.key, result.value);
  });

  callback(null, { results });
};

// Iniciando el worker
const PORT = process.argv[2];

const packageDefinition = loadSync("./mapReduce.proto", {});
const mapReducePackage =
  loadPackageDefinition(packageDefinition).mapReducePackage;

const server = new Server();
server.addService(mapReducePackage.MapReduce.service, {
  map,
  reduce,
});
server.bindAsync(`0.0.0.0:${PORT}`, ServerCredentials.createInsecure(), () => {
  console.log(`Worker funcionando en el puerto ${PORT}`);
});
