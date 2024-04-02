import React from "react";

import { IconButtonProps, IconButton } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";

export default function TagsButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <BookmarkIcon />
    </IconButton>
  );
}
