import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import CircleIcon from "@mui/icons-material/Circle";
import { FormattedMessage, useIntl } from "react-intl";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { PropsWithChildren, useEffect, useMemo } from "react";

import { get } from "lodash";
import { Box, Stack, Typography } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  WrapperTableCell,
  TableCellWithFetch,
  TableCellForAvatar,
  TableCellForSelection,
  TableHeaderForSelection,
} from "components/TableV3";

import {
  ViewButton,
  NumberFormat,
  WrapperTable,
  DeleteButton,
  LoadingButton,
} from "components";

import { PRODUCTS } from "routes";
import DynamicMessage from "messages";
import { SELECTED_TABLE } from "constant";
import { CommonTableProps } from "interfaces";
import { formatDate, transformUrl } from "libs";

import { ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_CATEGORIES_END_POINT } from "__generated__/END_POINT";

type ProductTableProps = CommonTableProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1> &
  Record<string, any>;

const ProductTable = (props: ProductTableProps) => {
  const {
    data,
    count,
    getTable,
    maxHeight,
    isLoading,
    pagination,
    hideAndShow,
    onPageChange,
    deleteHandler,
    onPageSizeChange,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const { formatMessage, messages } = useIntl();

  const initialState = { hiddenColumns: hideAndShow };

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
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const image = get(row, "original.primary_image.product_small");

          return <TableCellForAvatar src={image} />;
        },
        maxWidth: 90,
        width: 90,
      },
      {
        Header: <FormattedMessage id={`table.sku`} />,
        accessor: "sku",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.default_variant.sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.editable_sku`} />,
        accessor: "editable_sku",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.default_variant.editable_sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.productName`} />,
        accessor: "productName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 400,
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.available_quantity`} />
          </Box>
        ),
        accessor: "default_variant.quantity",
        textAlign: "right",
        className: "table.available_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const quantity = get(row, "original.default_variant.quantity");
          const allocatedQuantity = get(
            row,
            "original.default_variant.allocated_quantity"
          );

          return (
            <WrapperTableCell textAlign="right">
              {quantity - allocatedQuantity}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.price_incl_tax`} />
          </Box>
        ),
        accessor: "price_incl_tax",
        textAlign: "right",
        className: "table.price_incl_tax",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PRODUCT_PRODUCT_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const hasVariant = get(row, "original.product_class.has_variants");

          if (hasVariant) {
            const minPrice = get(row, "original.min_variant_price.incl_tax") || "0";
            const maxPrice = get(row, "original.max_variant_price.incl_tax") || "0";

            return (
              <WrapperTableCell textAlign="right" columnGap={2}>
                <NumberFormat value={parseFloat(minPrice)} />

                <Typography component="span">-</Typography>

                <NumberFormat value={parseFloat(maxPrice)} />
              </WrapperTableCell>
            );
          } else {
            const price = get(row, "original.default_variant.price.incl_tax") || "0";

            return (
              <WrapperTableCell textAlign="right">
                <NumberFormat value={parseFloat(price)} />
              </WrapperTableCell>
            );
          }
        },
      },

      {
        Header: <FormattedMessage id={`productCategory`} />,
        accessor: "productCategory",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.id");

          return (
            <TableCellWithFetch
              url={transformUrl(ADMIN_PRODUCTS_CATEGORIES_END_POINT, {
                product: value,
              })}
            >
              {(data: any) => {
                const value = data.results.map((el) => el.name);

                return <WrapperTableCell>{value.join(", ")}</WrapperTableCell>;
              }}
            </TableCellWithFetch>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.productClassName`} />,
        accessor: "productClassName",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.product_class.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`publicationDate`} />,
        accessor: "publicationDate",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.publication_date");

          return <WrapperTableCell>{formatDate(value, "dd/MM/yyyy")}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`availableForPurchase`} />,
        accessor: "availableForPurchase",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.is_used");
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
        Header: <FormattedMessage id={`isPublished`} />,
        accessor: "isPublished",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.date_updated");
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
        Header: <FormattedMessage id={`table.temporarily_out_of_stock`} />,
        accessor: "temporarily_out_of_stock",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.default_variant.allocated_quantity");
          let color = value > 0 ? "rgb(115,214,115)" : "rgb(88,91,100)";

          return (
            <WrapperTableCell textAlign="center">
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
        Header: <FormattedMessage id={`table.last_edit_time`} />,
        accessor: "last_edit_time",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.date_updated");

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
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <ViewButton href={`/${PRODUCTS}/${row.original.id}`} />

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
  }, [hideAndShow]);

  const table = useTable(
    {
      columns: columns as any,
      data,
      manualPagination: true,
      autoResetPage: false,
      initialState,
      ...restProps,
    },
    useSortBy,
    useSticky,
    useRowSelect
  );

  useEffect(() => {
    getTable({
      ...table,
      noDefault: hideAndShow,
      defaultSelect: SELECTED_TABLE.product,
    });
  }, [table, hideAndShow]);

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

export default ProductTable;
