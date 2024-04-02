import { useIntl } from "react-intl";
import { Control, UseFormSetValue, UseFormWatch, Controller } from "react-hook-form";

import dynamic from "next/dynamic";
import { Grid } from "@mui/material";

import {
  Ward,
  Checkbox,
  Province,
  District,
  CheckboxItem,
  LoadingDynamic,
} from "components";
import { FormControl, FormControlForPhoneNumber, MapProvider } from "compositions";

import { ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

const FormControlMap4D = dynamic(
  () => import("../../../compositions/FormControlForMap4D/FormControlMap4D"),
  {
    loading: () => {
      return <LoadingDynamic />;
    },
  }
);

interface AddressFormProps {
  control: any;
  setValue: any;
  watch: any;
}

const AddressForm = (props: AddressFormProps) => {
  const { messages } = useIntl();

  const control =
    props.control as Control<ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;
  const setValue =
    props.setValue as UseFormSetValue<ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  const watch =
    props.watch as UseFormWatch<ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  return (
    <Grid container>
      <Grid item xs={6}>
        <Province {...{ control, watch, setValue, name: "province" }} />
      </Grid>

      <Grid item xs={6}>
        <District {...{ control, watch, setValue, name: "district" }} />
      </Grid>

      <Grid item xs={6}>
        <Ward {...{ control, watch, setValue, name: "ward" }} />
      </Grid>

      <Grid item xs={6} />

      <Grid item xs={12}>
        <Controller
          name="line1"
          control={control}
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["address"] as string}
                placeholder={messages["address"] as string}
                FormControlProps={{
                  required: true,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="phone_number"
          control={control}
          render={(props) => {
            return (
              <FormControlForPhoneNumber
                controlState={props}
                label={messages["phoneNumber"] as string}
                InputProps={{
                  inputProps: {
                    placeholder: messages["phoneNumber"] as string,
                  },
                }}
                FormControlProps={{
                  required: true,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6} />

      <Grid item xs={6}>
        <Checkbox
          {...{
            control,
            name: "is_default_for_shipping",
            renderItem: ({ value, onChange }) => {
              return (
                <CheckboxItem
                  CheckboxProps={{
                    checked: value,
                    onChange,
                  }}
                  label={messages["defaultShippingAddress"] as string}
                />
              );
            },
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Checkbox
          {...{
            control,
            name: "is_default_for_billing",
            renderItem: ({ value, onChange }) => {
              return (
                <CheckboxItem
                  CheckboxProps={{
                    checked: value,
                    onChange,
                  }}
                  label={messages["defaultBillingAddress"] as string}
                />
              );
            },
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
                  rows: 5,
                  sx: {
                    padding: 1,
                  },
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <MapProvider>
          <FormControlMap4D setValue={setValue} watch={watch} />
        </MapProvider>
      </Grid>
    </Grid>
  );
};

export default AddressForm;
