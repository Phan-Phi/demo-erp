import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";

import { Stack } from "@mui/material";
import { get, isEmpty, set } from "lodash";

import FormTags from "./FormTags";
import { Dialog, BackButton, LoadingButton } from "components";

import { useNotification } from "hooks";
import { checkResArr, createRequest } from "libs";
import { TagsSchema, TagsSchemaProps, defaultTagsFormState } from "yups";
import { ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT } from "__generated__/END_POINT";

type CreateTagsProps = {
  open: boolean;
  objectId: number;
  onClose: () => void;
  refreshData: () => void;
  source_type: string;
};

export default function CreateTags(props: CreateTagsProps) {
  const { open, onClose, objectId, refreshData, source_type } = props;

  const { messages } = useIntl();
  const isMounted = useMountedState();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control: tagsControl,
    handleSubmit: tagsHandleSubmit,
    reset,
  } = useForm({
    resolver: TagsSchema(),
    defaultValues: defaultTagsFormState(),
  });

  const handleClose = useCallback(() => {
    reset({
      tags: [],
    });
    onClose();
  }, []);

  const onSubmit = useCallback(
    async ({ data }: { data: TagsSchemaProps }) => {
      try {
        setLoading(true);
        const tagsData = get(data, "tags");

        let resList: any[] = [];

        if (!isEmpty(tagsData)) {
          const transformedTags = tagsData.map((item) => {
            let body = {};
            set(body, "content_type", source_type);
            set(body, "object_id", objectId);
            set(body, "tag", get(item, "id"));

            return body;
          });

          const results = await createRequest(
            ADMIN_TAG_GROUPS_TAGS_TAGGED_ITEMS_END_POINT,
            transformedTags
          );

          resList = [...resList, ...results];

          const result = checkResArr(resList);

          if (result) {
            enqueueSnackbarWithSuccess("Thêm tags thành công");
            refreshData();
          }
        }

        handleClose();
      } catch (err) {
        enqueueSnackbarWithError(err);
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
        onClose: handleClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "40vw",
              maxWidth: "40vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["tags.addTags"],
        },
        dialogContentTextComponent: () => {
          return <FormTags control={tagsControl} />;
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  handleClose();
                }}
              />

              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={tagsHandleSubmit((data) => {
                  onSubmit({ data });
                })}
              >
                {loading["complete"] ? messages["creatingStatus"] : messages["addStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
}
