import { Grid, Stack } from "@mui/material";
import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";

import { BackButton, Card, LoadingButton } from "components";
import DiscountFormV2 from "./form/DiscountFormV2";
import { useNotification } from "hooks";
import { DISCOUNTS, EDIT } from "routes";
import { ADMIN_DISCOUNTS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_DISCOUNTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { useCallback } from "react";
import { get, set } from "lodash";
import { formatISO } from "date-fns";
import { ADMIN_DISCOUNTS_END_POINT } from "__generated__/END_POINT";
import { useRouter } from "next/router";
import axios from "axios.config";
import DynamicMessage from "messages";

export default function CreateDiscountV2() {
  const router = useRouter();
  const { messages, formatMessage } = useIntl();

  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch } = useForm({
    defaultValues: { ...ADMIN_DISCOUNTS_POST_DEFAULT_VALUE },
    resolver: ADMIN_DISCOUNTS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data }: { data: any }) => {
    setLoading(true);
    try {
      const { data: resData } = await axios.post(ADMIN_DISCOUNTS_END_POINT, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "giảm giá",
        })
      );

      const discountId = get(resData, "id");

      if (discountId) {
        let pathname = `/${DISCOUNTS}/${EDIT}/${discountId}`;

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
  }, []);

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          title={messages["createDiscount"]}
          body={<DiscountFormV2 {...{ control, watch }} />}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton pathname={`/${DISCOUNTS}`} disabled={loading} />

          <LoadingButton
            {...{
              loading,
              disabled: loading,
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
}
