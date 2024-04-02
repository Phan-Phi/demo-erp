import React from "react";
import { useIntl } from "react-intl";

import { Stack, Button, Typography } from "@mui/material";

import { Card } from "components";
import ReturnInvoiceList from "./ReturnInvoiceList";
import CreateReturnInvoiceDialog from "./CreateReturnInvoiceDialog";

import { usePermission, useToggle } from "hooks";
import { ContainerReturnInvoiceProvider } from "./context/ContainerReturnInvoiceContext";

export default function ContainerReturnInvoice() {
  const { messages } = useIntl();
  const { onOpen, onClose, open } = useToggle();
  const { hasPermission: writePermission } = usePermission("write_return_invoice");
  const { hasPermission: readPermission } = usePermission("read_return_invoice");

  return (
    <Card
      cardTitleComponent={() => {
        return (
          <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
            <Typography fontWeight={700}>{messages["listingReturnInvoice"]}</Typography>

            {writePermission && (
              <Button
                onClick={() => {
                  onOpen();
                }}
              >
                {messages["createReturnInvoice"]}
              </Button>
            )}
          </Stack>
        );
      }}
      cardBodyComponent={() => {
        return (
          <ContainerReturnInvoiceProvider>
            {readPermission && <ReturnInvoiceList />}
            <CreateReturnInvoiceDialog open={open} onClose={onClose} />
          </ContainerReturnInvoiceProvider>
        );
      }}
    />
  );
}
