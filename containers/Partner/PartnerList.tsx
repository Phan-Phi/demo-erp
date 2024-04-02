import { Row } from "react-table";
import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useMeasure } from "react-use";
import { useCallback, useMemo, useState } from "react";

import { cloneDeep, omit, get } from "lodash";
import { Grid, Stack, Box } from "@mui/material";

import Filter from "./Filter";
import PartnerTable from "./components/PartnerTable";
import { TableHeader, WrapperTable, LoadingDynamic } from "components";

import {
  useFetch,
  useLayout,
  useToggle,
  usePermission,
  useConfirmation,
  useNotification,
} from "hooks";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
  convertTagsNameToString,
} from "libs";

import DynamicMessage from "messages";
import { PARTNERS, CREATE } from "routes";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";
import { ADMIN_PARTNERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const TagsModal = dynamic(import("../../compositions/TagsModal/TagsModal"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

export type PartnerFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  use_cache: string | boolean;

  total_debt_amount_start: string;
  total_debt_amount_end: string;

  total_debt_params: {
    total_debt_amount_start: string;
    total_debt_amount_end: string;
  };

  total_purchase_start: string;
  total_purchase_end: string;

  total_purchase_params: {
    total_purchase_start: string;
    total_purchase_end: string;
  };
  tag_names_params: any[];
  tag_names: string;
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  use_cache: "false",

  total_debt_amount_start: "",
  total_debt_amount_end: "",

  total_debt_params: {
    total_debt_amount_start: "",
    total_debt_amount_end: "",
  },

  total_purchase_start: "",
  total_purchase_end: "",

  total_purchase_params: {
    total_purchase_start: "",
    total_purchase_end: "",
  },
  tag_names_params: [],
  tag_names: "",
};

const omitFields = [
  "total_purchase_params",
  "total_debt_params",
  "total_debt_amount_start",
  "total_debt_amount_end",
  "total_purchase_start",
  "total_purchase_end",
  "tag_names_params",
];

const Component = () => {
  const { hasPermission: writePermission } = usePermission("write_partner");

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
  const [hideAndShow, setHideAndShow] = useState<any>(SELECTED_TABLE.partners);
  const [filter, setFilter] = useState<PartnerFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading, refreshData } =
    useFetch<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1>(
      transformUrl(ADMIN_PARTNERS_END_POINT, omit(filter, omitFields))
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (
          key === "total_debt_amount_start" ||
          key === "total_debt_amount_end" ||
          key === "total_purchase_start" ||
          key === "total_purchase_end" ||
          key === "tag_names_params"
        )
          return;

        changeKey(
          transformUrl(ADMIN_PARTNERS_END_POINT, {
            ...omit(cloneFilter, omitFields),
            total_debt_amount_start:
              cloneFilter.total_debt_params.total_debt_amount_start,
            total_debt_amount_end: cloneFilter.total_debt_params.total_debt_amount_end,
            total_purchase_start: cloneFilter.total_purchase_params.total_purchase_start,
            total_purchase_end: cloneFilter.total_purchase_params.total_purchase_end,
          })
        );
      };
    },
    [filter]
  );

  const onFilterDebt = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFiler = {
      ...cloneFilter,
      total_debt_params: {
        total_debt_amount_start: cloneFilter.total_debt_amount_start,
        total_debt_amount_end: cloneFilter.total_debt_amount_end,
      },
    };

    setFilter(updateFiler);

    changeKey(
      transformUrl(ADMIN_PARTNERS_END_POINT, {
        ...omit(updateFiler, omitFields),
        total_debt_amount_start: updateFiler.total_debt_params.total_debt_amount_start,
        total_debt_amount_end: updateFiler.total_debt_params.total_debt_amount_end,
        total_purchase_start: cloneFilter.total_purchase_params.total_purchase_start,
        total_purchase_end: cloneFilter.total_purchase_params.total_purchase_end,
      })
    );
  }, [filter]);

  const onFilterPurchase = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      total_purchase_params: {
        total_purchase_start: cloneFilter.total_purchase_start,
        total_purchase_end: cloneFilter.total_purchase_end,
      },
    };

    setFilter(updateFilter);

    changeKey(
      transformUrl(ADMIN_PARTNERS_END_POINT, {
        ...omit(updateFilter, omitFields),
        total_debt_amount_start: cloneFilter.total_debt_params.total_debt_amount_start,
        total_debt_amount_end: cloneFilter.total_debt_params.total_debt_amount_end,
        total_purchase_start: updateFilter.total_purchase_params.total_purchase_start,
        total_purchase_end: updateFilter.total_purchase_params.total_purchase_end,
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

    changeKey(
      transformUrl(ADMIN_PARTNERS_END_POINT, {
        ...omit(updateFilter, omitFields),
        total_debt_amount_start: cloneFilter.total_debt_params.total_debt_amount_start,
        total_debt_amount_end: cloneFilter.total_debt_params.total_debt_amount_end,
        total_purchase_start: updateFilter.total_purchase_params.total_purchase_start,
        total_purchase_end: updateFilter.total_purchase_params.total_purchase_end,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_PARTNERS_END_POINT, omit(defaultFilterValue, omitFields))
    );
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const deleteHandler = useCallback(
    ({ data }: { data: Row<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1>[] }) => {
      const handler = async () => {
        const filteredData = data.filter((el) => {
          return !el.original.is_used;
        });

        if (get(filteredData, "length") === 0) {
          return;
        }

        const { list } = createLoadingList(filteredData);

        try {
          const results = await deleteRequest(ADMIN_PARTNERS_END_POINT, list);
          const result = checkResArr(results);

          if (result) {
            enqueueSnackbarWithSuccess(
              formatMessage(DynamicMessage.deleteSuccessfully, {
                content: "đối tác",
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
        message: "Bạn có chắc muốn xóa",
      });
    },

    []
  );

  const onViewTagsHandler = useCallback((id: number) => {
    setObjectId(id);
    onOpenTagsModal();
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
        source_type={SOURCE_TYPE_FOR_TAGS.partner}
      />

      <Grid container>
        <Grid item xs={2}>
          <Filter
            filter={filter}
            setFilter={setFilter}
            onFilterDebt={onFilterDebt}
            resetFilter={resetFilterHandler}
            onClickFilterTag={onClickFilterTag}
            onFilterPurchase={onFilterPurchase}
            onSearchChange={onFilterChangeHandler("search")}
            onTagsChange={onFilterChangeHandler("tag_names_params")}
            onChangePriceEnd={onFilterChangeHandler("total_debt_amount_end")}
            onChangePurchaseEnd={onFilterChangeHandler("total_purchase_end")}
            onChangePurchaseStart={onFilterChangeHandler("total_purchase_start")}
            onChangePriceStart={onFilterChangeHandler("total_debt_amount_start")}
          />
        </Grid>

        <Grid item xs={10}>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader
                objectTable={objectTable}
                showAndHideTable={showAndHideTable}
                title={messages["listingPartner"] as string}
                pathname={`/${PARTNERS}/${CREATE}`}
              />
            </Box>

            <WrapperTable>
              <PartnerTable
                hideAndShow={hideAndShow}
                getTable={getTable}
                data={data ?? []}
                count={itemCount}
                pagination={pagination}
                isLoading={isLoading}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                deleteHandler={deleteHandler}
                writePermission={writePermission}
                onViewTagsHandler={onViewTagsHandler}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
              />
            </WrapperTable>
          </Stack>

          <Box padding="20px" />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Component;
