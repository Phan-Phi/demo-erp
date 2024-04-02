import { Row } from "react-table";
import { useIntl } from "react-intl";
import { cloneDeep, get } from "lodash";
import { useRouter } from "next/router";
import { Box, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";

import DynamicMessage from "messages";
import FormAmountAndType from "./FormAmountAndType";
import ProductPriceVariantColumn from "../column/ProductPriceVariantColumn";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  updateRequest,
  setFilterValue,
  createLoadingList,
} from "libs";
import { LoadingButton } from "components";
import { useProductPrice } from "../context/ProductPriceProvider";
import { PRICE_TABLE_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRICE_TABLES_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { useConfirmation, useFetch, useMutateTable, useNotification } from "hooks";

export type ProductPriceFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
};

const defaultFilterValue: ProductPriceFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

export default function ListProductPriceVariant() {
  const { query } = useRouter();
  const { messages, formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { setUpdateData } = useProductPrice();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [changeAmountState, setChangeAmountState] = useState<string>("0");
  const [changeTypeState, setChangeTypeState] = useState<any>("discount_percentage");

  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const { data, isLoading, itemCount, refreshData, changeKey } =
    useFetch<PRICE_TABLE_VARIANT_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRICE_TABLES_VARIANTS_END_POINT, { ...filter, table: query.id })
    );

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    setUpdateLoading,
    resetEditRowHandler,
  } = useMutateTable({});

  useEffect(() => {
    let obj = {
      mutate: refreshData,
    };

    setUpdateData(obj);
  }, []);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_PRICE_TABLES_VARIANTS_END_POINT, {
            ...cloneFilter,
            table: query.id,
          })
        );
        // return {};
      };
    },
    [filter]
  );

  const handleChangeAmountAndType = useCallback((key: string) => {
    return (value: any) => {
      if (key === "changeTypeState") {
        setChangeTypeState(value);
      }

      if (key === "changeAmountState") {
        setChangeAmountState(value);
      }
    };
  }, []);

  const updateHandler = useCallback((data: Row<{ id: number }>[]) => {
    return async () => {
      let bodyList: any[] = [];
      let trueLoadingList = {};
      let falseLoadingList = {};

      data.forEach((el) => {
        let id = el.original.id;

        trueLoadingList[id] = true;
        falseLoadingList[id] = false;

        const currentData = editData.current[id];

        const changeAmountTable = get(currentData, "change_amount") || "0";

        const variantProduct = get(el, "original.variant.id") || "0";

        const idTable = get(el, "original.table.id") || "0";
        const changeTypeTable = get(currentData, "change_type") || "discount_percentage";

        bodyList.push({
          id,
          variant: variantProduct,
          table: idTable,
          change_type: changeTypeTable,
          change_amount: changeAmountTable,
        });
      });

      try {
        setUpdateLoading((prev) => {
          return {
            ...prev,
            ...trueLoadingList,
            all: true,
          };
        });

        const results = await updateRequest(
          ADMIN_PRICE_TABLES_VARIANTS_END_POINT,
          bodyList
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "đơn hàng",
            })
          );

          removeEditRowDataHandler(data)();

          refreshData();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        setUpdateLoading((prev) => {
          return {
            ...prev,
            ...falseLoadingList,
            all: false,
          };
        });
      }
    };
  }, []);

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
        const results = await deleteRequest(ADMIN_PRICE_TABLES_VARIANTS_END_POINT, list);

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "sản phẩm",
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
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const updateHandlerAll = useCallback(
    ({ data }) => {
      const handler = async () => {
        let bodyList: any[] = [];

        data.forEach((el) => {
          let id = el.original.id;

          const idTable = get(el, "original.table.id") || "0";
          const variantProduct = get(el, "original.variant.id") || "0";

          bodyList.push({
            id,
            table: idTable,
            variant: variantProduct,
            change_type: changeTypeState,
            change_amount: changeAmountState,
          });
        });

        try {
          const results = await updateRequest(
            ADMIN_PRICE_TABLES_VARIANTS_END_POINT,
            bodyList
          );

          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.updateSuccessfully, {
                content: "điều chỉnh giá",
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
        message: "Bạn có muốn điều chỉnh giá hàng loạt?",
      });
    },
    [changeAmountState, changeTypeState]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Box>
      <ProductPriceVariantColumn
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        deleteHandler={deleteHandler}
        editData={editData}
        loading={updateLoading}
        maxHeight={350}
        updateHandler={updateHandler}
        activeEditRow={activeEditRow}
        activeEditRowHandler={activeEditRowHandler}
        updateEditRowDataHandler={updateEditRowDataHandler}
        removeEditRowDataHandler={removeEditRowDataHandler}
        renderHeaderContentForSelectedRow={(tableInstance) => {
          const selectedRows = tableInstance.selectedFlatRows;

          return (
            <Stack flexDirection="row" columnGap={3} alignItems="center">
              <Typography>
                {`${formatMessage(DynamicMessage.selectedRow, {
                  length: selectedRows.length,
                })}`}
              </Typography>

              <FormAmountAndType
                amountState={changeAmountState}
                discountTypeState={changeTypeState}
                onChangeType={handleChangeAmountAndType("changeTypeState")}
                onChangeAmount={handleChangeAmountAndType("changeAmountState")}
              />

              <LoadingButton
                onClick={() => {
                  updateHandlerAll({
                    data: selectedRows,
                  });
                }}
                color="primary2"
                children="Gửi"
              />

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
    </Box>
  );
}
