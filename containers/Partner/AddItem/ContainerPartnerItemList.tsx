import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useToggle } from "react-use";
import { Grid, Stack, Button } from "@mui/material";

import History from "./History";
import { BackButton, LoadingDynamic as Loading } from "components";

import Provider from "./context";
import { PARTNERS } from "routes";
import { usePermission } from "hooks";

const AddedItemList = dynamic(() => import("./AddedItemList"), {
  loading: () => {
    return <Loading />;
  },
});

const CreateTransactionDialog = dynamic(() => import("./CreateTransactionDialog"), {
  loading: () => {
    return <Loading />;
  },
});

const PartnerItemList = () => {
  const { messages } = useIntl();
  const [open, toggle] = useToggle(false);

  const { hasPermission: writePermission } = usePermission("write_transaction");

  return (
    <Provider>
      <Grid container>
        <Grid item xs={12}>
          <AddedItemList />
        </Grid>
        <Grid item xs={12}>
          <History />
        </Grid>
        <Grid item xs={12}>
          <Stack flexDirection="row" justifyContent="space-between">
            <BackButton pathname={`/${PARTNERS}`} />

            {/* Hide on this version */}
            {/* {writePermission && (
              <Button
                variant="contained"
                onClick={() => {
                  toggle(true);
                }}
              >
                {messages["payment"]}
              </Button>
            )} */}
          </Stack>

          {/* Hide on this version */}
          {/* <CreateTransactionDialog
            {...{
              open,
              toggle,
            }}
          /> */}
        </Grid>
      </Grid>
    </Provider>
  );
};

export default PartnerItemList;
