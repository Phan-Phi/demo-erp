import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy, useRowSelect } from "react-table";

import { Box } from "@mui/material";

import { formatDate } from "libs";
import { CommonTableProps } from "interfaces";

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
import { WrapperTable } from "components";
import { PRICE_RULE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ViewPriceTableTableProps = CommonTableProps<PRICE_RULE_VIEW_TYPE_V1> &
  Record<string, any>;

const ViewPriceTableTable = (props: ViewPriceTableTableProps) => {
  const {
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

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.date_created`} />,
        accessor: "date_created",
        Cell: (props: PropsWithChildren<CellProps<PRICE_RULE_VIEW_TYPE_V1, any>>) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Tên loại thay đổi giá</Box>,
        accessor: "source_repr",
        Cell: (props: PropsWithChildren<CellProps<PRICE_RULE_VIEW_TYPE_V1, any>>) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
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
            <RenderHeader table={table} />
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
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </Box>
      </TableContainer>
    </WrapperTable>
  );
};

export default ViewPriceTableTable;
