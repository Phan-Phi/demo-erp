import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import React, { PropsWithChildren, useEffect, useMemo } from "react";
import { CellProps, useTable, useSortBy } from "react-table";
import CircleIcon from "@mui/icons-material/Circle";

import { get } from "lodash";
import DynamicMessage from "messages";
import { Box, MenuItem, Stack, Typography } from "@mui/material";

import { PRODUCTS } from "routes";
import { ChoiceItem, CommonTableProps, Unit as IUnit } from "interfaces";
import {
  ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1,
  ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

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
  TableCellForSelection,
  TableHeaderForSelection,
  TableCellWithFetch,
  TableCellForEdit,
} from "components/TableV3";

import {
  ViewButton,
  NumberFormat,
  WrapperTable,
  DeleteButton,
  LoadingButton,
  AddButton,
} from "components";
import { formatDate, transformUrl } from "libs";
import {
  ADMIN_PRODUCTS_CATEGORIES_END_POINT,
  ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT,
  PRODUCTS_CATEGORIES_END_POINT,
} from "__generated__/END_POINT";
import { SELECTED_TABLE } from "constant";

type ProductPriceVariantColumnProps = CommonTableProps<any> & Record<string, any>;

const ProductPriceDialogColumn = (props: ProductPriceVariantColumnProps) => {
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

          const image = get(row, "original.default_variant.primary_image.product_small");
          // const image = get(row, "original.default_variant.primary_image");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },

      {
        Header: <FormattedMessage id={`table.editable_sku`} />,
        accessor: "editable_sku",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.default_variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 400,
      },

      {
        Header: (
          <Box minWidth={150}>
            <FormattedMessage id={`table.unit`} />
          </Box>
        ),
        accessor: "unit",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, cell, updateEditRowDataHandler, editData, activeEditRowHandler } =
            props;
          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          return (
            <TableCellWithFetch
              url={transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT, {
                variant: row.original.id,
              })}
            >
              {(data): any => {
                if (data === undefined) return <Box></Box>;
                const dataUnit: any = data.results;
                return (
                  <TableCellForEdit
                    {...{
                      inputType: "select",
                      renderItem() {
                        return dataUnit.map((el, idx) => {
                          return (
                            <MenuItem key={idx} value={el.id}>
                              {el.unit}
                            </MenuItem>
                          );
                        });
                      },
                      value: get(editData, `current.${id}.${columnId}`) || "",
                      onChange(value) {
                        activeEditRowHandler(row)();

                        updateEditRowDataHandler?.({
                          value,
                          row,
                          keyName: columnId,
                        });
                      },
                    }}
                  />
                );
              }}
            </TableCellWithFetch>
          );
        },
        colSpan: 3,
      },

      {
        Header: <Box minWidth={150}>Loại bảng giá</Box>,
        accessor: "change_type",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, cell, updateEditRowDataHandler, editData, activeEditRowHandler } =
            props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const discountType = props.discountType;
          const defaultValue = get(discountType, "[0][0]");

          // const changeType = ["discount_percentage", "discount_absolute", "fixed_price"];

          // const mainUnit = get(row, "original.unit");

          // if (get(changeType, "length") <= 1) {
          //   return <WrapperTableCell>{get(changeType, "[0]") || "-"}</WrapperTableCell>;
          // }

          // return (
          //   <TableCellForEdit
          //     {...{
          //       inputType: "select",
          //       renderItem() {
          //         return changeType.map((el) => {
          //           return (
          //             <MenuItem key={el} value={el}>
          //               <FormattedMessage id={`table.${el}`} />
          //             </MenuItem>
          //           );
          //         });
          //       },
          //       value: get(editData, `current.${id}.${columnId}`) || mainUnit,
          //       onChange(value) {
          //         activeEditRowHandler(row)();

          //         updateEditRowDataHandler?.({
          //           value,
          //           row,
          //           keyName: columnId,
          //         });
          //       },
          //     }}
          //   />
          // );

          return (
            <TableCellForEdit
              {...{
                inputType: "select",
                renderItem() {
                  return discountType.map((el) => {
                    return (
                      <MenuItem key={el[0]} value={el[0]}>
                        {el[1]}
                      </MenuItem>
                    );
                  });
                },
                value: get(editData, `current.${id}.${columnId}`) || defaultValue,
                onChange(value) {
                  activeEditRowHandler?.(row)?.();
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
              }}
            />
          );
        },
        colSpan: 3,
      },

      {
        Header: (
          <Box minWidth={150} textAlign="right">
            Giá
          </Box>
        ),
        accessor: "change_amount",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, cell, updateEditRowDataHandler, editData } = props;

          // const value = Object.keys(editData.current);

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const discountTypeList = props.discountType;

          let discountType = get(editData, `current.[${id}].change_type`);
          const defaultDiscountType = get(discountTypeList, "[0][0]");

          if (!discountType) {
            discountType = defaultDiscountType;
          }

          return (
            <TableCellForEdit
              {...{
                inputType: "number",
                value: get(editData, `current.${id}.${columnId}`) || 0,
                onChange: (value) => {
                  updateEditRowDataHandler?.({
                    value,
                    row,
                    keyName: columnId,
                  });
                },
                NumberFormatProps: {
                  allowNegative: false,
                  suffix:
                    discountType === "discount_percentage" ||
                    discountType === "increase_percentage"
                      ? " %"
                      : " ₫",
                },
              }}
            />
          );

          // return (
          //   <TableCellForEdit
          //     {...{
          //       inputType: "number",
          //       value: get(editData, `current.${id}.${columnId}`) || 0,
          //       onChange: (value) => {
          //         updateEditRowDataHandler?.({
          //           value,
          //           row,
          //           keyName: columnId,
          //         });
          //       },
          //       NumberFormatProps: {
          //         allowNegative: false,
          //         suffix: " ₫",
          //       },
          //     }}
          //   />
          // );
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

  useEffect(() => {
    setListSelectedRow(table.selectedFlatRows);
  }, [table.selectedFlatRows.length]);

  return (
    <WrapperTable>
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

export default ProductPriceDialogColumn;
