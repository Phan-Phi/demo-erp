import { Row } from "react-table";
import { useMeasure } from "react-use";
import { Range } from "react-date-range";
import { Box, Button, Grid, Stack } from "@mui/material";
import { cloneDeep, get, omit } from "lodash";

import {
  useConfirmation,
  useFetch,
  useLayout,
  useNotification,
  usePermission,
  useToggle,
} from "hooks";
import {
  checkResArr,
  convertTagsNameToString,
  createLoadingList,
  deleteRequest,
  setFilterValue,
  transformDate,
  transformUrl,
} from "libs";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";

import { useIntl } from "react-intl";
import { ISSUES, CREATE } from "routes";
import { TagsModal } from "compositions";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { useCallback, useMemo, useState } from "react";
import { Link, TableHeader, WrapperTable } from "components";

import DynamicMessage from "messages";
import Filter from "./components/Filter";
import IssuesTable from "./columns/IssuesTable";

export type PartnerFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
  no_parent: boolean;
  search?: string;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  tag_names_params: any[];
  tag_names: string;
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  no_parent: true,
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
  tag_names_params: [],
  tag_names: "",
};
const omitFields = ["range", "range_params", "tag_names_params"];

export default function ListingIssues() {
  const {
    open: isOpenTagsModal,
    onOpen: onOpenTagsModal,
    onClose: onCloseTagsModal,
  } = useToggle();

  const [objectId, setObjectId] = useState(0);
  const [filter, setFilter] = useState(defaultFilterValue);

  const [ref, { height }] = useMeasure();
  const { state: layoutState } = useLayout();
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { hasPermission: writePermission } = usePermission("write_issue");
  const { hasPermission: writeTagsPermission } = usePermission("write_tag_group");
  const { hasPermission: readPermission } = usePermission("read_issue");

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ISSUE_VIEW_TYPE_V1>(transformUrl(ADMIN_ISSUES_END_POINT, filter));

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

        changeKey(
          transformUrl(ADMIN_ISSUES_END_POINT, {
            ...omit(params, omitFields),
            date_created_start: isStartDate ? startDate : undefined,
            date_created_end: isEndDate ? endDate : undefined,
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

    changeKey(
      transformUrl(ADMIN_ISSUES_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const onViewTagsHandler = useCallback((id: number) => {
    setObjectId(id);
    onOpenTagsModal();
  }, []);

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

    changeKey(
      transformUrl(ADMIN_ISSUES_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isStartDate ? startDate : undefined,
        date_created_end: isEndDate ? endDate : undefined,
      })
    );
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    changeKey(transformUrl(ADMIN_ISSUES_END_POINT, omit(defaultFilterValue, omitFields)));
  }, [filter]);

  const deleteHandler = useCallback(({ data }: { data: Row<any>[] }) => {
    const handler = async () => {
      const filteredData = data.filter((el) => {
        return el.original.id;
      });

      if (get(filteredData, "length") === 0) return;

      const { list } = createLoadingList(filteredData);
      // return;
      try {
        const results = await deleteRequest(ADMIN_ISSUES_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "khiếu nại",
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
      <TagsModal
        objectId={objectId}
        open={isOpenTagsModal}
        refreshData={refreshData}
        onClose={onCloseTagsModal}
        source_type={SOURCE_TYPE_FOR_TAGS.issue}
      />
      <Grid container>
        <Grid item xs={2}>
          <Filter
            filter={filter}
            setFilter={setFilter}
            resetFilter={resetFilterHandler}
            onClickFilterTag={onClickFilterTag}
            onSearch={onFilterChangeHandler("search")}
            onTagsChange={onFilterChangeHandler("tag_names_params")}
            onFilterByTime={onClickFilterByTime}
          />
        </Grid>
        <Grid item xs={10}>
          <Stack spacing={2}>
            <Box ref={ref}>
              <TableHeader title="Danh sách khiếu nại">
                <Link href={`/${ISSUES}/${CREATE}`}>
                  <Button>{messages["createNewButton"]}</Button>
                </Link>
              </TableHeader>
            </Box>

            <WrapperTable>
              <IssuesTable
                data={data ?? []}
                count={itemCount}
                // getTable={getTable}
                isLoading={isLoading}
                pagination={pagination}
                // hideAndShow={hideAndShow}
                deleteHandler={deleteHandler}
                // onGotoHandler={onGotoHandler}
                writeTagsPermission={writeTagsPermission}
                writePermission={writePermission}
                readPermission={readPermission}
                onViewTagsHandler={onViewTagsHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={
                  layoutState.windowHeight - (height + layoutState.sumHeight) - 48
                }
              />
            </WrapperTable>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
