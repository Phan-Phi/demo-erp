import { useCallback, useState } from "react";
import { Stack, Tab, Tabs } from "@mui/material";

import { TabPanel } from "components";
import ProductDiscounts from "./ProductDiscounts";
import DiscountVoucher from "./voucher/DiscountVoucher";

export default function ContainerDiscountListV2() {
  const [tab, setTab] = useState(0);

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Stack gap="24px">
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label="Giảm giá sản phẩm" />
        <Tab label="Mã giảm giá" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <ProductDiscounts />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <DiscountVoucher />
      </TabPanel>
    </Stack>
  );
}
