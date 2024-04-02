import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";

import { set } from "lodash";
import { Stack } from "@mui/material";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";

import ReturnInvoiceForm from "./ReturnInvoiceForm";
import { BackButton, Dialog, LoadingButton } from "components";

import {
  ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_YUP_RESOLVER,
  ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT } from "__generated__/END_POINT";
import { useContainerReturnInvoice } from "./context/ContainerReturnInvoiceContext";

type CreateReturnInvoiceDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateReturnInvoiceDialog(props: CreateReturnInvoiceDialogProps) {
  const { onClose, open } = props;

  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();
  const { updateData } = useContainerReturnInvoice();

  const { control, reset, handleSubmit } = useForm({
    resolver: ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_YUP_RESOLVER,
    defaultValues: ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_DEFAULT_VALUE,
  });

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const handleClose = useCallback(() => {
    onClose();
    reset(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_DEFAULT_VALUE, {
      keepDirty: false,
    });
  }, []);

  const onSubmit = useCallback(
    async (data: ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_YUP_SCHEMA_TYPE) => {
      try {
        setLoading(true);

        set(data, "is_confirmed", false);

        await axios.post(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "phiếu trả hàng",
          })
        );

        handleClose();
        updateData.mutate();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [updateData]
  );

  return (
    <Dialog
      {...{
        open,
        onClose: handleClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "50vw",
              maxWidth: "50vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["createReturnInvoice"],
        },
        dialogContentTextComponent: () => {
          return (
            <Stack gap="8px">
              <ReturnInvoiceForm control={control} />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" justifyContent="space-between" columnGap={2}>
              <BackButton
                disabled={loading}
                onClick={() => {
                  handleClose();
                }}
              />

              <LoadingButton
                loading={loading}
                onClick={handleSubmit((data) => {
                  onSubmit(data);
                })}
              >
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
}
