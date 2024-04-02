import { useIntl } from "react-intl";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { MEDTHOD_WAREHOUSE_CARD } from "constant";
import { CommonFilterTableProps } from "interfaces";

import { Select, DateRangePicker } from "components";
import { WarehouseCardVariantFilterType } from "./WarehouseCardVariant";

type FilterProps = CommonFilterTableProps<WarehouseCardVariantFilterType> & {
  onSourceTypeChange: (value: any) => void;
};

const LIST_SOURCE_TYPE_EXTENDS = [
  {
    name: "-",
    value: "",
  },
  ...MEDTHOD_WAREHOUSE_CARD,
];

const FilterWarehouseCardVariant = (props: FilterProps) => {
  const { filter, resetFilter, onDateRangeChange, onFilterByTime, onSourceTypeChange } =
    props;

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

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Phương thức
        </Typography>

        <Select
          {...{
            renderItem() {
              return LIST_SOURCE_TYPE_EXTENDS.map((item, index) => {
                return <MenuItem key={index} value={item.value} children={item.name} />;
              });
            },

            SelectProps: {
              value: filter.source_type || "",
              onChange: (e) => {
                onSourceTypeChange(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default FilterWarehouseCardVariant;
