import { isEmpty } from "lodash";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Controller } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";

import { LazyAutocomplete } from "components";
import { FormControl, FormControlForRichText } from "compositions";

import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";

export default function IssuesForm({ control }) {
  const { query } = useRouter();
  const { messages } = useIntl();

  return (
    <Grid container>
      <Grid item xs={query.type === "comment" ? 6 : 12}>
        <Controller
          control={control}
          name="title"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label="Tiêu đề"
                placeholder="Tiêu đề"
                FormControlProps={{
                  required: true,
                }}
                InputProps={{}}
              />
            );
          }}
        />
      </Grid>

      {query.type === "comment" && (
        <Grid item xs={6}>
          <LazyAutocomplete<any, any>
            {...{
              url: ADMIN_ISSUES_END_POINT,
              control,
              name: "parent",
              label: "Parent",
              AutocompleteProps: {
                renderOption(props, option) {
                  return (
                    <MenuItem {...props} value={option.id} children={option?.title} />
                  );
                },

                getOptionLabel: (option) => {
                  return option?.title;
                },
                isOptionEqualToValue: (option, value) => {
                  if (isEmpty(option) || isEmpty(value)) {
                    return true;
                  }

                  return option?.["id"] === value?.["id"];
                },
              },
              params: {
                no_parent: true,
              },
            }}
          />
        </Grid>
      )}

      <Grid item xs={12}>
        <Controller
          control={control}
          name="description"
          render={(props) => {
            return (
              <FormControlForRichText
                controlState={props}
                label={messages["productDescription"] as string}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}></Grid>
    </Grid>
  );
}
