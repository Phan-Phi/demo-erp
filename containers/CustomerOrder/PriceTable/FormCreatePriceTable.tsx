import React from "react";
import { Controller, Control, UseFormWatch } from "react-hook-form";

import { isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import { PRICE_TYPE } from "constant";
import { FormControlForSelect, LazyAutocomplete } from "compositions";

import { PRICE_TABLE_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRICE_TABLES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_PRICE_RULES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type FormCreatePriceTableProps = {
  control: any;
  watch: any;
};

export default function FormCreatePriceTable(props: FormCreatePriceTableProps) {
  const control = props.control as Control<ADMIN_ORDERS_PRICE_RULES_POST_YUP_SCHEMA_TYPE>;
  const watch =
    props.watch as UseFormWatch<ADMIN_ORDERS_PRICE_RULES_POST_YUP_SCHEMA_TYPE>;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="source_type"
          render={(props) => {
            return (
              <FormControlForSelect
                label="Loại thay đổi giá"
                controlState={props}
                renderItem={() => {
                  return PRICE_TYPE.map((item, index) => {
                    return (
                      <MenuItem key={index} value={item.value}>
                        {item.name}
                      </MenuItem>
                    );
                  });
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        {watch("source_type") === "price_table.pricetable" && (
          <Controller
            control={control}
            name="source_id"
            render={(props) => {
              const { field, fieldState } = props;
              const { value, onChange } = field;
              const { error } = fieldState;

              return (
                <LazyAutocomplete<PRICE_TABLE_TYPE_V1>
                  error={error}
                  label="ID"
                  placeholder="ID"
                  url={ADMIN_PRICE_TABLES_END_POINT}
                  AutocompleteProps={{
                    value: value,
                    onChange: (_, value) => {
                      onChange(value);
                    },
                    renderOption(props, option) {
                      return (
                        <MenuItem
                          {...props}
                          key={option.id}
                          value={option.id}
                          children={`${option.id}: ${option.name}`}
                        />
                      );
                    },
                    getOptionLabel: (option) => {
                      return `${option.id}: ${option.name}`;
                    },
                    isOptionEqualToValue: (option, value) => {
                      if (isEmpty(option) || isEmpty(value)) {
                        return true;
                      }

                      return option?.["id"] === value?.["id"];
                    },
                  }}
                />
              );
            }}
          />
        )}

        {/*Coming soon  */}
        {/* {watch("source_type") === "discount.voucher" && (
      <Controller
        control={control}
        name="source_id"
        render={(props) => {
          const { field, fieldState } = props;
          const { value, onChange } = field;
          const { error } = fieldState;

          return (
            <LazyAutocomplete<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1>
              error={error}
              label="ID"
              placeholder="ID"
              url={ADMIN_DISCOUNTS_VOUCHERS_END_POINT}
              AutocompleteProps={{
                value: value,
                onChange: (_, value) => {
                  onChange(value);
                },
                renderOption(props, option) {
                  return (
                    <MenuItem
                      {...props}
                      key={option.id}
                      value={option.id}
                      children={`${option.id}: ${option.name}`}
                    />
                  );
                },
                getOptionLabel: (option) => {
                  return `${option.id}: ${option.name}`;
                },
                isOptionEqualToValue: (option, value) => {
                  if (isEmpty(option) || isEmpty(value)) {
                    return true;
                  }

                  return option?.["id"] === value?.["id"];
                },
              }}
            />
          );
        }}
      />
    )} */}
      </Grid>
    </Grid>
  );
}
