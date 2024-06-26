import chunk from "lodash/chunk";

import axios from "../axios.config";

export default async (url, data) => {
  let resList = [];
  let chunkData = chunk(data, 5);

  for await (let list of chunkData) {
    const temp = await Promise.all(
      list.map(async (el) => {
        return await axios.get(url, el);
      })
    );

    resList = [...resList, ...temp];
  }

  return resList;
};
