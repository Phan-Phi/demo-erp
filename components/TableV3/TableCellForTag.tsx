import React from "react";
import { Box, styled, BoxProps, Skeleton } from "@mui/material";

interface ExtendBoxProps extends Omit<BoxProps, "title"> {
  loading?: boolean;
}

export default function TableCellForTag(props: ExtendBoxProps) {
  const { loading, ...restProps } = props;

  if (loading) return <Skeleton />;

  return <StyledBox {...restProps} />;
}

const StyledBox = styled(Box)({
  fontSize: 13,
  fontWeight: 400,
  lineHeight: "23px",
  color: "#2b2b2b",

  borderRadius: 4,
  textAlign: "center",
  padding: "4px 8px",
  width: "fit-content",
  backgroundColor: "#ebebeb",
});
