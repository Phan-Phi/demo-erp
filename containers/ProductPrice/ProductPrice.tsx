import { useCallback, useState } from "react";
import { Grid, Tab, Tabs } from "@mui/material";

import { TabPanel } from "components";

import ProductPriceList from "./components/ProductPriceList";
import PriceComparingList from "./PriceComparing/PriceComparingList";

export default function ProductPrice() {
  const [tab, setTab] = useState(0);

  const changeHandler = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Tabs value={tab} onChange={changeHandler} sx={{ marginBottom: "1.5rem" }}>
          <Tab label={"Bảng Giá"} />
          <Tab label={"So Sánh Giá"} />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <ProductPriceList />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <PriceComparingList />
        </TabPanel>
      </Grid>
    </Grid>
  );
}
