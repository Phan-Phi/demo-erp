import { get } from "lodash";
import { Box } from "@mui/material";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

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

import { useTransformUrlForSid } from "hooks";
import { CommonTableProps } from "interfaces";
import { Link, NumberFormat } from "components";
import { MEDTHOD_WAREHOUSE_CARD } from "constant";
import { formatDate, getDisplayValueFromObject } from "libs";
import { ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

import useTransFormUrlForSid2 from "hooks/useTransformUrlForSid2";
import { FormattedMessage } from "react-intl";

type WarehouseCardTableProps =
  CommonTableProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1> & Record<string, any>;

const WarehouseCardTable = (props: WarehouseCardTableProps) => {
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
        Header: <FormattedMessage id={`table.outnoteSid`} />,
        accessor: "source.sid",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value, row } = props;

          const sourceId = get(row, "original.source.id");
          const sourceType = get(row, "original.source_type");

          const sourceInvoiceOrder = get(row, "original.source.invoice.order");
          const data = get(row, "original");

          const { url, loading } = useTransFormUrlForSid2(
            sourceType,
            sourceId,
            sourceInvoiceOrder,
            data
          );

          return (
            <WrapperTableCell loading={loading}>
              {url ? (
                <Link href={url} target="_blank">
                  {value}
                </Link>
              ) : (
                <WrapperTableCell>{value || "-"}</WrapperTableCell>
              )}
            </WrapperTableCell>
          );

          // return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.editable_sku`} />,
        accessor: "record.variant.sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "record.variant.name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value || "-"}</WrapperTableCell>;
        },
        maxWidth: 260,
        width: 260,
      },
      {
        Header: <FormattedMessage id={`table.time`} />,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
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
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          const lastValue = getDisplayValueFromObject(MEDTHOD_WAREHOUSE_CARD, value);

          return <WrapperTableCell>{lastValue}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.module_type.partner.partner`} />,
        accessor: "partner_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
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
        // Header: <Box textAlign="right">Giá vốn</Box>,
        Header: <FormattedMessage id={`table.costPrice`} />,
        accessor: "price.excl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} suffix=" đ" />
            </WrapperTableCell>
          );
        },
      },
      {
        // Header: <Box textAlign="right">Giá vốn có thuế</Box>,
        Header: <FormattedMessage id={`table.costPriceInclTax`} />,
        accessor: "price.incl_tax",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} suffix=" đ" />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <Box textAlign="right">Tồn cuối</Box>,
        accessor: "ending-stocks",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_RECORD_TIMELINE_VIEW_TYPE_V1, any>
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

export default WarehouseCardTable;
