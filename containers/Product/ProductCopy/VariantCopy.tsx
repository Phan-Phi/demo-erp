import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import React, { useCallback, useEffect, useState } from "react";
import { FieldNamesMarkedBoolean, useForm } from "react-hook-form";

import useSWR from "swr";
import { get, isEmpty, pick, set } from "lodash";
import { Box, Grid, Stack } from "@mui/material";

import Checkbox from "../components/Checkbox";
import GeneralInfo from "../components/GeneralInfoForVariant";
import { BackButton, LoadingDynamic as Loading, LoadingButton } from "components";

import axios from "axios.config";
import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { checkResArr, transformUrl } from "libs";
import { useNotification, usePermission } from "hooks";

import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

import {
  ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

const VariantList = dynamic(() => import("../components/VariantList"), {
  loading: () => {
    return <Loading />;
  },
});

const Stock = dynamic(() => import("../components/Stock"), {
  loading: () => {
    return <Loading />;
  },
});

const ExtendUnit = dynamic(() => import("../components/ExtendUnit"), {
  loading: () => {
    return <Loading />;
  },
});

const VariantCopy = () => {
  const router = useRouter();
  const [defaultValues, setDefaultValues] =
    useState<ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE>();

  const { data: rootVariantData } = useSWR<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(
    () => {
      const variantId = router.query.id;

      if (variantId) {
        return transformUrl(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`, {
          use_cache: false,
        });
      }
    }
  );

  const { data: variantData, mutate: variantMutate } =
    useSWR<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(() => {
      const variantId = router.query.productId;

      if (variantId) {
        return transformUrl(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`, {
          use_cache: false,
        });
      }
    });

  useEffect(() => {
    if (variantData == undefined || rootVariantData == undefined) {
      return;
    }

    const keyList = [
      "id",
      "name",
      "unit",
      "bar_code",
      "is_default",
      "editable_sku",
      "list_id_values",
      "track_inventory",
    ];

    const data: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE =
      {} as ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;

    for (const key of keyList) {
      data[key] = rootVariantData[key];
    }

    const priceInclTax: string = get(rootVariantData, "price.incl_tax");
    const price: string = get(rootVariantData, "price.excl_tax");

    const weightValue: number = get(rootVariantData, "weight.weight");

    set(data, "price_incl_tax", parseFloat(priceInclTax).toString());
    set(data, "price", parseFloat(price).toString());
    // set(data, "priceForDisplay", parseFloat(priceForDisplay).toString());
    set(data, "weight", weightValue.toString());
    set(data, "list_id_values", "-");
    set(data, "bar_code", "");
    set(data, "editable_sku", get(variantData, "editable_sku"));
    set(data, "id", get(variantData, "id"));

    setDefaultValues(data);
  }, [variantData, router, rootVariantData]);

  const onSuccessHandler = useCallback(async () => {
    await variantMutate();
    router.replace(`/${PRODUCTS}/${router.query.productId}`);
  }, []);

  const selectVariantHandler = useCallback(() => {
    setDefaultValues(undefined);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent
      {...{
        defaultValues,
        onSuccessHandler,
        selectVariantHandler,
      }}
    />
  );
};

interface RootComponentProps {
  defaultValues: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
  selectVariantHandler: () => void;
}

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, onSuccessHandler, selectVariantHandler } = props;

  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_product");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const {
    control,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_PRODUCTS_VARIANTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      dirtyFields: FieldNamesMarkedBoolean<typeof defaultValues>;
    }) => {
      const variantId = get(data, "id");

      try {
        setLoading(true);

        let resList = [];

        // if (!isEmpty(dirtyFields)) {
        // const body = pick(data, Object.keys(dirtyFields));
        // await axios.patch(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}/`, body);
        // }

        await axios.patch(`${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}/`, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "sản phẩm",
          })
        );

        onSuccessHandler();

        // const result = checkResArr(resList);

        // if (result) {
        //   enqueueSnackbarWithSuccess(
        //     formatMessage(DynamicMessage.updateSuccessfully, {
        //       content: "sản phẩm",
        //     })
        //   );
        //   onSuccessHandler();
        // }
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
    <Box
      component="form"
      onSubmit={handleSubmit((data) => {
        onSubmit({
          data,
          dirtyFields,
        });
      })}
    >
      <Grid container>
        <Grid item xs={8}>
          <Grid container>
            <Grid item xs={12}>
              <GeneralInfo
                {...{
                  control,
                  defaultValues,
                }}
              />
            </Grid>

            {/* Hide on this version */}
            {/* <Grid item xs={12}>
              <Stock />
            </Grid> */}

            <Grid item xs={12}>
              <ExtendUnit />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={4}>
          <Grid container>
            <Grid item xs={12}>
              <Checkbox control={control} />
            </Grid>

            <Grid item xs={12}>
              <VariantList selectVariantHandler={selectVariantHandler} />
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between">
            <BackButton
              onClick={() => {
                if (router.query.variantId) {
                  let pathname = `/${PRODUCTS}/${router.query.productId}`;

                  router.push(pathname, pathname, {
                    shallow: true,
                  });
                } else {
                  let pathname = `/${PRODUCTS}`;

                  router.push(pathname, pathname, {
                    shallow: true,
                  });
                }
              }}
            />
            <Stack direction="row" spacing={2}>
              {writePermission && (
                <LoadingButton loading={loading} type="submit">
                  {loading ? messages["updatingStatus"] : messages["updateStatus"]}
                </LoadingButton>
              )}
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VariantCopy;
