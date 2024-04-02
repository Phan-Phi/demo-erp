import { useState } from "react";
import { useIntl } from "react-intl";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { useChoice } from "hooks";
import { LazyAutocomplete } from "compositions";
import { DateRangePicker, Select } from "components";
import { ADMIN_USERS_END_POINT } from "__generated__/END_POINT";

type FilterProps = {
  filter: any;
  onFilterByTime: any;
  onDateRangeChange: any;
  resetFilter: (value: any) => void;
  onSearch: (value: string | undefined) => void;
  onAction: (value: unknown) => void;
  onActorChange: (value: unknown) => void;
};

const actionType = [
  ["create", "Tạo"],
  ["update", "Chỉnh sửa"],
  ["delete", "Xoá"],
];

const FilterAuditLogs = ({
  onAction,
  filter,
  resetFilter,
  onActorChange,
  onFilterByTime,
  onDateRangeChange,
  onSearch,
}: FilterProps) => {
  const choice = useChoice();
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  if (!isReady) return null;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Nhân viên
        </Typography>
        <LazyAutocomplete<any>
          {...{
            url: ADMIN_USERS_END_POINT,
            placeholder: "Nhân viên",
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.email} />;
              },
              getOptionLabel: (option) => {
                return filter.actor ? filter.actor.email : option.email;
              },
              onChange: (_, value) => {
                onActorChange(value);
              },
              value: filter.actor,
            },
            initValue: null,
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Thao tác
        </Typography>

        <Select
          renderItem={() => {
            return actionType.map((el) => {
              return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
            });
          }}
          SelectProps={{
            onChange: (e) => {
              onAction(e.target.value);
            },
            value: filter.action_auditLog,
            placeholder: "Thao tác",
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Theo thời gian xác nhận
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

export default FilterAuditLogs;
