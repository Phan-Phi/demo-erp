import React from "react";
import { useFieldArray, Control } from "react-hook-form";

import { isEmpty } from "lodash";
import { Box, MenuItem } from "@mui/material";

import { TagsSchemaProps } from "yups";
import { ADMIN_TAG_GROUPS_TAGS_END_POINT } from "__generated__/END_POINT";
import LazyAutocompleteMultiple from "compositions/Input/LazyAutocompleteMultiple";

type FormTagsProps = {
  control: Control<TagsSchemaProps>;
};

export default function FormTags({ control }: FormTagsProps) {
  const { fields, replace } = useFieldArray({
    control: control,
    name: "tags",
    keyName: "formId",
  });

  return (
    <Box>
      <LazyAutocompleteMultiple<any>
        multiple={true}
        label="Tags"
        placeholder="Tags"
        url={ADMIN_TAG_GROUPS_TAGS_END_POINT}
        AutocompleteProps={{
          value: fields,
          onChange: (_, data) => {
            replace(data);
          },
          renderOption(props, option) {
            return <MenuItem {...props} key={option.id} children={option.name} />;
          },
          getOptionLabel: (option) => {
            return option.name;
          },
          isOptionEqualToValue: (option, value) => {
            if (isEmpty(option) || isEmpty(value)) {
              return true;
            }
            return option?.["id"] === value?.["id"];
          },
        }}
      />
    </Box>
  );
}
