import { get, isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";
import { Stack, Button, MenuItem, Typography, Box, Tooltip } from "@mui/material";

import { LazyAutocomplete } from "compositions";
import { Select, DateRangePicker } from "components";
import { WarehouseCardFilterType } from "./WarehouseCard";

import { MEDTHOD_WAREHOUSE_CARD } from "constant";
import { CommonFilterTableProps } from "interfaces";

import { ADMIN_WAREHOUSES_RECORDS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<WarehouseCardFilterType> & {
  onSourceTypeChange: (value: any) => void;
  onRecordChange: (value: any) => void;
};

const LIST_SOURCE_TYPE_EXTENDS = [
  {
    name: "-",
    value: "",
  },
  ...MEDTHOD_WAREHOUSE_CARD,
];

const FilterWarehouseCard = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onDateRangeChange,
    onFilterByTime,
    onSourceTypeChange,
    onRecordChange,
  } = props;

  const router = useRouter();
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

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Sản phẩm
        </Typography>

        <LazyAutocomplete<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>
          {...{
            url: ADMIN_WAREHOUSES_RECORDS_END_POINT,
            placeholder: "Sản phẩm",
            AutocompleteProps: {
              renderOption(props, option) {
                const name = get(option, "variant.name");
                return (
                  <Tooltip key={option.id} title={name}>
                    <MenuItem {...props} children={name} />
                  </Tooltip>
                );
              },
              getOptionLabel: (option) => {
                const name = get(option, "variant.name");
                return name;
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }
                return option?.["id"] === value?.["id"];
              },
              onChange: (_, value) => {
                onRecordChange(value);
              },
              value: filter.record,
            },
            params: {
              warehouse: router.query.id,
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

export default FilterWarehouseCard;
