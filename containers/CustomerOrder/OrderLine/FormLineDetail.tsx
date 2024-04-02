import React from "react";
import { useIntl } from "react-intl";

import { get } from "lodash";
import { Grid } from "@mui/material";

import { DEFAULT_VALUES_TYPE } from "./ViewLineDetail";
import { FormControlBase, InputNumber } from "compositions";

type FormLineDetailProps = {
  defaultValues: DEFAULT_VALUES_TYPE;
};

export default function FormLineDetail({ defaultValues }: FormLineDetailProps) {
  const { messages } = useIntl();

  return (
    <Grid container>
      <Grid item xs={6}>
        <FormControlBase
          FormLabelProps={{ children: messages["quantity"] as string }}
          InputProps={{
            inputProps: {
              placeholder: messages["quantity"] as string,
            },
            readOnly: true,
            value: get(defaultValues, "quantity"),
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <FormControlBase
          FormLabelProps={{ children: messages["unit"] as string }}
          InputProps={{
            inputProps: {
              placeholder: messages["unit"] as string,
            },
            readOnly: true,
            value: get(defaultValues, "unit"),
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <InputNumber
          FormLabelProps={{ children: messages["unitPriceBeforeDiscounts"] as string }}
          readOnly={true}
          placeholder={messages["unitPriceBeforeDiscounts"] as string}
          NumberFormatProps={{
            suffix: " đ",
            value: parseFloat(get(defaultValues, "unitPriceBeforeDiscounts")),
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <InputNumber
          FormLabelProps={{ children: messages["unitPriceAfterDiscounts"] as string }}
          readOnly={true}
          placeholder={messages["unitPriceAfterDiscounts"] as string}
          NumberFormatProps={{
            suffix: " đ",
            value: parseFloat(get(defaultValues, "unitPriceAfterDiscounts")),
          }}
        />
      </Grid>
    </Grid>
  );
}
