import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps, useRowSelect } from "react-table";

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
  WrapperTableHeaderCell,
} from "components/TableV3";
import { EDIT, TAG } from "routes";
import { CommonTableProps } from "interfaces";
import { DeleteButton, ViewButton } from "components";
import { TAG_GROUP_TYPE_V1 } from "__generated__/apiType_v1";

type TagTableProps = CommonTableProps<TAG_GROUP_TYPE_V1> & Record<string, any>;

export default function TagColumn(props: TagTableProps) {
  const {
    data,
    count,
    onPageChange,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

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
        Header: <FormattedMessage id={`table.tag_groups`} />,
        accessor: "tag_groups",
        Cell: (props: PropsWithChildren<CellProps<TAG_GROUP_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell minWidth={170}>{value}</WrapperTableCell>;
        },
        colSpan: 3,
      },

      {
        Header: <FormattedMessage id={`table.module`} />,
        accessor: "module",
        Cell: (props: PropsWithChildren<CellProps<TAG_GROUP_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.source_type");

          return (
            <WrapperTableHeaderCell minWidth={190}>
              <FormattedMessage id={`table.module_type.${value}`} />
            </WrapperTableHeaderCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission, deleteHandler } = props;

          // if (loading) return <Skeleton />;

          return (
            <Stack flexDirection="row" columnGap={1} alignItems="center">
              <ViewButton href={`/${TAG}/${EDIT}/${row.original.id}`} />
              {writePermission && (
                <DeleteButton
                  disabled={!writePermission}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 120,
        maxWidth: 120,
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
  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={renderHeaderContentForSelectedRow}
            />
          </TableHead>
          <TableBody>
            <RenderBody loading={isLoading} table={table} />
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="flex-end">
        <TablePagination
          count={count}
          page={pagination.pageIndex}
          rowsPerPage={pagination.pageSize}
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
