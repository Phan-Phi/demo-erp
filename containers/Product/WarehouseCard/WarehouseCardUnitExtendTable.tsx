import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

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
} from "components/TableV3";
import { NumberFormat } from "components";

import { CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromObject } from "libs";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type WarehouseCardUnitExtendTableProps =
  CommonTableProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1> &
    Record<string, any>;

const WarehouseCardUnitExtendTable = (props: WarehouseCardUnitExtendTableProps) => {
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
        Header: <Box>Mã hàng</Box>,
        accessor: "unit.editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Thời gian</Box>,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Đơn vị tính</Box>,
        accessor: "unit.unit",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box textAlign="right">Quy cách</Box>,
        accessor: "multiply",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell textAlign="right">{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Barcode</Box>,
        accessor: "unit.bar_code",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <Box textAlign="right">Cân nặng</Box>,
        accessor: "weight",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const weight = get(row, "original.unit.weight.weight");
          const unit = get(row, "original.unit.weight.unit");

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={weight} suffix={` ${unit}`} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Giá bán</Box>,
        accessor: "price.excl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} suffix={` đ`} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Giá bán có thuế</Box>,
        accessor: "price.incl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} suffix={` đ`} />
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
    useSortBy,
    useSticky,
    useRowSelect
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
          rowsPerPageOptions={[10, 25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
};

export default WarehouseCardUnitExtendTable;
