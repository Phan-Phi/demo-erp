import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable } from "react-table";
import React, { PropsWithChildren, useMemo } from "react";

import { Box } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForAvatar,
} from "components/TableV3";
import { NumberFormat } from "components";

import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";
import { RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ViewDetailReturnInvoiceTableProps =
  CommonTableProps<RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1> & Record<string, any>;

const ViewDetailReturnInvoiceTable = (props: ViewDetailReturnInvoiceTableProps) => {
  const {
    data,
    count,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "",
        accessor: "invoice_quantity.line.variant.primary_image.product_small",
        Cell: (
          props: PropsWithChildren<CellProps<RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <TableCellForAvatar src={value} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "invoice_quantity.line.variant_name",
        Cell: (
          props: PropsWithChildren<CellProps<RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        with: 300,
        maxWidth: 300,
      },
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <Box textAlign="right">Số lượng trả</Box>,
        accessor: "quantity",
        Cell: (
          props: PropsWithChildren<CellProps<RETURN_INVOICE_QUANTITY_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
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
    useSticky
  );

  return (
    <Box>
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
    </Box>
  );
};

export default ViewDetailReturnInvoiceTable;
