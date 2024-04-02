import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Range } from "react-date-range";
import { cloneDeep, omit } from "lodash";
import { useMountedState } from "react-use";
import { useCallback, useMemo, useState } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

import {
  ADMIN_ISSUES_END_POINT,
  ADMIN_ISSUES_RELATED_ITEMS_END_POINT,
} from "__generated__/END_POINT";
import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

import { Spacing, WrapperTable } from "components";
import { setFilterValue, transformDate, transformUrl } from "libs";
import { useFetch, useNotification, usePermission, useToggle, useUser } from "hooks";

import axios from "axios.config";
import DynamicMessage from "messages";
import ModalFormissuesRelated from "./ModalFormissuesRelated";
import IssuesRelatedItemsTable from "../columns/IssuesRelatedItemsTable";

export type PartnerFilterType = {
  page: 1;
  page_size: 25;
  with_count: boolean;
  range: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
};

const defaultFilterValue: PartnerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
};

const omitFields = ["range", "range_params"];

interface Props {
  id?: number;
  isID: boolean;
  owner: any;
}

export default function TableRelatedItem({ id, isID = false, owner }: Props) {
  const [filter, setFilter] = useState(defaultFilterValue);

  const { id: idUser } = useUser();
  const { hasPermission: writePermission } = usePermission("write_issue");

  const router = useRouter();
  const isMounted = useMountedState();
  const { messages, formatMessage } = useIntl();
  const { open, onOpen, onClose } = useToggle();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ISSUE_VIEW_TYPE_V1>(
      transformUrl(ADMIN_ISSUES_RELATED_ITEMS_END_POINT, {
        issue: isID ? id : router.query.idx,
      })
    );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range") return;

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

  const onSubmit = useCallback(async ({ data }: { data: any }) => {
    try {
      setLoading(true);
      const { data: resData } = await axios.post(
        ADMIN_ISSUES_RELATED_ITEMS_END_POINT,
        data
      );

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.createSuccessfully, {
          content: "loại dữ liệu",
        })
      );

      // if (noParent) {
      //   router.push(`${EDIT}/${resData.id}`);
      // } else {
      //   router.push(`${EDIT}/${resData.parent.id}`);
      // }
    } catch (err) {
      enqueueSnackbarWithError(err);
    } finally {
      if (isMounted()) {
        setLoading(false);
      }
    }
  }, []);

  const resetTable = useCallback(() => {
    refreshData();
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Box>
      <ModalFormissuesRelated
        id={id}
        isID={isID}
        handleClose={() => onClose()}
        open={open}
        resetTable={resetTable}
      />

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">Danh sách dữ liệu liên quan</Typography>

        {idUser === owner.id || writePermission ? (
          <Button onClick={() => onOpen()}>Thêm</Button>
        ) : null}
      </Stack>

      <Spacing spacing={1.5} />
      <WrapperTable>
        <IssuesRelatedItemsTable
          data={data ?? []}
          count={itemCount}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
        />
      </WrapperTable>
    </Box>
  );
}
