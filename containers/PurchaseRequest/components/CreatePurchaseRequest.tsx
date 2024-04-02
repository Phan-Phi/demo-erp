import { useIntl } from "react-intl";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import React, { useCallback } from "react";
import { useMountedState } from "react-use";

import FormPurchaseRequest from "./FormPurchaseRequest";
import { BackButton, Dialog, LoadingButton } from "components";

import axios from "axios.config";
import { useNotification } from "hooks";

import {
  ADMIN_PURCHASE_REQUESTS_POST_YUP_RESOLVER,
  ADMIN_PURCHASE_REQUESTS_POST_YUP_SCHEMA_TYPE,
} from "__generated__/POST_YUP";

import { ADMIN_PURCHASE_REQUESTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PURCHASE_REQUESTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

type CreatePurchaseRequestProps = {
  open: boolean;
  onClose: () => void;
  refreshData: () => void;
};

export default function CreatePurchaseRequest(props: CreatePurchaseRequestProps) {
  const { onClose, open, refreshData } = props;

  const { messages } = useIntl();
  const isMounted = useMountedState();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit, reset } = useForm({
    resolver: ADMIN_PURCHASE_REQUESTS_POST_YUP_RESOLVER,
    defaultValues: ADMIN_PURCHASE_REQUESTS_POST_DEFAULT_VALUE,
  });

  const onCreatePurchaseRequestHandler = useCallback(
    async (data: ADMIN_PURCHASE_REQUESTS_POST_YUP_SCHEMA_TYPE) => {
      try {
        setLoading(true);

        await axios.post(ADMIN_PURCHASE_REQUESTS_END_POINT, data);

        enqueueSnackbarWithSuccess("Tạo yêu cầu đặt hàng thành công");

        reset(ADMIN_PURCHASE_REQUESTS_POST_DEFAULT_VALUE, {
          keepDirty: true,
        });

        refreshData();

        onClose();
      } catch (error) {
        enqueueSnackbarWithError(error);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "40vw",
              maxWidth: "40vw",
            },
          },
        },
        DialogTitleProps: {
          children: "Tạo yêu cầu đặt hàng",
        },
        dialogContentTextComponent: () => {
          return <FormPurchaseRequest control={control} />;
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  onClose();
                }}
              />

              <LoadingButton
                loading={loading}
                disabled={loading}
                onClick={handleSubmit(onCreatePurchaseRequestHandler)}
              >
                {loading["complete"] ? messages["creatingStatus"] : messages["addStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
}
