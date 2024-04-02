import React, { useEffect, useState } from "react";

import useSWR from "swr";
import { get } from "lodash";
import { useRouter } from "next/router";
import { Button, Stack } from "@mui/material";

import InfoCustomer from "./InfoCustomer";
import { BackButton, Dialog, LoadingDynamic as Loading } from "components";

import { transformUrl } from "libs";
import { CUSTOMERS, DETAIL } from "routes";
import { ADMIN_CUSTOMERS_DRAFTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type PopupInfoProps = {
  open: boolean;
  onClose: () => void;
  customerId: number;
  setCustomerId: React.Dispatch<React.SetStateAction<number>>;
};

export default function PopupInfo(props: PopupInfoProps) {
  const { open, onClose, customerId, setCustomerId } = props;
  const [currentCustomer, setCurrentCustomer] =
    useState<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>();

  const { data } = useSWR(() => {
    if (customerId === 0) return;

    return transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
      official_customer: customerId,
    });
  });

  useEffect(() => {
    if (data) {
      setCurrentCustomer(data.results["0"]);
    }
  }, [data]);

  useEffect(() => {
    !open && setCustomerId(0);
    !open && setCurrentCustomer(undefined);
  }, [open]);

  if (currentCustomer == undefined && !open) return null;

  if (currentCustomer == undefined) return <Loading />;

  return <RootComponent {...{ open, onClose, currentCustomer }} />;
}

type RootComponentProps = {
  open: boolean;
  onClose: () => void;
  currentCustomer: ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1;
};

const RootComponent = (props: RootComponentProps) => {
  const { open, onClose, currentCustomer } = props;

  const router = useRouter();

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "35vw",
              maxWidth: "35vw",
            },
          },
        },
        DialogTitleProps: {
          children: "Thông tin khách hàng",
        },
        dialogContentTextComponent: () => {
          return <InfoCustomer data={currentCustomer} />;
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton onClick={onClose} />

              <Button
                onClick={() => {
                  const id = get(currentCustomer, "id");

                  router.push(`/${CUSTOMERS}/${DETAIL}/${id}`);
                }}
              >
                Xem chi tiết
              </Button>
            </Stack>
          ),
        },
      }}
    />
  );
};
