import { useIntl } from "react-intl";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";
import { useForm, FieldNamesMarkedBoolean } from "react-hook-form";

import { Stack } from "@mui/material";
import { differenceWith, get, isEmpty } from "lodash";

import FormTags from "./FormTags";
import { Dialog, BackButton, LoadingButton } from "components";

import { useNotification } from "hooks";
import { TagsSchema, TagsSchemaProps } from "yups";
import { checkResArr, createRequest, deleteRequest } from "libs";
import { ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT } from "__generated__/END_POINT";

type EditTagsProps = {
  open: boolean;
  objectId: number;
  source_type: string;
  onClose: () => void;
  refreshData: () => void;
  defaultValues: TagsSchemaProps;
};

export default function EditTags(props: EditTagsProps) {
  const { objectId, defaultValues, onClose, open, refreshData, source_type } = props;

  const { messages } = useIntl();
  const isMounted = useMountedState();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control: tagsControl,
    handleSubmit: tagsHandleSubmit,
    formState: { dirtyFields },
  } = useForm({
    resolver: TagsSchema(),
    defaultValues: defaultValues,
  });

  const onSubmit = useCallback(
    async ({
      data,
      originalTags,
      dirtyFields,
    }: {
      data: TagsSchemaProps;
      originalTags: TagsSchemaProps;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          let resList: any[] = [];

          const tagsData = get(data, "tags");
          const originalTagsData = get(originalTags, "tags");
          const newTagsList = differenceWith(
            tagsData,
            originalTagsData,
            (item1, item2) => {
              return item1.id === item2.id;
            }
          );

          const deleteTagsList = differenceWith(
            originalTagsData,
            tagsData,
            (item1, item2) => {
              return item1.id === item2.id;
            }
          );

          if (!isEmpty(newTagsList)) {
            const transformedNewTagsList = newTagsList.map((item) => {
              return {
                content_type: source_type,
                object_id: objectId,
                tag: get(item, "id"),
              };
            });

            const results = await createRequest(
              ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT,
              transformedNewTagsList
            );

            resList = [...resList, ...results];
          }

          if (!isEmpty(deleteTagsList)) {
            const transformedDeleteTagsList = deleteTagsList.map((item) => {
              return item.connectId;
            });

            const results = await deleteRequest(
              ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT,
              transformedDeleteTagsList
            );

            resList = [...resList, ...results];
          }

          const result = checkResArr(resList);

          if (result) {
            enqueueSnackbarWithSuccess("Cập nhật tags thành công");
            refreshData();
          }
        }

        onClose();
      } catch (error) {
        enqueueSnackbarWithError(error);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [objectId, source_type]
  );

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "40vw",
              maxWidth: "40vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["tags.editTags"],
        },
        dialogContentTextComponent: () => {
          return <FormTags control={tagsControl} />;
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  onClose();
                }}
              />

              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={tagsHandleSubmit((data) => {
                  onSubmit({ data, originalTags: defaultValues, dirtyFields });
                })}
              >
                {loading["complete"] ? messages["creatingStatus"] : messages["save"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
}
