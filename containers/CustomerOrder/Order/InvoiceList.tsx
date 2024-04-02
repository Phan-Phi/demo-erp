import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";
import { cloneDeep, get, omit, set } from "lodash";

import FilterInvoice from "./FilterInvoice";
import InvoiceListTable from "./InvoiceListTable";
import { TableHeader, WrapperTable, LoadingDynamic } from "components";

import {
  transformUrl,
  transformDate,
  setFilterValue,
  convertTagsNameToString,
} from "libs";
import { useFetch, useLayout, useToggle } from "hooks";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";

import {
  ADMIN_ORDER_INVOICE_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";

const TagsModal = dynamic(import("../../../compositions/TagsModal/TagsModal"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

export type InvoiceListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  search: string;
  status: string;
  shipping_status: string;
  shipper: ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1 | null;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  tag_names_params: any[];
  tag_names: string;
};

const defaultFilterValue: InvoiceListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 1,
  search: "",
  status: "",
  shipping_status: "",
  shipper: null,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
  tag_names_params: [],
  tag_names: "",
};

const omitFields = ["range", "range_params", "tag_names_params"];

type InvoiceListProps = {
  filterAll: string;
  setFilterAll: React.Dispatch<React.SetStateAction<string>>;
};

export default function InvoiceList({ filterAll, setFilterAll }: InvoiceListProps) {
  const { messages } = useIntl();
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();

  const {
    open: isOpenTagsModal,
    onOpen: onOpenTagsModal,
    onClose: onCloseTagsModal,
  } = useToggle();

  const [objectId, setObjectId] = useState(0);
  const [objectTable, setObjectTable] = useState<any>({});
  const [hideAndShow, setHideAndShow] = useState<any>(SELECTED_TABLE.invoice);
  const [filter, setFilter] = useState<InvoiceListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, omit(filter, omitFields))
    );

  useEffect(() => {
    if (filterAll === "") return;

    const cloneFilter = cloneDeep(filter);

    if (filterAll === "On delivery") {
      cloneFilter.shipping_status = "On delivery";
      cloneFilter.status = "";
      setFilter(cloneFilter);
    } else {
      cloneFilter.status = filterAll;
      cloneFilter.shipping_status = "";

      setFilter(cloneFilter);
    }

    changeKey(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, omit(cloneFilter, omitFields))
    );
  }, [filterAll]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "tag_names_params") return;

        const params = cloneDeep(cloneFilter);

        let startDate = transformDate(cloneFilter.range_params.startDate, "date_start");
        let endDate = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        set(params, "shipper", get(params, "shipper.id"));

        changeKey(
          transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
            ...omit(params, omitFields),
            date_created_start: isStartDate ? startDate : undefined,
            date_created_end: isEndDate ? endDate : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let startDate = transformDate(updateFilter.range_params.startDate, "date_start");
    let endDate = transformDate(updateFilter.range_params.endDate, "date_end");

    let isStartDate = updateFilter.range_params.startDate;
    let isEndDate = updateFilter.range_params.endDate;

    const params = cloneDeep(updateFilter);
    set(params, "shipper", get(params, "shipper.id"));

    changeKey(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const onClickFilterTag = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let listTagsName = convertTagsNameToString(cloneFilter.tag_names_params);

    let updateFilter = {
      ...cloneFilter,
      tag_names: listTagsName,
    };

    setFilter(updateFilter);

    let startDate = transformDate(updateFilter.range_params.startDate, "date_start");
    let endDate = transformDate(updateFilter.range_params.endDate, "date_end");

    let isStartDate = updateFilter.range_params.startDate;
    let isEndDate = updateFilter.range_params.endDate;

    const params = cloneDeep(updateFilter);
    set(params, "shipper", get(params, "shipper.id"));

    changeKey(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
        ...omit(params, omitFields),
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilter = useCallback(() => {
    setFilterAll("");
    setFilter(defaultFilterValue);
    changeKey(
      transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, omit(defaultFilterValue, omitFields))
    );
  }, []);

  const onViewTagsHandler = useCallback((id: number) => {
    setObjectId(id);
    onOpenTagsModal();
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const getTable = useCallback((item) => {
    setObjectTable(item);
  }, []);

  const showAndHideTable = useCallback((item) => {
    setHideAndShow((el) => {
      const index = el.findIndex((el) => el === item);

      if (index === -1) {
        return [...el, item];
      } else {
        const data = el.filter((el) => el !== item);
        return [...data];
      }
    });
  }, []);

  return (
    <Box>
      <TagsModal
        objectId={objectId}
        open={isOpenTagsModal}
        refreshData={refreshData}
        onClose={onCloseTagsModal}
        source_type={SOURCE_TYPE_FOR_TAGS.orderInvoice}
      />

      <Grid container>
        <Grid item xs={2}>
          <FilterInvoice
            filter={filter}
            setFilter={setFilter}
            resetFilter={resetFilter}
            onClickFilterTag={onClickFilterTag}
            onFilterByTime={onClickFilterByTime}
            onSearchChange={onFilterChangeHandler("search")}
            onStatusChange={onFilterChangeHandler("status")}
            onShipperChange={onFilterChangeHandler("shipper")}
            onDateRangeChange={onFilterChangeHandler("range")}
            onTagsChange={onFilterChangeHandler("tag_names_params")}
            onShippingStatusChange={onFilterChangeHandler("shipping_status")}
          />
        </Grid>

        <Grid item xs={10}>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingOrderInvoice"] as string}
                objectTable={objectTable}
                showAndHideTable={showAndHideTable}
              />
            </Box>

            <WrapperTable>
              <InvoiceListTable
                data={data ?? []}
                count={itemCount}
                getTable={getTable}
                isLoading={isLoading}
                pagination={pagination}
                hideAndShow={hideAndShow}
                onViewTagsHandler={onViewTagsHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
              />
            </WrapperTable>

            <Box padding="10px" />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
