import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

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
  TableCellForAvatar,
} from "components/TableV3";

import { WrapperTable, AddButton, NumberFormat } from "components";
import { formatPhoneNumber, getDisplayValueFromChoiceItem } from "libs";

import { useChoice } from "hooks";

type DiscountedVariantDialogColumnProps = CommonTableProps<any> & Record<string, any>;

const DiscountedVariantDialogColumn = (props: DiscountedVariantDialogColumnProps) => {
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
    onChangeData,
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
        accessor: "primary_image",
        Header: "",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const image = get(row, "original.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },

      {
        Header: <FormattedMessage id={`table.sku`} />,
        accessor: "editable_sku",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`productName`} />,
        accessor: "productName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.name") || "-";

          return <WrapperTableCell minWidth={120}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.price`} />,
        accessor: "price",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.price.incl_tax") || "-";

          return <NumberFormat value={parseFloat(value)} />;
        },
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
        width: 80,
        maxWidth: 80,
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

export default DiscountedVariantDialogColumn;
