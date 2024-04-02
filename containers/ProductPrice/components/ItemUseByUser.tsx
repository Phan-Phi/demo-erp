import { Row } from "react-table";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { cloneDeep, get } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useIntl } from "react-intl";
import { useUsedByUser } from "../context/UsedByUserProvider";
import { useConfirmation, useFetch, useNotification } from "hooks";
import { USAGE_LIMIT_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT } from "__generated__/END_POINT";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";

import DynamicMessage from "messages";
import UserByUserTable from "./UserByUserTable";
import { PRICE_TABLE_USAGE_LIMIT_ITEM_VIEW } from "constant";

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

interface Props {
  contentType: string;
}

export default function ItemUseByUser({ contentType }: Props) {
  const { query } = useRouter();
  const { formatMessage } = useIntl();
  const { setUpdateData } = useUsedByUser();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [filter, setFilter] = useState(defaultFilterValue);

  const { data, isLoading, itemCount, refreshData, changeKey } =
    useFetch<USAGE_LIMIT_ITEM_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT, {
        ...filter,
        table: query.id,
        content_type: contentType,
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
        changeKey(
          transformUrl(ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT, {
            ...cloneFilter,
            table: query.id,
            content_type: contentType,
          })
        );
      };
    },
    [filter, contentType]
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
          ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT,
          list
        );

        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "đối tượng áp dụng",
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

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Box>
      <UserByUserTable
        data={data ?? []}
        count={itemCount}
        isLoading={isLoading}
        pagination={pagination}
        deleteHandler={deleteHandler}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
      />
    </Box>
  );
}
