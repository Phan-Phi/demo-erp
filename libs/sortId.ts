import { get } from "lodash";

export const sortId = (data: any) => {
  const result = data.sort((a, b) => {
    const idA = get(a, "id");
    const idB = get(b, "id");

    return idA - idB;
  });

  return result;
};
