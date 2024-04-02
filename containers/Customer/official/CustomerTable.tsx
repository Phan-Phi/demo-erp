import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import CircleIcon from "@mui/icons-material/Circle";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { PropsWithChildren, useEffect, useMemo } from "react";

import { get } from "lodash";
import { Box, Icon, Stack, styled } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";

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
  WrapperTableHeaderCell,
} from "components/TableV3";
import { Link, NumberFormat, TagsButton, ToolTipForTags, ViewButton } from "components";

import { CUSTOMERS, DETAIL } from "routes";
import { CommonTableProps } from "interfaces";
import { useChoice, useGetTaggedItems } from "hooks";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";

import { formatDate, getDisplayValueFromChoiceItem, formatPhoneNumber } from "libs";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type CustomerTableProps = CommonTableProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1> &
  Record<string, any>;

const CustomerTable = (props: CustomerTableProps) => {
  const {
    data,
    count,
    getTable,
    isLoading,
    maxHeight,
    pagination,
    hideAndShow,
    onPageChange,
    onPageSizeChange,
    onViewTagsHandler,
  } = props;

  const initialState = { hiddenColumns: hideAndShow };

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
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const id = get(row, "original.official_customer.id");
          const { loading, data } = useGetTaggedItems(id, SOURCE_TYPE_FOR_TAGS.customer);

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
        Header: <FormattedMessage id={`table.customerSid`} />,
        accessor: "customerSid",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.last_name`} />,
        accessor: "last_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.last_name");

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.first_name`} />,
        accessor: "first_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.first_name");

          return <WrapperTableCell>{value || "-"}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.gender`} />,
        accessor: "gender",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;
          const { genders } = useChoice();

          const value = get(row, "original.gender");
          const displayValue = getDisplayValueFromChoiceItem(genders, value);

          return (
            <WrapperTableCell width={80}>
              {displayValue ? displayValue : "-"}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.birthday`} />,
        accessor: "birthday",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.birthday");

          return (
            <WrapperTableCell width={120}>
              {value ? formatDate(value, "dd/MM/yyyy") : "-"}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.main_phone_number") || "-";

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.email`} />,
        accessor: "email",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.email") || "-";

          return <WrapperTableCell width={120}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (props) => {
          const { column } = props;

          return (
            <WrapperTableHeaderCell isSortBy column={column}>
              <FormattedMessage id={`table.total_debt_amount`} />
            </WrapperTableHeaderCell>
          );
        },
        accessor: "official_customer.total_debt_amount.incl_tax",
        textAlign: "right",
        className: "table.total_debt_amount",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value =
            get(row, "original.official_customer.total_debt_amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.date_joined`} />,
        accessor: "date_joined",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.date_joined");

          return (
            <WrapperTableCell>
              {value ? formatDate(value, "dd/MM/yyyy") : "-"}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.facebook`} />,
        accessor: "facebook",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.facebook");

          return (
            <WrapperTableCell>
              {value ? (
                <Link href={value}>
                  <Icon children={<FacebookIcon />} />
                </Link>
              ) : (
                "-"
              )}
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.tax_identification_number`} />,
        accessor: "tax_identification_number",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.tax_identification_number") || "-";

          return <WrapperTableCell width={100}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.company_name`} />,
        accessor: "company_name",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.company_name") || "-";

          return <WrapperTableCell width={100}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.customerType`} />,
        accessor: "customerType",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const value = get(row, "original.official_customer.type.name") || "-";

          return <WrapperTableCell width={150}>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.is_active`} />,
        accessor: "is_active",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.in_business");

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
        Header: <FormattedMessage id={`table.sales_in_charge`} />,
        accessor: "sales_in_charge",
        Cell: (
          props: PropsWithChildren<
            CellProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1, any>
          >
        ) => {
          const { row } = props;

          const firstName =
            get(row, "original.official_customer.sales_in_charge.first_name") || "";
          const lastName =
            get(row, "original.official_customer.sales_in_charge.last_name") || "";

          const fullName = `${lastName} ${firstName}`;

          return <WrapperTableCell>{fullName}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.notes`} />,
        accessor: "note",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.note");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const id = get(row, "original.official_customer.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1} width={80}>
              <TagsButton
                onClick={() => {
                  onViewTagsHandler(id);
                }}
              />
              <ViewButton href={`/${CUSTOMERS}/${DETAIL}/${row.original.id}`} />
            </Stack>
          );
        },

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
    },
    useSortBy,
    useSticky
  );

  useEffect(() => {
    getTable({
      ...table,
      noDefault: hideAndShow,
      defaultSelect: SELECTED_TABLE.customers,
    });
  }, [table, hideAndShow]);

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
};

export default CustomerTable;

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
