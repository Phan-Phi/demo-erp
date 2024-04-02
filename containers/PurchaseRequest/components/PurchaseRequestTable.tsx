import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { CellProps, useTable } from "react-table";
import React, { PropsWithChildren, useMemo } from "react";

import { get } from "lodash";
import { Box, Stack, styled } from "@mui/material";

import {
  Table,
  TableBody,
  TableHead,
  RenderBody,
  RenderHeader,
  TableContainer,
  TablePagination,
  TableCellForTag,
  WrapperTableCell,
  TableCellWithFetch,
} from "components/TableV3";
import { TagsButton, ToolTipForTags, NumberFormat } from "components";

import { formatDate } from "libs";
import { useGetTaggedItems } from "hooks";
import { CommonTableProps } from "interfaces";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { PURCHASE_REQUEST_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_PRODUCTS_VARIANTS_END_POINT } from "__generated__/END_POINT";

type PurchaseRequestTableProps = CommonTableProps<PURCHASE_REQUEST_VIEW_TYPE_V1> &
  Record<string, any>;

export default function PurchaseRequestTable(props: PurchaseRequestTableProps) {
  const {
    data,
    count,
    getTable,
    isLoading,
    maxHeight,
    pagination,
    onPageChange,
    onPageSizeChange,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      {
        Header: (
          <Box>
            <FormattedMessage id={`table.tags`} />
          </Box>
        ),
        accessor: "tags",
        className: "table.tags",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;
          const id = get(row, "original.id");
          const { loading, data } = useGetTaggedItems(
            id,
            SOURCE_TYPE_FOR_TAGS.purchase_request
          );

          return (
            <StyledWrapperTags loading={loading} title={<ToolTipForTags data={data} />}>
              {data &&
                data.map((item, index) => {
                  const name = get(item, "tag.name");
                  return <TableCellForTag key={index}>{name}</TableCellForTag>;
                })}
            </StyledWrapperTags>
          );
        },
        width: 180,
        maxWidth: 180,
      },
      {
        Header: <Box>Sku biến thể sản phẩm</Box>,
        accessor: "variant_sku",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Tên biến thể sản phẩm</Box>,
        accessor: "variant_name",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box textAlign="right">Số lượng đặt</Box>,
        accessor: "quantity",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={value} suffix="" />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng tồn kho hiện tại</Box>,
        accessor: "inventory_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const variantId = get(row, "original.variant");

          const url = `${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`;

          return (
            <TableCellWithFetch url={url}>
              {(data) => {
                const quantity: any = get(data, "quantity", 0);

                return (
                  <WrapperTableCell textAlign="right">
                    <NumberFormat value={quantity} suffix="" />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: <Box textAlign="right">Số lượng dự trữ</Box>,
        accessor: "allocated_quantity",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const variantId = get(row, "original.variant");

          const url = `${ADMIN_PRODUCTS_VARIANTS_END_POINT}${variantId}`;

          return (
            <TableCellWithFetch url={url}>
              {(data) => {
                const allocatedQuantity: any = get(data, "allocated_quantity", 0);

                return (
                  <WrapperTableCell textAlign="right">
                    <NumberFormat value={allocatedQuantity} suffix="" />
                  </WrapperTableCell>
                );
              }}
            </TableCellWithFetch>
          );
        },
      },
      {
        Header: <Box>Tên người tạo</Box>,
        accessor: "owner_name",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Email người tạo</Box>,
        accessor: "owner_email",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <Box>Ghi chú</Box>,
        accessor: "notes",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: "250px",
      },
      {
        Header: <Box>Ngày tạo</Box>,
        accessor: "date_created",
        Cell: (
          props: PropsWithChildren<CellProps<PURCHASE_REQUEST_VIEW_TYPE_V1, any>>
        ) => {
          const { value } = props;

          return <WrapperTableCell>{formatDate(value, "dd/MM/yyyy")}</WrapperTableCell>;
        },
        maxWidth: "250px",
      },
      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, onViewTagsHandler } = props;

          const id = get(row, "original.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <TagsButton onClick={() => onViewTagsHandler(id)} />
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
    useSticky
  );

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader table={table} />
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
    </Box>
  );
}

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
