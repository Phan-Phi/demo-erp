import { useIntl } from "react-intl";
import { cloneDeep, get, isEmpty } from "lodash";
import { Stack, Button, Typography, MenuItem, Box } from "@mui/material";
import React, { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { DateRangePicker } from "components";
import { LazyAutocomplete, LazyAutocompleteMultiple } from "compositions";
import { ListPurchaseRequestSummaryType } from "../ListPurchaseRequestSummary";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_TAG_GROUPS_END_POINT,
  ADMIN_TAG_GROUPS_TAGS_END_POINT,
} from "__generated__/END_POINT";

import {
  TAG_GROUP_TYPE_V1,
  ADMIN_USER_USER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { CommonFilterTableProps } from "interfaces";

type FilterProps = CommonFilterTableProps<ListPurchaseRequestSummaryType> & {
  onClickFilterTag: () => void;
  onOwnerChange: (value: any) => void;
  onTagsChange: (value: any) => void;
  onFilterByTime: () => void;
  setFilter: Dispatch<SetStateAction<ListPurchaseRequestSummaryType>>;
};

export default function FilterPurchaseRequestSummary(props: FilterProps) {
  const {
    filter,
    setFilter,
    resetFilter,
    onTagsChange,
    onOwnerChange,
    onClickFilterTag,
    onDateRangeChange,
    onFilterByTime,
  } = props;

  const { messages } = useIntl();
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
              source_type: SOURCE_TYPE_FOR_TAGS.purchase_request,
            },
          }}
        />
      </Box>

      {renderTags}

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Người tạo
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
}
