import { isEmpty } from "lodash";
import { useIntl } from "react-intl";
import { Controller } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";

import { usePermission } from "hooks";
import { FormControl } from "compositions";
import { LazyAutocomplete } from "components";
import { ADMIN_USERS_END_POINT } from "__generated__/END_POINT";

type WarehouseFormProps = {
  control: any;
};

const WarehouseForm = ({ control }: WarehouseFormProps) => {
  const { messages } = useIntl();

  const { hasPermission: writePermission } = usePermission("write_warehouse");
  const urlManager = `${ADMIN_USERS_END_POINT}?is_staff=true`;

  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label={messages["warehouseName"] as string}
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
        <LazyAutocomplete<any, any>
          {...{
            url: urlManager,
            control,
            name: "manager",
            label: "Quản lý kho",
            AutocompleteProps: {
              renderOption(props, option) {
                return (
                  <MenuItem
                    {...props}
                    value={option.id}
                    children={`${option?.first_name} ${option?.last_name}`}
                  />
                );
              },

              getOptionLabel: (option) => {
                return `${option?.first_name} ${option?.last_name}`;
              },
              isOptionEqualToValue: (option, value) => {
                if (isEmpty(option) || isEmpty(value)) {
                  return true;
                }

                return option?.["id"] === value?.["id"];
              },
              ...(!writePermission && {
                disabled: true,
              }),
            },
            InputProps: {
              ...(!writePermission && {
                readOnly: true,
              }),
            },
          }}
        />
        {/* <Controller
          name="manager"
          control={control}
          render={(props) => {
            const { field, fieldState } = props;
            const { value, onChange } = field;
           
            return (
              <LazyAutocomplete<any, any>
                url={ADMIN_USERS_END_POINT}
                label="Quản lý kho"
                AutocompleteProps={{
                  value: value.id as any,
                  onChange: (_, value) => {
                    onChange(value);
                  },
                  renderOption(props, option) {
                    return (
                      <MenuItem
                        {...props}
                        value={option.id}
                        children={`${option?.first_name} ${option?.last_name}`}
                      />
                    );
                  },
                  isOptionEqualToValue: (option, value) => {
                    if (isEmpty(option) || isEmpty(value)) {
                      return true;
                    }

                    return option?.["id"] === value?.["id"];
                  },
                  getOptionLabel: (option) => {
                    return `${option?.first_name} ${option?.last_name}`;
                  },
                }}
              />
            );
          }}
        /> */}
      </Grid>
    </Grid>
  );
};

export default WarehouseForm;
