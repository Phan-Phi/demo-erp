import { useCallback, useMemo } from "react";
import { Box, Grid, Stack, Typography, styled } from "@mui/material";
import ToDoListItem from "./ToDoListItem";
import { useFetch } from "hooks";
import { ADMIN_ORDER_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import {
  ADMIN_ORDERS_END_POINT,
  ADMIN_WAREHOUSES_RECORDS_END_POINT,
} from "__generated__/END_POINT";
import { transformUrl } from "libs";
import { omit } from "lodash";
import { useRouter } from "next/router";

interface Props {
  title: string;
}

const filter = {
  page: 1,
  page_size: 25,
};

export default function ToDoList({ title }: Props) {
  const { push } = useRouter();
  const { itemCount: itemCountDraft, data } = useFetch<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_END_POINT, { ...filter, status: "Draft" })
  );

  const handle = useCallback(() => {
    push("/warehouses/edit/83");
  }, []);

  return (
    <Wrapper>
      <Title>{title}</Title>

      <Grid container>
        <ToDoListItem
          name="Sản phẩm tồn kho thấp"
          count={itemCountDraft ?? 0}
          countGrid={4}
          onClick={handle}
          borderRight={false}
        />
      </Grid>
    </Wrapper>
  );
}

const Wrapper = styled(Box)(({ theme }) => {
  return {
    marginBottom: "1rem",
  };
});

const Title = styled(Typography)(({ theme }) => {
  return {
    fontSize: "18px",
    lineHeight: 1.6,
    fontWeight: 700,
  };
});
