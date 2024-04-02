import { get } from "lodash";

type ITEM_TYPE = {
  name: string;
  value: string;
};

export const getDisplayValueFromObject = (
  data: ITEM_TYPE[],
  value: string
): string | undefined => {
  const findValue = data.filter((item) => {
    return item.value === value;
  });

  if (findValue) {
    const displayValue = get(findValue, "[0].name");

    return displayValue;
  } else {
    return undefined;
  }
};
