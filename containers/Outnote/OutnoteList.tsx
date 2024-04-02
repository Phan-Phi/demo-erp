import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Typography, Box } from "@mui/material";

import Filter from "./Filter";
import OutnoteTable from "./OutnoteTable";
import { LoadingButton, TableHeader } from "components";

import {
  checkResArr,
  deleteRequest,
  transformDate,
  setFilterValue,
  createLoadingList,
} from "libs";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import { Sticky } from "hocs";
import { transformUrl } from "libs";
import DynamicMessage from "messages";
import { OUTNOTES, CREATE } from "routes";

import { ADMIN_WAREHOUSES_OUT_NOTES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type OutnoteListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  search: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  direction: string;
  reasons: string;
};

const defaultFilterValue: OutnoteListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  search: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
  direction: "",
  reasons: "",
};

const omitFields = ["range", "range_params"];

const OutnoteList = () => {
  const { hasPermission: writePermission } = usePermission("write_stock_out_note");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [filter, setFilter] = useState<OutnoteListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, omit(filter, omitFields))
    );

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
          transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, {
            ...omit(cloneFilter, omitFields),
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
      transformUrl(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, {
        ...omit(cloneFilter, omitFields),
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(
        ADMIN_WAREHOUSES_OUT_NOTES_END_POINT,
        omit(defaultFilterValue, omitFields)
      )
    );
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_STOCK_STOCK_OUT_NOTE_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_WAREHOUSES_OUT_NOTES_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "phiếu điều chỉnh tồn kho",
              })
            );
            refreshData();

            onClose();
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
        }
      };

      onConfirm(handler, {
        message: "Bạn có chắc muốn xóa",
      });
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onSearchChange={onFilterChangeHandler("search")}
          onChangeReason={onFilterChangeHandler("reasons")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onChangeDirection={onFilterChangeHandler("direction")}
        />
      </Grid>

      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={"Danh sách phiếu điều chỉnh tồn kho"}
                pathname={`/${OUTNOTES}/${CREATE}`}
              />
            </Box>

            <OutnoteTable
              data={data ?? []}
              count={itemCount}
              messages={messages}
              isLoading={isLoading}
              pagination={pagination}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 48}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
                  </Stack>
                );
              }}
            />
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
};

export default OutnoteList;
