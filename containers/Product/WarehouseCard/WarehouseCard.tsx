import React from "react";
import { Stack } from "@mui/material";

import { Card } from "components";
import WarehouseCardVariant from "./WarehouseCardVariant";
import WarehouseCardUnitExtend from "./WarehouseCardUnitExtend";
import { WarehouseCardVariantProvider } from "./context/WarehouseCardVariantContext";

export default function WarehouseCard() {
  return (
    <WarehouseCardVariantProvider>
      <Stack gap="20px">
        <Card title="Thẻ kho biến thể" body={<WarehouseCardVariant />} />

        <Card title="Thẻ kho đơn vị mở rộng" body={<WarehouseCardUnitExtend />} />
      </Stack>
    </WarehouseCardVariantProvider>
  );
}
