import { get } from "lodash";
import { Box, Stack } from "@mui/material";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { useMemo, PropsWithChildren, useEffect } from "react";
import CircleIcon from "@mui/icons-material/Circle";
import FacebookIcon from "@mui/icons-material/Facebook";
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
} from "components/TableV3";
import { useChoice } from "hooks";
import { DETAIL, USERS } from "routes";
import { Link, ViewButton } from "components";
import { CommonTableProps } from "interfaces";
import { formatDate, getDisplayValueFromChoiceItem, formatPhoneNumber } from "libs";
import { ADMIN_USER_USER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { SELECTED_TABLE } from "constant";

type UserListTableProps = CommonTableProps<ADMIN_USER_USER_VIEW_TYPE_V1> &
  Record<string, any>;

export default function UserListColumn(props: UserListTableProps) {
  const {
    hideAndShow,
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
    getTable,
    ...restProps
  } = props;

  const initialState = { hiddenColumns: hideAndShow };

  const columns = useMemo(() => {
    return [
      {
        Header: <FormattedMessage id={`table.id`} />,
        accessor: "id",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.id");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.username`} />,
        accessor: "username",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.username") || "-";

          return <WrapperTableCell minWidth={120}>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.last_name`} />,
        accessor: "last_name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.last_name") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.first_name`} />,
        accessor: "first_name",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.first_name") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.gender`} />,
        accessor: "gender",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;
          const { genders } = useChoice();

          const value = get(row, `original.gender`);
          const displayValue = getDisplayValueFromChoiceItem(genders, value);

          return (
            <WrapperTableCell minWidth={70}>
              {displayValue ? displayValue : "-"}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.birthday`} />,
        accessor: "birthday",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.birthday");

          return (
            <WrapperTableCell>{formatDate(value, "dd/MM/yyyy") || "-"}</WrapperTableCell>
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
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.email") || "-";

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.is_active`} />,
        accessor: "is_active",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.is_active");

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
        Header: <FormattedMessage id={`table.is_staff`} />,
        accessor: "is_staff",
        textAlign: "center",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.is_staff");

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
        Header: <FormattedMessage id={`table.facebook`} />,
        accessor: "facebook",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.facebook");

          return (
            <WrapperTableCell>
              {value ? <Link href={value} children={<FacebookIcon />} /> : "-"}
            </WrapperTableCell>
          );
        },
      },

      {
        Header: <FormattedMessage id={`table.date_joined`} />,
        accessor: "date_joined",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.date_joined");

          return <WrapperTableCell>{formatDate(value, "dd/MM/yyyy")}</WrapperTableCell>;
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
          const { row } = props;

          // if (loading) return <Skeleton />;

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1} minWidth={60}>
              <ViewButton href={`/${USERS}/${DETAIL}/${row.original.id}`} />
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
    useSticky
  );

  useEffect(() => {
    getTable({
      ...table,
      noDefault: hideAndShow,
      defaultSelect: SELECTED_TABLE.user,
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
          onPageChange={(_, page) => onPageChange(page)}
          onRowsPerPageChange={onPageSizeChange}
          rowsPerPageOptions={[25, 50, 75, 100]}
        />
      </Box>
    </Box>
  );
}
