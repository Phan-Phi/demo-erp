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
  ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT,
  ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT,
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

export default function PartnerReportPrint(props: any) {
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
    transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, {
      ...filter,
      with_sum_purchase_amount_incl_tax: true,
      with_sum_return_amount_incl_tax: true,
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

    if (_viewType === "import") {
      changeKey(
        transformUrl(ADMIN_REPORTS_PARTNER_WITH_PURCHASE_AMOUNT_END_POINT, {
          ...filter,
          with_sum_purchase_amount_incl_tax: true,
          with_sum_return_amount_incl_tax: true,
          page_size: 100,
          page: count,
        })
      );
    }

    if (_viewType === "debt") {
      changeKey(
        transformUrl(ADMIN_REPORTS_PARTNER_WITH_DEBT_AMOUNT_END_POINT, {
          ...filter,
          with_sum_beginning_debt_amount: true,
          with_sum_credit: true,
          with_sum_debit: true,
          page_size: 100,
          page: count,
        })
      );
    }
  }, [count, _viewType]);

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
