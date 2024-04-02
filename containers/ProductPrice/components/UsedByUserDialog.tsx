import { Row } from "react-table";
import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Box, Stack } from "@mui/material";
import { useMountedState } from "react-use";
import { Fragment, useCallback, useMemo, useState } from "react";

import DynamicMessage from "messages";
import UsedByUserDialogColumn from "../column/UsedByUserDialogColumn";

import { useUsedByUser } from "../context/UsedByUserProvider";
import { BackButton, Dialog, LoadingButton } from "components";
import { useFetch, useMutateTable, useNotification } from "hooks";
import { checkResArr, createRequest, setFilterValue, transformUrl } from "libs";

import { ADMIN_USERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_USER_USER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import FilterProductPriceDialog from "./FilterProductPriceDialog";

export type CreateProductPriceItemDialogFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
  is_staff: boolean;
};

const defaultFilterValue: CreateProductPriceItemDialogFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  is_staff: true,
  use_cache: false,
};

type AddUsedByUserProps = {
  open: boolean;
  onClose: () => void;
};

export default function UsedByUserDialog(props: AddUsedByUserProps) {
  const { onClose, open } = props;

  const router = useRouter();
  const { updateData } = useUsedByUser();

  const { formatMessage, messages } = useIntl();
  const [addLoading, setAddLoading] = useState({});
  const [dataLineTable, setDataLineTable] = useState([]);
  const [listSelectedRow, setListSelectedRow] = useState<any>([]);
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const isMounted = useMountedState();
  const [filter, setFilter] =
    useState<CreateProductPriceItemDialogFilterType>(defaultFilterValue);

  const {
    data: editData,
    activeEditRow,
    activeEditRowHandler,
    updateEditRowDataHandler,
    removeEditRowDataHandler,
    resetEditRowHandler,
  } = useMutateTable({});

  const {
    data: dataTable,
    changeKey,
    itemCount,
    isLoading,
    refreshData,
  } = useFetch<ADMIN_USER_USER_VIEW_TYPE_V1>(
    transformUrl(ADMIN_USERS_END_POINT, { ...filter })
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_USERS_END_POINT, {
            ...cloneFilter,
            is_staff: true,
          })
        );
      };
    },
    [filter]
  );

  const onChangeData = useCallback((value) => {
    setDataLineTable([]);
  }, []);

  const addHandler = useCallback(
    async ({ data }: { data: Row<any>[] }) => {
      let trueLoadingList = {};
      let falseLoadingList = {};
      let bodyList: any[] = [];

      data.forEach((el) => {
        const id = el.original.id;
        falseLoadingList[id] = false;
        trueLoadingList[id] = true;

        bodyList.push({
          object_id: id,
          table: router.query.id,
          content_type: "account.user",
        });
      });

      setAddLoading((prev) => {
        return {
          ...prev,
          ...trueLoadingList,
          all: true,
        };
      });

      try {
        const results = await createRequest(
          "/api/v1/admin/price-tables/usage-limit-item/",
          bodyList
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "phạm vi áp dụng",
            })
          );

          refreshData();
          onClose();
          updateData.mutate();
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          resetEditRowHandler();

          setAddLoading((prev) => {
            return {
              ...prev,
              ...falseLoadingList,
              all: false,
            };
          });
        }
      }
    },
    [updateData]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Dialog
      {...{
        open,
        onClose,
        DialogProps: {
          PaperProps: {
            sx: {
              width: "90vw",
              maxWidth: "90vw",
              maxHeight: "90vh",
            },
          },
        },
        DialogTitleProps: {
          children: "Danh sách Sale phụ trách",
        },

        dialogContentTextComponent: () => {
          return (
            <Stack spacing={2}>
              <FilterProductPriceDialog
                filter={filter}
                onSearch={onFilterChangeHandler("search")}
              />

              <UsedByUserDialogColumn
                data={dataTable ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                writePermission={true}
                loading={addLoading}
                maxHeight="55vh"
                addHandler={addHandler}
                setListSelectedRow={setListSelectedRow}
                onChangeData={onChangeData}
                editData={editData}
                activeEditRow={activeEditRow}
                activeEditRowHandler={activeEditRowHandler}
                updateEditRowDataHandler={updateEditRowDataHandler}
                removeEditRowDataHandler={removeEditRowDataHandler}
              />

              <Box padding="10px" />
            </Stack>
          );
        },
        DialogActionsProps: {
          children: (
            <Fragment>
              <BackButton
                disabled={!!addLoading["all"]}
                onClick={() => {
                  onClose();
                }}
              />

              <LoadingButton
                disabled={!!addLoading["all"]}
                loading={!!addLoading["all"]}
                onClick={() => {
                  if (listSelectedRow.length > 0) {
                    addHandler({ data: listSelectedRow as any[] });
                  }
                }}
              >
                Thêm
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
}
