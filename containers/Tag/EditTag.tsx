import useSWR from "swr";
import unset from "lodash/unset";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useEffect, useState, useCallback } from "react";

import { TAG } from "routes";
import { transformUrl } from "libs";
import { Grid, Stack } from "@mui/material";
import { usePermission, useNotification } from "hooks";
import { ADMIN_TAG_GROUPS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_TAG_GROUPS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { Card, BackButton, LoadingButton, LoadingDynamic as Loading } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import TagCreateForm from "./components/TagCreateForm";

const EditTag = () => {
  const [defaultValues, setDefaultValues] = useState<any>();

  const router = useRouter();

  const { data: editTagData, mutate: editTagDataMutate } = useSWR(() => {
    const id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };

    return transformUrl(`${ADMIN_TAG_GROUPS_END_POINT}${id}`, params);
  });

  const onSuccessHandler = useCallback(async () => {
    await editTagDataMutate();
    router.replace(`/${TAG}`);
  }, []);

  useEffect(() => {
    if (editTagData == undefined) return;

    setDefaultValues(editTagData);
  }, [editTagData]);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent defaultValues={defaultValues} onSuccessHandler={onSuccessHandler} />
  );
};

type RootComponentProps = {
  defaultValues: any;
  onSuccessHandler: () => Promise<void>;
};

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { query } = useRouter();
  const [state, setState] = useState<any>([]);
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const { formatMessage, messages } = useIntl();

  const isMounted = useMountedState();

  const { hasPermission: writePermission } = usePermission("write_shipping_method");

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_TAG_GROUPS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data, dirtyFields }: { data: any; dirtyFields: object }) => {
      try {
        setLoading(true);

        unset(data, "id");
        const value = { ...data, tags: state };

        await axios.put(`${ADMIN_TAG_GROUPS_END_POINT}${query.id}/`, value);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "tag",
          })
        );

        onSuccessHandler();
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
      <Grid item xs={9}>
        <Card
          title="Cập nhật Tag"
          body={
            <TagCreateForm
              {...{
                control,
                state: defaultValues.tags,
                handle,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${TAG}`} />
          {writePermission && (
            <LoadingButton
              {...{
                loading: loading,
                onClick: handleSubmit((data) => {
                  onSubmit({ data, dirtyFields });
                }),
              }}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditTag;
