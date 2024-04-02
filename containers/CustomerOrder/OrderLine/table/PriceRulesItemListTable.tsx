import { useSticky } from "react-table-sticky";

import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

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
import { NumberFormat, WrapperTable } from "components";

import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";
import { PRICE_RULE_ITEM_TYPE_V1 } from "__generated__/apiType_v1";

type PriceRulesItemListTableProps = CommonTableProps<PRICE_RULE_ITEM_TYPE_V1> &
  Record<string, any>;

const PriceRulesItemListTable = (props: PriceRulesItemListTableProps) => {
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
        Header: "Ngày tạo",
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<PRICE_RULE_ITEM_TYPE_V1, any>>) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: "Tên loại thay đổi giá",
        accessor: "price_rule.source_repr",
        Cell: (props: PropsWithChildren<CellProps<PRICE_RULE_ITEM_TYPE_V1, any>>) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        width: 320,
        maxWidth: 320,
      },
      {
        Header: <Box textAlign="right">Thay đổi</Box>,
        accessor: "delta",
        Cell: (props: PropsWithChildren<CellProps<PRICE_RULE_ITEM_TYPE_V1, any>>) => {
          const { value } = props;

          return (
            <WrapperTableCell title={value} textAlign="right">
              <NumberFormat value={parseFloat(value)} suffix=" đ" />
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
    <WrapperTable>
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
      </TableContainer>
    </WrapperTable>
  );
};

export default PriceRulesItemListTable;
