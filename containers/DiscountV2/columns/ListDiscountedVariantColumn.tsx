import { get } from "lodash";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { Box, MenuItem, Stack } from "@mui/material";
import { CellProps, useTable, useSortBy } from "react-table";
import { Fragment, PropsWithChildren, useMemo, useState } from "react";

import { CommonTableProps, Unit as IUnit } from "interfaces";

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
  TableCellForEdit,
} from "components/TableV3";

import {
  WrapperTable,
  DeleteButton,
  Link,
  NumberFormat,
  CloseButton,
  EditButton,
  CheckButton,
} from "components";

import { ACTIVE_DISCOUNT_TYPE } from "constant";

type UserByUserTableProps = CommonTableProps<any> & Record<string, any>;

const ListDiscountedVariantColumn = (props: UserByUserTableProps) => {
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
  const [discountType, setDiscountType] = useState();

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

          const image = get(row, "original.variant.primary_image.product_small");

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

          const value = get(row, "original.variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, onGotoHandler } = props;

          const value = get(row, "original.variant.name");

          return (
            <WrapperTableCell>
              {/* <Link
                href={"#"}
                onClick={(e: React.SyntheticEvent) => {
                  e.preventDefault();
                  e.stopPropagation();

                  onGotoHandler?.(row);
                }}
              >
                {value}
              </Link> */}
              {value}
            </WrapperTableCell>
          );
        },
        colSpan: 3,
      },

      {
        Header: <FormattedMessage id={`table.unit_price_before_discounts`} />,
        accessor: "unit_price_before_discounts",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.variant.price.incl_tax") || "-";

          return <NumberFormat value={parseFloat(value)} />;
        },
      },

      {
        Header: <Box minWidth={150}>Loại bảng giá</Box>,
        accessor: "discount_type",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            cell,
            updateEditRowDataHandler,
            editData,
            activeEditRow,
            activeEditRowHandler,
          } = props;

          const changeType = ["Percentage", "Absolute"];

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const mainUnit = get(row, "original.unit");
          const value = get(row, "original.discount_type");

          if (get(changeType, "length") <= 1) {
            return <WrapperTableCell>{get(changeType, "[0]") || "-"}</WrapperTableCell>;
          }
          if (activeEditRow[id]) {
            return (
              <TableCellForEdit
                {...{
                  inputType: "select",
                  renderItem() {
                    return changeType.map((el) => {
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
                    setDiscountType(value);
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
            Giá trị giảm
          </Box>
        ),
        accessor: "discount_amount",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, cell, activeEditRow, updateEditRowDataHandler, editData } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const typeValue = get(row, "original.discount_type");
          const valueDiscountAmount = get(row, "original.discount_amount");

          if (activeEditRow[id]) {
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
                    suffix: discountType === "Percentage" ? " %" : " ₫",
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                {typeValue === "Percentage" ? (
                  `${parseFloat(valueDiscountAmount)}%`
                ) : (
                  <NumberFormat value={parseFloat(valueDiscountAmount)} />
                )}
              </WrapperTableCell>
            );
          }
        },
      },

      {
        Header: "Giá sau giảm",
        accessor: "discount-price",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.variant.editable_sku");
          const discountType = get(row, "original.discount_type");
          const discountAmount = get(row, "original.discount_amount");
          const price = get(row, "original.variant.price");

          //thuế của sản phẩm
          const priceVAT1 = price.incl_tax / price.excl_tax - 1;
          const priceVAT = priceVAT1 * 100;

          if (discountType === "Percentage") {
            const discountPercentage = (price.excl_tax * discountAmount) / 100;
            const totalDiscountPercentage =
              parseFloat(price.excl_tax) - discountPercentage;

            //giá bán có thuế
            const productPriceVAT = (totalDiscountPercentage * priceVAT) / 100;
            const totalProductPriceVAT = totalDiscountPercentage + productPriceVAT;

            if (discountPercentage < 0) {
              return (
                <WrapperTableCell textAlign="right">
                  <NumberFormat value={parseFloat(String(0))} />
                </WrapperTableCell>
              );
            }

            if (discountAmount >= 100) {
              return (
                <WrapperTableCell textAlign="right">
                  <NumberFormat value={parseFloat(String(0))} />
                </WrapperTableCell>
              );
            }

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    String(totalProductPriceVAT < 0 ? 0 : totalProductPriceVAT)
                  )}
                />
              </WrapperTableCell>
            );
          }

          if (discountType === "Absolute") {
            const totalDiscountAbsolute =
              parseFloat(price.excl_tax) - parseFloat(discountAmount);

            const productPriceVAT = (totalDiscountAbsolute * priceVAT) / 100;
            const totalProductPriceVAT = totalDiscountAbsolute + productPriceVAT;

            if (totalDiscountAbsolute <= 0) {
              return (
                <WrapperTableCell textAlign="right">
                  <NumberFormat value={parseFloat(String(0))} />
                </WrapperTableCell>
              );
            }

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat
                  value={parseFloat(
                    String(totalProductPriceVAT < 0 ? 0 : totalProductPriceVAT)
                  )}
                />
              </WrapperTableCell>
            );
          }
        },
      },

      {
        Header: "Số lượng giảm",
        accessor: "quantity_discount",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, cell, activeEditRow, updateEditRowDataHandler, editData } = props;

          const id = get(row, "original.id");
          const columnId = get(cell, "column.id");
          const value = get(row, "original.usage_limit");

          if (activeEditRow[id]) {
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
                    suffix: "",
                  },
                }}
              />
            );
          } else {
            return (
              <WrapperTableCell textAlign="right">
                {value === null ? "-" : value}
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
            typeDiscount,
          } = props;

          const id = get(row, "original.id");
          const active =
            typeDiscount === ACTIVE_DISCOUNT_TYPE.end ||
            typeDiscount === ACTIVE_DISCOUNT_TYPE.happenning;

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
                    <EditButton onClick={activeEditRowHandler(row)} disabled={active} />
                    <DeleteButton
                      disabled={active}
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
  }, [discountType]);

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
            rowsPerPageOptions={[25, 50, 75, 100]}
          />
        </Box>
      </TableContainer>
    </WrapperTable>
  );
};

export default ListDiscountedVariantColumn;
