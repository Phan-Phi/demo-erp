import { get } from "lodash";
import { useRowSelect } from "react-table";
import { FormattedMessage } from "react-intl";
import { useSticky } from "react-table-sticky";
import { Box, Stack, styled } from "@mui/material";
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
  TableCellForSelection,
  TableHeaderForSelection,
  TableCellForTag,
  TableCellWithFetch,
} from "components/TableV3";
import { transformUrl } from "libs";
import { ISSUES, EDIT } from "routes";
import { CommonTableProps } from "interfaces";
import { SOURCE_TYPE_FOR_TAGS } from "constant";
import { useGetTaggedItems, useUser } from "hooks";
import { DeleteButton, TagsButton, ToolTipForTags, ViewButton } from "components";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ISSUES_RELATED_ITEMS_END_POINT } from "__generated__/END_POINT";

type IssuesTableProps = CommonTableProps<ISSUE_VIEW_TYPE_V1> & Record<string, any>;

export default function IssuesTable(props: IssuesTableProps) {
  const {
    tag,
    data,
    count,
    onPageChange,
    deleteHandler,
    onPageSizeChange,
    pagination,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

  const userInfo = useUser();

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
        Header: (
          <Box>
            <FormattedMessage id={`table.tags`} />
          </Box>
        ),
        accessor: "tags",
        className: "table.tags",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const id = get(row, "original.id");
          const { loading, data } = useGetTaggedItems(id, SOURCE_TYPE_FOR_TAGS.issue);

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
        Header: <FormattedMessage id={`sid`} />,
        accessor: "sid",
        Cell: (props: PropsWithChildren<CellProps<ISSUE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.sid");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: "Tiêu đề",
        accessor: "title",
        Cell: (props: PropsWithChildren<CellProps<ISSUE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.title");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.owner_name`} />,
        accessor: "owner_name",
        Cell: (props: PropsWithChildren<CellProps<ISSUE_VIEW_TYPE_V1, any>>) => {
          const { row } = props;

          const value = get(row, "original.owner_name");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },

      {
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const {
            row,
            // deleteHandler,
            writeTagsPermission,
            writePermission,
            onViewTagsHandler,
            readPermission,
          } = props;
          const id = get(row, "original.id");

          const idUserTable: number = get(row, "original.owner.id");
          const idUser: number = userInfo.id;

          return (
            <TableCellWithFetch
              url={transformUrl(ADMIN_ISSUES_RELATED_ITEMS_END_POINT, {
                content_type: "account.user",
                issue: id,
              })}
            >
              {(data: any) => {
                const userOfValueRelated = data.results.filter((el, idx) => {
                  return el.content_object.id === idUser;
                });

                return (
                  <Stack flexDirection="row" alignItems="center" columnGap={1}>
                    {writeTagsPermission && (
                      <TagsButton onClick={() => onViewTagsHandler(id)} />
                    )}

                    {idUserTable === idUser ||
                    userOfValueRelated.length > 0 ||
                    readPermission ? (
                      <ViewButton href={`/${ISSUES}/${EDIT}/${row.original.id}`} />
                    ) : null}

                    {idUserTable === idUser || writePermission ? (
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteHandler({
                            data: [row],
                          });
                        }}
                      />
                    ) : null}
                  </Stack>
                );
              }}
            </TableCellWithFetch>
          );
        },
        width: 180,
        maxWidth: 180,
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
