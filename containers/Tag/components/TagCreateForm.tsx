import { useIntl } from "react-intl";
import { Controller } from "react-hook-form";
import { Autocomplete, Box, Chip, Grid, MenuItem, Typography } from "@mui/material";

import { usePermission } from "hooks";
import { TAG_GROUP_SOURCE_TYPE } from "constant";
import { FormControl, FormControlForSelect, InputForAutocomplete } from "compositions";

export default function TagCreateForm({ control, handle, state }: any) {
  const { formatMessage, messages } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_tag_group");

  return (
    <Grid container>
      <Grid item xs={6}>
        <Controller
          control={control}
          name="name"
          render={(props) => {
            return (
              <FormControl
                controlState={props}
                label="Tên"
                placeholder="Tên nhóm tag"
                FormControlProps={{ required: true }}
                InputProps={{
                  ...(!writePermission && {
                    readOnly: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={6}>
        <Controller
          control={control}
          name="source_type"
          render={(props) => {
            return (
              <FormControlForSelect
                controlState={props}
                renderItem={() => {
                  return TAG_GROUP_SOURCE_TYPE.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                }}
                label="Module"
                FormControlProps={{
                  required: true,
                  ...(!writePermission && {
                    disabled: true,
                  }),
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Box>
          <Autocomplete
            multiple={true}
            id="tags"
            options={state}
            defaultValue={[...state] as any}
            freeSolo
            onChange={(_, data) => {
              handle(data);
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => (
                <Chip variant="outlined" label={option} {...getTagProps({ index })} />
              ))
            }
            filterSelectedOptions={true}
            renderInput={(props) => {
              return (
                <InputForAutocomplete
                  {...props}
                  label="Tag (tùy chọn)"
                  placeholder="Tag (tùy chọn)"
                  FormHelperTextProps={
                    <Typography>Điền tên và bấm enter để tạo</Typography>
                  }
                />
              );
            }}
          />
        </Box>
      </Grid>
    </Grid>
  );
}
