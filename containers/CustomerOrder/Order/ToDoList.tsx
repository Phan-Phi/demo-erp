import { Range } from "react-date-range";
import { useCallback, useState } from "react";

import { cloneDeep } from "lodash";
import { Box, Grid, Typography, styled } from "@mui/material";

import { ToDoListItem } from "compositions";
import FilterTodoList from "./FilterTodoList";
import { Divider, LoadingDynamic } from "components";

import { useFetch } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

import {
  ADMIN_ORDERS_END_POINT,
  ADMIN_ORDERS_INVOICES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_ORDER_ORDER_VIEW_TYPE_V1,
  ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

interface ToDoListProps {
  title: string;
  setFilterAll: React.Dispatch<React.SetStateAction<string>>;
}

export type FilterTodoListType = {
  range: Range;
};

const defaultFilterValue: FilterTodoListType = {
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
};

const filterAdminOrderDraft = {
  page: 1,
  page_size: 1,
  status: "Draft",
};

const filterAdminOrderProcessed = {
  page: 1,
  page_size: 1,
  status: "Processed",
};

const filterAdminOrderConfirm = {
  page: 1,
  page_size: 1,
  status: "Confirmed",
};

const filterAdminOrderInvoiceShippingStatus = {
  page: 1,
  page_size: 1,
  shipping_status: "On delivery",
};

const filterAdminOrderInvoiceStatusPartialPaid = {
  page: 1,
  page_size: 1,
  status: "Partial_paid",
};

const filterAdminOrderInvoiceStatusPaid = {
  page: 1,
  page_size: 1,
  status: "paid",
};

export default function ToDoList(props: ToDoListProps) {
  const { title, setFilterAll } = props;
  const [filter, setFilter] = useState<FilterTodoListType>(defaultFilterValue);

  const {
    data,
    itemCount: itemCountDraft,
    changeKey: changeKeyAdminOrderDraft,
  } = useFetch<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_END_POINT, filterAdminOrderDraft)
  );

  const { itemCount: itemCountProcessed, changeKey: changeKeyAdminOrderProcessed } =
    useFetch<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_END_POINT, filterAdminOrderProcessed)
    );

  const { itemCount: itemCountConfirmed, changeKey: changeKeyAdminOrderConfirm } =
    useFetch<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_END_POINT, filterAdminOrderConfirm)
    );

  const {
    itemCount: itemCountDelivering,
    changeKey: changeKeyAdminOrderInvoiceDelivery,
  } = useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, filterAdminOrderInvoiceShippingStatus)
  );

  const {
    itemCount: itemCountPartialPaid,
    changeKey: changKeyAdminOrderInvoicePartialPaid,
  } = useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
    transformUrl(
      ADMIN_ORDERS_INVOICES_END_POINT,
      filterAdminOrderInvoiceStatusPartialPaid
    )
  );

  const { itemCount: itemCountPaid, changeKey: changeKeyAdminOrderInvoicePaid } =
    useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, filterAdminOrderInvoiceStatusPaid)
    );

  const handleDraftOrders = useCallback(() => {
    setFilterAll("Draft");
  }, []);

  const handleConfirmedOrders = useCallback(() => {
    setFilterAll("Confirmed");
  }, []);

  const handleProcessedOrders = useCallback(() => {
    setFilterAll("Processed");
  }, []);

  const handleDeliveryInvoice = useCallback(() => {
    setFilterAll("On delivery");
  }, []);

  const handlePartialPaid = useCallback(() => {
    setFilterAll("Partial_paid");
  }, []);

  const handlePaid = useCallback(() => {
    setFilterAll("Paid");
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let startDate = transformDate(cloneFilter.range.startDate, "date_start");
    let endDate = transformDate(cloneFilter.range.endDate, "date_end");

    let isStartDate = cloneFilter.range.startDate;
    let isEndDate = cloneFilter.range.endDate;

    // Orders
    changeKeyAdminOrderDraft(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...filterAdminOrderDraft,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
      })
    );

    changeKeyAdminOrderProcessed(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...filterAdminOrderProcessed,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
      })
    );

    changeKeyAdminOrderConfirm(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...filterAdminOrderConfirm,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
      })
    );

    // Invoice
    changeKeyAdminOrderInvoiceDelivery(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filterAdminOrderInvoiceShippingStatus,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );

    changKeyAdminOrderInvoicePartialPaid(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filterAdminOrderInvoiceStatusPartialPaid,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );

    changeKeyAdminOrderInvoicePaid(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filterAdminOrderInvoiceStatusPaid,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    // Orders
    changeKeyAdminOrderDraft(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...filterAdminOrderDraft,
      })
    );

    changeKeyAdminOrderProcessed(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...filterAdminOrderProcessed,
      })
    );

    changeKeyAdminOrderConfirm(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...filterAdminOrderConfirm,
      })
    );

    // Invoice
    changeKeyAdminOrderInvoiceDelivery(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filterAdminOrderInvoiceShippingStatus,
      })
    );

    changKeyAdminOrderInvoicePartialPaid(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filterAdminOrderInvoiceStatusPartialPaid,
      })
    );

    changeKeyAdminOrderInvoicePaid(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...filterAdminOrderInvoiceStatusPaid,
      })
    );
  }, []);

  return (
    <StyledWrapper>
      <Title>{title}</Title>

      <Box padding="10px" />

      <Grid container>
        <Grid item xs={2}>
          <FilterTodoList
            filter={filter}
            resetFilter={resetFilterHandler}
            onFilterByTime={onClickFilterByTime}
            onDateRangeChange={onFilterChangeHandler("range")}
          />
        </Grid>

        <Grid item xs={10}>
          {data == undefined ? (
            <Loading />
          ) : (
            <Grid container>
              <ToDoListItem
                countGrid={4}
                name="Đơn nháp"
                count={itemCountDraft ?? 0}
                onClick={handleDraftOrders}
              />

              <ToDoListItem
                countGrid={4}
                name="Đã duyệt"
                count={itemCountConfirmed ?? 0}
                onClick={handleConfirmedOrders}
              />

              <ToDoListItem
                name="Đang xử lý"
                count={itemCountProcessed ?? 0}
                countGrid={4}
                borderRight={false}
                onClick={handleProcessedOrders}
              />

              <ToDoListItem
                countGrid={4}
                borderRight={true}
                name="Đang vận chuyển"
                onClick={handleDeliveryInvoice}
                count={itemCountDelivering ?? 0}
              />

              <ToDoListItem
                countGrid={4}
                borderRight={true}
                name="Đã thanh toán 1 phần"
                onClick={handlePartialPaid}
                count={itemCountPartialPaid ?? 0}
              />

              <ToDoListItem
                countGrid={4}
                name="Đã thanh toán"
                borderRight={false}
                onClick={handlePaid}
                count={itemCountPaid ?? 0}
              />
            </Grid>
          )}
        </Grid>
      </Grid>

      <Box padding="10px" />

      <Divider />
    </StyledWrapper>
  );
}

const Loading = () => {
  return (
    <StyledWrapperLoading>
      <LoadingDynamic />
    </StyledWrapperLoading>
  );
};

const StyledWrapperLoading = styled(Box)(() => {
  return {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
});

const StyledWrapper = styled(Box)(({ theme }) => {
  return {};
});

const Title = styled(Typography)(({ theme }) => {
  return {
    fontSize: "18px",
    lineHeight: 1.6,
    fontWeight: 700,
  };
});
