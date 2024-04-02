import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useTable, useSortBy, CellProps } from "react-table";

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
import { DISCOUNTS, EDIT, VOUCHER } from "routes";
import { CommonTableProps } from "interfaces";
import { formatDate, getDiscount } from "libs";
import { DeleteButton, NumberFormat, ViewButton } from "components";
import { ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type AuditLogsTableProps = CommonTableProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1> &
  Record<string, any>;
export const keys = ["selection", "discountName", "discount_amount", "period", "action"];

export default function DiscountVoucherColumn(props: AuditLogsTableProps) {
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

  const { formatMessage, messages } = useIntl();

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
        Header: <FormattedMessage id={`table.discountName`} />,
        accessor: "discountName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Mã giảm giá",
        accessor: "code",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.code");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Mức giảm",
        accessor: "discount_amount",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.discount_amount");
          const type = get(row, "original.discount_type");

          return (
            <WrapperTableCell>
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(value)}
                  suffix={type === "Percentage" ? " %" : " đ"}
                />
              </WrapperTableCell>
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.period`} />,
        accessor: "period",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          let dateStart = get(row, "original.date_start");
          let dateEnd = get(row, "original.date_end");

          return (
            <WrapperTableCell>{`${formatDate(dateStart) || "-"} - ${
              formatDate(dateEnd) || "∞"
            }`}</WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.is_active`} />,
        accessor: "is_active",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const date = new Date();

          let dateStart = get(row, "original.date_start");
          let dateEnd = get(row, "original.date_end");

          // let convertDateStart = new Date(get(row, "original.date_start"));
          // let convertDateEnd = new Date(get(row, "original.date_end"));

          // if (dateEnd === null || dateStart === null) {
          //   return (
          //     <WrapperTableCell>
          //       {messages["table.discount_happenning"] as any}
          //     </WrapperTableCell>
          //   );
          // }

          // if (date.getTime() > convertDateEnd.getTime()) {
          //   return (
          //     <WrapperTableCell>{messages["table.discount_end"] as any}</WrapperTableCell>
          //   );
          // }

          // if (date.getTime() < convertDateStart.getTime()) {
          //   return (
          //     <WrapperTableCell>
          //       {messages["table.discount_schedule"] as any}
          //     </WrapperTableCell>
          //   );
          // }

          // if (
          //   date.getTime() > convertDateStart.getTime() &&
          //   date.getTime() < convertDateEnd.getTime()
          // ) {
          //   return (
          //     <WrapperTableCell>
          //       {messages["table.discount_happenning"] as any}
          //     </WrapperTableCell>
          //   );
          // }

          return (
            <WrapperTableCell>
              {messages[`table.${getDiscount(dateStart, dateEnd)}`] as any}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: "Số lượt sử dụng",
        accessor: "usage_limit",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.usage_limit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Tổng số lượt",
        accessor: "min_checkout_items_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_DISCOUNT_VOUCHER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.min_checkout_items_quantity");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, deleteHandler, writePermission, readPermission } = props;

          //   if (loading) return <Skeleton />;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              {readPermission && (
                <ViewButton
                  href={`/${DISCOUNTS}/${VOUCHER}/${EDIT}/${row.original.id}`}
                />
              )}

              {writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 120,
        maxWidth: 120,
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
