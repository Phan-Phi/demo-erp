import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useRouter } from "next/router";
import { Range } from "react-date-range";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Grid, Box, Stack } from "@mui/material";
import { cloneDeep, get, omit, set } from "lodash";

import WarehouseCardTable from "./WarehouseCardTable";
import { TableHeader, WrapperTable } from "components";
import FilterWarehouseCard from "./FilterWarehouseCard";

import { useFetch, useLayout } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";

import {
  ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1,
  ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_RECORDS_TIMELINES_END_POINT } from "__generated__/END_POINT";

export type WarehouseCardFilterType = {
  page: number;
  page_size: number;
  with_count: true;
  warehouse: number | undefined;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  source_type: string;
  nested_depth: number;
  record: ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 | null;
};

const defaultFilterValue: WarehouseCardFilterType = {
  page: 1,
  page_size: 10,
  with_count: true,
  warehouse: undefined,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
  source_type: "",
  nested_depth: 3,
  record: null,
};

const omitFiled = ["range", "range_params"];

export default function WarehouseCard() {
  const router = useRouter();
  const { messages } = useIntl();
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const [filter, setFilter] = useState<WarehouseCardFilterType>(defaultFilterValue);

  const { data, changeKey, isLoading, itemCount } =
    useFetch<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_TIMELINES_END_POINT, {
        ...omit(filter, omitFiled),
        warehouse: router.query.id,
      })
    );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_WAREHOUSES_RECORDS_TIMELINES_END_POINT, {
          ...omit(filter, omitFiled),
          warehouse: router.query.id,
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

        if (key === "range") return;

        let startDate = transformDate(cloneFilter.range_params.startDate, "date_start");
        let endDate = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        const params = cloneDeep(cloneFilter);

        set(params, "record", get(params, "record.id"));

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_RECORDS_TIMELINES_END_POINT, {
            ...omit(params, omitFiled),
            warehouse: router.query.id,
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
    const recordId = get(cloneFilter, "record.id");

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

    changeKey(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_TIMELINES_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        warehouse: router.query.id,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
        record: recordId,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    changeKey(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_TIMELINES_END_POINT, {
        ...omit(defaultFilterValue, omitFiled),
        warehouse: router.query.id,
      })
    );
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <FilterWarehouseCard
          filter={filter}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onRecordChange={onFilterChangeHandler("record")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onSourceTypeChange={onFilterChangeHandler("source_type")}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack gap={2}>
          <Box ref={ref}>
            <TableHeader title={messages["table.historyList"] as string} />
          </Box>

          <WrapperTable>
            <WarehouseCardTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 48}
            />
          </WrapperTable>
        </Stack>
      </Grid>
    </Grid>
  );
}
