import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { cloneDeep, isEmpty, get } from "lodash";
import { Stack, Button, MenuItem, Typography, Box } from "@mui/material";

import { useChoice } from "hooks";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { ChoiceItem, CommonFilterTableProps } from "interfaces";

import { DraftListFilterType } from "./DraftList";
import { SearchField, Select, DateRangePicker } from "components";
import { LazyAutocomplete, LazyAutocompleteMultiple } from "compositions";

import {
  ADMIN_USERS_END_POINT,
  ADMIN_TAG_GROUPS_END_POINT,
  ADMIN_CUSTOMERS_TYPES_END_POINT,
  ADMIN_TAG_GROUPS_TAGS_END_POINT,
} from "__generated__/END_POINT";

import {
  TAG_GROUP_TYPE_V1,
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<DraftListFilterType> & {
  onChangeSearch: (value: any) => void;
  onChangeGender: (value: any) => void;
  onChangeStatus: (value: any) => void;
  onChangeUserType: (value: any) => void;
  onBirthDayChange: (range: Range) => void;
  onChangeCustomerType: (value: any) => void;
  onClickFilterTag: () => void;
  onTagsChange: (value: any) => void;
  onClickFilterBirthDay: any;
  setFilter: Dispatch<SetStateAction<DraftListFilterType>>;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    setFilter,
    resetFilter,
    onChangeSearch,
    onChangeGender,
    onChangeStatus,
    onFilterByTime,
    onChangeUserType,
    onBirthDayChange,
    onDateRangeChange,
    onChangeCustomerType,
    onClickFilterBirthDay,
    onClickFilterTag,
    onTagsChange,
  } = props;

  const choice = useChoice();
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

  const inBusinessList = [
    ["true", "onBusiness"],
    ["false", "offBusiness"],
  ] as ChoiceItem[];

  const { genders } = choice;

  return (
    <Stack spacing={3}>
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onChangeSearch}
      />

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

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterGender"]}
        </Typography>

        <Select
          {...{
            renderItem() {
              return genders.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            },

            SelectProps: {
              value: filter.gender || "",
              onChange: (e) => {
                onChangeGender(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterInBusiness"]}
        </Typography>

        <Select
          {...{
            renderItem() {
              return inBusinessList.map((el) => {
                return (
                  <MenuItem key={el[0]} value={el[0]}>
                    {messages[el[1]]}
                  </MenuItem>
                );
              });
            },

            SelectProps: {
              value: filter.in_business || "",
              onChange: (e) => {
                onChangeStatus(e.target.value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterCustomerType"]}
        </Typography>

        <LazyAutocomplete<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1>
          {...{
            url: ADMIN_CUSTOMERS_TYPES_END_POINT,
            placeholder: messages["filterCustomerType"] as string,
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
                onChangeCustomerType(value);
              },

              value: filter.type,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterSaleInCharge"]}
        </Typography>

        <LazyAutocomplete<ADMIN_USER_USER_VIEW_TYPE_V1>
          {...{
            url: ADMIN_USERS_END_POINT,
            placeholder: messages["filterSaleInCharge"] as string,
            AutocompleteProps: {
              renderOption(props, option) {
                const lastName = get(option, "last_name");
                const firstName = get(option, "first_name");

                const fullName = `${lastName} ${firstName}`;

                return (
                  <MenuItem
                    {...props}
                    key={option.id}
                    value={option.id}
                    children={fullName}
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
                const lastName = get(option, "last_name");
                const firstName = get(option, "first_name");

                const fullName = `${lastName} ${firstName}`;

                return fullName;
              },

              value: filter.sales_in_charge,
              onChange: (e, value) => {
                onChangeUserType(value);
              },
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["birthday"]}
        </Typography>

        <DateRangePicker
          ranges={[filter.birthday]}
          onChange={(ranges) => {
            const range = ranges.birthday;
            range && onBirthDayChange && onBirthDayChange(range);
          }}
          onFilterByTime={onClickFilterBirthDay}
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
              source_type: SOURCE_TYPE_FOR_TAGS.customer,
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
