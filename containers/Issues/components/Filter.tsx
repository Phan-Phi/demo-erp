import { Box, Button, MenuItem, Stack, Typography } from "@mui/material";
import {
  ADMIN_TAG_GROUPS_END_POINT,
  ADMIN_TAG_GROUPS_TAGS_END_POINT,
} from "__generated__/END_POINT";
import { TAG_GROUP_TYPE_V1 } from "__generated__/apiType_v1";
import { DateRangePicker, SearchField } from "components";
import { LazyAutocomplete, LazyAutocompleteMultiple, TagsModal } from "compositions";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { OrderListFilterType } from "containers/CustomerOrder/Order/OrderList";
import { cloneDeep, get, isEmpty } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useIntl } from "react-intl";

interface Props {
  filter: any;
  onSearch: (value: string | undefined) => void;
  onClickFilterTag: () => void;
  onTagsChange: (value: any) => void;

  setFilter: any;
}

export default function Filter({
  filter,
  setFilter,
  onTagsChange,
  onClickFilterTag,
  onSearch,
  onDateRangeChange,
  onFilterByTime,
  resetFilter,
}: any) {
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
      <Stack spacing={2}>
        <Typography fontWeight={700}>Tìm kiếm</Typography>
        <SearchField
          isShowIcon={false}
          initSearch={filter.search}
          onChange={(value) => {
            onSearch(value);
          }}
        />
      </Stack>

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
              source_type: SOURCE_TYPE_FOR_TAGS.issue,
            },
          }}
        />
      </Box>

      {renderTags}

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
