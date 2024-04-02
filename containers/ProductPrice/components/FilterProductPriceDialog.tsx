import { useState } from "react";
import { Stack, Card, CardHeader, CardContent } from "@mui/material";

import { SearchField } from "components";

type FilterProps = {
  onSearch: (value: string | undefined) => void;
  filter: any;
};

const FilterProductPriceDialog = ({ filter, onSearch }: FilterProps) => {
  const [isReady, setIsReady] = useState(true);

  if (!isReady) return null;

  return (
    <Stack spacing={3}>
      <Card>
        <CardHeader title={"Tìm kiếm"} />
        <CardContent
          sx={{
            paddingTop: "0 !important",
          }}
        >
          <SearchField
            isShowIcon={false}
            initSearch={filter.search}
            onChange={(value) => {
              onSearch(value);
            }}
          />
        </CardContent>
      </Card>
    </Stack>
  );
};

export default FilterProductPriceDialog;
