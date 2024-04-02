import { useIntl } from "react-intl";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { CommonFilterTableProps } from "interfaces";
import { OutnoteListFilterType } from "./OutnoteList";
import { DIRECTION_TYPE, REASON_TYPE } from "constant";
import { SearchField, Select, DateRangePicker } from "components";

type FilterProps = CommonFilterTableProps<OutnoteListFilterType> & {
  onSearchChange: (value: any) => void;
  onChangeDirection: (value: any) => void;
  onChangeReason: (value: any) => void;
};

const LIST_DIRECTION_EXTENDS = [
  {
    name: "-",
    value: "",
  },
  ...DIRECTION_TYPE,
];

const LIST_REASON_EXTENDS = [
  {
    name: "-",
    value: "",
  },
  ...REASON_TYPE,
];

const Filter = (props: FilterProps) => {
  const {
    filter,
    onSearchChange,
    resetFilter,
    onDateRangeChange,
    onFilterByTime,
    onChangeDirection,
    onChangeReason,
  } = props;

  const { messages } = useIntl();

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
        placeholder="Tìm kiếm"
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Loại điều chỉnh
        </Typography>

        <Select
          {...{
            renderItem() {
              return LIST_DIRECTION_EXTENDS.map((item, index) => {
                return <MenuItem key={index} value={item.value} children={item.name} />;
              });
            },

            SelectProps: {
              value: filter.direction || "",
              onChange: (e) => {
                onChangeDirection(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Lý do
        </Typography>

        <Select
          {...{
            renderItem() {
              return LIST_REASON_EXTENDS.map((item, index) => {
                return <MenuItem key={index} value={item.value} children={item.name} />;
              });
            },

            SelectProps: {
              value: filter.reasons || "",
              onChange: (e) => {
                onChangeReason(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["dateCreated"]}
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

export default Filter;
