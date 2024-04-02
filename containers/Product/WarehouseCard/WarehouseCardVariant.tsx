import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useRouter } from "next/router";
import { Range } from "react-date-range";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, get, omit } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import { TableHeader, WrapperTable } from "components";
import WarehouseCardVariantTable from "./WarehouseCardVariantTable";
import FilterWarehouseCardVariant from "./FilterWarehouseCardVariant";

import { useFetch, useLayout } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { useWarehouseCardVariant } from "./context/WarehouseCardVariantContext";

import { ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type WarehouseCardVariantFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  variant: number | undefined;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  source_type: string;
  nested_depth: number;
};

const defaultFilterValue: WarehouseCardVariantFilterType = {
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
  source_type: "",
  nested_depth: 3,
};

const omitFiled = ["range", "range_params"];

export default function WarehouseCardVariant() {
  const { messages } = useIntl();
  const router = useRouter();
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();

  const { setData } = useWarehouseCardVariant();

  const [filter, setFilter] =
    useState<WarehouseCardVariantFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
        ...omit(filter, omitFiled),
        variant: router.query.variantId,
      })
    );

  const {
    data: dataNextPage,
    changeKey: changKeyNextPage,
    resData,
    isLoading: isLoadingQuantity,
  } = useFetch<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
      ...omit(filter, omitFiled),
      variant: router.query.variantId,
    })
  );

  useEffect(() => {
    if (router.query.variantId) {
      changeKey(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
          ...omit(filter, omitFiled),
          variant: router.query.variantId,
        })
      );

      changKeyNextPage(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
          ...omit(filter, omitFiled),
          variant: router.query.variantId,
        })
      );
    }
  }, [router.query.variantId]);

  useEffect(() => {
    if (resData == undefined) return;

    const next = get(resData, "next");

    if (next) {
      let startDate = transformDate(filter.range_params.startDate, "date_start");
      let endDate = transformDate(filter.range_params.endDate, "date_end");

      let isStartDate = filter.range_params.startDate;
      let isEndDate = filter.range_params.endDate;

      changKeyNextPage(
        transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
          ...omit(filter, omitFiled),
          variant: router.query.variantId,
          date_created_start: isStartDate ? startDate : undefined,
          date_created_end: isEndDate ? endDate : undefined,
          page: filter.page + 1,
        })
      );
    }
  }, [filter, resData]);

  useEffect(() => {
    if (dataNextPage == undefined || data == undefined) return;

    const mergeArr = [...data, dataNextPage[0]];

    setData(mergeArr);
  }, [dataNextPage, data]);

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
          transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            variant: router.query.variantId,
            date_created_start: isStartDate ? startDate : undefined,
            date_created_end: isEndDate ? endDate : undefined,
          })
        );

        changKeyNextPage(
          transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
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
      transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
        ...omit(cloneFilter, omitFiled),
        variant: router.query.variantId,
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );

    changKeyNextPage(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
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
      transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
        ...omit(defaultFilterValue, omitFiled),
        variant: router.query.variantId,
      })
    );

    changKeyNextPage(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_TIMELINES_END_POINT, {
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
        <FilterWarehouseCardVariant
          filter={filter}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onDateRangeChange={onFilterChangeHandler("range")}
          onSourceTypeChange={onFilterChangeHandler("source_type")}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader title={messages["table.historyList"] as string} />
          </Box>

          <WrapperTable>
            <WarehouseCardVariantTable
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              isLoadingQuantity={isLoadingQuantity}
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
