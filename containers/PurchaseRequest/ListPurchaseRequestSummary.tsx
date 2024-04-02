import dynamic from "next/dynamic";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { endOfDay, startOfDay } from "date-fns";
import { Stack, Box, Grid } from "@mui/material";
import { get, set, cloneDeep, omit } from "lodash";
import React, { useCallback, useMemo, useState } from "react";

import {
  transformUrl,
  transformDate,
  setFilterValue,
  convertTagsNameToString,
} from "libs";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { useFetch, useLayout, useToggle } from "hooks";

import { LoadingDynamic, TableHeader, WrapperTable } from "components";
import PurchaseRequestSummaryTable from "./components/PurchaseRequestSummaryTable";
import FilterPurchaseRequestSummary from "./components/FilterPurchaseRequestSummary";

import {
  PurchaseRequestSummary,
  ADMIN_USER_USER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_PURCHASE_REQUESTS_SUMMARY_END_POINT } from "__generated__/END_POINT";

const TagsModal = dynamic(import("../../compositions/TagsModal/TagsModal"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

export type ListPurchaseRequestSummaryType = {
  page: number;
  page_size: number;
  with_count: boolean;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  tag_names_params: any[];
  tag_names: string;
  owner: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
};

const defaultFilterValue: ListPurchaseRequestSummaryType = {
  page: 1,
  page_size: 25,
  with_count: true,
  range: {
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
    key: "range",
  },
  range_params: {
    startDate: startOfDay(new Date()),
    endDate: endOfDay(new Date()),
  },
  tag_names_params: [],
  tag_names: "",
  owner: null,
};

const omitFields = ["range", "range_params", "tag_names_params"];

export default function ListPurchaseRequestSummary() {
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();

  const {
    open: isOpenTagsModal,
    onOpen: onOpenTagsModal,
    onClose: onCloseTagsModal,
  } = useToggle();

  const [objectId, setObjectId] = useState(0);
  const [filter, setFilter] =
    useState<ListPurchaseRequestSummaryType>(defaultFilterValue);

  const [currentStartDay] = useState(transformDate(startOfDay(new Date()), "date_start"));
  const [currentEndDay] = useState(transformDate(endOfDay(new Date()), "date_end"));

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<PurchaseRequestSummary>(
      transformUrl(ADMIN_PURCHASE_REQUESTS_SUMMARY_END_POINT, {
        ...omit(filter, omitFields),
        date_created_start: currentStartDay,
        date_created_end: currentEndDay,
      })
    );

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

        set(params, "owner", get(params, "owner.id"));

        changeKey(
          transformUrl(ADMIN_PURCHASE_REQUESTS_SUMMARY_END_POINT, {
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

    set(params, "owner", get(params, "owner.id"));

    changeKey(
      transformUrl(ADMIN_PURCHASE_REQUESTS_SUMMARY_END_POINT, {
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
    set(params, "owner", get(params, "owner.id"));

    changeKey(
      transformUrl(ADMIN_PURCHASE_REQUESTS_SUMMARY_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    changeKey(
      transformUrl(ADMIN_PURCHASE_REQUESTS_SUMMARY_END_POINT, {
        ...omit(defaultFilterValue, omitFields),
        date_created_start: currentStartDay,
        date_created_end: currentEndDay,
      })
    );
  }, [currentStartDay, currentEndDay]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const onViewTagsHandler = useCallback((id: number) => {
    setObjectId(id);
    onOpenTagsModal();
  }, []);

  return (
    <Box>
      <TagsModal
        objectId={objectId}
        open={isOpenTagsModal}
        refreshData={refreshData}
        onClose={onCloseTagsModal}
        source_type={SOURCE_TYPE_FOR_TAGS.purchase_request}
      />

      <Grid container>
        <Grid item xs={2}>
          <FilterPurchaseRequestSummary
            filter={filter}
            setFilter={setFilter}
            resetFilter={resetFilterHandler}
            onClickFilterTag={onClickFilterTag}
            onFilterByTime={onClickFilterByTime}
            onOwnerChange={onFilterChangeHandler("owner")}
            onDateRangeChange={onFilterChangeHandler("range")}
            onTagsChange={onFilterChangeHandler("tag_names_params")}
          />
        </Grid>
        <Grid item xs={10}>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader title="Thống kê" />
            </Box>

            <WrapperTable>
              <PurchaseRequestSummaryTable
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                onViewTagsHandler={onViewTagsHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
              />
            </WrapperTable>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
