import { get } from "lodash";
import React, { useMemo } from "react";
import { Stack, styled, Box } from "@mui/material";

type ToolTipForTagsProps = {
  data: any;
};

export default function ToolTipForTags({ data }: ToolTipForTagsProps) {
  const renderTagItem = useMemo(() => {
    if (data == undefined) return null;

    return data.map((item, index) => {
      const name = get(item, "tag.name");

      return <StyledTagItem key={index}>{name}</StyledTagItem>;
    });
  }, [data]);

  return <StyledStack>{renderTagItem}</StyledStack>;
}

const StyledStack = styled(Stack)(() => {
  return {
    gap: 4,
    padding: "4px 2px",
    flexDirection: "column",
  };
});

const StyledTagItem = styled(Box)(() => {
  return {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: "23px",
    color: "#2b2b2b",

    height: 30,
    borderRadius: 4,
    padding: "4px 8px",
    textAlign: "center",
    backgroundColor: "#ebebeb",
  };
});
