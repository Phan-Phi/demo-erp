import { Autocomplete, Box, Chip } from "@mui/material";
import { ADMIN_PRICE_TABLES_END_POINT } from "__generated__/END_POINT";

import { InputForAutocomplete } from "compositions";
import { useFetch } from "hooks";
import { CommonFilterTableProps } from "interfaces";
import { transformUrl } from "libs";
import { useEffect, useState } from "react";

interface FilterProps {
  handleAddTag: (value: any) => void;
  tag: any;
}

const defaultPriceTableFilterValue = {
  page: 1,
  page_size: 25,
  with_count: true,
};

export default function FilterTagPrice(props: FilterProps) {
  const { tag, handleAddTag } = props;

  return (
    <Box marginBottom={3}>
      <Autocomplete
        multiple={true}
        id="tags"
        options={tag ? tag.map((option) => option.name) : []}
        freeSolo
        onChange={(_, data) => {
          const name = tag.filter((el) => data.includes(el.name));
          handleAddTag(name);
        }}
        renderTags={(value: any, getTagProps) => {
          return value.map((option: string, index: number) => {
            const name = tag.filter((el) => el.name === option);

            if (name.length === 0) {
              return;
            }

            return (
              <Chip variant="outlined" label={name[0].name} {...getTagProps({ index })} />
            );
          });
        }}
        renderInput={(props) => {
          return (
            <InputForAutocomplete {...props} label="Bảng giá" placeholder="Bảng giá" />
          );
        }}
      />
    </Box>
  );
}
