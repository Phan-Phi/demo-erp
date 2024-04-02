import { REPORT_CUSTOMER_WITH_DEBT_AMOUNT, REPORT_CUSTOMER_WITH_REVENUE } from "apis";
import { transformUrl } from "libs";
import useSWR from "swr";
import { CommonTableProps } from "interfaces";
import { Fragment, useEffect, useState } from "react";
import { useFetch } from "hooks";
import { Box } from "@mui/material";
import { LoadingDialog } from "components";
import { useReactToPrint } from "react-to-print";
import {
  ADMIN_REPORTS_REVENUE_END_POINT,
  ADMIN_REPORTS_STAFF_WITH_REVENUE_END_POINT,
} from "__generated__/END_POINT";
import ColumnPrint from "./ColumnPrint";

interface Props {
  filter: any;
  viewType: string;
  isLoading: boolean;
  _viewType: any;
  dataTable: any;
}

export default function SaleReportPrint(props: any) {
  const {
    _viewType,
    onPageChange,
    onPageSizeChange,
    dataTotal,
    maxHeight,
    isLoading,
    onViewHandler,
    TableRowProps,
    onGotoHandler,
    deleteHandler,
    onViewDetailHandler,
    renderHeaderContentForSelectedRow,
    type,
    filter,
    onActivePrint,
    ...restProps
  } = props;

  const [items, setItems] = useState<any>([]);
  const [count, setCount] = useState<number>(1);
  const [active, setActive] = useState<boolean>(false);
  const [totalCount, setTotalCount] = useState<any>(() => {
    if (dataTotal.length === 0) return 1;
    return Math.ceil(dataTotal[0].count / 100);
  });

  useEffect(() => {
    if (active) {
      onActivePrint();
    }
    return;
  }, [active]);

  const {
    resData: dataPrint,
    itemCount,
    changeKey,
  } = useFetch<any>(
    transformUrl(ADMIN_REPORTS_REVENUE_END_POINT, {
      ...filter,
      with_sum_net_revenue_incl_tax: true,
      with_sum_revenue_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_invoice_count: true,
      page_size: 100,
      page: 1,
    })
  );

  useEffect(() => {
    if (dataPrint == undefined) return;
    if (count > totalCount) return;

    setItems((el: any) => {
      return [...el, ...dataPrint.results];
    });

    setCount((el: number) => {
      return el + 1;
    });
    setActive(false);
  }, [dataPrint]);

  useEffect(() => {
    if (count > totalCount) {
      setActive(true);
      return;
    }
    changeKey(
      transformUrl(ADMIN_REPORTS_REVENUE_END_POINT, {
        ...filter,
        with_sum_net_revenue_incl_tax: true,
        with_sum_revenue_incl_tax: true,
        with_sum_base_amount_incl_tax: true,
        with_sum_invoice_count: true,
        page_size: 100,
        page: count,
      })
    );
  }, [count]);

  return (
    <Fragment>
      {active ? (
        <ColumnPrint
          type={_viewType}
          isLoading={isLoading}
          data={items ? items : []}
          dataTotal={dataTotal ? [dataTotal] : []}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          onViewDetailHandler={onViewDetailHandler}
        />
      ) : (
        <Box></Box>
      )}
    </Fragment>
  );
}
