import { useRouter } from "next/router";
import { Box, Stack, Typography, styled } from "@mui/material";

import { useFetch } from "hooks";
import { transformUrl } from "libs";
import { ADMIN_WAREHOUSES_RECORDS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { useEffect } from "react";

interface Props {
  isLoading: boolean;
}

export default function ToDoList({ isLoading }: Props) {
  const router = useRouter();

  const { itemCount, refreshData } = useFetch<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>(
    transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
      warehouse: router.query.id,
      is_below_threshold: true,
      page: 1,
      page_size: 1,
    })
  );

  useEffect(() => {
    refreshData();
  }, [isLoading]);

  return (
    <Wrapper direction="row" spacing={1}>
      <Title variant="h6">Số lượng sản phẩm có tồn kho thấp:</Title>
      <Number variant="h5">{itemCount}</Number>
    </Wrapper>
  );
}

const Wrapper = styled(Stack)(() => {
  return {
    padding: "1rem",
    backgroundColor: "#f5f5f5",
    marginBottom: "1rem",
    alignItems: "center",
  };
});

const Title = styled(Typography)(() => {
  return {};
});

const Number = styled(Typography)(() => {
  return {
    color: "red",
    fontWeight: 700,
  };
});
