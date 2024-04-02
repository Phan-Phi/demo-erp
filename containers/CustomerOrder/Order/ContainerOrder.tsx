import { useUpdateEffect } from "react-use";
import { useCallback, useState } from "react";
import { Stack, Tab, Tabs } from "@mui/material";

import ToDoList from "./ToDoList";
import OrderList from "./OrderList";
import { TabPanel } from "components";
import InvoiceList from "./InvoiceList";

const LIST_FILTER_ORDERS = ["Draft", "Confirmed", "Processed"];
const LIST_FILTER_INVOICE = ["On delivery", "Partial_paid", "Paid"];

export default function ContainerOrder() {
  const [tab, setTab] = useState(0);
  const [filterAll, setFilterAll] = useState<string>("");

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
    setFilterAll("");
  }, []);

  useUpdateEffect(() => {
    if (filterAll === "") return;

    if (LIST_FILTER_ORDERS.includes(filterAll)) {
      setTab(0);
    }

    if (LIST_FILTER_INVOICE.includes(filterAll)) {
      setTab(1);
    }
  }, [filterAll]);

  return (
    <Stack gap="16px">
      <ToDoList title="Danh sách cần làm" setFilterAll={setFilterAll} />

      <Tabs value={tab} onChange={onChangeTab}>
        <Tab label="Đơn hàng" />

        <Tab label="Hóa đơn" />
      </Tabs>

      <TabPanel value={tab} index={0}>
        <OrderList filterAll={filterAll} setFilterAll={setFilterAll} />
      </TabPanel>
      <TabPanel value={tab} index={1}>
        <InvoiceList filterAll={filterAll} setFilterAll={setFilterAll} />
      </TabPanel>
    </Stack>
  );
}
