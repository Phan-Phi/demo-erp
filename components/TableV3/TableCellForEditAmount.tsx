import NumberFormat, {
  NumberFormatValues,
  NumberFormatPropsBase,
} from "react-number-format";
import React, { useCallback, useState } from "react";

import { InputBase } from "components";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled, Box, IconButton } from "@mui/material";

type TableCellForEditAmountProps = {
  value: any;
  onChange: (value: any) => void;
  NumberFormatProps?: Omit<NumberFormatPropsBase<typeof InputBase>, "customInput">;
};

export default function TableCellForEditAmount(props: TableCellForEditAmountProps) {
  const { value, onChange, NumberFormatProps } = props;

  const [quantity, setQuantity] = useState(value);

  const onValueChangeHandler = useCallback(
    (e: NumberFormatValues) => {
      const { floatValue } = e;

      setQuantity(floatValue || 1);
      onChange && onChange(floatValue || 1);
    },
    [onChange]
  );

  const onIncreaseNumberHandler = useCallback(() => {
    const parsedValue = Number(quantity);

    if (Number.isNaN(parsedValue)) return;

    setQuantity(parsedValue + 1);
    onChange && onChange(parsedValue + 1);
  }, [quantity, onChange]);

  const onDecreaseNumberHandler = useCallback(() => {
    const parsedValue = Number(quantity);

    if (Number.isNaN(parsedValue)) return;

    if (parsedValue <= 1) return;

    setQuantity(parsedValue - 1);
    onChange && onChange(parsedValue - 1);
  }, [quantity, onChange]);

  return (
    <StyledWrapper className="counter-input">
      <StyledWrapperIcon onClick={onDecreaseNumberHandler}>
        <RemoveIcon />
      </StyledWrapperIcon>

      <NumberFormat
        fullWidth
        value={quantity}
        customInput={StyledInputBase}
        onValueChange={onValueChangeHandler}
        thousandSeparator
        isNumericString
        allowNegative={false}
        allowLeadingZeros={false}
        {...NumberFormatProps}
      />

      <StyledWrapperIcon onClick={onIncreaseNumberHandler}>
        <AddIcon />
      </StyledWrapperIcon>
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Box)(() => {
  return {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderRadius: 4,
    borderStyle: "solid",
    borderColor: "#e0e0e0",
  };
});

const StyledWrapperIcon = styled(IconButton)(() => {
  return {};
});

const StyledInputBase = styled(InputBase)(() => {
  return {
    borderRadius: 0,
    borderTopWidth: 0,
    borderBottomWidth: 0,

    ["& input"]: {
      textAlign: "center",
    },
  };
});
