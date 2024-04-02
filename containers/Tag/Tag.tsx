import { cloneDeep } from "lodash";
import { useIntl } from "react-intl";
import { Box, Grid, Stack } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import {
  checkResArr,
  transformUrl,
  deleteRequest,
  setFilterValue,
  createLoadingList,
} from "libs";
import { Sticky } from "hocs";
import { CREATE, TAG } from "routes";
import { TableHeader, WrapperTable } from "components";
import { ADMIN_TAG_GROUPS_END_POINT } from "__generated__/END_POINT";
import { useConfirmation, useFetch, useNotification, usePermission } from "hooks";

import DynamicMessage from "messages";
import TagColumn from "./columns/TagColumn";
import { TAG_GROUP_TYPE_V1 } from "__generated__/apiType_v1";

export type TagFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
};

const defaultFilterValue: TagFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
};

export default function Tag() {
  const { formatMessage, messages } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [filter, setFilter] = useState(defaultFilterValue);
  const { hasPermission: writePermission } = usePermission("write_tag_group");
  const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

  const { data, isLoading, itemCount, changeKey, refreshData } =
    useFetch<TAG_GROUP_TYPE_V1>(transformUrl(ADMIN_TAG_GROUPS_END_POINT, filter));

  const deleteHandler = useCallback(({ data }) => {
    const handler = async () => {
      const { list } = createLoadingList(data);

      try {
        const results = await deleteRequest(ADMIN_TAG_GROUPS_END_POINT, list);
        const result = checkResArr(results);

        if (result) {
          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.deleteSuccessfully, {
              content: "tag",
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

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        // if (key === "range") return;

        changeKey(transformUrl(ADMIN_TAG_GROUPS_END_POINT, cloneFilter));
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

  return (
    <Grid container>
      <Grid item xs={2}></Grid>
      <Grid item xs={12}>
        <Sticky>
          <Stack spacing={2}>
            <Box>
              <TableHeader title="Quản lý Tag" pathname={`/${TAG}/${CREATE}`} />
            </Box>

            <WrapperTable>
              <TagColumn
                data={data ?? []}
                count={itemCount}
                isLoading={isLoading}
                pagination={pagination}
                writePermission={writePermission}
                deleteHandler={deleteHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
              />
            </WrapperTable>
          </Stack>
        </Sticky>
      </Grid>
    </Grid>
  );
}
