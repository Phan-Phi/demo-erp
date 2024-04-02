import { TAG_TYPE_V1 } from "__generated__/apiType_v1";

const convertTagsNameToString = (data: TAG_TYPE_V1[]) => {
  const result = data
    .map((item) => {
      return item.name;
    })
    .join(", ");

  return result;
};

export default convertTagsNameToString;
