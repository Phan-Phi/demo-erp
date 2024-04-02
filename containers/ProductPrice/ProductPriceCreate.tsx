import { get } from "lodash";
import { useCallback } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Grid, Stack } from "@mui/material";
import { useMountedState } from "react-use";

import { EDIT, PRODUCT_PRICE_LIST } from "routes";
import { useNotification, usePermission } from "hooks";
import { BackButton, Card, LoadingButton } from "components";
import { ADMIN_PRICE_TABLES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRICE_TABLES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_PRICE_TABLES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

import axios from "axios.config";
import DynamicMessage from "messages";
import ProductPriceCreateForm from "./components/ProductPriceCreateForm";

export default function ProductPriceCreate() {
  const { hasPermission: writePermission } = usePermission("write_price_table");
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();
  const router = useRouter();

  const { formatMessage, messages } = useIntl();

  const { control, handleSubmit, watch, setValue, getValues } = useForm({
    defaultValues: { ...ADMIN_PRICE_TABLES_POST_DEFAULT_VALUE },
    resolver: ADMIN_PRICE_TABLES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data }: { data: any }) => {
    setLoading(true);

    try {
      const { data: resData } = await axios.post(ADMIN_PRICE_TABLES_END_POINT, data);

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "bảng giá sản phẩm",
        })
      );

      const discountId = get(resData, "id");

      if (discountId) {
        let pathname = `/${PRODUCT_PRICE_LIST}/${EDIT}/${discountId}`;

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
          title="Tạo Bảng Giá"
          body={
            <ProductPriceCreateForm
              {...{
                control,
                getValues,
                setValue,
                watch,
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
          <BackButton pathname={`/${PRODUCT_PRICE_LIST}`} disabled={loading} />

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
