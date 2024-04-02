import useSWR from "swr";
import set from "lodash/set";
import unset from "lodash/unset";

import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { formatISO, parseISO } from "date-fns";
import { useState, useEffect, useCallback } from "react";

import { DISCOUNT } from "apis";
import { DISCOUNTS } from "routes";
import { useRouter } from "next/router";
import { DISCOUNT_ITEM } from "interfaces";
import { ACTIVE_DISCOUNT_TYPE } from "constant";
import { getDiscount, transformUrl } from "libs";
import { usePermission, useNotification } from "hooks";
import { defaultDiscountFormState, DiscountSchemaProps } from "yups";
import { ADMIN_DISCOUNTS_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { Card, LoadingDynamic as Loading, BackButton, LoadingButton } from "components";

import get from "lodash/get";
import axios from "axios.config";
import dynamic from "next/dynamic";
import isEmpty from "lodash/isEmpty";
import DynamicMessage from "messages";
import DiscountFormV2 from "./form/DiscountFormV2";

const ContainerDiscountedVariantV2 = dynamic(
  () => import("./connection/ContainerDiscountedVariantV2"),
  {
    loading: () => {
      return <Loading />;
    },
  }
);

const EditDiscountV2 = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] = useState<DiscountSchemaProps>();

  const { data: discountData, mutate: discountMutate } = useSWR<DISCOUNT_ITEM>(() => {
    const id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };

    return transformUrl(`${DISCOUNT}${id}`, params);
  });

  useEffect(() => {
    if (discountData == undefined) {
      return;
    }

    const data = {} as DiscountSchemaProps;

    const keyList = [...Object.keys(defaultDiscountFormState()), "id"];

    keyList.forEach((key) => {
      if (key === "date_start" || key === "date_end") {
        const date = discountData[key];

        if (date) {
          set(data, key, parseISO(date));
          return;
        }

        set(data, key, null);

        return;
      }

      if (key === "discount_amount") {
        set(data, key, parseFloat(discountData[key]));
        return;
      }

      set(data, key, discountData[key]);
    });

    setDefaultValues(data);
  }, [discountData]);

  const onSuccessHandler = useCallback(async () => {
    await discountMutate();

    router.replace(`/${DISCOUNTS}`);
  }, []);

  if (defaultValues == undefined) return <Loading />;

  return <RootComponent {...{ defaultValues, onSuccessHandler }} />;
};

interface RootComponentProps {
  defaultValues: DiscountSchemaProps;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { date_end, date_start } = defaultValues;
  const activeDiscountType = getDiscount(date_start, date_end);

  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_voucher");

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const {
    control,
    handleSubmit,
    watch,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_DISCOUNTS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data, dirtyFields }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const discountId = get(data, "id");

          unset(data, "id");

          let dateStart = get(data, "date_start");
          let dateEnd = get(data, "date_end");

          set(data, "date_start", formatISO(dateStart));

          if (dateEnd) {
            set(data, "date_end", formatISO(dateEnd));
          }
          const body = {};

          for (const key of Object.keys(data)) {
            if (data[key] != undefined) {
              body[key] = data[key];
            }
          }

          if (activeDiscountType === "discount_happenning") {
            await axios.patch(`${DISCOUNT}${discountId}/`, {
              date_end: get(body, "date_end"),
            });
          } else {
            await axios.patch(`${DISCOUNT}${discountId}/`, { body });
          }

          await onSuccessHandler();

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "khuyến mại",
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
    },
    [activeDiscountType]
  );

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          title={messages["updateDiscount"]}
          body={<DiscountFormV2 {...{ control, watch, activeDiscountType }} />}
        />
      </Grid>

      <Grid item xs={10}>
        <ContainerDiscountedVariantV2 type={activeDiscountType} />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${DISCOUNTS}`} disabled={loading} />

          {activeDiscountType === ACTIVE_DISCOUNT_TYPE.end
            ? null
            : writePermission && (
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

export default EditDiscountV2;
