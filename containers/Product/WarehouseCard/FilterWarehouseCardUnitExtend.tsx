import { useIntl } from "react-intl";
import { Stack, Button, Typography, Box } from "@mui/material";

import { CommonFilterTableProps } from "interfaces";

import { DateRangePicker } from "components";
import { WarehouseCardUnitExtendFilterType } from "./WarehouseCardUnitExtend";

type FilterProps = CommonFilterTableProps<WarehouseCardUnitExtendFilterType> & {};

const FilterWarehouseCardUnitExtend = (props: FilterProps) => {
  const { filter, resetFilter, onDateRangeChange, onFilterByTime } = props;

  const { messages } = useIntl();

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
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default FilterWarehouseCardUnitExtend;
