import { useIntl } from "react-intl";
import { Box, Grid, MenuItem } from "@mui/material";

import { Select } from "components";
import { InputNumber } from "compositions";
import { SELECTED_PRODUCT_TYPE } from "constant";
import { useMemo } from "react";

interface Props {
  reducedValueType: string;
  reducedValueAmount: string;
  onChangeType: (value: any) => void;
  onChangeAmount: (value: any) => void;
}

export default function ProductPriceCategoryDialogForm({
  onChangeType,
  onChangeAmount,
  reducedValueType,
  reducedValueAmount,
}: Props) {
  const { messages, formatMessage } = useIntl();

  const MAX_VAL = 100;
  const withValueCap = (inputObj) => {
    const { value } = inputObj;
    if (value <= MAX_VAL) return true;
    return false;
  };

  const renderInputNumber = useMemo(() => {
    return (
      <InputNumber
        NumberFormatProps={{
          onValueChange(values) {
            onChangeAmount(values.value);
          },
          value: reducedValueAmount,
          defaultValue: "0",
          allowNegative: false,
          suffix:
            reducedValueType === "discount_percentage" ||
            reducedValueType === "increase_percentage"
              ? " %"
              : " đ",

          ...(reducedValueType === "discount_percentage" ||
          reducedValueType === "increase_percentage"
            ? { isAllowed: withValueCap }
            : null),
        }}
      />
    );
  }, [reducedValueType, reducedValueAmount]);

  return (
    <Grid container>
      <Grid item xs={6}>
        <Box>
          <Select
            renderItem={() => {
              return SELECTED_PRODUCT_TYPE.map((el) => {
                return (
                  <MenuItem
                    key={el}
                    value={el}
                    children={messages[`table.${el}`] as string}
                  />
                );
              });
            }}
            SelectProps={{
              onChange: (e) => {
                onChangeType(e.target.value);

                onChangeAmount(0);
              },
              value: reducedValueType,
              placeholder: messages["filterGender"] as string,
            }}
          />
        </Box>
      </Grid>

      <Grid item xs={6}>
        {renderInputNumber}
      </Grid>
    </Grid>
  );
}
