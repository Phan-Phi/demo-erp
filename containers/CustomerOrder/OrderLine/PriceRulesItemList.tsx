import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Stack, styled, Typography, Box } from "@mui/material";

import { LoadingDynamic, WrapperTable } from "components";
import PriceRulesItemListTable from "./table/PriceRulesItemListTable";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";

import { PRICE_RULE_ITEM_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_PRICE_RULES_ITEMS_END_POINT } from "__generated__/END_POINT";

type PriceRulesItemListProps = {
  id: number;
};

type defaultValuesFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  line: number | undefined;
};

const defaultValueFiler: defaultValuesFilterType = {
  page: 1,
  page_size: 10,
  with_count: true,
  line: undefined,
};

export default function PriceRulesItemList(props: PriceRulesItemListProps) {
  const { id } = props;

  const [filter, setFilter] = useState<defaultValuesFilterType>(defaultValueFiler);

  const { data, changeKey, isLoading, itemCount } = useFetch<PRICE_RULE_ITEM_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_PRICE_RULES_ITEMS_END_POINT, {
      ...filter,
      line: id,
    })
  );

  useEffect(() => {
    if (id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_PRICE_RULES_ITEMS_END_POINT, {
          ...filter,
          line: id,
        })
      );
    }
  }, [id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_PRICE_RULES_ITEMS_END_POINT, {
            ...cloneFilter,
            line: id,
          })
        );
      };
    },
    [filter, id]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  if (data == undefined) return <LoadingDynamic />;

  return (
    <Stack gap="16px">
      <StyledTitle>Danh sách thay đổi giá</StyledTitle>

      <WrapperTable>
        <PriceRulesItemListTable
          data={data ?? []}
          count={itemCount}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          maxHeight={300}
        />
      </WrapperTable>

      <Box />
    </Stack>
  );
}

const StyledTitle = styled(Typography)(() => {
  return {
    fontSize: 16,
    lineHeight: "20px",
    fontWeight: 700,
  };
});
