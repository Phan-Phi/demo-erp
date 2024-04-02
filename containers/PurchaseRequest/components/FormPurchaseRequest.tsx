import React from "react";
import { isEmpty } from "lodash";
import { Stack, MenuItem } from "@mui/material";
import { Controller, Control } from "react-hook-form";

import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { FormControl, FormControlForNumber, LazyAutocomplete } from "compositions";
import { ADMIN_PURCHASE_REQUESTS_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type FormPurchaseRequestProps = {
  control: Control<any>;
};

export default function FormPurchaseRequest(props: FormPurchaseRequestProps) {
  const control = props.control as Control<ADMIN_PURCHASE_REQUESTS_POST_YUP_SCHEMA_TYPE>;

  return (
    <Stack gap="12px">
      <Controller
        control={control}
        name="variant"
        render={(props) => {
          const { field, fieldState } = props;
          const { value, onChange } = field;
          const { error } = fieldState;

          return (
            <LazyAutocomplete
              error={error}
              label="Biến thể sản phẩm"
              placeholder="Biến thể sản phẩm"
              url={ADMIN_PRODUCTS_VARIANTS_END_POINT}
              AutocompleteProps={{
                value: value,
                onChange: (_, value) => {
                  onChange(value);
                },
                getOptionLabel: (option) => option.name,
                renderOption: (props, option) => {
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
              }}
            />
          );
        }}
      />

      <Controller
        control={control}
        name="quantity"
        render={(props) => {
          return <FormControlForNumber controlState={props} label="Số lượng" />;
        }}
      />

      <Controller
        control={control}
        name="notes"
        render={(props) => {
          return (
            <FormControl
              controlState={props}
              label="Ghi chú"
              placeholder="Ghi chú"
              InputProps={{
                multiline: true,
                rows: 5,
                sx: {
                  padding: 1,
                },
              }}
            />
          );
        }}
      />
    </Stack>
  );
}
