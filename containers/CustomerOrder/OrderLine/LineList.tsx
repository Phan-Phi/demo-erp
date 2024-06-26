import {
  useMemo,
  Fragment,
  useState,
  Dispatch,
  useEffect,
  useContext,
  useCallback,
  SetStateAction,
} from "react";
import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import { cloneDeep, get } from "lodash";
import { Stack, Typography } from "@mui/material";

import LineTable from "./table/LineTable";
import { LoadingButton, LoadingDynamic } from "components";

import {
  checkResArr,
  transformUrl,
  updateRequest,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import {
  useFetch,
  usePermission,
  useMutateTable,
  useConfirmation,
  useNotification,
  useToggle,
} from "hooks";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { OrderLineContext } from "./Line";
import { usePriceTable } from "../PriceTable/context/PriceTableContext";

import { ADMIN_ORDERS_LINES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDER_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const ViewLineDetail = dynamic(() => import("./ViewLineDetail"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

export type LineListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  nested_depth: number;
  order: string | undefined;
};

const defaultFilterValue: LineListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
  nested_depth: 3,
  order: undefined,
};

type LineListProps = {
  setTriggerRender: Dispatch<SetStateAction<boolean>>;
};

const LineList = ({ setTriggerRender }: LineListProps) => {
  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    updateLoading,
    setUpdateLoading,
  } = useMutateTable();

  const {
    open: isOpenLineDetail,
    onOpen: onOpenLineDetail,
    onClose: onCloseLineDetail,
  } = useToggle();

  const router = useRouter();
  const { messages } = useIntl();
  const { formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const orderLineContext = useContext(OrderLineContext);
  const { hasPermission: writePermission } = usePermission("write_order");
  const { updateData: updatePriceTableData, setUpdateLineList } = usePriceTable();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [lineId, setLineId] = useState(0);
  const [filter, setFilter] = useState<LineListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_ORDER_LINE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    orderLineContext.set({
      mutateLineList: refreshData,
    });

    let obj = {
      mutate: refreshData,
    };

    setUpdateLineList(obj);
  }, []);

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
          ...defaultFilterValue,
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
          transformUrl(ADMIN_ORDERS_LINES_END_POINT, {
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

  const deleteHandler = useCallback(
    ({ data }) => {
      const handler = async () => {
        const { list } = createLoadingList(data);

        try {
          const results = await deleteRequest(ADMIN_ORDERS_LINES_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "sản phẩm",
              })
            );
            refreshData();
            updatePriceTableData.mutate();
            setTriggerRender((prev) => !prev);
          }
        } catch (err) {
          enqueueSnackbarWithError(err);
        } finally {
          onClose();
        }
      };

      onConfirm(handler, {
        message: "Bạn có chắc muốn xóa?",
      });
    },
    [updatePriceTableData]
  );

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

        const unitQuantity = get(currentData, "unit_quantity");

        if (unitQuantity) {
          bodyList.push({
            id,
            unit_quantity: unitQuantity,
          });
        }
      });

      try {
        setUpdateLoading((prev) => {
          return {
            ...prev,
            ...trueLoadingList,
            all: true,
          };
        });

        const results = await updateRequest(ADMIN_ORDERS_LINES_END_POINT, bodyList);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "đơn hàng",
            })
          );

          removeEditRowDataHandler(data)();

          refreshData();
          setTriggerRender((prev) => !prev);
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

  const onGotoHandler = useCallback((data: Row<ADMIN_ORDER_LINE_VIEW_TYPE_V1>) => {
    const productId = get(data, "original.variant.product.id");

    if (productId) {
      window.open(`/${PRODUCTS}/${productId}`, "_blank");
    }
  }, []);

  const onViewLineDetail = useCallback((data: Row<ADMIN_ORDER_LINE_VIEW_TYPE_V1>) => {
    const lineId = get(data, "original.id");

    if (lineId) {
      setLineId(lineId);
      onOpenLineDetail();
    }
  }, []);

  return (
    <Fragment>
      <LineTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        activeEditRow={activeEditRow}
        editData={editData}
        loading={updateLoading}
        writePermission={writePermission}
        onGotoHandler={onGotoHandler}
        activeEditRowHandler={activeEditRowHandler}
        updateEditRowDataHandler={updateEditRowDataHandler}
        removeEditRowDataHandler={removeEditRowDataHandler}
        deleteHandler={deleteHandler}
        updateHandler={updateHandler}
        onViewLineDetail={onViewLineDetail}
        maxHeight={300}
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

      <ViewLineDetail
        lineId={lineId}
        setLineId={setLineId}
        onClose={onCloseLineDetail}
        open={isOpenLineDetail}
      />
    </Fragment>
  );
};

export default LineList;
