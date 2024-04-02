import React from "react";
import { Stack, Box, Typography, Button } from "@mui/material";

import { DateRangePicker } from "components";
import { FilterTodoListType } from "./ToDoList";
import { CommonFilterTableProps } from "interfaces";

type FilterTodoListProps = CommonFilterTableProps<FilterTodoListType> & {};

export default function FilterTodoList(props: FilterTodoListProps) {
  const { filter, resetFilter, onDateRangeChange, onFilterByTime } = props;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Thời gian
        </Typography>

        <DateRangePicker
          ranges={[filter.range]}
          onChange={(ranges) => {
            const range = ranges.range;
            range && onDateRangeChange && onDateRangeChange(range);
          }}
          onFilterByTime={onFilterByTime}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        Bỏ Filter
      </Button>
    </Stack>
  );
}
