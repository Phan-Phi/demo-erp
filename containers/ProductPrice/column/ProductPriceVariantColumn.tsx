import { get } from "lodash";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { Box, MenuItem, Stack } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { CellProps, useTable, useSortBy } from "react-table";
import { Fragment, PropsWithChildren, useMemo, useState } from "react";

import { CommonTableProps } from "interfaces";
import { WrapperTable, DeleteButton } from "components";
import { PRICE_TABLE_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { CheckButton, CloseButton, EditButton, NumberFormat } from "components";

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
  TableCellForEdit,
} from "components/TableV3";
import { SELECTED_PRODUCT_TYPE } from "constant";
import { getPriceTable } from "libs/getPriceTable";

type ProductPriceVariantColumnProps = CommonTableProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1> &
  Record<string, any>;

const ProductPriceVariantColumn = (props: ProductPriceVariantColumnProps) => {
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
    ...restProps
  } = props;

  const [unitType, setUnitType] = useState();
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
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const image = get(row, "original.variant.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.sku`} />,
        accessor: "sku",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.variant.sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.variant.name");

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
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const {
            row,
            cell,
            activeEditRow,
            updateEditRowDataHandler,
            editData,
            activeEditRowHandler,
          } = props;

          const id = get(row, "original.id");
          const value = get(row, "original.unit");
          const columnId = get(cell, "column.id");

          // if (activeEditRow[id]) {
          //   return (
          //     <TableCellWithFetch
          //       url={transformUrl(ADMIN_PRODUCTS_VARIANTS_UNITS_END_POINT, {
          //         variant: row.original.variant.id,
          //       })}
          //     >
          //       {(data): any => {
          //         if (data === undefined) return <Box></Box>;
          //         const dataUnit: any = data.results;

          //         return (
          //           <TableCellForEdit
          //             {...{
          //               inputType: "select",
          //               renderItem() {
          //                 return dataUnit.map((el, idx) => {
          //                   return (
          //                     <MenuItem key={idx} value={el.id}>
          //                       {el.unit}
          //                     </MenuItem>
          //                   );
          //                 });
          //               },
          //               value: get(editData, `current.${id}.${columnId}`) || "",
          //               onChange(value) {
          //                 activeEditRowHandler(row)();

          //                 updateEditRowDataHandler?.({
          //                   value,
          //                   row,
          //                   keyName: columnId,
          //                 });
          //               },
          //             }}
          //           />
          //         );
          //       }}
          //     </TableCellWithFetch>
          //   );
          // } else {
          //   return (
          //     <WrapperTableCell>{value === null ? "-" : value.unit}</WrapperTableCell>
          //   );
          // }

          return <WrapperTableCell>{value === null ? "-" : value.unit}</WrapperTableCell>;
        },
        colSpan: 3,
      },

      {
        Header: <Box minWidth={150}>Loại bảng giá</Box>,
        accessor: "change_type",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const {
            row,
            cell,
            updateEditRowDataHandler,
            editData,
            activeEditRow,
            activeEditRowHandler,
          } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const mainUnit = get(row, "original.unit");
          const value = get(row, "original.change_type");

          if (get(SELECTED_PRODUCT_TYPE, "length") <= 1) {
            return (
              <WrapperTableCell>
                {get(SELECTED_PRODUCT_TYPE, "[0]") || "-"}
              </WrapperTableCell>
            );
          }
          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                {...{
                  inputType: "select",
                  renderItem() {
                    return SELECTED_PRODUCT_TYPE.map((el) => {
                      return (
                        <MenuItem key={el} value={el}>
                          <FormattedMessage id={`table.${el}`} />
                        </MenuItem>
                      );
                    });
                  },
                  value: get(editData, `current.${id}.${columnId}`) || mainUnit,
                  onChange(value) {
                    activeEditRowHandler(row)();
                    setUnitType(value);
                    updateEditRowDataHandler?.({
                      value,
                      row,
                      keyName: columnId,
                    });
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell>
                <FormattedMessage id={`table.${value}`} />
              </WrapperTableCell>
            );
          }
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
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row, cell, activeEditRow, updateEditRowDataHandler, editData } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const typeValue = get(row, "original.change_type");
          const valueChangeAmount = get(row, "original.change_amount");

          if (activeEditRow[id]) {
            const MAX_VAL = 100;
            const withValueCap = (inputObj) => {
              const { value } = inputObj;
              if (value <= MAX_VAL) return true;
              return false;
            };

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
                      unitType === "discount_percentage" ||
                      unitType === "increase_percentage"
                        ? " %"
                        : " ₫",
                    ...(unitType === "discount_percentage" ||
                    unitType === "increase_percentage"
                      ? { isAllowed: withValueCap }
                      : null),
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                {typeValue === "discount_percentage" ||
                typeValue === "increase_percentage" ? (
                  `${parseFloat(valueChangeAmount)}%`
                ) : (
                  <NumberFormat value={parseFloat(valueChangeAmount)} />
                )}
              </WrapperTableCell>
            );
          }
        },
      },

      {
        Header: "Giá bán",
        accessor: "price",
        Cell: (
          props: PropsWithChildren<CellProps<PRICE_TABLE_VARIANT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const typeValue = get(row, "original.change_type");
          const valueChangeAmount = get(row, "original.change_amount");
          const price =
            get(row, "original.unit") === null
              ? get(row, "original.variant.price")
              : get(row, "original.unit.price");

          //thuế của sản phẩm
          // const priceVAT1 = price.incl_tax / price.excl_tax - 1;
          // const priceVAT = priceVAT1 * 100;

          if (typeValue === "discount_percentage") {
            const total = getPriceTable(typeValue, valueChangeAmount, price);

            // const discountPercentage = valueChangeAmount / 100;

            // const value = (price.incl_tax - price.excl_tax) * discountPercentage;

            // const VAT = (priceVAT * value) / 100;

            // const total = value + VAT;

            // const discountPercentage =
            //   (parseFloat(price.incl_tax) * valueChangeAmount) / 100;
            // const VAT = price.incl_tax / price.excl_tax;
            // const total = discountPercentage + VAT;

            // //ty le chiet khau
            // const discountPercentage = (price.excl_tax * valueChangeAmount) / 100;
            // const totalDiscountPercentage =
            //   parseFloat(price.excl_tax) - discountPercentage;

            // //giá bán có thuế
            // const productPriceVAT = (totalDiscountPercentage * priceVAT) / 100;
            // const totalProductPriceVAT = totalDiscountPercentage + productPriceVAT;

            // if (discountPercentage < 0) {
            //   return (
            //     <WrapperTableCell textAlign="right">
            //       <NumberFormat value={parseFloat(String(0))} />
            //     </WrapperTableCell>
            //   );
            // }

            if (valueChangeAmount >= 100) {
              return (
                <WrapperTableCell textAlign="right">
                  <NumberFormat value={parseFloat(String(0))} />
                </WrapperTableCell>
              );
            }

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(String(total < 0 ? 0 : total))} />
              </WrapperTableCell>
            );
          }

          if (typeValue === "increase_percentage") {
            const total = getPriceTable(typeValue, valueChangeAmount, price);

            // //ty le chiet khau
            // const discountPercentage = (price.excl_tax * valueChangeAmount) / 100;
            // const totalDiscountPercentage =
            //   parseFloat(price.excl_tax) + discountPercentage;

            // //giá bán có thuế
            // const productPriceVAT = (totalDiscountPercentage * priceVAT) / 100;
            // const totalProductPriceVAT = totalDiscountPercentage + productPriceVAT;

            // if (discountPercentage < 0) {
            //   return (
            //     <WrapperTableCell textAlign="right">
            //       <NumberFormat value={parseFloat(String(0))} />
            //     </WrapperTableCell>
            //   );
            // }

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(String(total < 0 ? 0 : total))} />
              </WrapperTableCell>
            );
          }

          if (typeValue === "discount_absolute") {
            const total = getPriceTable(typeValue, valueChangeAmount, price);

            // const totalDiscountAbsolute = price.excl_tax - valueChangeAmount;

            // // const VAT = (priceVAT * value) / 100;
            // // const total = value + VAT;

            // const productPriceVAT = (totalDiscountAbsolute * priceVAT) / 100;
            // const totalProductPriceVAT = totalDiscountAbsolute + productPriceVAT;

            // if (totalDiscountAbsolute <= 0) {
            //   return (
            //     <WrapperTableCell textAlign="right">
            //       <NumberFormat value={parseFloat(String(0))} />
            //     </WrapperTableCell>
            //   );
            // }

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(String(total < 0 ? 0 : total))} />
              </WrapperTableCell>
            );
          }

          if (typeValue === "increase_absolute") {
            const total = getPriceTable(typeValue, valueChangeAmount, price);

            // const totalDiscountAbsolute =
            //   parseFloat(price.excl_tax) + parseFloat(valueChangeAmount);

            // const productPriceVAT = (totalDiscountAbsolute * priceVAT) / 100;
            // const totalProductPriceVAT = totalDiscountAbsolute + productPriceVAT;

            // if (totalDiscountAbsolute <= 0) {
            //   return (
            //     <WrapperTableCell textAlign="right">
            //       <NumberFormat value={parseFloat(String(0))} />
            //     </WrapperTableCell>
            //   );
            // }

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(String(total < 0 ? 0 : total))} />
              </WrapperTableCell>
            );
          }

          if (typeValue === "fixed_price") {
            const total = getPriceTable(typeValue, valueChangeAmount, price);

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={total} />
              </WrapperTableCell>
            );
          }
        },
        maxWidth: 400,
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

          const id = get(row, "original.id");

          if (true) {
            return (
              <Stack flexDirection="row" alignItems="center" columnGap={1}>
                {activeEditRow[id] ? (
                  <Fragment>
                    <CheckButton
                      disabled={!!updateLoading[id]}
                      onClick={updateHandler([row])}
                    />

                    <CloseButton
                      disabled={!!updateLoading[id]}
                      onClick={removeEditRowDataHandler([row])}
                    />
                  </Fragment>
                ) : (
                  <Fragment>
                    <EditButton onClick={activeEditRowHandler(row)} />
                    <DeleteButton
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHandler({
                          data: [row],
                        });
                      }}
                    />
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
  }, [unitType]);

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
    </WrapperTable>
  );
};

export default ProductPriceVariantColumn;
