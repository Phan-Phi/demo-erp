import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import React, { PropsWithChildren, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";

import { get } from "lodash";
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
  TableCellForAvatar,
} from "components/TableV3";
import { Link, NumberFormat, WrapperTable } from "components";
import { CommonTableProps, Unit as IUnit } from "interfaces";
import { ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type ViewLineTableProps = CommonTableProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1> &
  Record<string, any>;

const ViewLineTable = (props: ViewLineTableProps) => {
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
        accessor: "primary_image",
        Header: "",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const image = get(row, "original.variant.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: "Mã hàng",
        accessor: "variant.editable_sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.variant_name`} />,
        accessor: "variant_name",
        maxWidth: 400,
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.variant_name");

          return (
            <WrapperTableCell title={value}>
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
        colSpan: 2,
      },
      // {
      //   Header: <FormattedMessage id={`table.variant_sku`} />,
      //   accessor: "variant_sku",
      //   Cell: (
      //     props: PropsWithChildren<
      //       CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
      //     >
      //   ) => {
      //     const { row } = props;

      //     const value = get(row, "original.variant_sku");

      //     return <WrapperTableCell>{value}</WrapperTableCell>;
      //   },
      // },
      {
        Header: <FormattedMessage id={`table.unit`} />,
        accessor: "unit",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.unit");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      // {
      //   Header: <Box textAlign="right">SL tồn kho hiện tại</Box>,
      //   accessor: "record_quantity",
      //   Cell: (
      //     props: PropsWithChildren<
      //       CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
      //     >
      //   ) => {
      //     const { row } = props;

      //     const selectedUnit = get(row, `original.unit`);
      //     const quantity = parseInt(get(row, "original.record.quantity"));
      //     const remainingQuantity = quantity;

      //     let value = 0;

      //     const mainUnit = get(row, "original.variant.unit");

      //     if (!mainUnit) {
      //       return null;
      //     }

      //     let extendUnit: IUnit[] = get(row, "original.variant.units");

      //     let mergeUnit = [
      //       {
      //         unit: mainUnit,
      //         multiply: 1,
      //       },
      //     ];

      //     extendUnit.forEach((el) => {
      //       mergeUnit.push({
      //         unit: el.unit,
      //         multiply: el.multiply,
      //       });
      //     });

      //     const unitObj = mergeUnit.find((el) => {
      //       return el.unit === selectedUnit;
      //     });

      //     if (unitObj == undefined) {
      //       return null;
      //     }

      //     value = Math.floor(remainingQuantity / unitObj.multiply);

      //     return (
      //       <WrapperTableCell textAlign="right">
      //         <NumberFormat value={value} suffix="" />
      //       </WrapperTableCell>
      //     );
      //   },
      // },

      {
        Header: (
          <Box textAlign="right" width="150px">
            SL điều chỉnh
          </Box>
        ),
        accessor: "unit_quantity",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const unitQuantity = parseInt(get(row, "original.unit_quantity")) || 0;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={unitQuantity} suffix="" />
            </WrapperTableCell>
          );
        },
      },

      // {
      //   Header: (
      //     <Box textAlign="right" width="180px">
      //       SL tồn kho sau điều chỉnh
      //     </Box>
      //   ),
      //   accessor: "quantity_remaining_after_adjustment",
      //   Cell: (
      //     props: PropsWithChildren<
      //       CellProps<ADMIN_STOCK_STOCK_OUT_NOTE_LINE_VIEW_TYPE_V1, any>
      //     >
      //   ) => {
      //     const { row } = props;

      //     const direction = get(row, "original.stock_out_note.direction");

      //     const unitQuantity = parseInt(get(row, "original.unit_quantity")) || 0;

      //     const quantity = get(row, "original.quantity");

      //     const convertionRate = quantity / unitQuantity;

      //     const quantityInStock = get(row, "original.record.quantity");

      //     const remainingQuantity = quantityInStock / convertionRate;

      //     let value: number;

      //     if (direction === "in") {
      //       value = remainingQuantity + unitQuantity;
      //     } else {
      //       value = remainingQuantity - unitQuantity;
      //     }

      //     return (
      //       <WrapperTableCell textAlign="right">
      //         <NumberFormat value={Math.floor(value)} suffix="" />
      //       </WrapperTableCell>
      //     );
      //   },
      // },
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
    useSticky
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
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </Box>
      </TableContainer>
    </WrapperTable>
  );
};

export default ViewLineTable;
