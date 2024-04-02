import { StringSchema } from "yup";
import { TransformFunction } from "yup/lib/types";

export const transformDecimal = (value: any): TransformFunction<StringSchema> => {
  return value === "" ? "0" : value.toString();
};
