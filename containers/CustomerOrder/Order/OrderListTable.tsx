import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { PropsWithChildren, useEffect, useMemo } from "react";

import { get } from "lodash";
import { Box, Stack, Typography, styled } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  TableCellForTag,
  WrapperTableCell,
  TableCellForSelection,
  TableHeaderForSelection,
} from "components/TableV3";

import {
  Link,
  ViewButton,
  TagsButton,
  DeleteButton,
  LoadingButton,
  ToolTipForTags,
} from "components";

import DynamicMessage from "messages";
import { EDIT, ORDERS } from "routes";
import { CommonTableProps } from "interfaces";
import { useChoice, useGetTaggedItems } from "hooks";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";
import { ADMIN_ORDER_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { formatDate, formatPhoneNumber, getDisplayValueFromChoiceItem } from "libs";

type OrderListTableProps = CommonTableProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1> &
  Record<string, any>;

const OrderListTable = (props: OrderListTableProps) => {
  const {
    data,
    count,
    getTable,
    isLoading,
    maxHeight,
    pagination,
    hideAndShow,
    onPageChange,
    deleteHandler,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const initialState = { hiddenColumns: hideAndShow };

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
        Header: (
          <Box>
            <FormattedMessage id={`table.tags`} />
          </Box>
        ),
        accessor: "tags",
        className: "table.tags",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const id = get(row, "original.id");
          const { loading, data } = useGetTaggedItems(id, SOURCE_TYPE_FOR_TAGS.order);

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
        Header: <FormattedMessage id={`table.orderSid`} />,
        accessor: "orderSid",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.date_placed`} />,
        accessor: "date_placed",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.date_placed");

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.status`} />,
        accessor: "status",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const { order_statuses } = useChoice();

          const value = get(row, "original.status");
          const displayValue = getDisplayValueFromChoiceItem(order_statuses, value);

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.receiver_name`} />,
        accessor: "receiver_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.receiver_name");

          return (
            <WrapperTableCell>
              <Link
                href={"#"}
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onGotoHandler?.(row);
                }}
              >
                {value}
              </Link>
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.receiver_phone_number");

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.shipping_address`} />,
        accessor: "shipping_address",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.shipping_address.line1");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 250,
      },
      {
        Header: <FormattedMessage id={`table.customer_notes`} />,
        accessor: "customer_notes",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.customer_notes");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.owner_name`} />,
        accessor: "owner_name",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.owner_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (
          <Box width={100} maxWidth={100}>
            <FormattedMessage id={`table.channel`} />
          </Box>
        ),
        accessor: "channel",
        className: "table.channel",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_ORDER_ORDER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.channel.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.shipping_method_name`} />,
        accessor: "shipping_method_name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.shipping_method_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.delivery_notes`} />,
        accessor: "delivery_notes",
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

          const value = get(row, "original.date_placed");

          return (
            <WrapperTableCell>
              {formatDate(value, "dd/MM/yyyy - HH:mm:ss")}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, writePermission, onViewTagsHandler } = props;

          const id = get(row, "original.id");
          const status = get(row, "original.status");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <TagsButton onClick={() => onViewTagsHandler(id)} />

              <ViewButton href={`/${ORDERS}/${EDIT}/${id}`} />

              {status === "Draft" && writePermission && (
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
        width: 160,
        maxWidth: 160,
        sticky: "right",
      },
    ];
  }, [hideAndShow]);

  const { formatMessage, messages } = useIntl();

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
    useSticky,
    useRowSelect
  );

  useEffect(() => {
    getTable({
      ...table,
      noDefault: hideAndShow,
      defaultSelect: SELECTED_TABLE.orders,
    });
  }, [table, hideAndShow]);

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Stack flexDirection="row" columnGap={3} alignItems="center">
                    <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                      length: selectedRows.length,
                    })}`}</Typography>

                    <LoadingButton
                      onClick={() => {
                        deleteHandler({
                          data: selectedRows,
                        });
                      }}
                      color="error"
                      children={messages["deleteStatus"]}
                    />
                  </Stack>
                );
              }}
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

export default OrderListTable;

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
