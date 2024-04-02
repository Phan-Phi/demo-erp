import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useUpdateEffect } from "react-use";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { cloneDeep } from "lodash";
import { Box } from "@mui/material";

import { WrapperTable } from "components";
import PriceTableListTable from "./PriceTableListTable";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";
import DynamicMessage from "messages";
import { usePriceTable } from "./context/PriceTableContext";
import { useConfirmation, useFetch, useNotification } from "hooks";

import { PRICE_RULE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_PRICE_RULES_END_POINT } from "__generated__/END_POINT";

type PriceTableListFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  order: string | undefined;
};

const defaultFilterValue: PriceTableListFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  order: undefined,
};

export default function PriceTableList() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { setUpdateData, updateLineList } = usePriceTable();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [triggerRender, setTriggerRender] = useState(false);
  const [filter, setFilter] = useState<PriceTableListFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<PRICE_RULE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ORDERS_PRICE_RULES_END_POINT, {
        ...filter,
        order: router.query.id,
      })
    );

  useEffect(() => {
    let obj = {
      mutate: refreshData,
    };

    setUpdateData(obj);
  }, []);

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

  useUpdateEffect(() => {
    updateLineList.mutate();
  }, [triggerRender]);

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

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(ADMIN_ORDERS_PRICE_RULES_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "loại giá",
            })
          );
          refreshData();
          setTriggerRender((prev) => !prev);
        }
      } catch (error) {
        enqueueSnackbarWithError(error);
      } finally {
        onClose();
      }
    };

    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  return (
    <Box>
      <WrapperTable>
        <PriceTableListTable
          data={data ?? []}
          count={itemCount}
          pagination={pagination}
          isLoading={isLoading}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          maxHeight={300}
          deleteHandler={deleteHandler}
        />
      </WrapperTable>
    </Box>
  );
}
