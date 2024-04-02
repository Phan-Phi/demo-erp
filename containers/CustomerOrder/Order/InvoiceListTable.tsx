import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { PropsWithChildren, useEffect, useMemo } from "react";

import { get } from "lodash";
import { Box, styled, Stack } from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellForTag,
} from "components/TableV3";
import { NumberFormat, TagsButton, ToolTipForTags, ViewButton } from "components";

import { EDIT, ORDERS } from "routes";
import { CommonTableProps } from "interfaces";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { useChoice, useGetTaggedItems, usePermission } from "hooks";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type InvoiceListTableProps = CommonTableProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1> &
  Record<string, any>;

const InvoiceListTable = (props: InvoiceListTableProps) => {
  const {
    hideAndShow,
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
    ...restProps
  } = props;

  const { hasPermission: readOrder } = usePermission("read_order");

  const initialState = { hiddenColumns: hideAndShow };

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <Box>
            <FormattedMessage id={`table.tags`} />
          </Box>
        ),
        accessor: "tags",
        className: "table.tags",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const id = get(row, "original.id");
          const { loading, data } = useGetTaggedItems(
            id,
            SOURCE_TYPE_FOR_TAGS.orderInvoice
          );

          return (
            <StyledWrapperTags loading={loading} title={<ToolTipForTags data={data} />}>
              {data &&
                data.map((item, index) => {
                  const name = get(item, "tag.name");

                  return <TableCellForTag key={index}>{name}</TableCellForTag>;
                })}
            </StyledWrapperTags>
          );
        },
        width: 180,
        maxWidth: 180,
      },
      {
        Header: <FormattedMessage id={`table.invoiceSid`} />,
        accessor: "sid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;
          const { invoice_statuses } = useChoice();
          const displayValue = getDisplayValueFromChoiceItem(invoice_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.shipping_status`} />,
        accessor: "shipping_status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          const { shipping_statuses } = useChoice();
          const displayValue = getDisplayValueFromChoiceItem(shipping_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.shipper`} />,
        accessor: "shipper_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.cod`} />,
        accessor: "cod",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

          return (
            <WrapperTableCell textAlign="center">
              <CircleIcon
                sx={{
                  color,
                }}
              />
            </WrapperTableCell>
          );
        },
        width: 100,
        maxWidth: 100,
      },
      {
        Header: <FormattedMessage id={`table.total_price`} />,
        accessor: "total_price",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const amount_incl_tax = get(row, "original.amount.incl_tax") || "0";

          const shipping_charge_incl_tax =
            get(row, "original.shipping_charge.incl_tax") || "0";

          const surcharge_incl_tax = get(row, "original.surcharge.incl_tax") || "0";

          const total_price =
            parseFloat(amount_incl_tax) +
            parseFloat(shipping_charge_incl_tax) +
            parseFloat(surcharge_incl_tax);

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={total_price} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.amount`} />,
        accessor: "amount",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.amount.incl_tax");

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.surcharge`} />,
        accessor: "surcharge",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.surcharge.incl_tax");

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`shippingInclTax`} />,
        accessor: "shippingInclTax",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.shipping_charge.incl_tax");

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.owner_name`} />,
        accessor: "owner_name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.owner_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.last_edit_time`} />,
        accessor: "last_edit_time",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.date_updated");

          return (
            <WrapperTableCell>
              {formatDate(value, "dd/MM/yyyy - HH:mm:ss")}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <Box>Thao tác</Box>,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, onViewTagsHandler } = props;

          const id = get(row, "original.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <TagsButton onClick={() => onViewTagsHandler(id)} />

              {readOrder && (
                <ViewButton href={`/${ORDERS}/${EDIT}/${row.original?.order}`} />
              )}
            </Stack>
          );
        },
        width: 150,
        maxWidth: 150,
        sticky: "right",
      },
    ];
  }, [hideAndShow]);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      initialState,
      ...restProps,
    },
    useSortBy,
    useSticky
  );

  useEffect(() => {
    getTable({
      ...table,
      noDefault: hideAndShow,
      defaultSelect: SELECTED_TABLE.invoice,
    });
  }, [table, hideAndShow]);

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

export default InvoiceListTable;

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
