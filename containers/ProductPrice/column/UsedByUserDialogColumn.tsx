import { get } from "lodash";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { Box, Stack } from "@mui/material";
import { CommonTableProps, Unit as IUnit } from "interfaces";

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

import { useChoice } from "hooks";
import { WrapperTable, AddButton } from "components";
import { formatPhoneNumber, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_USER_USER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type UsedByUserDialogColumnProps = CommonTableProps<ADMIN_USER_USER_VIEW_TYPE_V1> &
  Record<string, any>;

const UsedByUserDialogColumn = (props: UsedByUserDialogColumnProps) => {
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
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.id");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.username`} />,
        accessor: "username",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.username") || "-";

          return <WrapperTableCell minWidth={120}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.last_name`} />,
        accessor: "last_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.last_name") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.first_name`} />,
        accessor: "first_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.first_name") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.gender`} />,
        accessor: "gender",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const { genders } = useChoice();

          const value = get(row, `original.gender`);
          const displayValue = getDisplayValueFromChoiceItem(genders, value);

          return (
            <WrapperTableCell minWidth={70}>
              {displayValue ? displayValue : "-"}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.main_phone_number") || "-";

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.email`} />,
        accessor: "email",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_USER_USER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.email") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, loading: addLoading, addHandler } = props;

          const id = get(row, "original.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <AddButton
                disabled={!!addLoading[id]}
                onClick={() => {
                  addHandler?.({
                    data: [row],
                  });
                }}
              />
            </Stack>
          );
        },
        width: 80,
        maxWidth: 80,
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

  useEffect(() => {
    setListSelectedRow(table.selectedFlatRows);
  }, [table.selectedFlatRows.length]);

  return (
    <WrapperTable>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
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

export default UsedByUserDialogColumn;
