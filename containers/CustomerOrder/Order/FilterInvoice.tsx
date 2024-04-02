import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { cloneDeep, get, isEmpty } from "lodash";
import { Box, MenuItem, Stack, Typography, Button } from "@mui/material";

import { LazyAutocomplete, LazyAutocompleteMultiple } from "compositions";
import { ButtonReset, DateRangePicker, SearchField, Select } from "components";

import { useChoice } from "hooks";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { CommonFilterTableProps } from "interfaces";
import { InvoiceListFilterType } from "./InvoiceList";

import {
  ADMIN_TAG_GROUPS_END_POINT,
  ADMIN_ORDERS_SHIPPERS_END_POINT,
  ADMIN_TAG_GROUPS_TAGS_END_POINT,
} from "__generated__/END_POINT";

import {
  TAG_GROUP_TYPE_V1,
  ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<InvoiceListFilterType> & {
  onSearchChange: any;
  onClickFilterTag: () => void;
  onTagsChange: (value: any) => void;
  onStatusChange: (value: any) => void;
  onShipperChange: (value: any) => void;
  onShippingStatusChange: (value: any) => void;
  setFilter: Dispatch<SetStateAction<InvoiceListFilterType>>;
};

export default function FilterInvoice(props: FilterProps) {
  const {
    filter,
    setFilter,
    resetFilter,
    onTagsChange,
    onStatusChange,
    onFilterByTime,
    onSearchChange,
    onShipperChange,
    onClickFilterTag,
    onDateRangeChange,
    onShippingStatusChange,
  } = props;

  const choice = useChoice();
  const { invoice_statuses, shipping_statuses } = choice;
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
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
        placeholder="Tìm kiếm"
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Trạng thái hóa đơn
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return invoice_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.status,
              onChange(event) {
                onStatusChange(event.target.value);
              },
              placeholder: "Trạng thái hóa đơn",
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Trạng thái giao hàng
        </Typography>

        <Select
          {...{
            renderItem: () => {
              return shipping_statuses.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },
            SelectProps: {
              value: filter.shipping_status,
              onChange(event) {
                onShippingStatusChange(event.target.value);
              },
              placeholder: "Trạng thái giao hàng",
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Người giao hàng
        </Typography>

        <LazyAutocomplete<ADMIN_SHIPPING_SHIPPER_VIEW_TYPE_V1>
          url={ADMIN_ORDERS_SHIPPERS_END_POINT}
          placeholder="Người giao hàng"
          AutocompleteProps={{
            value: filter.shipper,
            onChange: (_, value) => {
              onShipperChange(value);
            },

            renderOption: (props, option) => {
              return (
                <MenuItem
                  {...props}
                  key={option.id}
                  value={option?.id}
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
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Ngày tạo
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
              source_type: SOURCE_TYPE_FOR_TAGS.orderInvoice,
            },
          }}
        />
      </Box>

      {renderTags}

      <ButtonReset
        onClick={() => {
          resetFilter();
          resetTagGroup();
        }}
      />
    </Stack>
  );
}
