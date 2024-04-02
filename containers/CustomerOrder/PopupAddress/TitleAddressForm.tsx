import React from "react";
import { useIntl } from "react-intl";
import { AddressButton } from "components";
import { Stack, Typography, styled } from "@mui/material";

type TitleAddressFormProps = {
  onOpen: () => void;
};

export default function TitleAddressForm({ onOpen }: TitleAddressFormProps) {
  const { messages } = useIntl();

  return (
    <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
      <StyledTitle variant="h6">{messages["shippingAddress"]}</StyledTitle>

      <AddressButton sx={{ height: 20, padding: 0 }} onClick={onOpen} />
    </Stack>
  );
}

const StyledTitle = styled(Typography)(() => {
  return {
    fontWeight: 700,
  };
});
