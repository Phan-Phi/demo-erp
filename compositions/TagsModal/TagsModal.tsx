import useSWR from "swr";
import React, { useEffect, useState } from "react";

import EditTags from "./EditTags";
import CreateTags from "./CreateTags";
import { LoadingDynamic } from "components";

import { transformUrl } from "libs";
import { TagsSchemaProps } from "yups";
import { TAGGED_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT } from "__generated__/END_POINT";

type TagsModalProps = {
  open: boolean;
  objectId: number;
  onClose: () => void;
  refreshData: () => void;
  source_type: string;
};

export default function TagsModal(props: TagsModalProps) {
  const { open, onClose, objectId, refreshData, source_type } = props;

  const [defaultValues, setDefaultValues] = useState<TagsSchemaProps>();

  const { data } = useSWR<TAGGED_ITEM_VIEW_TYPE_V1[]>(() => {
    if (!objectId) return;

    const params = {
      source_type: source_type,
      object_id: objectId,
      get_all: true,
    };

    return transformUrl(ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT, params);
  });

  useEffect(() => {
    if (data == undefined) return;

    const result = data.map((item) => {
      return {
        ...item.tag,
        connectId: item.id,
      };
    });

    setDefaultValues({
      tags: result,
    });
  }, [data, open]);

  useEffect(() => {
    !open && setDefaultValues(undefined);
  }, [open]);

  if (defaultValues == undefined && !open) return null;

  if (defaultValues == undefined) return <LoadingDynamic />;

  if (defaultValues.tags.length > 0) {
    return (
      <EditTags
        {...{ objectId, defaultValues, onClose, open, refreshData, source_type }}
      />
    );
  }

  return <CreateTags {...{ objectId, onClose, open, refreshData, source_type }} />;
}
