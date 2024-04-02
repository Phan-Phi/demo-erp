import React from "react";
import { IconButton, IconButtonProps } from "@mui/material";
import ContactPageIcon from "@mui/icons-material/ContactPage";

export default function AddressButton(props: IconButtonProps) {
  return (
    <IconButton {...props}>
      <ContactPageIcon sx={{ color: "#757575" }} />
    </IconButton>
  );
}
