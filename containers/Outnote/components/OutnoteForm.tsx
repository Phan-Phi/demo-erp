import { Fragment } from "react";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Control, Controller, useWatch, UseFormSetValue } from "react-hook-form";

import { get, isEmpty } from "lodash";
import { Grid, MenuItem } from "@mui/material";

import {
  FormControl,
  FormControlBase,
  LazyAutocomplete,
  FormControlForSelect,
} from "compositions";

import { useChoice, usePermission } from "hooks";
import { getDisplayValueFromChoiceItem } from "libs";
import { DIRECTION_TYPE, REASON_TYPE, REASON_TYPE_IN, REASON_TYPE_OUT } from "constant";

import { ADMIN_WAREHOUSES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";
import { useUpdateEffect } from "react-use";

type OutnoteFormProps = {
  control: any;
  setValue?: any;
  defaultValues?: ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE;
};

const OutnoteForm = (props: OutnoteFormProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const { stock_out_note_statuses } = useChoice();
  const { hasPermission: writePermission } = usePermission("write_stock_out_note");

  const { defaultValues } = props;

  const control =
    props.control as Control<ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE>;

  const setValue =
    props.setValue as UseFormSetValue<ADMIN_WAREHOUSES_OUT_NOTES_POST_YUP_SCHEMA_TYPE>;

  const status = get(defaultValues, "status");

  const watchDirection = useWatch({ control });

  useUpdateEffect(() => {
    if (watchDirection.direction) {
      setValue("reason", "");
    }
  }, [watchDirection.direction]);

  return (
    <Grid container justifyContent="flex-start">
      {router.query.id && (
        <Grid item xs={4}>
          <FormControlBase
            FormControlProps={{ disabled: true }}
            FormLabelProps={{ children: "Mã phiếu điều chỉnh tồn kho" }}
            InputProps={{
              inputProps: {
                placeholder: "Mã phiếu điều chỉnh tồn kho",
                value: get(defaultValues, "sid"),
              },
              readOnly: true,
            }}
          />
        </Grid>
      )}

      {router.query.id && (
        <Grid item xs={4}>
          <FormControlBase
            FormControlProps={{ disabled: true }}
            FormLabelProps={{ children: messages["status"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["status"] as string,
              },
              readOnly: true,
              value: status
                ? getDisplayValueFromChoiceItem(stock_out_note_statuses, status)
                : "-",
            }}
          />
        </Grid>
      )}

      {router.query.id ? (
        <Grid item xs={4}>
          <FormControlBase
            FormControlProps={{ disabled: true }}
            FormLabelProps={{ children: messages["warehouseName"] as string }}
            InputProps={{
              inputProps: {
                placeholder: messages["warehouseName"] as string,
                defaultValue: get(defaultValues, "warehouse.name"),
              },
              readOnly: true,
            }}
          />
        </Grid>
      ) : (
        <Fragment>
          <Grid item xs={6}>
            <Controller
              control={control}
              name="warehouse"
              render={(props) => {
                const { field, fieldState } = props;
                const { value, onChange } = field;
                const { error } = fieldState;

                return (
                  <LazyAutocomplete
                    error={error}
                    url={ADMIN_WAREHOUSES_END_POINT}
                    label={messages["warehouseName"] as string}
                    placeholder={messages["warehouseName"] as string}
                    AutocompleteProps={{
                      ...(!writePermission && {
                        disabled: true,
                      }),
                      value: value as any,
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
          </Grid>

          <Grid item xs={6}></Grid>
        </Fragment>
      )}

      <Grid item xs={6}>
        <Controller
          control={control}
          name="direction"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return DIRECTION_TYPE.map((item) => {
                    return (
                      <MenuItem key={item.name} value={item.value}>
                        {item.name}
                      </MenuItem>
                    );
                  });
                }}
                label="Loại điều chỉnh"
                FormControlProps={{
                  required: true,
                  disabled: !writePermission,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="reason"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  const data =
                    watchDirection.direction === "in" ? REASON_TYPE_IN : REASON_TYPE_OUT;

                  return data.map((item) => {
                    return (
                      <MenuItem key={item.name} value={item.value}>
                        {item.name}
                      </MenuItem>
                    );
                  });
                }}
                label="Lý do"
                FormControlProps={{
                  required: true,
                  disabled: !writePermission || watchDirection.direction === "",
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
                FormControlProps={{
                  disabled: !writePermission,
                }}
                InputProps={{
                  multiline: true,
                  rows: 5,
                  readOnly: !writePermission,
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
};

export default OutnoteForm;
