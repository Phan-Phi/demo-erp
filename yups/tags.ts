import { array, object } from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TAGGED_ITEM_VIEW_TYPE_V1, TAG_TYPE_V1 } from "__generated__/apiType_v1";

interface EXTEND_TAG_TYPE extends TAGGED_ITEM_VIEW_TYPE_V1 {
  connectId?: number;
}

export interface TagsSchemaProps {
  tags: EXTEND_TAG_TYPE[];
}

export const TagsSchema = () => {
  return yupResolver(
    object().shape({
      tags: array(object()),
    })
  );
};

export const defaultTagsFormState = (): TagsSchemaProps => {
  return {
    tags: [],
  };
};
