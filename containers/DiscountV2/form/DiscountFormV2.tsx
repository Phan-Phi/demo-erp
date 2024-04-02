import { Grid } from "@mui/material";
import { useIntl } from "react-intl";
import { Controller } from "react-hook-form";

import { FormControl } from "compositions";
import { DateTimePicker } from "components";

const DiscountFormV2 = ({ control, watch, activeDiscountType = "no_discount" }) => {
  const { messages } = useIntl();

  return (
    <Grid container>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["discountName"] as string}
                placeholder={messages["discountName"] as string}
                FormControlProps={{
                  required: true,
                }}
                InputProps={{
                  disabled:
                    activeDiscountType === "discount_happenning" ||
                    activeDiscountType === "discount_end"
                      ? true
                      : false,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <DateTimePicker
          {...{
            control,
            name: "date_start",
            label: messages["dateStart"] as string,
            DateTimePickerProps: {
              disabled:
                activeDiscountType === "discount_happenning" ||
                activeDiscountType === "discount_end"
                  ? true
                  : false,
            },
            FormControlProps: {
              disabled:
                activeDiscountType === "discount_happenning" ||
                activeDiscountType === "discount_end"
                  ? true
                  : false,
            },
          }}
        />
      </Grid>
      <Grid item xs={6}>
        <DateTimePicker
          {...{
            control,
            name: "date_end",
            label: messages["dateEnd"] as string,
            DateTimePickerProps: {
              disabled: activeDiscountType === "discount_end" ? true : false,
              minDateTime: watch("date_start"),
            },
            FormControlProps: {
              disabled: activeDiscountType === "discount_end" ? true : false,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default DiscountFormV2;
