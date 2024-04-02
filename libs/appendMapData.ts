import { get } from "lodash";

export const appendMapData = (apiData: any) => {
  if (apiData == undefined) return [];

  const limitData = 100;

  const localData = Array(limitData).fill(undefined);

  for (let iData in apiData) {
    const id = get(apiData[iData], "id");

    const index = id % limitData;
    const oState = localData[index];

    if (oState == undefined || oState.id !== id) {
      localData[index] = apiData[iData];
    }
  }

  const filterData = localData.filter((item) => item !== undefined);

  return filterData;
};
