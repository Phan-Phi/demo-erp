import { Grid } from "@mui/material";
import { DateTimePicker, Loading, Switch } from "components";
import { FormControl } from "compositions";
import { usePermission } from "hooks";
import dynamic from "next/dynamic";
import React from "react";
import { Controller } from "react-hook-form";
import { useIntl } from "react-intl";

export default function ProductPriceCreateForm({ control }: any) {
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_price_table");

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label="Tên bảng giá"
                placeholder={messages["warehouseName"] as string}
                FormControlProps={{ required: true }}
                InputProps={{
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Switch
          {...{
            control,
            name: "active",
            label: "Trạng thái",
            FormControlProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <DateTimePicker
          {...{
            control,
            name: "date_start",
            label: "Thời gian bắt đầu",
            DateTimePickerProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <DateTimePicker
          {...{
            control,
            name: "date_end",
            label: "Thời gian kết thúc",
            DateTimePickerProps: {
              disabled: !writePermission,
            },
          }}
        />
      </Grid>
    </Grid>
  );
}
