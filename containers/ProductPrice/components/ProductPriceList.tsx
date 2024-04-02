import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Box, Button, Grid, Stack, Typography } from "@mui/material";
import { useCallback, useMemo, useRef, useState } from "react";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";
import { Sticky } from "hocs";
import { CREATE, PRODUCT_PRICE_LIST } from "routes";
import { Link, TableHeader, WrapperTable } from "components";
import { ADMIN_PRICE_TABLES_END_POINT } from "__generated__/END_POINT";
import { PRICE_TABLE_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { useConfirmation, useFetch, useNotification, usePermission } from "hooks";

import DynamicMessage from "messages";
import ProductPriceTable from "./ProductPriceTable";

export type ProductPriceListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: ProductPriceListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

export default function ProductPriceList() {
  const tableInstance = useRef<any>();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [filter, setFilter] = useState(defaultFilterValue);
  const { hasPermission: writePermission } = usePermission("write_price_table");
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<PRICE_TABLE_VARIANT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRICE_TABLES_END_POINT, filter)
    );

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(ADMIN_PRICE_TABLES_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "bảng giá sản phẩm",
            })
          );

          tableInstance?.current?.mutate();
          refreshData();
          onClose();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        const params = cloneDeep(cloneFilter);
        changeKey(transformUrl(ADMIN_PRICE_TABLES_END_POINT, { ...params, page: 1 }));
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
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={12}>
        <Sticky>
          <Stack spacing={2}>
            <Box>
              <Stack
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">Danh Sách Bảng Giá Sản Phẩm</Typography>

                {writePermission && (
                  <Link href={`/${PRODUCT_PRICE_LIST}/${CREATE}`}>
                    <Button>{messages["createNewButton"]}</Button>
                  </Link>
                )}
              </Stack>
              {/* <TableHeader
                title="Danh Sách Bảng Giá Sản Phẩm"
                pathname={`/${PRODUCT_PRICE_LIST}/${CREATE}`}
              /> */}
            </Box>

            <WrapperTable>
              <ProductPriceTable
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                deleteHandler={deleteHandler}
                writePermission={writePermission}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
              />
            </WrapperTable>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
}
