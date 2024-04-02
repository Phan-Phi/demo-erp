import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { cloneDeep, get, omit } from "lodash";
import { Box, Grid, Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import {
  ADMIN_DISCOUNTS_END_POINT,
  ADMIN_DISCOUNTS_VOUCHERS_END_POINT,
} from "__generated__/END_POINT";
import { CREATE, DISCOUNTS, VOUCHER } from "routes";
import { TableHeader, WrapperTable } from "components";
import { useConfirmation, useFetch, useNotification, usePermission } from "hooks";
import {
  checkResArr,
  createLoadingList,
  deleteRequest,
  setFilterValue,
  transformUrl,
} from "libs";

import DynamicMessage from "messages";
import DiscountVoucherColumn from "../columns/DiscountVoucherColumn";
import { ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type ProductListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: ProductListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

export default function DiscountVoucher() {
  const [ref, { height }] = useMeasure();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { hasPermission: writePermission } = usePermission("write_voucher");
  const { hasPermission: readPermission } = usePermission("read_voucher");

  const [filter, setFilter] = useState<ProductListFilterType>(defaultFilterValue);
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_DISCOUNTS_VOUCHERS_END_POINT, omit(filter))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "order_date") return;

        changeKey(
          transformUrl(ADMIN_DISCOUNTS_END_POINT, {
            ...omit(cloneFilter),
          })
        );
      };
    },
    [filter]
  );

  const deleteHandler = useCallback(({ data }: { data: Row<any>[] }) => {
    const handler = async () => {
      const filteredData = data.filter((el) => {
        return el.original.id;
      });
      if (get(filteredData, "length") === 0) {
        return;
      }

      const { list } = createLoadingList(filteredData);
      try {
        const results = await deleteRequest(ADMIN_DISCOUNTS_VOUCHERS_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "mã khuyến mãi",
            })
          );

          refreshData();

          onClose();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa",
    });
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Stack spacing={2}>
          <Box ref={ref}>
            <TableHeader
              title="Danh sách mã giảm giá"
              pathname={`/${DISCOUNTS}/${VOUCHER}/${CREATE}`}
            />
          </Box>

          <WrapperTable>
            <DiscountVoucherColumn
              data={data ?? []}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              deleteHandler={deleteHandler}
              readPermission={readPermission}
              writePermission={writePermission}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
            />
          </WrapperTable>
        </Stack>
      </Grid>
    </Grid>
  );
}
