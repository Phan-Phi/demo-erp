import get from "lodash/get";

import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { cloneDeep, omit } from "lodash";
import { useCallback, useMemo, useState } from "react";
import { Grid, Stack, Box, Typography } from "@mui/material";

import DynamicMessage from "messages";
import DiscountColumnV2 from "./columns/DiscountColumnV2";

import { CREATE, DISCOUNTS } from "routes";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { ADMIN_DISCOUNTS_END_POINT } from "__generated__/END_POINT";
import { deleteRequest, checkResArr, createLoadingList } from "libs";
import { LoadingButton, TableHeader, WrapperTable } from "components";
import { ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

import {
  useFetch,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

export type ProductListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;

  search: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };

  order_date: Range;
  orderDate_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: ProductListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,

  search: "",
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },

  order_date: {
    startDate: undefined,
    endDate: undefined,
    key: "order_date",
  },
  orderDate_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const omitFiled = [
  "range",
  "range_params",
  "date_start",
  "date_end",

  "order_date",
  "orderDate_params",
  "discount_amount_end",
  "discount_amount_start",
];

const ProductDiscounts = () => {
  const { hasPermission: writePermission } = usePermission("write_voucher");
  const { hasPermission: readPermission } = usePermission("read_voucher");

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [filter, setFilter] = useState<ProductListFilterType>(defaultFilterValue);

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_DISCOUNTS_END_POINT, omit(filter, omitFiled))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "order_date") return;

        let dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");
        let dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        let orderDateStart = transformDate(
          cloneFilter.orderDate_params.startDate,
          "date_start"
        );
        let orderDateEnd = transformDate(
          cloneFilter.orderDate_params.endDate,
          "date_end"
        );

        let isDateStart = cloneFilter.range_params.startDate;
        let isDateEnd = cloneFilter.range_params.endDate;

        let isOrderDateStart = cloneFilter.orderDate_params.startDate;
        let isOrderDateEnd = cloneFilter.orderDate_params.endDate;

        changeKey(
          transformUrl(ADMIN_DISCOUNTS_END_POINT, {
            ...omit(cloneFilter, omitFiled),
            publication_date_start: isDateStart ? dateStart : undefined,
            publication_date_end: isDateEnd ? dateEnd : undefined,
            available_for_purchase_start: isOrderDateStart ? orderDateStart : undefined,
            available_for_purchase_end: isOrderDateEnd ? orderDateEnd : undefined,
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
        const results = await deleteRequest(ADMIN_DISCOUNTS_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "khuyến mãi",
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
              title="Danh sách chương trình giảm"
              pathname={`/${DISCOUNTS}/${CREATE}`}
            />
          </Box>

          <WrapperTable>
            <DiscountColumnV2
              data={data ?? []}
              count={itemCount}
              pagination={pagination}
              isLoading={isLoading}
              deleteHandler={deleteHandler}
              writePermission={writePermission}
              readPermission={readPermission}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={layoutState.windowHeight - (height + layoutState.sumHeight) - 70}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
                  </Stack>
                );
              }}
            />
          </WrapperTable>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default ProductDiscounts;
