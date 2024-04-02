import { isEmpty } from "lodash";
import { Stack } from "@mui/material";
import { Button, Box, Typography, MenuItem } from "@mui/material";

import { useIntl } from "react-intl";
import { SearchField } from "components";
import { LazyAutocomplete } from "compositions";
import { CommonFilterTableProps } from "interfaces";

import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";

import { ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<any> & {
  onSearchChange: (value: any) => void;
  handleAddTag: (value: any) => void;
  tag: any;

  onCategoryChange: (value: any) => void;
};

const Filter = (props: FilterProps) => {
  const { filter, resetFilter, onSearchChange, onCategoryChange, tag, handleAddTag } =
    props;

  const { messages } = useIntl();

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterProductCategory"]}
        </Typography>

        <LazyAutocomplete<Required<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1>>
          {...{
            url: ADMIN_PRODUCTS_CATEGORIES_END_POINT,
            placeholder: messages["filterProductCategory"] as string,
            shouldSearch: false,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.full_name;
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              value: filter.category,
              onChange: (e, value) => {
                onCategoryChange(value);
              },

              componentsProps: {
                popper: {
                  sx: {
                    minWidth: "250px !important",
                    left: 0,
                  },
                  placement: "bottom-start",
                },
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

export default Filter;
