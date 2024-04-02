import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable } from "react-table";
import React, { PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
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
  TableCellForEdit,
  TableCellForAvatar,
} from "components/TableV3";
import { NumberFormat } from "components";

import { CommonTableProps } from "interfaces";
import { useFetchReturnInvoiceQuantity } from "hooks";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ReturnInvoiceLineListTableProps =
  CommonTableProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1> & Record<string, any>;

const ReturnInvoiceLineListTable = (props: ReturnInvoiceLineListTableProps) => {
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
        accessor: "primary_image",
        Header: "",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const image = get(row, "original.record.variant.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "record.variant.name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        with: 300,
        maxWidth: 300,
      },
      {
        Header: <Box textAlign="right">Số lượng có thể trả</Box>,
        accessor: "quantityCanReturn",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const id = get(row, "original.id");
          const quantity = get(row, "original.quantity");

          const { value } = useFetchReturnInvoiceQuantity(id);

          const result = quantity - value;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={result} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng đã trả</Box>,
        accessor: "quantityReturned",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const id = get(row, "original.id");

          const { value } = useFetchReturnInvoiceQuantity(id);

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng</Box>,
        accessor: "quantityReturn",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row, cell, editData, updateEditRowDataHandler, returnInvoiceId } =
            props;
          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const quantity = get(row, "original.quantity");
          const { value } = useFetchReturnInvoiceQuantity(id);

          const result = quantity - value;

          return (
            <TableCellForEdit
              {...{
                inputType: "number",
                value: get(editData, `current.${id}.${columnId}`) || "",
                NumberFormatProps: {
                  allowNegative: false,
                  suffix: "",
                  isAllowed: ({ floatValue }) => {
                    if (floatValue === undefined) return true;

                    if (floatValue <= result) {
                      return true;
                    } else {
                      return false;
                    }
                  },
                },
                onChange: (value) => {
                  // * quantity
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });

                  // * line id
                  updateEditRowDataHandler?.({
                    value: id,
                    row,
                    keyName: "line",
                  });
                },
              }}
            />
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

export default ReturnInvoiceLineListTable;
