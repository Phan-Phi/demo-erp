import { Grid } from "@mui/material";

import HeaderEdit from "./components/HeaderEdit";
import TimeLineIssuesMain from "compositions/TimeLine/TimeLineIssuesMain";
import TimeLineItemContainer from "compositions/TimeLine/TimeLineItemContainer";

import { Container, Divider, Spacing } from "components";

export default function EditIssues() {
  return (
    <Container>
      <Grid container>
        <Grid item xs={12}>
          <HeaderEdit />

          <Spacing spacing={3} />
          <Divider />
          <Spacing spacing={3} />

          <TimeLineIssuesMain />
        </Grid>

        <Grid item xs={12} sx={{ paddingTop: "0 !important", marginTop: "3rem" }}>
          <TimeLineItemContainer />
        </Grid>
      </Grid>
    </Container>
  );
}
