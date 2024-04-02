import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";

import { get, set } from "lodash";
import { Stack } from "@mui/material";

import FormCreatePriceTable from "./FormCreatePriceTable";
import { BackButton, Dialog, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { usePriceTable } from "./context/PriceTableContext";

import {
  ADMIN_ORDERS_PRICE_RULES_POST_YUP_RESOLVER,
  ADMIN_ORDERS_PRICE_RULES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";
import { ADMIN_ORDERS_PRICE_RULES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_PRICE_RULES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

type CreatePriceTableProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreatePriceTable(props: CreatePriceTableProps) {
  const { open, onClose } = props;

  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();
  const { updateData } = usePriceTable();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const defaultValues = {
    ...ADMIN_ORDERS_PRICE_RULES_POST_DEFAULT_VALUE,
    source_type: "price_table.pricetable",
  };

  const { control, handleSubmit, watch, reset } = useForm({
    resolver: ADMIN_ORDERS_PRICE_RULES_POST_YUP_RESOLVER,
    defaultValues: defaultValues,
  });

  const handleClose = useCallback(() => {
    reset(defaultValues, {
      keepDirty: false,
    });
    onClose();
  }, []);

  const onSubmit = useCallback(
    async ({ data }: { data: ADMIN_ORDERS_PRICE_RULES_POST_YUP_SCHEMA_TYPE }) => {
      try {
        setLoading(true);

        set(data, "source_id", get(data, "source_id").toString());
        set(data, "order", router.query.id);

        await axios.post(ADMIN_ORDERS_PRICE_RULES_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "loại giá",
          })
        );

        updateData.mutate();
        handleClose();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [router.query.id, updateData]
  );

  return (
    <Dialog
      {...{
        open,
        onClose: handleClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "40vw",
              maxWidth: "45vw",
            },
          },
        },
        DialogTitleProps: {
          children: "Loại giá",
        },
        dialogContentTextComponent: () => {
          return <FormCreatePriceTable control={control} watch={watch} />;
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  handleClose();
                }}
              />

              <LoadingButton
                loading={loading}
                disabled={loading || watch("source_id") === null ? true : false}
                onClick={handleSubmit((data) => {
                  onSubmit({ data });
                })}
              >
                {loading["complete"]
                  ? messages["creatingStatus"]
                  : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    >
      CreatePriceTable
    </Dialog>
  );
}
