import { useSticky } from "react-table-sticky";
import { FormattedMessage } from "react-intl";
import { CellProps, useTable } from "react-table";
import React, { PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
} from "components/TableV3";
import {
  AddButton,
  ViewButton,
  CheckButton,
  DeleteButton,
  NumberFormat,
  WrapperTable,
} from "components";
import { RETURN_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ReturnInvoiceListTableProps = CommonTableProps<RETURN_INVOICE_VIEW_TYPE_V1> &
  Record<string, any>;

const ReturnInvoiceListTable = (props: ReturnInvoiceListTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`sid`} />,
        accessor: "sid",
        Cell: (props: PropsWithChildren<CellProps<RETURN_INVOICE_VIEW_TYPE_V1, any>>) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<RETURN_INVOICE_VIEW_TYPE_V1, any>>) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (props: PropsWithChildren<CellProps<RETURN_INVOICE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const isConfirmed = get(row, "original.is_confirmed");

          let value = isConfirmed ? "Bản đã duyệt" : "Bản nháp";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`surcharge`} />
          </Box>
        ),
        accessor: "surcharge.incl_tax",
        Cell: (props: PropsWithChildren<CellProps<RETURN_INVOICE_VIEW_TYPE_V1, any>>) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            addHandler,
            onViewHandler,
            deleteHandler,
            readPermission,
            approveHandler,
            writePermission,
          } = props;

          const isConfirmed = get(row, "original.is_confirmed");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              {isConfirmed === false && (
                <AddButton
                  onClick={(e) => {
                    addHandler(row);
                  }}
                />
              )}

              {isConfirmed && readPermission && (
                <ViewButton
                  onClick={() => {
                    onViewHandler(row);
                  }}
                />
              )}

              {/* <PrintButton
                onClick={(e) => {
                  // e.stopPropagation();
                  // printInvoiceHandler(row);
                }}
              /> */}

              {!isConfirmed && writePermission && (
                <CheckButton
                  onClick={(e) => {
                    e.stopPropagation();
                    approveHandler({
                      data: [row],
                    });
                  }}
                />
              )}

              {!isConfirmed && writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({ data: [row] });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 100,
        maxWidth: 100,
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
    useSticky
  );

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
      </TableContainer>

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
    </WrapperTable>
  );
};

export default ReturnInvoiceListTable;
