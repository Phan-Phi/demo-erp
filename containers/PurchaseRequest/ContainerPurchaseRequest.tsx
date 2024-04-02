import { Stack, Tab, Tabs } from "@mui/material";
import React, { useCallback, useState } from "react";

import { TabPanel } from "components";
import ListPurchaseRequest from "./ListPurchaseRequest";
import ListPurchaseRequestSummary from "./ListPurchaseRequestSummary";

export default function ContainerPurchaseRequest() {
  const [tab, setTab] = useState(0);

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Stack gap="16px">
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label="Yêu cầu đặt hàng" />

        <Tab label="Thống kê" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <ListPurchaseRequest />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <ListPurchaseRequestSummary />
      </TabPanel>
    </Stack>
  );
}
