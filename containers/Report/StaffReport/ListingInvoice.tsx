import useSWR from "swr";
import { Fragment, useMemo } from "react";

import { useFetch } from "hooks";
import { Box } from "@mui/material";
import { transformUrl } from "libs";
import { ADMIN_ORDER_INVOICE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";

import ColumnDetail from "./ColumnDetail";
import StaffReportDetailPrint from "./print/StaffReportDetailPrint";

interface ListingTimeProps {
  owner: number;
  filter: Record<string, any>;
  viewType: "sale" | "profit" | "hang_ban_theo_nhan_vien";
  isPrinting: boolean;
  onIsDoneHandler: () => void;
  onPageChange: any;
  onPageSizeChange: any;
  isOpen: boolean;
  onActivePrint: () => void;
}

export const ListingInvoice = (props: ListingTimeProps) => {
  const {
    owner,
    viewType,
    filter,
    isPrinting,
    onIsDoneHandler,
    onPageChange,
    onPageSizeChange,
    onActivePrint,
    isOpen,
  } = props;

  const { data } = useSWR(() => {
    return transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      order_owner: owner,
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
      shipping_status: "Delivered",
      with_sum_amount_incl_tax: true,
    });
  });

  const {
    data: dataTable,
    isLoading,
    itemCount,
  } = useFetch<ADMIN_ORDER_INVOICE_VIEW_TYPE_V1>(
    transformUrl(ADMIN_ORDERS_INVOICES_END_POINT, {
      order_owner: owner,
      shipping_status: "Delivered",
      date_created_start: filter.date_start,
      date_created_end: filter.date_end,
    })
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  return (
    <Fragment>
      {viewType === "profit" ? (
        <Box></Box>
      ) : (
        <Fragment>
          <Box display={isOpen ? "none" : "block"}>
            <ColumnDetail
              filter={filter}
              type={viewType}
              count={itemCount}
              isLoading={isLoading}
              data={dataTable ? dataTable : []}
              dataTotal={data ? [data] : []}
              pagination={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </Box>

          {isOpen && (
            <Box>
              <StaffReportDetailPrint
                owner={owner}
                filter={filter}
                _viewType={viewType}
                isLoading={isLoading}
                data={dataTable ? dataTable : []}
                dataTotal={data ? [data] : []}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
                onActivePrint={onActivePrint}
              />
            </Box>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};
