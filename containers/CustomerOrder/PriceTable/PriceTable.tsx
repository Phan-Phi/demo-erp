import React from "react";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { Stack, Typography, styled, Button, ButtonProps, Box } from "@mui/material";

import { Card } from "components";
import { useToggle } from "hooks";
import PriceTableList from "./PriceTableList";

const CreatePriceTable = dynamic(() => import("./CreatePriceTable"), {
  ssr: false,
});

type TitleProps = {
  buttonProps: ButtonProps;
};

export default function PriceTable() {
  const { onOpen, onClose, open } = useToggle();

  return (
    <Box>
      <Card
        title={
          <Title
            buttonProps={{
              onClick: onOpen,
            }}
          />
        }
        body={<PriceTableList />}
      />

      <CreatePriceTable {...{ onClose, open }} />
    </Box>
  );
}

const Title = (props: TitleProps) => {
  const { buttonProps } = props;
  const { messages } = useIntl();

  return (
    <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
      <StyledTitle>{messages["price_table.title"]}</StyledTitle>
      <Button {...buttonProps}>{messages["price_table.addPriceTable"]}</Button>
    </Stack>
  );
};

const StyledTitle = styled(Typography)(() => {
  return {
    fontSize: 16,
    lineHeight: "19px",
    fontWeight: 700,
  };
});
