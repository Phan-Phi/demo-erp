import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { Fragment, PropsWithChildren, useEffect, useMemo } from "react";

import { get } from "lodash";
import FacebookIcon from "@mui/icons-material/Facebook";
import { Box, Icon, Stack, Typography, styled } from "@mui/material";

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
} from "components/TableV3";

import {
  Link,
  CheckButton,
  DeleteButton,
  LoadingButton,
  ViewButton,
  TagsButton,
  ToolTipForTags,
} from "components";

import DynamicMessage from "messages";
import { CommonTableProps } from "interfaces";
import { useChoice, useGetTaggedItems } from "hooks";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";
import { formatDate, getDisplayValueFromChoiceItem } from "libs";
import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type DraftTableProps = CommonTableProps<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1> &
  Record<string, any>;

const DraftTable = (props: DraftTableProps) => {
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
    approveLoading,
    approveHandler,
    onPageSizeChange,
    onViewTagsHandler,
    renderHeaderContentForSelectedRow,
    ...restProps
  } = props;

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

          const value = get(row, "original.birthday");

          return (
            <WrapperTableCell width={120}>
              {value ? formatDate(value, "dd/MM/yyyy") : "-"}
            </WrapperTableCell>
          );
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
        Header: <FormattedMessage id={`table.action`} />,
        accessor: "action",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row, approvePermission, onViewHandler } = props;

          const id = get(row, "original.id");
          const officialCustomerId = get(row, "original.official_customer.id");

          if (approvePermission) {
            return (
              <Stack columnGap={1} flexDirection="row" alignItems="center">
                <ViewButton
                  onClick={() => {
                    onViewHandler(row);
                  }}
                />

                <CheckButton
                  disabled={!!approveLoading[id]}
                  onClick={(e) => {
                    approveHandler({
                      data: [row],
                      type: "apply",
                    })();
                  }}
                />

                <DeleteButton
                  disabled={!!approveLoading[id]}
                  onClick={(e) => {
                    deleteHandler({ data: [row] });
                  }}
                />

                {officialCustomerId && (
                  <TagsButton
                    onClick={() => {
                      onViewTagsHandler(officialCustomerId);
                    }}
                  />
                )}
              </Stack>
            );
          }

          return null;
        },
        width: 210,
        maxWidth: 210,
        sticky: "right",
      },
    ];
  }, [hideAndShow]);

  const { formatMessage, messages } = useIntl();

  const table = useTable(
    {
      data,
      columns: columns as any,
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
      defaultSelect: SELECTED_TABLE.customers,
    });
  }, [table, hideAndShow]);

  return (
    <Box>
      <TableContainer maxHeight={maxHeight}>
        <Table>
          <TableHead>
            <RenderHeader
              table={table}
              renderHeaderContentForSelectedRow={(tableInstance) => {
                const selectedRows = tableInstance.selectedFlatRows;

                return (
                  <Fragment>
                    <Stack flexDirection="row" columnGap={3} alignItems="center">
                      <Typography>{`${formatMessage(DynamicMessage.selectedRow, {
                        length: selectedRows.length,
                      })}`}</Typography>
                      <LoadingButton
                        loading={!!approveLoading["all"]}
                        disabled={!!approveLoading["all"]}
                        color="success"
                        onClick={approveHandler({ data: selectedRows, type: "apply" })}
                      >
                        {messages["approveButton"]}
                      </LoadingButton>

                      <LoadingButton
                        loading={!!approveLoading["all"]}
                        disabled={!!approveLoading["all"]}
                        onClick={() => {
                          deleteHandler({
                            data: selectedRows,
                          });
                        }}
                        color="error"
                        children={messages["refuseButton"]}
                      />
                    </Stack>
                  </Fragment>
                );
              }}
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
    </Box>
  );
};

export default DraftTable;

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
