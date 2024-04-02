import { Box, Grid, Typography, styled } from "@mui/material";
import {
  ADMIN_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_END_POINT,
  ADMIN_WAREHOUSES_RECORDS_END_POINT,
} from "__generated__/END_POINT";
import {
  ADMIN_ORDER_ORDER_VIEW_TYPE_V1,
  ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1,
  ADMIN_STOCK_WAREHOUSE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { Divider, LoadingDynamic } from "components";
import { ToDoListItem } from "compositions";
import FilterTodoList from "containers/CustomerOrder/Order/FilterTodoList";
import { useFetch } from "hooks";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { Range } from "react-date-range";

interface Props {
  title: string;
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
  is_below_threshold: true,
};

export default function WarehouseTodoList({ title }: Props) {
  const { query } = useRouter();
  const [filter, setFilter] = useState<FilterTodoListType>(defaultFilterValue);

  const { data, resData, itemCount, changeKey } =
    useFetch<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
        ...filterAdminOrderDraft,
        warehouse: query.id,
      })
    );

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

  const handleDraftOrders = useCallback(() => {}, []);

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let startDate = transformDate(cloneFilter.range.startDate, "date_start");
    let endDate = transformDate(cloneFilter.range.endDate, "date_end");

    let isStartDate = cloneFilter.range.startDate;
    let isEndDate = cloneFilter.range.endDate;

    changeKey(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
        ...filterAdminOrderDraft,
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
        warehouse: query.id,
      })
    );
  }, [filter, query]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
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
                countGrid={12}
                name="Số lượng tồn kho thấp"
                borderRight={false}
                count={itemCount ?? 0}
                onClick={handleDraftOrders}
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

const StyledBox = styled(Box)(({ theme }) => {
  return {
    background: "red",
    marginBottom: "1rem",
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
