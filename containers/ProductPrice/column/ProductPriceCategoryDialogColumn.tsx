import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { ChoiceItem, CommonTableProps, Unit as IUnit } from "interfaces";

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

import { WrapperTable, AddButton } from "components";

type ProductPriceCategoryDialogColumnProps = CommonTableProps<any> & Record<string, any>;

const ProductPriceCategoryDialogColumn = (
  props: ProductPriceCategoryDialogColumnProps
) => {
  const {
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
    setListSelectedRow,
    ...restProps
  } = props;

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
        maxWidth: 40,
        width: 40,
      },

      {
        accessor: "full_name",
        Header: "Tên danh mục",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const name = get(row, "original.full_name");

          return <WrapperTableCell>{name}</WrapperTableCell>;
        },
        // maxWidth: 90,
        // width: 90,
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, loading: addLoading, addHandler } = props;

          const id = get(row, "original.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <AddButton
                disabled={!!addLoading[id]}
                onClick={() => {
                  addHandler?.({
                    data: [row],
                  });
                }}
              />
            </Stack>
          );
        },
        width: 70,
        maxWidth: 70,
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

  useEffect(() => {
    setListSelectedRow(table.selectedFlatRows);
  }, [table.selectedFlatRows.length]);

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

export default ProductPriceCategoryDialogColumn;
