import { writeFile } from "node:fs/promises";

export const shuffleMaps = async (maps) => {
  const words = new Map();

  for (const map of maps) {
    for (const [word, ocurrence] of map) {
      const ocurrences = words.get(word);

      words.set(word, ocurrences ? [...ocurrences, ocurrence] : [ocurrence]);
    }
  }

  let wordCount = 0;
  for (const [word] of words) {
    const entry = {
      key: word,
      value: words.get(word),
    };

    await writeFile(
      `./raw-data/step-3/word-${wordCount}.json`,
      JSON.stringify(entry, null, 2)
    );
    wordCount += 1;
  }

  return words;
};
