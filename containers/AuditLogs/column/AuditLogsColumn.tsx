import { get } from "lodash";
import { Box } from "@mui/material";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

import {
  Table,
  TableHead,
  TableBody,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";
import { FormattedMessage, useIntl } from "react-intl";
import { AUDIT_LOG_TYPE_V1 } from "__generated__/apiType_v1";

type AuditLogsTableProps = CommonTableProps<AUDIT_LOG_TYPE_V1> & Record<string, any>;

export default function AuditLogsColumn(props: AuditLogsTableProps) {
  const {
    tag,
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

  const { messages } = useIntl();

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.is_staff`} />,
        accessor: "email",
        Cell: (props: PropsWithChildren<CellProps<AUDIT_LOG_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.actor_email");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<AUDIT_LOG_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.action");

          return (
            <WrapperTableCell>{messages[`setting.${value}`] as any}</WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.body`} />,
        accessor: "note",
        Cell: (props: PropsWithChildren<CellProps<AUDIT_LOG_TYPE_V1, any>>) => {
          const { row } = props;

          const action = get(row, "original.action");
          const source_repr = get(row, "original.source_repr");

          const value = `${messages[`setting.${action}`] as any}: ${source_repr}`;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.time`} />,
        accessor: "time",
        Cell: (props: PropsWithChildren<CellProps<AUDIT_LOG_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.date_created");

          return <WrapperTableCell>{formatDate(value) || "-"}</WrapperTableCell>;
        },
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
