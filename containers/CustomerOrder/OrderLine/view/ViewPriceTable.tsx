import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Box } from "@mui/material";

import { Card } from "components";
import ViewPriceTableTable from "../table/ViewPriceTableTable";

import { useFetch } from "hooks";
import { setFilterValue, transformUrl } from "libs";

import { PRICE_RULE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_PRICE_RULES_END_POINT } from "__generated__/END_POINT";

type ViewPriceTableFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  order: string | undefined;
};

const defaultFilterValue: ViewPriceTableFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  order: undefined,
};

export default function ViewPriceTable() {
  const router = useRouter();

  const [filter, setFilter] = useState<ViewPriceTableFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch<PRICE_RULE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_PRICE_RULES_END_POINT, {
      ...filter,
      order: router.query.id,
    })
  );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_PRICE_RULES_END_POINT, {
          ...filter,
          order: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_ORDERS_PRICE_RULES_END_POINT, {
            ...cloneFilter,
            order: router.query.id,
          })
        );
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Box>
      <Card
        title="Thay đổi giá"
        body={
          <ViewPriceTableTable
            maxHeight={300}
            data={data ?? []}
            count={itemCount}
            isLoading={isLoading}
            pagination={pagination}
            onPageChange={onFilterChangeHandler("page")}
            onPageSizeChange={onFilterChangeHandler("pageSize")}
          />
        }
      />
    </Box>
  );
}
