import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Box } from "@mui/material";
import { cloneDeep, get, isEmpty } from "lodash";

import { LoadingDynamic } from "components";
import ReturnInvoiceListTable from "./ReturnInvoiceListTable";

import {
  checkResArr,
  transformUrl,
  updateRequest,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import {
  useFetch,
  useToggle,
  usePermission,
  useNotification,
  useConfirmation,
} from "hooks";
import axios from "axios.config";
import DynamicMessage from "messages";
import { useContainerReturnInvoice } from "./context/ContainerReturnInvoiceContext";

import {
  ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT,
  ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT,
} from "__generated__/END_POINT";
import { RETURN_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const ReturnInvoiceLineListDialog = dynamic(
  () => import("./ReturnInvoiceLineListDialog"),
  {
    loading: () => {
      return <LoadingDynamic />;
    },
  }
);

const ViewDetailReturnInvoice = dynamic(() => import("./ViewDetailReturnInvoice"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

type ReturnInvoiceListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  order: number | undefined;
};

const defaultFilterValue: ReturnInvoiceListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  order: undefined,
};

export default function ReturnInvoiceList() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { setUpdateData, updateViewDetail } = useContainerReturnInvoice();
  const { hasPermission: readPermission } = usePermission("read_return_invoice");
  const { hasPermission: writePermission } = usePermission("write_return_invoice");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, enqueueSnackbar } =
    useNotification();

  const {
    open: openViewDetailReturnInvoice,
    onClose: onCloseViewDetailReturnInvoice,
    onOpen: onOpenViewDetailReturnInvoice,
  } = useToggle();
  const { open, onClose: onCloseDialog, onOpen } = useToggle();

  const [returnInvoice, setReturnInvoice] = useState<RETURN_INVOICE_VIEW_TYPE_V1>({});
  const [filter, setFilter] = useState<ReturnInvoiceListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<RETURN_INVOICE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    let obj = {
      mutate: refreshData,
    };

    setUpdateData(obj);
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT, {
          ...filter,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
          })
        );
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

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(
          ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT,
          list
        );

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "phiếu trả hàng",
            })
          );
          refreshData();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        onClose();
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const addHandler = useCallback((row) => {
    const data = get(row, "original");

    if (data) {
      setReturnInvoice(data);
      onOpen();
    }
  }, []);

  const onViewHandler = useCallback((row) => {
    const data = get(row, "original");

    if (data) {
      setReturnInvoice(data);
      onOpenViewDetailReturnInvoice();
    }
  }, []);

  const approveHandler = useCallback(
    ({ data }) => {
      const handler = async () => {
        let bodyList: any[] = [];

        const returnInvoiceId = get(data[0], "original.id");

        const url = transformUrl(
          ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT,
          {
            page_size: 1,
            return_invoice: returnInvoiceId,
          }
        );

        const { data: returnInvoiceQuantityData } = await axios.get(url);

        const isQuantity = get(returnInvoiceQuantityData, "results");

        if (isEmpty(isQuantity)) {
          enqueueSnackbar("Vui lòng kiểm tra lại số lượng", {
            variant: "error",
          });
          onClose();
          return;
        } else {
          data.forEach((item) => {
            const id = get(item, "original.id");

            const body = {
              id,
              is_confirmed: true,
            };

            bodyList.push(body);
          });
        }

        try {
          const results = await updateRequest(
            ADMIN_ORDERS_INVOICES_RETURN_INVOICES_END_POINT,
            bodyList
          );
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.approveSuccessfully, {
                content: "phiếu trả hàng",
              })
            );

            refreshData();
            updateViewDetail.mutate();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          onClose();
        }
      };

      onConfirm(handler, {
        message: "Bạn có muốn xác nhận phiếu trả hàng?",
        variant: "info",
      });
    },
    [updateViewDetail]
  );

  return (
    <Box>
      <ReturnInvoiceListTable
        maxHeight={300}
        data={data ?? []}
        count={itemCount}
        isLoading={isLoading}
        pagination={pagination}
        addHandler={addHandler}
        deleteHandler={deleteHandler}
        onViewHandler={onViewHandler}
        readPermission={readPermission}
        approveHandler={approveHandler}
        writePermission={writePermission}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
      />

      <ReturnInvoiceLineListDialog
        {...{
          open,
          returnInvoice,
          onClose: onCloseDialog,
        }}
      />

      <ViewDetailReturnInvoice
        {...{
          returnInvoice,
          open: openViewDetailReturnInvoice,
          onClose: onCloseViewDetailReturnInvoice,
        }}
      />
    </Box>
  );
}
