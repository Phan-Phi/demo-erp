import React from "react";
import { IconButtonProps, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function CopyButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <ContentCopyIcon />
    </IconButton>
  );
}
