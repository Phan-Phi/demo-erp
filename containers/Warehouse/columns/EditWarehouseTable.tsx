import { Row } from "react-table";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";

import { useSnackbar } from "notistack";
import { cloneDeep, get, isEmpty } from "lodash";
import { Grid, Stack, TextField, Typography } from "@mui/material";

import ToDoList from "../components/ToDoList";
import EditWarehouseColumn from "./EditWarehouseColumn";
import { Loading, LoadingButton, WrapperTable } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import FilterEdit from "../FilterEdit";

import {
  checkResArr,
  transformUrl,
  setFilterValue,
  createLoadingList,
  getValueForUpdatingRow,
  updateRequest,
} from "libs";

import {
  useFetch,
  useLayout,
  useMutateTable,
  useNotification,
  useConfirmation,
} from "hooks";

import { ADMIN_WAREHOUSES_RECORDS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_RESOLVER } from "__generated__/PATCH_YUP";
import dynamic from "next/dynamic";

const Total = dynamic(() => import("../components/ToDoList"), {
  loading: () => {
    return <Loading />;
  },
});

export type EditWarehouseTableFilterType = {
  with_count: boolean;
  search?: string;
  page: number;
  page_size: number;
  lowStockThreshold: any;
  is_below_threshold: string;
};

const defaultFilterValue: EditWarehouseTableFilterType = {
  with_count: true,
  search: "",
  page: 1,
  page_size: 25,
  lowStockThreshold: null,
  is_below_threshold: "",
};

const defaultValueWarehouse = {
  price: "0",
  price_incl_tax: "0",
  low_stock_threshold: null,
};

export default function EditWarehouseTable() {
  const { query } = useRouter();
  const [ref, { height }] = useMeasure();
  const { enqueueSnackbar } = useSnackbar();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [state, setState] = useState<string>();

  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [filter, setFilter] = useState<EditWarehouseTableFilterType>(defaultFilterValue);

  const { handleSubmit, setValue } = useForm({
    resolver: ADMIN_WAREHOUSES_RECORDS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    setUpdateLoading,
  } = useMutateTable({});

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1>(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
        ...filter,
        warehouse: query.id,
      })
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

        changeKey(
          transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
            ...cloneFilter,
            warehouse: query.id,
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

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_WAREHOUSES_RECORDS_END_POINT, {
        ...defaultFilterValue,
        warehouse: query.id,
      })
    );
  }, [query.id]);

  const updateHandler = useCallback(
    (data: Row<{ id: number }>[]) => {
      return async () => {
        if (isEmpty(editData.current)) {
          removeEditRowDataHandler(data)();
          return;
        }

        let bodyList: any[] = [];
        let trueLoadingList = {};
        let falseLoadingList = {};

        data.forEach((el) => {
          let id = el.original.id;
          trueLoadingList[id] = true;
          falseLoadingList[id] = false;

          const body = getValueForUpdatingRow(
            Object.keys(defaultValueWarehouse),
            editData.current[id],
            el.original
          );

          bodyList.push({
            id,
            ...body,
          });
        });

        try {
          let resList: any[] = [];

          setUpdateLoading((prev) => {
            return {
              ...prev,
              ...trueLoadingList,
              all: true,
            };
          });

          for await (const el of bodyList) {
            Object.keys(el).forEach((key) => {
              setValue(key, el[key]);
            });

            await handleSubmit(
              async (data) => {
                // const { id, ...restBody } = data;
                const { id, price, price_incl_tax, low_stock_threshold } = data;
                const keyEditData = editData.current[id];

                const isLowStockThreshold =
                  Object.keys(keyEditData).includes("low_stock_threshold");

                const isPrice = Object.keys(keyEditData).includes("price");

                const isAll =
                  Object.keys(keyEditData).includes("low_stock_threshold") &&
                  Object.keys(keyEditData).includes("price");

                if (isLowStockThreshold) {
                  const resData = await axios.patch(
                    `${ADMIN_WAREHOUSES_RECORDS_END_POINT}${id}/`,
                    { low_stock_threshold: low_stock_threshold }
                  );

                  resList.push(resData);
                }

                if (isPrice) {
                  const resData = await axios.patch(
                    `${ADMIN_WAREHOUSES_RECORDS_END_POINT}${id}/`,
                    { price: price, price_incl_tax: String(parseFloat(price_incl_tax)) }
                  );

                  resList.push(resData);
                }

                if (isAll) {
                  await axios.patch(`${ADMIN_WAREHOUSES_RECORDS_END_POINT}${id}/`, {
                    low_stock_threshold: low_stock_threshold,
                  });

                  const resData = await axios.patch(
                    `${ADMIN_WAREHOUSES_RECORDS_END_POINT}${id}/`,
                    { price: price, price_incl_tax: String(parseFloat(price_incl_tax)) }
                  );

                  resList.push(resData);
                }
              },
              (err) => {
                Object.keys(err).forEach((key) => {
                  enqueueSnackbar(`${key}: ${err?.[key]?.message}`, {
                    variant: "error",
                  });
                });

                throw new Error("");
              }
            )();
          }

          const result = checkResArr(resList);

          if (result) {
            removeEditRowDataHandler(data)();

            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.updateSuccessfully, {
                content: "thông tin sản phẩm trong kho",
              })
            );

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
    },
    [editData]
  );

  const updateLowStockThreshold = useCallback(
    ({ data }) => {
      const handler = async () => {
        let bodyList: any[] = [];

        data.forEach((el) => {
          const currentData = el.original;

          const id = get(currentData, "id") || "0";

          bodyList.push({
            id,
            low_stock_threshold: state,
          });
        });

        try {
          const results = await updateRequest(
            ADMIN_WAREHOUSES_RECORDS_END_POINT,
            bodyList
          );
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "tồn kho thấp",
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
        message: "Bạn có chắc muốn cập nhật tất cả tồn kho thấp đã chọn?",
      });
    },
    [state]
  );

  const renderToDoList = useMemo(() => {
    return <Total isLoading={isLoading} />;
  }, [isLoading]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={2}>
        <FilterEdit
          filter={filter}
          resetFilter={resetFilterHandler}
          onSearchChange={onFilterChangeHandler("search")}
          onChangeIsBelowThreshold={onFilterChangeHandler("is_below_threshold")}
        />
      </Grid>

      <Grid item xs={10}>
        <Fragment>
          {renderToDoList}
          {/* <ToDoList /> */}
          <WrapperTable ref={ref}>
            <EditWarehouseColumn
              data={data ?? []}
              count={itemCount}
              isLoading={isLoading}
              pagination={pagination}
              onPageChange={onFilterChangeHandler("page")}
              onPageSizeChange={onFilterChangeHandler("pageSize")}
              maxHeight={
                layoutState.windowHeight - (height + layoutState.sumHeight) - 140
              }
              updateLowStockThreshold={updateLowStockThreshold}
              editData={editData}
              loading={updateLoading}
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
                    <TextField
                      onChange={(e) => {
                        setState(e.target.value);
                      }}
                    />

                    <LoadingButton
                      onClick={() => {
                        updateLowStockThreshold({
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
          </WrapperTable>
        </Fragment>
      </Grid>
    </Grid>
  );
}
