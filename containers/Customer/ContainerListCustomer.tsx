import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useState, useCallback } from "react";
import { Tabs, Tab, Stack, Grid } from "@mui/material";

import { usePermission } from "hooks";
import { MapProvider } from "./map/context/MapContext";
import { LoadingDynamic as Loading, TabPanel } from "components";

const ListCustomer = dynamic(() => import("./official/ListCustomer"), {
  loading: () => {
    return <Loading />;
  },
});

const DraftCustomer = dynamic(() => import("./draft/DraftList"), {
  loading: () => {
    return <Loading />;
  },
});

const Map = dynamic(() => import("./map/Map"), {
  loading: () => {
    return <Loading />;
  },
});

const Customer = () => {
  const { messages } = useIntl();
  const [tab, setTab] = useState(0);
  const { hasPermission: approvePermission } = usePermission("approve_customer");

  const changeHandler = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack gap="16px">
          <Tabs value={tab} onChange={changeHandler}>
            <Tab label={messages["approved"]} />

            {approvePermission && <Tab label={messages["noApprove"]} />}

            <Tab label={messages["map"]} />
          </Tabs>

          <TabPanel value={tab} index={0}>
            <ListCustomer />
          </TabPanel>

          {approvePermission && (
            <TabPanel value={tab} index={1}>
              <DraftCustomer />
            </TabPanel>
          )}

          <TabPanel value={tab} index={2}>
            <MapProvider>
              <Map />
            </MapProvider>
          </TabPanel>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Customer;
