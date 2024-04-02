import React from "react";
import { useIntl } from "react-intl";
import AddIcon from "@mui/icons-material/Add";
import { Box, styled, Typography } from "@mui/material";

type AddNewAddressProps = {
  onClick: () => void;
};

export default function AddNewAddress({ onClick }: AddNewAddressProps) {
  const { messages } = useIntl();

  return (
    <StyledWrapper onClick={onClick}>
      <AddIcon />

      <StyledText>{messages["addNewAddress"]}</StyledText>
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Box)(() => {
  return {
    padding: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    cursor: "pointer",
    border: "1px  dashed #000",
  };
});

const StyledText = styled(Typography)(() => {
  return {
    marginLeft: 1,
  };
});
