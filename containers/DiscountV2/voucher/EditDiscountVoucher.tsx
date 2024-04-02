import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { Grid, Stack } from "@mui/material";
import { formatISO, parseISO } from "date-fns";
import { useState, useEffect, useCallback } from "react";

import useSWR from "swr";
import get from "lodash/get";
import set from "lodash/set";
import unset from "lodash/unset";
import isEmpty from "lodash/isEmpty";

import { DISCOUNTS } from "routes";
import { getDiscount, transformUrl } from "libs";
import { usePermission, useNotification } from "hooks";
import {
  ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_RESOLVER,
  ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_DISCOUNTS_VOUCHERS_END_POINT } from "__generated__/END_POINT";
import { Card, LoadingDynamic as Loading, BackButton, LoadingButton } from "components";
import { ADMIN_DISCOUNTS_VOUCHERS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

import axios from "axios.config";
import DynamicMessage from "messages";
import DiscountVoucherForm from "../form/DiscountVoucherForm";

const EditDiscountVoucher = () => {
  const router = useRouter();

  const [defaultValues, setDefaultValues] =
    useState<ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA_TYPE>();

  const { data: discountData, mutate: discountMutate } = useSWR<any>(() => {
    const id = router.query.id;

    if (id == undefined) return;

    const params = {
      use_cache: false,
    };

    return transformUrl(`${ADMIN_DISCOUNTS_VOUCHERS_END_POINT}${id}`, params);
  });

  useEffect(() => {
    if (discountData == undefined) {
      return;
    }

    const data = {} as ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA_TYPE;

    const keyList = [...Object.keys(ADMIN_DISCOUNTS_VOUCHERS_POST_DEFAULT_VALUE), "id"];

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

      if (key === "max_discount_amount") {
        if (discountData.max_discount_amount === null) {
          set(data, key, null);
          return;
        }
        set(data, key, parseFloat(discountData.max_discount_amount.incl_tax));
        return;
      }

      if (key === "min_spent_amount") {
        set(data, key, discountData.min_spent_amount.incl_tax);
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
  defaultValues: ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_SCHEMA_TYPE;
  onSuccessHandler: () => Promise<void>;
}

const RootComponent = ({ defaultValues, onSuccessHandler }: RootComponentProps) => {
  const { date_end, date_start, max_discount_amount } = defaultValues;
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
    setValue,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_DISCOUNTS_VOUCHERS_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(async ({ data, dirtyFields }) => {
    try {
      setLoading(true);

      const dataDirty = Object.keys(dirtyFields);

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
          // if (data[key] != undefined) {
          //   body[key] = data[key];
          // }

          if (dataDirty.includes(key)) {
            if (dataDirty.includes("discount_amount")) {
              body["discount_type"] = data["discount_type"];
            }
            body[key] = data[key];
          }
        }

        if (activeDiscountType === "discount_happenning") {
          await axios.patch(`${ADMIN_DISCOUNTS_VOUCHERS_END_POINT}${discountId}/`, {
            date_end: get(body, "date_end"),
          });
        } else {
          await axios.patch(`${ADMIN_DISCOUNTS_VOUCHERS_END_POINT}${discountId}/`, body);
        }

        await onSuccessHandler();

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.updateSuccessfully, {
            content: "mã khuyến mại",
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
      <Grid item xs={10}>
        <Card
          title={messages["updateDiscount"]}
          body={
            <DiscountVoucherForm
              {...{ control, watch, setValue, activeDiscountType, max_discount_amount }}
            />
          }
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
          <BackButton pathname={`/${DISCOUNTS}`} disabled={loading} />

          {writePermission && (
            <LoadingButton
              loading={loading}
              onClick={handleSubmit(
                (data) => {
                  onSubmit({ data, dirtyFields });
                },
                (err) => {}
              )}
            >
              {loading ? messages["updatingStatus"] : messages["updateStatus"]}
            </LoadingButton>
          )}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default EditDiscountVoucher;
