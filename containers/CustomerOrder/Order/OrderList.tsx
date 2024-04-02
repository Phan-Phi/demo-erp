import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep, omit, get, set } from "lodash";
import { Grid, Stack, Box, Button } from "@mui/material";

import Filter from "../Filter";
import OrderListTable from "./OrderListTable";
import ExportButton from "components/Button/ExportButton";
import { TableHeader, Link, WrapperTable, LoadingDynamic } from "components";

import DynamicMessage from "messages";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";
import { ORDERS, CREATE, USERS, DETAIL, EXPORTS, INVOICE } from "routes";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  transformDate,
  setFilterValue,
  createLoadingList,
  convertTagsNameToString,
} from "libs";

import {
  useFetch,
  useToggle,
  useLayout,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_ORDER_ORDER_VIEW_TYPE_V1,
  ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1,
  ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

import { ADMIN_ORDERS_END_POINT } from "__generated__/END_POINT";

const TagsModal = dynamic(import("../../../compositions/TagsModal/TagsModal"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

export type OrderListFilterType = {
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
  owner: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
  channel: ADMIN_ORDER_PURCHASE_CHANNEL_VIEW_TYPE_V1 | null;
  status: string;
  shipping_method: ADMIN_SHIPPING_SHIPPING_METHOD_VIEW_TYPE_V1 | null;
  tag_names_params: any[];
  tag_names: string;
  product_variant: Required<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1> | null;
};

const defaultFilterValue: OrderListFilterType = {
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
  owner: null,
  channel: null,
  status: "",
  shipping_method: null,
  tag_names_params: [],
  tag_names: "",
  product_variant: null,
};

type OrderListProps = {
  filterAll: string;
  setFilterAll: React.Dispatch<React.SetStateAction<string>>;
};

const omitFields = ["range", "range_params", "tag_names_params"];

const OrderList = ({ filterAll, setFilterAll }: OrderListProps) => {
  const { hasPermission: writePermission } = usePermission("write_order");
  const { hasPermission: exportInvoiceQuantityPermission } = usePermission(
    "export_invoice_quantity"
  );

  const {
    open: isOpenTagsModal,
    onOpen: onOpenTagsModal,
    onClose: onCloseTagsModal,
  } = useToggle();
  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [objectId, setObjectId] = useState(0);
  const [objectTable, setObjectTable] = useState<any>({});
  const [hideAndShow, setHideAndShow] = useState<any>(SELECTED_TABLE.orders);
  const [filter, setFilter] = useState<OrderListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_END_POINT, omit(filter, omitFields))
    );

  useEffect(() => {
    if (filterAll === "") return;

    const cloneFilter = cloneDeep(filter);

    cloneFilter.status = filterAll;

    setFilter(cloneFilter);

    changeKey(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...omit(cloneFilter, omitFields),
      })
    );
  }, [filterAll]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "tag_names_params") return;

        const params = cloneDeep(cloneFilter);

        let startDate = transformDate(cloneFilter.range_params.startDate, "date_start");
        let endDate = transformDate(cloneFilter.range_params.endDate, "date_end");

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        set(params, "owner", get(params, "owner.id"));
        set(params, "channel", get(params, "channel.id"));
        set(params, "shipping_method", get(params, "shipping_method.id"));
        set(params, "product_variant", get(params, "product_variant.id"));

        changeKey(
          transformUrl(ADMIN_ORDERS_END_POINT, {
            ...omit(params, omitFields),
            date_placed_start: isStartDate ? startDate : undefined,
            date_placed_end: isEndDate ? endDate : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let startDate = transformDate(updateFilter.range_params.startDate, "date_start");
    let endDate = transformDate(updateFilter.range_params.endDate, "date_end");

    let isStartDate = updateFilter.range_params.startDate;
    let isEndDate = updateFilter.range_params.endDate;

    const params = cloneDeep(updateFilter);

    set(params, "owner", get(params, "owner.id"));
    set(params, "channel", get(params, "channel.id"));
    set(params, "shipping_method", get(params, "shipping_method.id"));
    set(params, "product_variant", get(params, "product_variant.id"));

    changeKey(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...omit(params, omitFields),
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const onClickFilterTag = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let listTagsName = convertTagsNameToString(cloneFilter.tag_names_params);

    let updateFilter = {
      ...cloneFilter,
      tag_names: listTagsName,
    };

    setFilter(updateFilter);

    let startDate = transformDate(updateFilter.range_params.startDate, "date_start");
    let endDate = transformDate(updateFilter.range_params.endDate, "date_end");

    let isStartDate = updateFilter.range_params.startDate;
    let isEndDate = updateFilter.range_params.endDate;

    const params = cloneDeep(updateFilter);

    set(params, "owner", get(params, "owner.id"));
    set(params, "channel", get(params, "channel.id"));
    set(params, "shipping_method", get(params, "shipping_method.id"));
    changeKey(
      transformUrl(ADMIN_ORDERS_END_POINT, {
        ...omit(params, omitFields),
        date_placed_start: isStartDate ? startDate : undefined,
        date_placed_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilterAll("");
    setFilter(defaultFilterValue);
    changeKey(transformUrl(ADMIN_ORDERS_END_POINT, omit(defaultFilterValue, omitFields)));
  }, [filter]);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return el.original.status === "Draft";
        });

        if (get(filteredData, "length") === 0) return;

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_ORDERS_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "đơn hàng",
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
    },
    []
  );

  const onGotoHandler = useCallback((data: Row<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>) => {
    const receiverId = get(data, "original.receiver.id");

    if (receiverId) {
      window.open(`/${USERS}/${DETAIL}/${receiverId}`, "_blank");
    }
  }, []);

  const onViewTagsHandler = useCallback((id: number) => {
    setObjectId(id);
    onOpenTagsModal();
  }, []);

  const onGotoExportFileHandler = useCallback(() => {
    window.open(`/${EXPORTS}/${INVOICE}`, "_blank");
  }, []);

  const getTable = useCallback((item) => {
    setObjectTable(item);
  }, []);

  const showAndHideTable = useCallback((item) => {
    setHideAndShow((el) => {
      const index = el.findIndex((el) => el === item);

      if (index === -1) {
        return [...el, item];
      } else {
        const data = el.filter((el) => el !== item);
        return [...data];
      }
    });
  }, []);

  return (
    <Box>
      <TagsModal
        objectId={objectId}
        open={isOpenTagsModal}
        refreshData={refreshData}
        onClose={onCloseTagsModal}
        source_type={SOURCE_TYPE_FOR_TAGS.order}
      />

      <Grid container>
        <Grid item xs={2}>
          <Filter
            filter={filter}
            setFilter={setFilter}
            resetFilter={resetFilterHandler}
            onClickFilterTag={onClickFilterTag}
            onFilterByTime={onClickFilterByTime}
            onOwnerChange={onFilterChangeHandler("owner")}
            onSearchChange={onFilterChangeHandler("search")}
            onStatusChange={onFilterChangeHandler("status")}
            onDateRangeChange={onFilterChangeHandler("range")}
            onChannelChange={onFilterChangeHandler("channel")}
            onTagsChange={onFilterChangeHandler("tag_names_params")}
            onShippingMethodChange={onFilterChangeHandler("shipping_method")}
            onProductVariantChange={onFilterChangeHandler("product_variant")}
          />
        </Grid>

        <Grid item xs={10}>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                title={messages["listingOrder"] as string}
                objectTable={objectTable}
                showAndHideTable={showAndHideTable}
              >
                <Stack flexDirection="row" columnGap={2} alignItems="center">
                  {exportInvoiceQuantityPermission && (
                    <ExportButton onClick={onGotoExportFileHandler} />
                  )}
                  <Link href={`/${ORDERS}/${CREATE}`}>
                    <Button>{messages["createNewButton"]}</Button>
                  </Link>
                </Stack>
              </TableHeader>
            </Box>

            <WrapperTable>
              <OrderListTable
                data={data ?? []}
                count={itemCount}
                messages={messages}
                getTable={getTable}
                isLoading={isLoading}
                pagination={pagination}
                hideAndShow={hideAndShow}
                deleteHandler={deleteHandler}
                onGotoHandler={onGotoHandler}
                writePermission={writePermission}
                onViewTagsHandler={onViewTagsHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
              />
            </WrapperTable>

            <Box padding="20px" />
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderList;
