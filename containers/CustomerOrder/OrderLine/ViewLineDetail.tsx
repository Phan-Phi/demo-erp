import React, { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import useSWR from "swr";
import { get, set } from "lodash";
import { Stack } from "@mui/material";

import FormLineDetail from "./FormLineDetail";
import PriceRulesItemList from "./PriceRulesItemList";
import { BackButton, Dialog, LoadingDynamic } from "components";

import { ADMIN_ORDERS_LINES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ViewLineDetailProps = {
  lineId: number;
  open: boolean;
  onClose: () => void;
  setLineId: Dispatch<SetStateAction<number>>;
};

export type DEFAULT_VALUES_TYPE = {
  id: number;
  unit: string;
  quantity: number;
  unitPriceBeforeDiscounts: string;
  unitPriceAfterDiscounts: string;
  variantName: string;
};

export default function ViewLineDetail(props: ViewLineDetailProps) {
  const { onClose, open, lineId, setLineId } = props;

  const [defaultValues, setDefaultValues] = useState<DEFAULT_VALUES_TYPE>();

  const { data: lineData } = useSWR<ADMIN_ORDER_LINE_VIEW_TYPE_V1>(() => {
    if (!lineId) return;
    if (lineId === 0) return;

    return `${ADMIN_ORDERS_LINES_END_POINT}${lineId}`;
  });

  useEffect(() => {
    if (lineData == undefined || !open) return;

    const data = {} as DEFAULT_VALUES_TYPE;

    set(data, "id", get(lineData, "id"));
    set(data, "variantName", get(lineData, "variant_name"));
    set(data, "quantity", get(lineData, "quantity"));
    set(data, "unit", get(lineData, "unit"));
    set(
      data,
      "unitPriceBeforeDiscounts",
      get(lineData, "unit_price_before_discounts.incl_tax")
    );
    set(data, "unitPriceAfterDiscounts", get(lineData, "unit_price.incl_tax"));

    setDefaultValues(data);
  }, [lineData, open]);

  useEffect(() => {
    !open && setDefaultValues(undefined);
  }, [open]);

  const handleClose = useCallback(() => {
    setLineId(0);
    onClose();
  }, []);

  if (defaultValues == undefined && !open) return null;

  if (defaultValues == undefined) return <LoadingDynamic />;

  return <RootComponent {...{ defaultValues, handleClose, open }} />;
}

type RootComponentProps = {
  open: boolean;
  handleClose: () => void;
  defaultValues: DEFAULT_VALUES_TYPE;
};

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, handleClose, open } = props;

  const lineId = get(defaultValues, "id");
  const variantName = get(defaultValues, "variantName");

  return (
    <Dialog
      {...{
        open,
        onClose: handleClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "60vw",
              maxWidth: "65vw",
            },
          },
        },
        DialogTitleProps: {
          children: `Sản phẩm: ${variantName}`,
        },
        dialogContentTextComponent: () => {
          return (
            <Stack gap="16px">
              <FormLineDetail defaultValues={defaultValues} />

              <PriceRulesItemList id={lineId} />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <BackButton
              onClick={() => {
                handleClose();
              }}
            />
          ),
        },
      }}
    />
  );
};
