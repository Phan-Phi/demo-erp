import React from "react";
import { Box, BoxProps, styled } from "@mui/material";
import { WRAPPER_TABLE_BOX_SHADOW } from "constant";

export default function WrapperTable({ children, ...restProps }: BoxProps) {
  return <StyledWrapper {...restProps}>{children}</StyledWrapper>;
}

const StyledWrapper = styled(Box)(() => {
  return {
    // padding: "8px 0 0 24px",
    borderRadius: 4,
    boxShadow: WRAPPER_TABLE_BOX_SHADOW,
  };
});
