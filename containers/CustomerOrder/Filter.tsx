import { useIntl } from "react-intl";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { cloneDeep, get, isEmpty } from "lodash";
import { Stack, Button, Box, Typography, MenuItem } from "@mui/material";

import { SearchField, Select, DateRangePicker } from "components";
import { LazyAutocomplete, LazyAutocompleteMultiple } from "compositions";

import { useChoice } from "hooks";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { CommonFilterTableProps } from "interfaces";
import { OrderListFilterType } from "./Order/OrderList";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_TAG_GROUPS_END_POINT,
  ADMIN_TAG_GROUPS_TAGS_END_POINT,
  ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
  ADMIN_ORDERS_SHIPPING_METHODS_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
} from "__generated__/END_POINT";

import {
  TAG_GROUP_TYPE_V1,
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<OrderListFilterType> & {
  onSearchChange: any;
  onClickFilterTag: () => void;
  onTagsChange: (value: any) => void;
  onOwnerChange: (value: any) => void;
  onStatusChange: (value: any) => void;
  onProductVariantChange: (value: any) => void;
  onChannelChange: (value: any) => void;
  onShippingMethodChange: (value: any) => void;
  setFilter: Dispatch<SetStateAction<OrderListFilterType>>;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    setFilter,
    resetFilter,
    onTagsChange,
    onOwnerChange,
    onFilterByTime,
    onStatusChange,
    onSearchChange,
    onChannelChange,
    onClickFilterTag,
    onDateRangeChange,
    onProductVariantChange,
    onShippingMethodChange,
  } = props;

  const choice = useChoice();
  const { messages } = useIntl();
  const { order_statuses } = choice;
  const [tagGroupValue, setTagGroupValue] = useState<any | null>(null);

  const onChangeTagGroup = useCallback((value: any) => {
    setTagGroupValue(value);
  }, []);

  const resetTagGroup = useCallback(() => {
    setTagGroupValue(null);
  }, []);

  const renderTags = useMemo(() => {
    if (tagGroupValue == undefined) return null;

    const id = get(tagGroupValue, "id");

    return (
      <Stack gap="16px">
        <Typography fontWeight={700}>Tags</Typography>

        <LazyAutocompleteMultiple<any>
          {...{
            multiple: true,
            url: ADMIN_TAG_GROUPS_TAGS_END_POINT,
            placeholder: "Tags",
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    children={option.name}
                  />
                );
              },
              getOptionLabel: (option) => {
                return option.name;
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },
              onChange: (_, value) => {
                onTagsChange(value);
              },
              value: filter.tag_names_params,
            },
            params: {
              groups: id,
            },
          }}
        />

        <Button
          fullWidth={true}
          variant="outlined"
          onClick={onClickFilterTag}
          disabled={isEmpty(filter.tag_names_params)}
        >
          Lọc
        </Button>
      </Stack>
    );
  }, [tagGroupValue, filter]);

  return (
    <Stack spacing={3}>
      <Stack spacing={2}>
        <Typography fontWeight={700}>Tìm kiếm</Typography>

        <SearchField
          isShowIcon={false}
          initSearch={filter.search}
          onChange={onSearchChange}
          placeholder="Tìm kiếm"
        />
      </Stack>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterProduct"]}
        </Typography>

        <LazyAutocomplete<Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>>
          {...{
            url: ADMIN_PRODUCTS_VARIANTS_END_POINT,
            placeholder: messages["filterProduct"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    children={option.name}
                  />
                );
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              getOptionLabel: (option) => {
                return option.name;
              },

              onChange: (e, value) => {
                onProductVariantChange(value);
              },
              value: filter.product_variant,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["datePlaced"]}
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
          {messages["filterOwner"]}
        </Typography>

        <LazyAutocomplete<ADMIN_USER_USER_VIEW_TYPE_V1>
          {...{
            url: ADMIN_USERS_END_POINT,
            placeholder: messages["filterOwner"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                const fullName = `${get(option, "last_name")} ${get(
                  option,
                  "first_name"
                )}`;

                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    children={fullName}
                  />
                );
              },

              getOptionLabel: (option) => {
                const fullName = `${get(option, "last_name")} ${get(
                  option,
                  "first_name"
                )}`;

                return fullName;
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              onChange: (e, value) => {
                onOwnerChange(value);
              },
              value: filter.owner,
            },
            // params: {
            //   nested_depth: 1,
            // },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterChannel"]}
        </Typography>

        <LazyAutocomplete<ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1>
          {...{
            url: ADMIN_ORDERS_PURCHASE_CHANNELS_END_POINT,
            placeholder: messages["filterChannel"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    value={option.id}
                    key={option.id}
                    children={option.name}
                  />
                );
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              getOptionLabel: (option) => {
                return option.name;
              },

              onChange: (e, value) => {
                onChannelChange(value);
              },
              value: filter.channel,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterOrderStatus"]}
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return order_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.status,
              onChange(event) {
                onStatusChange(event.target.value);
              },
              placeholder: messages["filterOrderStatus"] as string,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterShippingMethod"]}
        </Typography>

        <LazyAutocomplete<ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1>
          {...{
            url: ADMIN_ORDERS_SHIPPING_METHODS_END_POINT,
            placeholder: messages["filterShippingMethod"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                return <MenuItem {...props} value={option.id} children={option.name} />;
              },

              getOptionLabel: (option) => {
                return option.name;
              },

              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },

              onChange: (e, value) => {
                onShippingMethodChange(value);
              },
              value: filter.shipping_method,
            },
            params: {
              nested_depth: 1,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Nhóm tags
        </Typography>

        <LazyAutocomplete<TAG_GROUP_TYPE_V1>
          {...{
            url: ADMIN_TAG_GROUPS_END_POINT,
            placeholder: "Nhóm tags",
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    children={option.name}
                  />
                );
              },
              getOptionLabel: (option) => {
                return option.name;
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },
              onChange: (e, value) => {
                const cloneFilter = cloneDeep(filter);

                const updateFilter = {
                  ...cloneFilter,
                  tag_names_params: [],
                };

                setFilter(updateFilter);

                onChangeTagGroup(value);
              },
              value: tagGroupValue,
            },
            params: {
              source_type: SOURCE_TYPE_FOR_TAGS.order,
            },
          }}
        />
      </Box>

      {renderTags}

      <Button
        color="error"
        variant="contained"
        onClick={() => {
          resetFilter();
          resetTagGroup();
        }}
      >
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
};

export default Filter;
