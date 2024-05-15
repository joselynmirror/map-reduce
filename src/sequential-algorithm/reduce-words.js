import { writeFile } from "node:fs/promises";

export const reduceWords = async (words) => {
  const wordsCounted = new Map();

  for (const [word, values] of words) {
    wordsCounted.set(
      word,
      values.reduce((accumulator, value) => {
        return accumulator + value;
      }, 0)
    );
  }

  await writeFile(
    `./raw-data/step-4/words.json`,
    JSON.stringify(Object.fromEntries(wordsCounted.entries()), null, 2)
  );
};
