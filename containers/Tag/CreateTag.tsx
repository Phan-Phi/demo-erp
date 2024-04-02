import { get } from "lodash";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useCallback, useState } from "react";

import axios from "axios.config";
import DynamicMessage from "messages";
import TagCreateForm from "./components/TagCreateForm";

import { TAG } from "routes";
import { Grid, Stack } from "@mui/material";
import { useNotification, usePermission } from "hooks";
import { BackButton, Card, LoadingButton } from "components";
import { ADMIN_TAG_GROUPS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_TAG_GROUPS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_TAG_GROUPS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

export default function CreateTag() {
  const router = useRouter();
  const [state, setState] = useState<any>([]);
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_tag_group");
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: { ...ADMIN_TAG_GROUPS_POST_DEFAULT_VALUE },
    resolver: ADMIN_TAG_GROUPS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: any }) => {
      setLoading(true);
      try {
        const value = { ...data, tags: state };
        const { data: resData } = await axios.post(ADMIN_TAG_GROUPS_END_POINT, value);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "tag",
          })
        );

        const discountId = get(resData, "id");

        if (discountId) {
          let pathname = `/${TAG}`;

          router.push(pathname, pathname, {
            shallow: true,
          });
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [state]
  );

  const handle = useCallback((value) => {
    setState(value);
  }, []);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          title="Tạo Tag"
          body={
            <TagCreateForm
              {...{
                control,
                getValues,
                setValue,
                watch,
                handle,
                state: state,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
          <BackButton pathname={`/${TAG}`} disabled={loading} />

          {writePermission && (
            <LoadingButton
              {...{
                loading,
                disabled: loading,
                onClick: handleSubmit(
                  (data) => {
                    onSubmit({ data });
                  },
                  (err) => {}
                ),
              }}
            >
              {loading ? messages["creatingStatus"] : messages["createStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
}
