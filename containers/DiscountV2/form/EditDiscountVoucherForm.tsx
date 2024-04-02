import { useState } from "react";
import { useIntl } from "react-intl";
import { useUpdateEffect } from "react-use";
import { Controller } from "react-hook-form";
import { Grid, MenuItem, Typography } from "@mui/material";

import { usePermission, useChoice } from "hooks";
import { Select, DateTimePicker, Switch } from "components";
import { FormControl, FormControlForSelect, FormControlForNumber } from "compositions";

const limitType = [
  ["limit", "Giới hạn"],
  ["no_limit", "Không giới hạn"],
];

const EditDiscountVoucherForm = ({
  control,
  setValue,
  watch,
  activeDiscountType = "",
  max_discount_amount,
}) => {
  const choice = useChoice();
  const { messages } = useIntl();

  const [limit, setLimit] = useState<any>("");

  const { hasPermission: writePermission } = usePermission("write_sale");

  const { discount_types } = choice;

  useUpdateEffect(() => {
    if (limit === "no_limit") {
      setValue("max_discount_amount", null);
    }
  }, [limit]);

  const disableSelect =
    activeDiscountType === "discount_happenning" || activeDiscountType === "discount_end"
      ? true
      : false;

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
                label="Tên chương trình"
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
        <Controller
          control={control}
          name="code"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label="Mã giảm giá"
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

      <Grid item xs={6}>
        <Controller
          control={control}
          name="discount_type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return discount_types.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label="Loại giảm giá"
                SelectProps={{
                  readOnly: disableSelect,
                  style: { backgroundColor: disableSelect ? "#bdbdbd" : "white" },
                }}
                FormControlProps={{
                  disabled: disableSelect,
                }}
              />
            );
          }}
        />
      </Grid>

      {watch("discount_type") === "Percentage" && (
        <Grid item xs={6}>
          <Controller
            name="discount_amount"
            control={control}
            render={(props) => {
              return (
                <FormControlForNumber
                  controlState={props}
                  label="Số tiền giảm"
                  readOnly={!writePermission}
                  FormControlProps={{
                    disabled:
                      activeDiscountType === "discount_happenning" ||
                      activeDiscountType === "discount_end"
                        ? true
                        : false,
                  }}
                  NumberFormatProps={{
                    allowNegative: false,
                    suffix: " %",
                    isAllowed: (values) => {
                      return values.value.length <= 5;
                    },
                  }}
                />
              );
            }}
          />
        </Grid>
      )}

      {watch("discount_type") === "Percentage" && (
        <Grid item xs={6}>
          <Typography
            sx={{
              paddingBottom: "3.5px",
              fontSize: "0.875rem",
              lineHeight: 1.57,
              fontWeight: 700,
            }}
          >
            Loại giới hạn
          </Typography>
          <Select
            renderItem={() => {
              return limitType.map((el) => {
                return <MenuItem key={el[0]} value={el[0]} children={el[1]} />;
              });
            }}
            SelectProps={{
              readOnly: disableSelect,
              disabled: disableSelect,
              defaultValue: limitType[0][0],
              value: max_discount_amount ? limitType[0][0] : limitType[1][0],
              onChange: (e) => {
                setLimit(e.target.value == undefined ? "" : e.target.value);
              },
            }}
          />
        </Grid>
      )}

      {limit === "limit" || max_discount_amount != null ? (
        <Grid item xs={6}>
          <Controller
            name="max_discount_amount"
            control={control}
            render={(props) => {
              return (
                <FormControlForNumber
                  controlState={props}
                  label="Số tiền giới hạn giảm"
                  readOnly={!writePermission}
                  FormControlProps={{
                    disabled:
                      activeDiscountType === "discount_happenning" ||
                      activeDiscountType === "discount_end"
                        ? true
                        : false,
                  }}
                  NumberFormatProps={{
                    allowNegative: false,
                    suffix: " đ",
                  }}
                />
              );
            }}
          />
        </Grid>
      ) : (
        <Grid item xs={6}></Grid>
      )}

      {watch("discount_type") === "Absolute" && (
        <Grid item xs={6}>
          <Controller
            name="discount_amount"
            control={control}
            render={(props) => {
              return (
                <FormControlForNumber
                  controlState={props}
                  label="Số tiền muốn giảm"
                  readOnly={!writePermission}
                  FormControlProps={{
                    disabled: !writePermission,
                  }}
                  NumberFormatProps={{
                    allowNegative: false,
                    suffix: " đ",
                  }}
                />
              );
            }}
          />
        </Grid>
      )}

      <Grid item xs={6}>
        <Controller
          name="usage_limit"
          control={control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label="Giá trị đơn hàng tối thiểu"
                readOnly={!writePermission}
                FormControlProps={{
                  disabled:
                    activeDiscountType === "discount_happenning" ||
                    activeDiscountType === "discount_end"
                      ? true
                      : false,
                }}
                NumberFormatProps={{
                  allowNegative: false,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          name="min_checkout_items_quantity"
          control={control}
          render={(props) => {
            return (
              <FormControlForNumber
                controlState={props}
                label="Tổng lượt sử dụng"
                readOnly={!writePermission}
                FormControlProps={{
                  disabled:
                    activeDiscountType === "discount_happenning" ||
                    activeDiscountType === "discount_end"
                      ? true
                      : false,
                }}
                NumberFormatProps={{
                  allowNegative: false,
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
            name: "standalone",
            label: "Không sử dụng đồng thời mã giảm giá khác",
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

      <Grid item xs={6}></Grid>
    </Grid>
  );
};

export default EditDiscountVoucherForm;
