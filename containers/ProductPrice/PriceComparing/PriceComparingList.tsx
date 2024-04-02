import { useMeasure } from "react-use";
import { cloneDeep, get } from "lodash";
import { Box, Grid, Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { Sticky } from "hocs";
import { CREATE, PRODUCT_PRICE_LIST } from "routes";
import { setFilterValue, transformUrl } from "libs";
import { TableHeader, WrapperTable } from "components";
import { useFetch, useLayout, usePermission } from "hooks";
import {
  PRICE_TABLE_TYPE_V1,
  ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import {
  ADMIN_PRICE_TABLES_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_END_POINT,
} from "__generated__/END_POINT";

import Filter from "./Filter";
import FilterTagPrice from "./FilterTagPrice";
import PriceComparingColumn from "../column/PriceComparingColumn";

export type PriceComparingListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search: string;
  category: Required<ADMIN_PRODUCT_CATEGORY_VIEW_TYPE_V1> | null;
};

const defaultFilterValue: PriceComparingListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  category: null,
  search: "",
};

const defaultPriceTableFilterValue = {
  page: 1,
  page_size: 25,
  with_count: true,
  active: true,
};

export default function PriceComparingList() {
  const [tag, setTag] = useState([]);
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { hasPermission: writePermission } = usePermission("write_price_table");

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey } =
    useFetch<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, filter)
    );

  const { data: dataPriceTable } = useFetch<PRICE_TABLE_TYPE_V1>(
    transformUrl(ADMIN_PRICE_TABLES_END_POINT, defaultPriceTableFilterValue)
  );

  const handleAddTag = useCallback((value) => {
    setTag(value);
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;
        let categoryId = get(cloneFilter, "category.id");

        const params = cloneDeep(cloneFilter);
        changeKey(
          transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, {
            ...params,

            category: categoryId,

            page: 1,
          })
        );
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(transformUrl(ADMIN_PRODUCTS_VARIANTS_END_POINT, defaultFilterValue));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <FilterTagPrice tag={dataPriceTable} handleAddTag={handleAddTag} />

        <Filter
          handleAddTag={handleAddTag}
          tag={tag}
          filter={filter}
          onSearchChange={onFilterChangeHandler("search")}
          onCategoryChange={onFilterChangeHandler("category")}
          resetFilter={resetFilterHandler}
        />
      </Grid>
      <Grid item xs={10}>
        <Sticky>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title="Danh Sách Sản Phẩm"
                pathname={`/${PRODUCT_PRICE_LIST}/${CREATE}`}
              />
            </Box>

            <WrapperTable>
              <PriceComparingColumn
                tag={tag}
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                writePermission={writePermission}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 190
                }
              />
            </WrapperTable>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
}
