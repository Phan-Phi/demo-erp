import { useIntl } from "react-intl";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

import { cloneDeep, get, isEmpty } from "lodash";
import { Stack, Button, Box, Typography, MenuItem } from "@mui/material";

import { PartnerFilterType } from "./PartnerList";
import { CommonFilterTableProps } from "interfaces";
import { FilterByPriceRangeV2, SearchField } from "components";
import { LazyAutocomplete, LazyAutocompleteMultiple } from "compositions";

import {
  ADMIN_TAG_GROUPS_END_POINT,
  ADMIN_TAG_GROUPS_TAGS_END_POINT,
} from "__generated__/END_POINT";
import { TAG_GROUP_TYPE_V1 } from "__generated__/apiType_v1";
import { SOURCE_TYPE_FOR_TAGS } from "constant";

type FilterProps = CommonFilterTableProps<PartnerFilterType> & {
  onSearchChange: (value: any) => void;
  onFilterDebt: () => void;
  onFilterPurchase: () => void;
  onChangePriceStart: any;
  onChangePriceEnd: any;
  onChangePurchaseStart: any;
  onChangePurchaseEnd: any;
  onTagsChange: (value: any) => void;
  onClickFilterTag: () => void;
  setFilter: Dispatch<SetStateAction<PartnerFilterType>>;
};

const Filter = (props: FilterProps) => {
  const {
    filter,
    resetFilter,
    onSearchChange,
    onFilterDebt,
    onChangePriceStart,
    onChangePriceEnd,
    onFilterPurchase,
    onChangePurchaseStart,
    onChangePurchaseEnd,
    onTagsChange,
    onClickFilterTag,
    setFilter,
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
      <SearchField
        isShowIcon={false}
        initSearch={filter.search}
        onChange={onSearchChange}
      />

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          {messages["filterTotalDebtAmount"]}
        </Typography>

        <FilterByPriceRangeV2
          initPriceStart={filter.total_debt_amount_start}
          initPriceEnd={filter.total_debt_amount_end}
          onChangePriceStart={onChangePriceStart}
          onChangePriceEnd={onChangePriceEnd}
          onFilterPrice={onFilterDebt}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Tổng mua
        </Typography>

        <FilterByPriceRangeV2
          initPriceStart={filter.total_purchase_start}
          initPriceEnd={filter.total_purchase_end}
          onChangePriceStart={onChangePurchaseStart}
          onChangePriceEnd={onChangePurchaseEnd}
          onFilterPrice={onFilterPurchase}
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
              source_type: SOURCE_TYPE_FOR_TAGS.partner,
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
