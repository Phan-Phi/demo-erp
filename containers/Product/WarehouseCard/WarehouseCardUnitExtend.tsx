import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useRouter } from "next/router";
import { Range } from "react-date-range";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, omit } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import { TableHeader, WrapperTable } from "components";
import WarehouseCardUnitExtendTable from "./WarehouseCardUnitExtendTable";
import FilterWarehouseCardUnitExtend from "./FilterWarehouseCardUnitExtend";

import { useFetch, useLayout } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { ADMIN_PRODUCTS_VARIANTS_UNITS_TIMELINES_END_POINT } from "__generated__/END_POINT";

export type WarehouseCardUnitExtendFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  variant: number | undefined;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: WarehouseCardUnitExtendFilterType = {
  page: 1,
  page_size: 10,
  with_count: true,
  variant: undefined,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const omitFiled = ["range", "range_params"];

export default function WarehouseCardUnitExtend() {
  const { messages } = useIntl();
  const router = useRouter();
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();

  const [filter, setFilter] =
    useState<WarehouseCardUnitExtendFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_TIMELINES_END_POINT, {
      ...omit(filter, omitFiled),
      variant: router.query.variantId,
    })
  );

  useEffect(() => {
    if (router.query.variantId) {
      changeKey(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_TIMELINES_END_POINT, {
          ...omit(filter, omitFiled),
          variant: router.query.variantId,
        })
      );
    }
  }, [router.query.variantId]);

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

        changeKey(
          transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_TIMELINES_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            variant: router.query.variantId,
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

    changeKey(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_TIMELINES_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        variant: router.query.variantId,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_TIMELINES_END_POINT, {
        ...omit(defaultFilterValue, omitFiled),
        variant: router.query.variantId,
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
        <FilterWarehouseCardUnitExtend
          filter={filter}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onDateRangeChange={onFilterChangeHandler("range")}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader title={messages["table.historyList"] as string} />
          </Box>

          <WrapperTable>
            <WarehouseCardUnitExtendTable
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
