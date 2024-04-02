import { get } from "lodash";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { PropsWithChildren, useMemo } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, Stack, Typography } from "@mui/material";
import { CellProps, useTable, useSortBy } from "react-table";

import DynamicMessage from "messages";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForSelection,
  TableHeaderForSelection,
} from "components/TableV3";

import { formatPhoneNumber } from "libs";
import { CommonTableProps, Unit as IUnit } from "interfaces";
import { WrapperTable, DeleteButton, LoadingButton } from "components";
import { USAGE_LIMIT_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type UserByUserTableProps = CommonTableProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1> &
  Record<string, any>;

const UserByUserTable = (props: UserByUserTableProps) => {
  const {
    getTable,
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    deleteHandler,
    setListSelectedRow,
    onChangeData,
    ...restProps
  } = props;

  const { formatMessage, messages } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        accessor: "selection",
        Header: (props) => {
          const { getToggleAllRowsSelectedProps } = props;

          return (
            <TableHeaderForSelection
              getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
            />
          );
        },
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          return <TableCellForSelection row={row} />;
        },
        maxWidth: 64,
        width: 64,
      },

      {
        Header: <FormattedMessage id={`table.id`} />,
        accessor: "id",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.content_object.id");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Tài khoản",
        accessor: "object_repr",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.object_repr");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Đối tượng áp dụng",
        accessor: "content_type",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.content_type");

          return <WrapperTableCell>{messages[`table.${value}`]}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.last_name`} />,
        accessor: "last_name",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.content_object.last_name") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.first_name`} />,
        accessor: "first_name",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.content_object.first_name") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.content_object.main_phone_number") || "-";

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.email`} />,
        accessor: "email",
        Cell: (
          props: PropsWithChildren<CellProps<USAGE_LIMIT_ITEM_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.content_object.email") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, loading: addLoading } = props;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <DeleteButton
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHandler({
                    data: [row],
                  });
                }}
              />
            </Stack>
          );
        },
        width: 90,
        maxWidth: 90,
        sticky: "right",
      },
    ];
  }, []);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      ...restProps,
    },
    useSortBy,
    useSticky,
    useRowSelect
  );

  //   useEffect(() => {
  //     setListSelectedRow(table.selectedFlatRows);
  //   }, [table.selectedFlatRows.length]);

  return (
    <WrapperTable>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
                  </Stack>
                );
              }}
            />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>

        <Box display="flex" justifyContent="flex-end">
          <TablePagination
            count={count}
            page={pagination.pageIndex}
            rowsPerPage={pagination.pageSize}
            onPageChange={(_, page) => {
              onPageChange(page);
            }}
            onRowsPerPageChange={onPageSizeChange}
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </Box>
      </TableContainer>
    </WrapperTable>
  );
};

export default UserByUserTable;
