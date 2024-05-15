import { writeFile } from "node:fs/promises";

export const mapString = async (string, index) => {
  const words = string.split(" ");

  const map = new Map();

  words.forEach((word) => {
    const ocurrence = map.get(word);

    if (!ocurrence) {
      return map.set(word, 1);
    }

    map.set(word, ocurrence + 1);
  });

  await writeFile(
    `./raw-data/step-2/description-${index}.json`,
    JSON.stringify(Object.fromEntries(map.entries()), null, 2)
  );

  return map;
};
