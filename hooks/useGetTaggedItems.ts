import useSWR from "swr";
import { get } from "lodash";
import { useEffect, useState } from "react";

import { transformUrl } from "libs";
import { TAGGED_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT } from "__generated__/END_POINT";

const useGetTaggedItems = (id: number, source_type: string) => {
  const [tags, setTags] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data, isValidating } = useSWR<TAGGED_ITEM_VIEW_TYPE_V1[]>(() => {
    if (!id) return;

    const params = {
      object_id: id,
      get_all: true,
      source_type: source_type,
    };

    return transformUrl(ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT, params);
  });

  useEffect(() => {
    if (data == undefined && isValidating) setIsLoading(true);
    if (data == undefined) return;

    if (data.length > 0) {
      const result = data.map((item) => {
        return get(item, "tag.name");
      });

      setTags(result.join(", "));
    } else {
      setTags("");
    }

    setIsLoading(false);
  }, [data, isValidating]);

  return {
    data: data,
    value: tags,
    loading: isLoading,
  };
};

export default useGetTaggedItems;
