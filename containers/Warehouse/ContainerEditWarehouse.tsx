import { useCallback, useState } from "react";

import EditWarehouse from "./EditWarehouse";
import WarehouseCard from "./WarehouseCard/WarehouseCard";
import EditWarehouseTable from "./columns/EditWarehouseTable";

import { TabPanel } from "components";
import { Stack, Tab, Tabs } from "@mui/material";

export default function ContainerEditWarehouse() {
  const [tab, setTab] = useState(0);

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Stack gap="24px">
      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label="Thông tin" />
        <Tab label="Sản phẩm" />
        <Tab label="Thẻ kho" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <EditWarehouse />
      </TabPanel>

      <TabPanel value={tab} index={1}>
        <EditWarehouseTable />
      </TabPanel>

      <TabPanel value={tab} index={2}>
        <WarehouseCard />
      </TabPanel>
    </Stack>
  );
}
