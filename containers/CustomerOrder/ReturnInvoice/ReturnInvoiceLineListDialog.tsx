import { useIntl } from "react-intl";
import { useMountedState } from "react-use";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, get } from "lodash";
import { Stack, Box } from "@mui/material";

import {
  Dialog,
  BackButton,
  WrapperTable,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import ReturnInvoiceLineListTable from "./ReturnInvoiceLineListTable";

import { useFetch, useMutateTable, useNotification } from "hooks";
import { checkResArr, createRequest, setFilterValue, transformUrl } from "libs";

import {
  RETURN_INVOICE_VIEW_TYPE_V1,
  ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import {
  ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT,
  ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";

type ReturnInvoiceLineListDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  invoice: number | undefined;
  nested_depth: number;
};

const defaultFilterValue: ReturnInvoiceLineListDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  invoice: undefined,
  nested_depth: 3,
};

type ReturnInvoiceLineListDialogProps = {
  open: boolean;
  onClose: () => void;
  returnInvoice: RETURN_INVOICE_VIEW_TYPE_V1;
};

export default function ReturnInvoiceLineListDialog(
  props: ReturnInvoiceLineListDialogProps
) {
  const { returnInvoice, onClose, open } = props;

  const { messages } = useIntl();
  const isMounted = useMountedState();
  const returnInvoiceId = get(returnInvoice, "id");
  const invoiceId = get(returnInvoice, "invoice.id");
  const { updateEditRowDataHandler, data: editData } = useMutateTable();
  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const [filter, setFilter] =
    useState<ReturnInvoiceLineListDialogFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, filter)
    );

  useEffect(() => {
    if (invoiceId) {
      changeKey(
        transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
          ...filter,
          invoice: invoiceId,
        })
      );
    }
  }, [invoiceId]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        transformUrl(ADMIN_ORDERS_INVOICES_QUANTITIES_END_POINT, {
          ...cloneFilter,
          invoice: invoiceId,
        });
      };
    },
    [filter, invoiceId]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const onSubmit = useCallback(async () => {
    try {
      const filteredData = Object.values(editData.current).map((item) => {
        const invoiceQuantity = get(item, "line");
        const quantity = get(item, "quantityReturn");

        return {
          quantity,
          invoice_quantity: invoiceQuantity,
          return_invoice: returnInvoiceId,
        };
      });

      if (get(filteredData, "length") === 0) return;

      setLoading(true);

      const results = await createRequest(
        ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT,
        filteredData
      );

      const result = checkResArr(results);

      if (result) {
        enqueueSnackbarWithSuccess("Thêm sản phẩm thành công");
        onClose();
      }
    } catch (error) {
      enqueueSnackbarWithError(error);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, [editData, returnInvoiceId]);

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
                  <ReturnInvoiceLineListTable
                    maxHeight={300}
                    data={data ?? []}
                    count={itemCount}
                    editData={editData}
                    isLoading={isLoading}
                    pagination={pagination}
                    returnInvoiceId={returnInvoiceId}
                    onPageChange={onFilterChangeHandler("page")}
                    updateEditRowDataHandler={updateEditRowDataHandler}
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

              <LoadingButton onClick={onSubmit} loading={loading}>
                {loading ? messages["creatingStatus"] : messages["createStatus"]}
              </LoadingButton>
            </Stack>
          ),
        },
      }}
    />
  );
}
