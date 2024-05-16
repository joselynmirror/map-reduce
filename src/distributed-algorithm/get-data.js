import { writeFile } from "node:fs/promises";

const query = "language(es),sizePage(10)";
const input = `http://api.redalyc.org/search/${query}/output(json)/download(no)/token(VEJtYkpMMXNmQnpZYXpmeXREVzVUUT09)`;

export const getData = async () => {
  const response = await fetch(input);
  const result = await response.json();

  const data = result.searchRetrieveResponse.records
    .filter((record) => {
      return record.recordData.dc_description;
    })
    .map((record) => {
      return record.recordData.dc_description;
    });

  await writeFile("./raw-data/step-1/data.json", JSON.stringify(data, null, 2));

  return data;
};
