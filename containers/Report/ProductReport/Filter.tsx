import { useState } from "react";
import { Stack, Button, Card, CardHeader, CardContent, MenuItem } from "@mui/material";

import { useChoice } from "hooks";
import { useIntl } from "react-intl";
import { LazyAutocomplete } from "compositions";
import { SearchField, DateRangePicker } from "components";

import {
  ADMIN_PRICE_TABLES_END_POINT,
  ADMIN_PRODUCTS_CATEGORIES_END_POINT,
} from "__generated__/END_POINT";

type FilterProps = {
  onFilterByTime: any;
  onDateRangeChange: any;
  onFilterDateHandler: any;
  filterDate: any;
  filter: any;
  onCategoryChange: any;
  resetFilter: (value: any) => void;
  onSearch: (value: string | undefined) => void;
  onPriceTablesChange: any;
  viewType: string;
};

const Filter = ({
  viewType,
  filterDate,
  onFilterByTime,
  onFilterDateHandler,
  resetFilter,
  onSearch,
  onPriceTablesChange,
  onCategoryChange,
  filter,
}: FilterProps) => {
  const choice = useChoice();
  const { messages } = useIntl();

  const [isReady, setIsReady] = useState(true);

  if (!isReady) return null;

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title={messages["filterProductCategory"]} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <LazyAutocomplete<any>
            {...{
              url: ADMIN_PRODUCTS_CATEGORIES_END_POINT,
              placeholder: "Danh mục sản phẩm",
              AutocompleteProps: {
                getOptionLabel: (option) => {
                  return filter.category ? filter.category.name : option.name;
                },
                onChange: (_, value) => {
                  onCategoryChange(value);
                },
                value: filter.category,
              },
              initValue: null,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={"Bảng giá"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <LazyAutocomplete<any>
            {...{
              url: ADMIN_PRICE_TABLES_END_POINT,
              placeholder: "Bảng giá",

              AutocompleteProps: {
                disabled:
                  viewType === "warehouse_value" || viewType === "import_export_stock"
                    ? true
                    : false,
                renderOption(props, option) {
                  return <MenuItem {...props} value={option.id} children={option.name} />;
                },
                getOptionLabel: (option) => {
                  return filter.price_tables ? filter.price_tables.name : option.name;
                },
                onChange: (_, value) => {
                  onPriceTablesChange(value);
                },
                value: filter.price_tables,
              },
              initValue: null,
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={"Tìm kiếm"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <SearchField
            isShowIcon={false}
            initSearch={filter.search}
            onChange={(value) => {
              onSearch(value);
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader title={"Theo thời gian xác nhận"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <DateRangePicker
            ranges={[filterDate.range]}
            onChange={(ranges) => {
              const range = ranges.range;
              range && onFilterDateHandler && onFilterDateHandler(range);
            }}
            onFilterByTime={onFilterByTime}
          />
        </CardContent>
      </Card>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
