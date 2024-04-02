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
import { MEDTHOD_WAREHOUSE_CARD } from "constant";
import { formatDate, getDisplayValueFromObject } from "libs";
import { useWarehouseCardVariant } from "./context/WarehouseCardVariantContext";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type WarehouseCardVariantTableProps =
  CommonTableProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1> &
    Record<string, any>;

const WarehouseCardVariantTable = (props: WarehouseCardVariantTableProps) => {
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
        Header: <Box>Mã phiếu</Box>,
        accessor: "source.sid",
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
        Header: <Box>Phương thức</Box>,
        accessor: "source_type",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          const lastValue = getDisplayValueFromObject(MEDTHOD_WAREHOUSE_CARD, value);

          return <WrapperTableCell>{lastValue}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Đối tác</Box>,
        accessor: "partner_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          let value = "";
          const source = get(row, "original.source");
          const source_type = get(row, "original.source_type");

          if (source && source_type) {
            const order = get(source, "order");

            if (order && source_type === "stock.receiptorder") {
              const partnerName = get(order, "partner_name");

              value = partnerName;
            } else {
              value = "";
            }
          } else {
            value = "";
          }

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
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
              <NumberFormat value={parseFloat(value)} />
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
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng</Box>,
        accessor: "quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, isLoadingQuantity } = props;

          let quantity = 0;

          const id = get(row, "original.id");
          const currentInputQuantity = get(row, "original.input_quantity");
          const currentOutputQuantity = get(row, "original.output_quantity");
          const currentQuantity = currentInputQuantity - currentOutputQuantity;

          const { data } = useWarehouseCardVariant();

          const currentIndex = data.findIndex((item) => {
            const itemId = get(item, "id");
            return itemId === id;
          });

          if (data[currentIndex + 1]) {
            const nextInputQuantity = get(data[currentIndex + 1], "input_quantity");
            const nextOutputQuantity = get(data[currentIndex + 1], "output_quantity");

            const nextQuantity = nextInputQuantity - nextOutputQuantity;

            quantity = currentQuantity - nextQuantity;
          } else {
            quantity = currentQuantity;
          }

          return (
            <WrapperTableCell textAlign="right" loading={isLoadingQuantity}>
              <NumberFormat value={quantity} suffix="" />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <Box textAlign="right">Tồn cuối</Box>,
        accessor: "ending-stocks",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const input_quantity = get(row, "original.input_quantity");
          const output_quantity = get(row, "original.output_quantity");

          const quantity = input_quantity - output_quantity;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={quantity} suffix="" />
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

export default WarehouseCardVariantTable;
