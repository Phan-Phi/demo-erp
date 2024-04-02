import { Row } from "react-table";
import { cloneDeep } from "lodash";
import { useRouter } from "next/router";
import { useMountedState } from "react-use";
import { Fragment, useCallback, useMemo, useState } from "react";

import { useIntl } from "react-intl";
import { Stack } from "@mui/material";
import { BackButton, Dialog, LoadingButton } from "components";
import { useFetch, useMutateTable, useNotification } from "hooks";
import { useProductPrice } from "../context/ProductPriceProvider";
import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";
import { checkResArr, createRequest, setFilterValue, transformUrl } from "libs";

import DynamicMessage from "messages";
import ProductPriceCategoryDialogForm from "../form/ProductPriceCategoryDialogForm";
import ProductPriceCategoryDialogColumn from "../column/ProductPriceCategoryDialogColumn";
import FilterProductPriceDialog from "./FilterProductPriceDialog";

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

export default function ProductPriceCategoryDialog(props: AddProductPriceProps) {
  const { onClose, open } = props;

  const { query } = useRouter();
  const isMounted = useMountedState();
  const { updateData } = useProductPrice();
  const { formatMessage, messages } = useIntl();
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const [addLoading, setAddLoading] = useState({});
  const [listSelectedRow, setListSelectedRow] = useState<any>([]);
  const [changeAmountState, setChangeAmountState] = useState<string>("0");
  const [changeTypeState, setChangeTypeState] = useState<any>("discount_percentage");

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
    transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, {
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
          transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, {
            ...cloneFilter,
          })
        );
      };
    },
    [filter]
  );

  const addHandler = useCallback(
    async ({ data }: { data: Row<any>[] }) => {
      let trueLoadingList = {};
      let falseLoadingList = {};

      const limitToCategories = data.map((el) => el.original.id);

      setAddLoading((prev) => {
        return {
          ...prev,
          ...trueLoadingList,
          all: true,
        };
      });

      try {
        const results = await createRequest(
          "/api/v1/admin/price-tables/variants/bulk-upsert/",
          [
            {
              table: query.id,
              change_type: changeTypeState,
              change_amount: changeAmountState,
              limit_to_categories: limitToCategories,
            },
          ]
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
    [updateData, changeTypeState, changeAmountState]
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
              <ProductPriceCategoryDialogForm
                reducedValueType={changeTypeState}
                reducedValueAmount={changeAmountState}
                onChangeType={handleChangeAmountAndType("changeTypeState")}
                onChangeAmount={handleChangeAmountAndType("changeAmountState")}
              />

              <FilterProductPriceDialog
                filter={filter}
                onSearch={onFilterChangeHandler("search")}
              />

              <ProductPriceCategoryDialogColumn
                data={(dataTable as any) ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                writePermission={true}
                loading={addLoading}
                maxHeight="63vh"
                addHandler={addHandler}
                setListSelectedRow={setListSelectedRow}
                editData={editData}
                activeEditRow={activeEditRow}
                activeEditRowHandler={activeEditRowHandler}
                updateEditRowDataHandler={updateEditRowDataHandler}
                removeEditRowDataHandler={removeEditRowDataHandler}
              />
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
