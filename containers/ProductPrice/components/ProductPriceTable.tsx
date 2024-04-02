import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

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
} from "components/TableV3";
import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";
import { EDIT, PRODUCT_PRICE_LIST } from "routes";
import { DeleteButton, ViewButton } from "components";
import { PRICE_TABLE_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ProductPriceTableProps = CommonTableProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1> &
  Record<string, any>;

export default function ProductPriceTable(props: ProductPriceTableProps) {
  const {
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
    deleteHandler,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: "Tên bảng giá",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: "Trạng thái",
        accessor: "active",
        textAlign: "center",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.active");
          let color = value ? "rgb(115,214,115)" : "rgb(88,91,100)";

          return (
            <WrapperTableCell textAlign="center" minWidth={70}>
              <CircleIcon
                sx={{
                  color,
                }}
              />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Thời gian bắt đầu",
        accessor: "date_start",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.date_start");

          return (
            <WrapperTableCell>
              {formatDate(value, "dd/MM/yyyy - HH:mm:ss")}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: "Thời gian kết thúc",
        accessor: "date_end",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.date_end");

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
          const { row, writePermission } = props;

          const isUsed = get(row, "original.is_used");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1} minWidth={70}>
              <ViewButton href={`/${PRODUCT_PRICE_LIST}/${EDIT}/${row.original.id}`} />

              {writePermission && !isUsed && (
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
