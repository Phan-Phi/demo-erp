import { Row } from "react-table";
import { cloneDeep, get } from "lodash";
import { Box, Stack } from "@mui/material";
import { Fragment, useCallback, useMemo, useState } from "react";

import DynamicMessage from "messages";
import ProductPriceDialogColumn from "../column/ProductPriceDialogColumn";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { BackButton, Dialog, LoadingButton } from "components";
import { useFetch, useMutateTable, useNotification } from "hooks";
import { useProductPrice } from "../context/ProductPriceProvider";
import { checkResArr, createRequest, setFilterValue, transformUrl } from "libs";

import {
  ADMIN_PRICE_TABLES_VARIANTS_END_POINT,
  ADMIN_PRODUCTS_END_POINT,
} from "__generated__/END_POINT";
import FilterProductPriceDialog from "./FilterProductPriceDialog";
import { SELECTED_DISCOUNT_TYPE } from "constant";

export type CreateProductPriceItemDialogFilterType = {
  search?: string;
  page: number;
  page_size: number;
  with_count: boolean;
  use_cache: boolean;
};

const defaultFilterValue: CreateProductPriceItemDialogFilterType = {
  search: "",
  page: 1,
  page_size: 25,
  with_count: true,
  use_cache: false,
};

type AddProductPriceProps = {
  open: boolean;
  onClose: () => void;
};

export default function CreateProductPriceDialog(props: AddProductPriceProps) {
  const { onClose, open } = props;
  const { updateData } = useProductPrice();

  const router = useRouter();
  const { formatMessage, messages } = useIntl();
  const [addLoading, setAddLoading] = useState({});
  const [dataLineTable, setDataLineTable] = useState([]);
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();
  const [listSelectedRow, setListSelectedRow] = useState<any>([]);

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
  } = useFetch<any>(
    transformUrl(ADMIN_PRODUCTS_END_POINT, {
      ...filter,
    })
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(ADMIN_PRODUCTS_END_POINT, {
            ...cloneFilter,
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

        const currentData = editData.current[id];
        const unitTable = get(currentData, "unit") || get(el, "original.unit");

        const changeAmountTable = get(currentData, "change_amount") || "0";
        const changeTypeTable = get(currentData, "change_type") || "discount_percentage";

        bodyList.push({
          variant: el.original.id,
          table: router.query.id,
          change_type: changeTypeTable,
          change_amount: changeAmountTable,
          unit: unitTable ? unitTable : null,
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
          ADMIN_PRICE_TABLES_VARIANTS_END_POINT,
          bodyList
        );
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.addSuccessfully, {
              content: "sản phẩm",
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
          children: messages["addProduct"],
        },

        dialogContentTextComponent: () => {
          return (
            <Stack spacing={2}>
              <FilterProductPriceDialog
                filter={filter}
                onSearch={onFilterChangeHandler("search")}
              />

              <ProductPriceDialogColumn
                discountType={SELECTED_DISCOUNT_TYPE}
                data={dataTable ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                writePermission={true}
                loading={addLoading}
                maxHeight="62vh"
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
                {messages["addProduct"]}
              </LoadingButton>
            </Fragment>
          ),
        },
      }}
    />
  );
}
