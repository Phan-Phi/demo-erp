import React from "react";
import useSWR from "swr";
import { useIntl } from "react-intl";
import { get, isEmpty } from "lodash";
import { Autocomplete, Box, Button, MenuItem, Stack, Typography } from "@mui/material";

import { MapFilterType } from "./Map";
import { InputForAutocomplete, LazyAutocomplete } from "compositions";

import { transformUrl } from "libs";
import { DISTRICT, PROVINCE } from "apis";
import { CommonFilterTableProps } from "interfaces";
import { ADMIN_CUSTOMERS_TYPES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type FilterProps = CommonFilterTableProps<MapFilterType> & {
  onTypeChange: (value: any) => void;
  onProvinceChange: (value: any) => void;
  onDistrictChange: (value: any) => void;
};

export default function Filter(props: FilterProps) {
  const { resetFilter, filter, onTypeChange, onProvinceChange, onDistrictChange } = props;
  const { messages } = useIntl();

  const { data: provinceData } = useSWR(`${PROVINCE}?country=vn&step=1`);
  const { data: districtData } = useSWR(() => {
    if (filter.province) {
      const districtId = get(filter, "province[0]");

      return transformUrl(DISTRICT, {
        country: "vn",
        step: 2,
        value: districtId,
      });
    } else {
      return null;
    }
  });

  return (
    <Stack spacing={3}>
      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Nhóm khách hàng
        </Typography>

        <LazyAutocomplete<ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1>
          {...{
            url: ADMIN_CUSTOMERS_TYPES_END_POINT,
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    value={option.id}
                    children={option.name}
                    sx={{
                      marginLeft: (option.level as any) * 1.5,
                      fontWeight: (theme) => {
                        if (option.level === 0) {
                          return theme.typography.fontWeightBold;
                        } else if (option.level === 1) {
                          return theme.typography.fontWeightMedium;
                        } else {
                          return theme.typography.fontWeightRegular;
                        }
                      },
                      fontSize: (theme) => {
                        if (option.level === 0) {
                          return "16px";
                        } else if (option.level === 1) {
                          return "15px";
                        } else {
                          return "14px";
                        }
                      },
                    }}
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
              value: filter.type,
              onChange: (e, value) => {
                onTypeChange(value);
              },
            },
            params: {
              nested_depth: 1,
              use_cache: false,
            },
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Tỉnh / Thành phố
        </Typography>

        <Autocomplete
          options={provinceData}
          getOptionLabel={(option: any) => {
            return option["1"];
          }}
          renderInput={(props) => {
            return <InputForAutocomplete {...props} />;
          }}
          value={filter.province}
          onChange={(e, value) => {
            onProvinceChange(value);
          }}
        />
      </Box>

      <Box>
        <Typography fontWeight={700} marginBottom={1}>
          Quận / Huyện
        </Typography>

        <Autocomplete
          disabled={filter.province ? false : true}
          options={districtData || []}
          getOptionLabel={(option: any) => {
            return option["1"];
          }}
          renderInput={(props) => {
            return <InputForAutocomplete {...props} />;
          }}
          value={filter.district}
          onChange={(e, value) => {
            onDistrictChange(value);
          }}
        />
      </Box>

      <Button color="error" variant="contained" onClick={resetFilter}>
        {messages["removeFilter"]}
      </Button>
    </Stack>
  );
}
