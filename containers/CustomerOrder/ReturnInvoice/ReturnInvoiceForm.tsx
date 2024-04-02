import React from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Control, Controller } from "react-hook-form";

import { get, isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";
import { FormControl, FormControlForNumber, LazyAutocomplete } from "compositions";

import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type ReturnInvoiceFormProps = {
  control: any;
};

export default function ReturnInvoiceForm(props: ReturnInvoiceFormProps) {
  const router = useRouter();
  const { messages } = useIntl();

  const control =
    props.control as Control<ADMIN_ORDERS_INVOICES_RETURN_INVOICES_POST_YUP_SCHEMA_TYPE>;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="invoice"
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
            const { error } = fieldState;

            return (
              <LazyAutocomplete
                error={error}
                url={ADMIN_ORDERS_INVOICES_END_POINT}
                label="Hóa đơn"
                placeholder="Hóa đơn"
                AutocompleteProps={{
                  value: value as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  getOptionLabel: (option) => option.sid,
                  renderOption: (props, option) => {
                    return (
                      <MenuItem
                        {...props}
                        key={option.id}
                        value={option.id}
                        children={option.sid}
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
                params={{
                  order: router.query.id,
                  shipping_status: "Delivered",
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="surcharge"
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label={messages["surcharge"] as string}
                placeholder={messages["surcharge"] as string}
                NumberFormatProps={{
                  suffix: " ₫",
                  allowNegative: false,
                }}
              />
            );
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="notes"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["note"] as string}
                placeholder={messages["note"] as string}
                InputProps={{
                  multiline: true,
                  rows: 3,
                  sx: {
                    padding: 1,
                  },
                }}
              />
            );
          }}
        />
      </Grid>
    </Grid>
  );
}
