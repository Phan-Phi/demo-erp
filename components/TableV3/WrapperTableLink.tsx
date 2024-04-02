import React from "react";
import { ColumnInstance } from "react-table";

import { Box, styled, BoxProps, Tooltip, TooltipProps, Skeleton } from "@mui/material";

interface ExtendBoxProps extends Omit<BoxProps, "title"> {
  title?: TooltipProps["title"];
  loading?: boolean;
}

type ConditionalProps =
  | { isSortBy: true; column: ColumnInstance }
  | { isSortBy?: false; column?: never };

type Props = ExtendBoxProps & ConditionalProps;

const WrapperTableLink = (props: Props) => {
  const { title, isSortBy, column, loading, ...restProps } = props;

  if (loading) return <Skeleton />;

  return (
    <Tooltip title={title || ""}>
      <StyledBox {...restProps} />
    </Tooltip>
  );
};

const StyledBox = styled(Box)({
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  overflow: "hidden",
  fontSize: 14,
  lineHeight: "16px",
  color: "#1074ba",
  cursor: "pointer",
});

export default WrapperTableLink;
