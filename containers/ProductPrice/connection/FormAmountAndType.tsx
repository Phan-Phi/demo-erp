import { useMemo } from "react";
import { Box, MenuItem, Stack, styled } from "@mui/material";

import { Select } from "components";
import { useIntl } from "react-intl";
import { InputNumber } from "compositions";
import { SELECTED_PRODUCT_TYPE } from "constant";

interface Props {
  amountState: string;
  discountTypeState: string;
  onChangeType: (value: any) => void;
  onChangeAmount: (value: any) => void;
}

export default function FormAmountAndType({
  discountTypeState,
  amountState,
  onChangeType,
  onChangeAmount,
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
          value: amountState,
          defaultValue: "0",
          allowNegative: false,
          suffix:
            discountTypeState === "discount_percentage" ||
            discountTypeState === "increase_percentage"
              ? " %"
              : " đ",

          ...(discountTypeState === "discount_percentage" ||
          discountTypeState === "increase_percentage"
            ? { isAllowed: withValueCap }
            : null),
        }}
      />
    );
  }, [discountTypeState, amountState]);

  return (
    <Stack flexDirection="row" columnGap={3} alignItems="center">
      <WrapperSelect>
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
            value: discountTypeState,
            placeholder: messages["filterGender"] as string,
          }}
        />
      </WrapperSelect>

      {renderInputNumber}
      {/* <InputNumber
        NumberFormatProps={{
          onValueChange(values) {
            onChangeAmount(values.value);
          },
          defaultValue: "0",
          allowNegative: false,
          suffix:
            discountTypeState === "discount_percentage" ||
            discountTypeState === "increase_percentage"
              ? " %"
              : " đ",

          ...(discountTypeState === "discount_percentage" ||
          discountTypeState === "increase_percentage"
            ? { isAllowed: withValueCap }
            : null),

          // ...(discountTypeState === "discount_percentage" ||
          // discountTypeState === "increase_percentage"
          //   ? { isAllowed: withValueCap }
          //   : null),
        }}
      /> */}
    </Stack>
  );
}

const WrapperSelect = styled(Box)(() => {
  return {
    "& .MuiFormControl-root": {
      width: "12.5rem",
    },
  };
});
