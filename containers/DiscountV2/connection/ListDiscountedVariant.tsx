import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { cloneDeep, get } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";

import {
  checkResArr,
  createLoadingList,
  deleteRequest,
  setFilterValue,
  transformUrl,
  updateRequest,
} from "libs";
import { useConfirmation, useFetch, useMutateTable, useNotification } from "hooks";
import { ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_END_POINT } from "__generated__/END_POINT";

import DynamicMessage from "messages";
import ListDiscountedVariantColumn from "../columns/ListDiscountedVariantColumn";
import { LoadingButton, Select } from "components";
import { useDiscountedVariant } from "../context/DiscountedVariantProvider";

export type ListDiscountedVariantFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
};

const defaultFilterValue: ListDiscountedVariantFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

interface Props {
  type: string;
}

export default function ListDiscountedVariant({ type }: Props) {
  const { query } = useRouter();
  const { messages, formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { setUpdateData } = useDiscountedVariant();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [discountAmountState, setDiscountAmountState] = useState<string>("0");
  const [discountTypeState, setDiscountTypeState] = useState<any>("Percentage");

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

  const { data, isLoading, itemCount, changeKey, refreshData } = useFetch<any>(
    transformUrl(ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_END_POINT, {
      ...filter,
      sale: query.id,
    })
  );

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

        return {};
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
        const results = await deleteRequest(
          ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_END_POINT,
          list
        );

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "nhân viên trong bảng giá",
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

        const discountAmountTable = get(currentData, "discount_amount");
        const discountTypeTable = get(currentData, "discount_type");
        const usageLimitTable = get(currentData, "quantity_discount") || 0;

        bodyList.push({
          id,
          discount_type: discountTypeTable,
          discount_amount: discountAmountTable,
          usage_limit: usageLimitTable,
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
          ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_END_POINT,
          bodyList
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "sản phẩm giảm giá",
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

  const updateHandlerAll = useCallback(
    ({ data }) => {
      const handler = async () => {
        let bodyList: any[] = [];

        data.forEach((el) => {
          const currentData = el.original;

          const id = get(currentData, "id") || "0";

          bodyList.push({
            id,
            discount_amount: discountAmountState,
            discount_type: discountTypeState,
          });
        });

        try {
          const results = await updateRequest(
            ADMIN_DISCOUNTS_DISCOUNTED_VARIANTS_END_POINT,
            bodyList
          );
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "giảm giá sản phẩm",
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
        message: "Bạn có muốn cập nhật tất cả giảm giá đã chọn?",
      });
    },
    [discountAmountState, discountTypeState]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Box>
      <ListDiscountedVariantColumn
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        deleteHandler={deleteHandler}
        loading={updateLoading}
        editData={editData}
        updateHandler={updateHandler}
        activeEditRow={activeEditRow}
        activeEditRowHandler={activeEditRowHandler}
        updateEditRowDataHandler={updateEditRowDataHandler}
        removeEditRowDataHandler={removeEditRowDataHandler}
        typeDiscount={type}
        renderHeaderContentForSelectedRow={(tableInstance) => {
          const selectedRows = tableInstance.selectedFlatRows;

          return (
            <Stack flexDirection="row" columnGap={3} alignItems="center">
              <Typography>
                {`${formatMessage(DynamicMessage.selectedRow, {
                  length: selectedRows.length,
                })}`}
              </Typography>

              <Select
                renderItem={() => {
                  const changeType = ["Percentage", "Absolute"];

                  return changeType.map((el) => {
                    return (
                      <MenuItem
                        key={el}
                        value={el}
                        children={messages[`table.${el}`] as string}
                      />
                    );
                  });
                }}
                SelectProps={{
                  onChange: (e) => {
                    setDiscountTypeState(e.target.value);
                  },
                  value: discountTypeState,
                  placeholder: messages["filterGender"] as string,
                }}
              />
              <TextField
                onChange={(e) => {
                  setDiscountAmountState(e.target.value);
                }}
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
            </Stack>
          );
        }}
      />
    </Box>
  );
}
