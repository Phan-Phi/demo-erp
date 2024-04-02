import { useRowSelect } from "react-table";
import { useSticky } from "react-table-sticky";
import { FormattedMessage, useIntl } from "react-intl";
import { CellProps, useTable, useSortBy } from "react-table";
import React, { PropsWithChildren, useEffect, useMemo } from "react";

import { cloneDeep, get, set } from "lodash";
import { Box, Stack, Typography, styled } from "@mui/material";

import {
  ViewButton,
  TagsButton,
  NumberFormat,
  DeleteButton,
  AddLinkButton,
  LoadingButton,
  ToolTipForTags,
} from "components";

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
  TableCellForSelection,
  WrapperTableHeaderCell,
  TableHeaderForSelection,
  TableCellWithFullAddress,
} from "components/TableV3";

import DynamicMessage from "messages";
import { EDIT, PARTNERS } from "routes";
import { useGetTaggedItems } from "hooks";
import { CommonTableProps } from "interfaces";
import { formatDate, formatPhoneNumber } from "libs";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";
import { ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type PartnerTableProps = CommonTableProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1> &
  Record<string, any>;

const PartnerTable = (props: PartnerTableProps) => {
  const {
    data,
    count,
    getTable,
    maxHeight,
    pagination,
    isLoading,
    onPageChange,
    onPageSizeChange,
    hideAndShow,
    renderHeaderContentForSelectedRow,
    deleteHandler,
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
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const id = get(row, "original.id");

          const { loading, data } = useGetTaggedItems(id, SOURCE_TYPE_FOR_TAGS.partner);

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
        Header: <FormattedMessage id={`table.partnerName`} />,
        accessor: "partnerName",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.name");

          return <WrapperTableCell title={value}>{value}</WrapperTableCell>;
        },
        maxWidth: 250,
      },
      {
        Header: <FormattedMessage id={`table.address`} />,
        accessor: "address",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.primary_address.line1");

          const primaryAddress = get(row, "original.primary_address");

          const clonePrimaryAddress = cloneDeep(primaryAddress);

          set(clonePrimaryAddress, "address", value);

          return <TableCellWithFullAddress data={clonePrimaryAddress} />;
        },
        maxWidth: 300,
      },
      {
        Header: <FormattedMessage id={`table.phone_number`} />,
        accessor: "phone_number",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.primary_address.phone_number");

          return <WrapperTableCell>{formatPhoneNumber(value)}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.email`} />,
        accessor: "email",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.email");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: (props) => {
          const { column } = props;

          return (
            <WrapperTableHeaderCell isSortBy column={column}>
              <FormattedMessage id={`table.total_debt_amount_partner`} />
            </WrapperTableHeaderCell>
          );
        },
        accessor: "total_debt_amount.incl_tax",
        textAlign: "right",
        className: "table.total_debt_amount_partner",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.total_debt_amount.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.max_debt`} />,
        accessor: "max_debt",
        textAlign: "right",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.max_debt.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: (
          <Box textAlign="right">
            <FormattedMessage id={`table.total_purchase`} />
          </Box>
        ),
        accessor: "total_purchase",
        className: "table.total_purchase",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value: string = get(row, "original.total_purchase.incl_tax") || "0";

          return (
            <WrapperTableCell textAlign="right">
              <NumberFormat value={parseFloat(value)} />
            </WrapperTableCell>
          );
        },
      },
      {
        Header: <FormattedMessage id={`table.tax_identification_number`} />,
        accessor: "tax_identification_number",
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
          const { row } = props;

          const value = get(row, "original.tax_identification_number");

          return <WrapperTableCell>{value}</WrapperTableCell>;
        },
      },
      {
        Header: <FormattedMessage id={`table.person_in_charge`} />,
        accessor: "person_in_charge",
        Cell: (props: PropsWithChildren<CellProps<any, any>>) => {
          const { row } = props;

          const value = get(row, "original.contact_info");

          return <WrapperTableCell>{value}</WrapperTableCell>;
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
        Cell: (
          props: PropsWithChildren<CellProps<ADMIN_PARTNER_PARTNER_VIEW_TYPE_V1, any>>
        ) => {
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
          const { row, writePermission, onViewTagsHandler } = props;

          const isUsed = get(row, "original.is_used");
          const id = get(row, "original.id");

          return (
            <Stack flexDirection="row" alignItems="center" columnGap={1}>
              <TagsButton onClick={() => onViewTagsHandler(id)} />

              <ViewButton href={`/${PARTNERS}/${EDIT}/${row.original.id}`} />

              <AddLinkButton href={`/${PARTNERS}/${row.original.id}`} />

              {!isUsed && writePermission && (
                <DeleteButton
                  onClick={(e) => {
                    deleteHandler({
                      data: [row],
                    });
                  }}
                />
              )}
            </Stack>
          );
        },
        width: 200,
        maxWidth: 200,
        sticky: "right",
      },
    ];
  }, [hideAndShow]);

  const { formatMessage, messages } = useIntl();

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
      defaultSelect: SELECTED_TABLE.partners,
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

export default PartnerTable;

const StyledWrapperTags = styled(WrapperTableCell)(() => {
  return {
    gap: 4,
    display: "flex",
    alignItems: "center",
  };
});
