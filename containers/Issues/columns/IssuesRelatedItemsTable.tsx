import { get } from "lodash";
import { Box, styled } from "@mui/material";
import { useSticky } from "react-table-sticky";

import { useRowSelect } from "react-table";
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
} from "components/TableV3";
import { ISSUES_OBJECT_ID } from "constant";
import { CommonTableProps } from "interfaces";
import { getDisplayValueFromChoiceItem } from "libs";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type IssuesRelatedItemsTableProps = CommonTableProps<ISSUE_VIEW_TYPE_V1> &
  Record<string, any>;

export default function IssuesRelatedItemsTable(props: IssuesRelatedItemsTableProps) {
  const {
    tag,
    data,
    count,
    onPageChange,
    // deleteHandler,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    // onGotoHandler,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const columns = useMemo(() => {
    return [
      //   {
      //     accessor: "selection",
      //     Header: (props) => {
      //       const { getToggleAllRowsSelectedProps } = props;

      //       return (
      //         <TableHeaderForSelection
      //           getToggleAllRowsSelectedProps={getToggleAllRowsSelectedProps}
      //         />
      //       );
      //     },
      //     Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
      //       const { row } = props;
      //       return <TableCellForSelection row={row} />;
      //     },
      //     maxWidth: 64,
      //     width: 64,
      //   },

      {
        Header: "Tên",
        accessor: "name",
        Cell: (props: PropsWithChildren<CellProps<ISSUE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const firstName = get(row, "original.content_object.first_name");
          const lastName = get(row, "original.content_object.last_name");
          const value = get(row, "original.content_type");

          if (value === "stock.receiptorder" || value === "order.invoice") {
            const sid = get(row, "original.content_object.sid");

            return <WrapperTableCell>{sid}</WrapperTableCell>;
          }

          return <WrapperTableCell>{`${firstName} ${lastName}`}</WrapperTableCell>;
        },
      },

      {
        Header: "Loại",
        accessor: "content_type",
        Cell: (props: PropsWithChildren<CellProps<ISSUE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.content_type");
          const displayValue = getDisplayValueFromChoiceItem(
            ISSUES_OBJECT_ID as any,
            value
          );

          return <WrapperTableCell>{displayValue}</WrapperTableCell>;
        },
      },

      {
        Header: "Dữ liệu",
        accessor: "object_repr",
        Cell: (props: PropsWithChildren<CellProps<ISSUE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.object_repr");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      //   {
      //     Header: <FormattedMessage id={`table.action`} />,
      //     accessor: "action",
      //     Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
      //       const {
      //         row,
      //         // deleteHandler,
      //         writePermission,
      //         onViewTagsHandler,
      //         readPermission,
      //       } = props;
      //       const id = get(row, "original.id");

      //       //   if (loading) return <Skeleton />;

      //       return (
      //         <Stack flexDirection="row" alignItems="center" columnGap={1}>
      //           {writePermission && <TagsButton onClick={() => onViewTagsHandler(id)} />}

      //           {readPermission && (
      //             <ViewButton href={`/${ISSUES}/${EDIT}/${row.original.id}`} />
      //           )}

      //           {writePermission && (
      //             <DeleteButton
      //               onClick={(e) => {
      //                 e.stopPropagation();
      //                 deleteHandler({
      //                   data: [row],
      //                 });
      //               }}
      //             />
      //           )}
      //         </Stack>
      //       );
      //     },
      //     width: 180,
      //     maxWidth: 180,
      //     sticky: "right",
      //   },
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

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
