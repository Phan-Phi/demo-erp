import useSWR from "swr";
import get from "lodash/get";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { isEmpty, pick, unset } from "lodash";
import { useCallback, useEffect, useState } from "react";

import { transformUrl } from "libs";
import { PRODUCT_PRICE_LIST } from "routes";
import { useNotification, usePermission } from "hooks";
import { PRICE_TABLE_TYPE_V1 } from "__generated__/apiType_v1";
import { BackButton, Card, Loading, LoadingButton } from "components";
import { ADMIN_PRICE_TABLES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRICE_TABLES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_PRICE_TABLES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

import axios from "axios.config";
import DynamicMessage from "messages";
import ContainerUserByUser from "./components/ContainerUserByUser";
import ProductPriceCreateForm from "./components/ProductPriceCreateForm";
import ContainerProductPriceVariant from "./components/ContainerProductPriceVariant";

const EditProductPrice = () => {
  const router = useRouter();
  const isMounted = useMountedState();

  const [defaultProductPriceValues, setDefaultProductPriceValues] = useState<any>();

  const { data: ProductPriceData, mutate: userMutate } = useSWR<PRICE_TABLE_TYPE_V1>(
    () => {
      const id = get(router, "query.id");

      if (id) {
        const params = {
          use_cache: false,
        };

        return transformUrl(`${ADMIN_PRICE_TABLES_END_POINT}${id}`, params);
      }
    }
  );

  useEffect(() => {
    if (ProductPriceData == undefined) return;

    const data = pick(ProductPriceData, [
      ...Object.keys(ADMIN_PRICE_TABLES_POST_DEFAULT_VALUE),
      "id",
    ]) as any;

    setDefaultProductPriceValues(data);
  }, [ProductPriceData]);

  const onSuccessHandler = useCallback(async () => {
    setDefaultProductPriceValues(undefined);

    const data = await userMutate();

    if (isMounted() && data) {
      await setDefaultProductPriceValues(data);
    }
  }, []);

  if (defaultProductPriceValues == undefined) {
    return <Loading />;
  }

  return (
    <RootComponent
      {...{
        defaultProductPriceValues,
        onSuccessHandler,
      }}
    />
  );
};

interface RootComponentProps {
  defaultProductPriceValues: any;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({
  defaultProductPriceValues,
  onSuccessHandler,
}: RootComponentProps) => {
  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_price_table");

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: defaultProductPriceValues,
    resolver: ADMIN_PRICE_TABLES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data, dirtyFields }) => {
    try {
      setLoading(true);

      if (!isEmpty(dirtyFields)) {
        const discountId = get(data, "id");

        unset(data, "id");

        const body = {};

        for (const key of Object.keys(data)) {
          if (data[key] != undefined) {
            body[key] = data[key];
          }
        }

        await axios.patch(`${ADMIN_PRICE_TABLES_END_POINT}${discountId}/`, body);

        await onSuccessHandler();

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "thông tin bảng giá",
          })
        );
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
      <Grid item xs={12}>
        <Card
          title={"Thông tin bảng giá"}
          body={
            <ProductPriceCreateForm
              {...{
                control,
              }}
            />
          }
        />
      </Grid>

      <Grid item xs={12}>
        <ContainerUserByUser />
      </Grid>

      <Grid item xs={12}>
        <ContainerProductPriceVariant />
      </Grid>

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${PRODUCT_PRICE_LIST}`} disabled={loading} />

          {writePermission && (
            <LoadingButton
              loading={loading}
              onClick={handleSubmit((data) => {
                onSubmit({ data, dirtyFields });
              })}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};
export default EditProductPrice;
