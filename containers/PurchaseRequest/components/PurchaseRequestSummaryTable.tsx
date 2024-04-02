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
  TableCellWithFetch,
} from "components/TableV3";
import { NumberFormat } from "components";

import { CommonTableProps } from "interfaces";
import { PurchaseRequestSummary } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";

type PurchaseRequestSummaryTableProps = CommonTableProps<PurchaseRequestSummary> &
  Record<string, any>;

export default function PurchaseRequestSummaryTable(
  props: PurchaseRequestSummaryTableProps
) {
  const {
    data,
    count,
    getTable,
    isLoading,
    maxHeight,
    pagination,
    onPageChange,
    onPageSizeChange,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: <Box>Sku biến thể sản phẩm</Box>,
        accessor: "variant_sku",
        Cell: (props: PropsWithChildren<CellProps<PurchaseRequestSummary, any>>) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Tên biến thể sản phẩm</Box>,
        accessor: "variant_name",
        Cell: (props: PropsWithChildren<CellProps<PurchaseRequestSummary, any>>) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box textAlign="right">Số lượng đặt</Box>,
        accessor: "total_quantity",
        Cell: (props: PropsWithChildren<CellProps<PurchaseRequestSummary, any>>) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng tồn kho hiện tại</Box>,
        accessor: "inventory_quantity",
        Cell: (props: PropsWithChildren<CellProps<PurchaseRequestSummary, any>>) => {
          const { row } = props;

          const variantId = get(row, "original.variant");

          const url = `${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`;

          return (
            <TableCellWithFetch url={url}>
              {(data) => {
                const quantity: any = get(data, "quantity", 0);

                return (
                  <WrapperTableCell textAlign="right">
                    <NumberFormat value={quantity} suffix="" />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng dự trữ</Box>,
        accessor: "allocated_quantity",
        Cell: (props: PropsWithChildren<CellProps<PurchaseRequestSummary, any>>) => {
          const { row } = props;

          const variantId = get(row, "original.variant");

          const url = `${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`;

          return (
            <TableCellWithFetch url={url}>
              {(data) => {
                const allocatedQuantity: any = get(data, "allocated_quantity", 0);

                return (
                  <WrapperTableCell textAlign="right">
                    <NumberFormat value={allocatedQuantity} suffix="" />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
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
}
