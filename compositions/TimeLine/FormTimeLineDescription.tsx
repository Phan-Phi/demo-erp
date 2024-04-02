import { Grid, Stack, styled } from "@mui/material";
import FormControlForRichText from "compositions/Input/FormControlForRichText";
import { Controller } from "react-hook-form";

export default function FormTimeLineDescription({ control }) {
  return (
    <Grid container>
      <Grid item xs={12}>
        <Controller
          control={control}
          name="description"
          render={(props) => {
            return <FormControlForRichText controlState={props} />;
          }}
        />
      </Grid>
    </Grid>
  );
}
