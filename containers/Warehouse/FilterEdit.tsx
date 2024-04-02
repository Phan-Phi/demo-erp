import { useIntl } from "react-intl";
import { Box, Button, MenuItem, Stack, Typography } from "@mui/material";

import { SearchField, Select } from "components";
import { CommonFilterTableProps } from "interfaces";
import { IS_BELOW_THRESHOLD_TYPE } from "constant";
import { EditWarehouseTableFilterType } from "./columns/EditWarehouseTable";

type FilterProps = CommonFilterTableProps<EditWarehouseTableFilterType> & {
  onSearchChange: any;
  onChangeIsBelowThreshold: (value: any) => void;
};

const FilterEdit = (props: FilterProps) => {
  const { filter, onSearchChange, onChangeIsBelowThreshold, resetFilter } = props;

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
          Trạng thái tồn kho thấp
        </Typography>

        <Select
          {...{
            renderItem() {
              return IS_BELOW_THRESHOLD_TYPE.map((item, index) => {
                return <MenuItem key={index} value={item.value} children={item.name} />;
              });
            },

            SelectProps: {
              value: filter.is_below_threshold || "",
              onChange: (e) => {
                onChangeIsBelowThreshold(e.target.value);
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

export default FilterEdit;
