import { useIntl } from "react-intl";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, get } from "lodash";
import { Box, Stack } from "@mui/material";

import ViewDetailReturnInvoiceTable from "./ViewDetailReturnInvoiceTable";
import { BackButton, Dialog, LoadingDynamic as Loading, WrapperTable } from "components";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";
import { useContainerReturnInvoice } from "./context/ContainerReturnInvoiceContext";

import {
  RETURN_INVOICE_VIEW_TYPE_V1,
  RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";

type ViewDetailReturnInvoiceProps = {
  open: boolean;
  onClose: () => void;
  returnInvoice: RETURN_INVOICE_VIEW_TYPE_V1;
};

type ViewDetailReturnInvoiceFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  return_invoice: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: ViewDetailReturnInvoiceFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  return_invoice: undefined,
  nested_depth: 4,
};

export default function ViewDetailReturnInvoice(props: ViewDetailReturnInvoiceProps) {
  const { returnInvoice, onClose, open } = props;

  const { messages } = useIntl();
  const returnInvoiceId = get(returnInvoice, "id");
  const { setUpdateViewDetail } = useContainerReturnInvoice();

  const [filter, setFilter] =
    useState<ViewDetailReturnInvoiceFilterType>(defaultFilterValue);

  const { data, itemCount, changeKey, isLoading, refreshData } =
    useFetch<RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT, filter)
    );

  useEffect(() => {
    let obj = {
      mutate: refreshData,
    };

    setUpdateViewDetail(obj);
  }, []);

  useEffect(() => {
    if (returnInvoiceId) {
      changeKey(
        transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT, {
          ...filter,
          return_invoice: returnInvoiceId,
        })
      );
    }
  }, [returnInvoiceId]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT, {
          ...cloneFilter,
          return_invoice: returnInvoiceId,
        });
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "60vw",
              maxWidth: "60vw",
            },
          },
        },
        DialogTitleProps: {
          children: messages["listingProduct"],
        },
        dialogContentTextComponent: () => {
          return (
            <Box>
              {data == undefined ? (
                <Loading />
              ) : (
                <WrapperTable>
                  <ViewDetailReturnInvoiceTable
                    maxHeight={300}
                    data={data ?? []}
                    count={itemCount}
                    isLoading={isLoading}
                    pagination={pagination}
                    onPageChange={onFilterChangeHandler("page")}
                    onPageSizeChange={onFilterChangeHandler("pageSize")}
                  />
                </WrapperTable>
              )}

              <Box padding="4px" />
            </Box>
          );
        },
        DialogActionsProps: {
          children: (
            <Stack flexDirection="row" columnGap={2}>
              <BackButton
                onClick={() => {
                  onClose();
                }}
              />
            </Stack>
          ),
        },
      }}
    />
  );
}
