import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren, Fragment } from "react";
import { useTable, useSortBy, CellProps } from "react-table";
import ReportIcon from "@mui/icons-material/Report";

import {
  RenderBody,
  RenderHeader,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  WrapperTableCell,
  TableCellForAvatar,
  TableCellForEdit,
  TableHeaderForSelection,
  TableCellForSelection,
} from "components/TableV3";
import { CommonTableProps } from "interfaces";
import { CheckButton, CloseButton, EditButton, NumberFormat } from "components";
import { ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type WarehouseTableProps = CommonTableProps<any> & Record<string, any>;

export default function EditWarehouseColumn(props: WarehouseTableProps) {
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
        Header: <FormattedMessage id={`image`} />,
        accessor: "image",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const image = get(row, "original.variant.primary_image.product_gallery");

          return <TableCellForAvatar src={image} />;
        },
      },
      {
        Header: <FormattedMessage id={`table.editable_sku`} />,
        accessor: "editable_sku",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`productName`} />,
        accessor: "productName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.variant.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 400,
      },

      {
        Header: "Số lượng tồn kho thấp",
        accessor: "is_below_threshold",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = "low_stock_threshold";
          const value = get(row, "original.low_stock_threshold");
          const quantity =
            get(row, "original.quantity") - get(row, "original.allocated_quantity");

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: "",
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          }

          if (value === null) {
            return <WrapperTableCell>-</WrapperTableCell>;
          }
          if (quantity < value || quantity === value) {
            return (
              <WrapperTableCell
                sx={{ display: "flex", alignItems: "center" }}
                title="Lưu ý: Số lượng tồn kho thấp"
              >
                {value}
                <ReportIcon color="error" />
              </WrapperTableCell>
            );
          }
          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.quantityInStock`} />,
        accessor: "quantityInStock",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.quantity");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Số lượng dự trữ",
        accessor: "quantityInStock1",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.allocated_quantity");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: "Số lượng khả dụng",
        accessor: "quantityInStock2",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const quantity = get(row, "original.quantity");
          const allocatedQuantity = get(row, "original.allocated_quantity");

          return <WrapperTableCell>{quantity - allocatedQuantity}</WrapperTableCell>;
        },
      },

      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.costPrice`} />
          </Box>
        ),
        accessor: "costPrice",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_STOCK_STOCK_RECORD_VIEW_TYPE_V1, any>>
        ) => {
          const { row, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = "price";

          const value = get(row, `original.price.excl_tax`) || "0";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          }
        },
        width: 150,
        minWidth: 150,
        maxWidth: 150,
      },

      {
        Header: <FormattedMessage id={`table.costPriceInclTax`} />,
        accessor: "costPriceInclTax",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, activeEditRow, updateEditRowDataHandler } = props;

          const id = get(row, "original.id");
          const columnId = "price_incl_tax";

          const value = get(row, `original.price.incl_tax`) || "0";

          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                inputType="number"
                value={parseFloat(value)}
                NumberFormatProps={{
                  allowNegative: false,
                  suffix: " ₫",
                }}
                onChange={(value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(value)} />
              </WrapperTableCell>
            );
          }
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            loading: updateLoading,
            updateHandler,
            writePermission,
            activeEditRow,
            activeEditRowHandler,
            removeEditRowDataHandler,
          } = props;

          if (true) {
            return (
              <Stack flexDirection="row" alignItems="center" columnGap={1}>
                {activeEditRow[row.original.id] ? (
                  <Fragment>
                    <CheckButton
                      disabled={!!updateLoading[row.original.id]}
                      onClick={updateHandler([row])}
                    />

                    <CloseButton
                      disabled={!!updateLoading[row.original.id]}
                      onClick={removeEditRowDataHandler([row])}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <EditButton onClick={activeEditRowHandler(row)} />
                  </Fragment>
                )}
              </Stack>
            );
          }

          return null;
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
