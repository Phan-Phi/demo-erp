import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { cloneDeep, get, omit, set } from "lodash";
import { useCallback, useMemo, useState } from "react";

import { Sticky } from "hocs";
import { WrapperTable } from "components";
import { useFetch, useLayout } from "hooks";
import { Box, Grid, Stack } from "@mui/material";
import { AUDIT_LOG_TYPE_V1 } from "__generated__/apiType_v1";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { ADMIN_AUDIT_LOGS_END_POINT } from "__generated__/END_POINT";

import AuditLogsColumn from "./column/AuditLogsColumn";
import FilterAuditLogs from "./FilterAuditLogs";

export type PriceComparingListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search: string;
  action_auditLog: AUDIT_LOG_TYPE_V1 | null;
  actor: AUDIT_LOG_TYPE_V1 | null;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: PriceComparingListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  actor: null,
  action_auditLog: null,
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

export default function AuditLogs() {
  const { state: layoutState } = useLayout();
  const [ref, { height: heightTable }] = useMeasure();
  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<AUDIT_LOG_TYPE_V1>(transformUrl(ADMIN_AUDIT_LOGS_END_POINT, { ...filter }));

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);
        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);
        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        set(params, "actor", get(params, "actor"));
        set(params, "action_auditLog", get(params, "action_auditLog"));

        let dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");
        let dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        changeKey(
          transformUrl(ADMIN_AUDIT_LOGS_END_POINT, {
            ...omit(params, ["range", "range_params", "action_auditLog"]),
            date_created_start: isStartDate ? dateStart : undefined,
            date_created_end: isEndDate ? dateEnd : undefined,
            action: params.action_auditLog,
            actor: params.actor ? params.actor.id : undefined,
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_AUDIT_LOGS_END_POINT, {
        ...omit(defaultFilterValue, ["range", "range_params", "action_auditLog"]),
        action: undefined,
        actor: undefined,
      })
    );
  }, [filter]);

  const onClickFilterByTime = useCallback(
    (key: string) => {
      const cloneFilter = cloneDeep(filter);
      let updateFilter = {
        ...cloneFilter,
        range_params: {
          startDate: cloneFilter.range.startDate,
          endDate: cloneFilter.range.endDate,
        },
      };
      setFilter(updateFilter);

      let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
      let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

      let isStartDate = updateFilter.range_params.startDate;
      let isEndDate = updateFilter.range_params.endDate;

      changeKey(
        transformUrl(ADMIN_AUDIT_LOGS_END_POINT, {
          ...omit(cloneFilter, ["range", "range_params", "type", "action_auditLog"]),
          date_created_start: isStartDate ? dateStart : undefined,
          date_created_end: isEndDate ? dateEnd : undefined,
          action: cloneFilter.action_auditLog,
          actor: cloneFilter.actor ? cloneFilter.actor.id : undefined,
          offset: 0,
        })
      );
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
    <Grid container>
      <Grid item xs={2}>
        <FilterAuditLogs
          filter={filter}
          resetFilter={resetFilterHandler}
          onFilterByTime={onClickFilterByTime}
          onSearch={onFilterChangeHandler("search")}
          onActorChange={onFilterChangeHandler("actor")}
          onDateRangeChange={onFilterChangeHandler("range")}
          onAction={onFilterChangeHandler("action_auditLog")}
        />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack>
            <Box ref={ref}>
              {/* <TableHeader title={"Danh sách "}></TableHeader> */}
              <Box paddingBottom={2}></Box>
            </Box>
          </Stack>
          <WrapperTable>
            <AuditLogsColumn
              data={data ?? []}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={
                layoutState.windowHeight - (heightTable + layoutState.sumHeight) - 100
              }
            />
          </WrapperTable>
        </Sticky>
      </Grid>
    </Grid>
  );
}
