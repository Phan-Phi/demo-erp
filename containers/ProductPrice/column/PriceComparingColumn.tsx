import { get } from "lodash";
import { Box } from "@mui/material";
import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren } from "react";
import { useTable, useSortBy, CellProps } from "react-table";

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
import { transformUrl } from "libs";
import { NumberFormat } from "components";
import { CommonTableProps } from "interfaces";
import { ADMIN_PRICE_TABLES_VARIANTS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { getPriceTable } from "libs/getPriceTable";

type ProductPriceTableProps =
  CommonTableProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1> & Record<string, any>;

export default function PriceComparingColumn(props: ProductPriceTableProps) {
  const {
    tag,
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
    const currentColumn = [
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
        Header: "",
        accessor: "primary_image",

        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.primary_image.product_small");

          return <TableCellForAvatar src={value} />;
        },
      },

      {
        Header: "Mã hàng",
        accessor: "sku",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.sku");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Tên sản phẩm",
        accessor: "name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Danh mục sản phẩm",
        accessor: "category",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;
          const value = get(row, "original.name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Bảng giá chung",
        accessor: "giá vốn",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_PRODUCT_PRODUCT_VARIANT_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.price.incl_tax");

          return (
            <WrapperTableCell>
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
    ];

    const columnPrice = tag.map((el, idx) => {
      return {
        Header: el.name,
        accessor: el.name,
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.id");

          return (
            <TableCellWithFetch
              url={transformUrl(ADMIN_PRICE_TABLES_VARIANTS_END_POINT, {
                table: el.id,
                variant: value,
              })}
            >
              {(data: any) => {
                const result = data.results;

                if (result.length === 0) {
                  return <WrapperTableCell textAlign="right">-</WrapperTableCell>;
                }

                const typeValue = result[0].change_type;

                const valueChangeAmount = result[0].change_amount;

                const price = result[0].variant.price;

                // const priceVAT1 = price.incl_tax / price.excl_tax - 1;
                // const priceVAT = priceVAT1 * 100;

                if (typeValue === "discount_percentage") {
                  const total = getPriceTable(typeValue, valueChangeAmount, price);
                  // const discountPercentage =
                  //   (parseFloat(price.excl_tax) * valueChangeAmount) / 100;

                  // const totalDiscountPercentage =
                  //   parseFloat(price.excl_tax) - discountPercentage;

                  // const VAT = (totalDiscountPercentage * priceVAT) / 100;
                  // const total = totalDiscountPercentage + VAT;

                  // if (discountPercentage <= 0) {
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
                      <NumberFormat value={parseFloat(String(total <= 0 ? 0 : total))} />
                    </WrapperTableCell>
                  );
                }

                if (typeValue === "increase_percentage") {
                  const total = getPriceTable(typeValue, valueChangeAmount, price);

                  // const discountPercentage =
                  //   (price.excl_tax * parseFloat(valueChangeAmount)) / 100;
                  // const totalDiscountPercentage =
                  //   parseFloat(price.excl_tax) + discountPercentage;

                  // const VAT = (totalDiscountPercentage * priceVAT) / 100;
                  // const total = totalDiscountPercentage + VAT;

                  // if (discountPercentage <= 0) {
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
                      <NumberFormat value={parseFloat(String(total <= 0 ? 0 : total))} />
                    </WrapperTableCell>
                  );
                }

                if (typeValue === "discount_absolute") {
                  const total = getPriceTable(typeValue, valueChangeAmount, price);

                  // const value = price.excl_tax - valueChangeAmount;

                  // const VAT = (priceVAT * value) / 100;
                  // const total = value + VAT;

                  return (
                    <WrapperTableCell textAlign="right">
                      <NumberFormat value={parseFloat(String(total < 0 ? 0 : total))} />
                    </WrapperTableCell>
                  );
                }

                if (typeValue === "increase_absolute") {
                  const total = getPriceTable(typeValue, valueChangeAmount, price);

                  // const value = price.excl_tax + valueChangeAmount;

                  // const VAT = (priceVAT * value) / 100;
                  // const total = value + VAT;

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

                return (
                  <WrapperTableCell textAlign="right">
                    <NumberFormat value={parseFloat(result[0].change_amount)} />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      };
    });

    if (tag.length === 0) {
      return currentColumn;
    }

    return [...currentColumn, ...columnPrice];
  }, [tag]);

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
