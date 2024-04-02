import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { get } from "lodash";
import { string, object } from "yup";
import { Grid, Stack } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";

import OutnoteForm from "./components/OutnoteForm";
import { Card, LoadingButton, BackButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { OUTNOTES, EDIT } from "routes";
import { usePermission, useNotification } from "hooks";

import {
  ADMIN_WAREHOUSES_OUT_NOTES_POST_SHAPE,
  ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_WAREHOUSES_OUT_NOTES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_OUT_NOTES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

const CreateOutnote = () => {
  usePermission("write_stock_out_note");

  const ADMIN_WAREHOUSES_OUT_NOTES_EXTENDS = Object.assign(
    ADMIN_WAREHOUSES_OUT_NOTES_POST_SHAPE,
    {
      reason: string().trim().required(),
    }
  );

  const ADMIN_WAREHOUSES_OUT_NOTES_POST_SCHEMA = object({}).shape(
    ADMIN_WAREHOUSES_OUT_NOTES_EXTENDS
  );

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      ...ADMIN_WAREHOUSES_OUT_NOTES_POST_DEFAULT_VALUE,
      direction: "",
      reason: "",
      amount: "0",
      amount_incl_tax: "0",
      shipping_excl_tax: "0",
      shipping_incl_tax: "0",
    },
    // resolver: ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_RESOLVER,
    resolver: yupResolver(ADMIN_WAREHOUSES_OUT_NOTES_POST_SCHEMA),
  });

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const router = useRouter();

  const { formatMessage, messages } = useIntl();

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        const { data: resData } = await axios.post(
          ADMIN_WAREHOUSES_OUT_NOTES_END_POINT,
          data
        );

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "phiếu điều chỉnh tồn kho",
          })
        );

        const outnoteId = get(resData, "id");

        const pathname = `/${OUTNOTES}/${EDIT}/${outnoteId}`;

        router.replace(pathname, pathname, {
          shallow: true,
        });
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={9}>
        <Card
          title="Tạo phiếu điều chỉnh tồn kho"
          body={
            <OutnoteForm
              {...{
                setValue,
                control,
                defaultValues: ADMIN_WAREHOUSES_OUT_NOTES_POST_DEFAULT_VALUE,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={9}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${OUTNOTES}`} />

          <LoadingButton
            {...{
              loading,
              onClick: handleSubmit((data) => {
                onSubmit({ data });
              }),
            }}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreateOutnote;
