import { get } from "lodash";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Grid, Stack } from "@mui/material";
import { useMountedState } from "react-use";

import { DISCOUNTS } from "routes";
import { useNotification } from "hooks";
import { BackButton, Card, LoadingButton } from "components";
import { ADMIN_DISCOUNTS_VOUCHERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_DISCOUNTS_VOUCHERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

import axios from "axios.config";
import DynamicMessage from "messages";
import DiscountVoucherForm from "../form/DiscountVoucherForm";
import { SPECIALS } from "constant";

export default function CreateDiscountVoucher() {
  const router = useRouter();
  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, watch, setValue } = useForm({
    defaultValues: { ...ADMIN_DISCOUNTS_VOUCHERS_POST_DEFAULT_VALUE },
    resolver: ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data }: { data: any }) => {
    setLoading(true);

    try {
      if (SPECIALS.test(data.code)) {
        return;
      }

      const { data: resData } = await axios.post(
        ADMIN_DISCOUNTS_VOUCHERS_END_POINT,
        data
      );

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "mã giảm giá",
        })
      );

      const discountId = get(resData, "id");

      if (discountId) {
        let pathname = `/${DISCOUNTS}`;

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
          title="Tạo mã khuyến mãi"
          body={
            <DiscountVoucherForm
              {...{ control, watch, setValue, max_discount_amount: null }}
            />
          }
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
