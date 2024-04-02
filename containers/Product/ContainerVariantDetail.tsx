import React, { useCallback, useState } from "react";

import { Box, Tab, Tabs } from "@mui/material";

import VariantDetail from "./VariantDetail";
import { Spacing, TabPanel } from "components";
import WarehouseCard from "./WarehouseCard/WarehouseCard";

export default function ContainerVariantDetail() {
  const [tab, setTab] = useState(0);

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Box>
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label="Thông tin biến thể" />

        <Tab label="Thẻ kho" />
      </Tabs>

      <Spacing spacing={3} />

      <TabPanel value={tab} index={0}>
        <VariantDetail />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <WarehouseCard />
      </TabPanel>
    </Box>
  );
}
