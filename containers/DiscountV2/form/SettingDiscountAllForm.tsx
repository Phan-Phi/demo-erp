import { Grid, Stack } from "@mui/material";
import { useIntl } from "react-intl";
import { Controller } from "react-hook-form";

import { usePermission, useChoice } from "hooks";
import { Select, DateTimePicker, LoadingButton } from "components";
import { FormControl, FormControlForSelect, FormControlForNumber } from "compositions";

interface Props {
  selectedRows: any;
}

const SettingDiscountAllForm = ({ control, watch }) => {
  const choice = useChoice();

  const { hasPermission: writePermission } = usePermission("write_sale");

  const { messages } = useIntl();

  const { discount_types } = choice;

  return (
    <Stack direction="row">
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
                readOnly: !writePermission,
              }}
            />
          );
        }}
      />
    </Stack>
  );
};

export default SettingDiscountAllForm;
