import {
  REPORT_CUSTOMER_WITH_DEBT_AMOUNT,
  REPORT_CUSTOMER_WITH_REVENUE,
  REPORT_PRODUCT_WITH_IO_INVENTORY,
  REPORT_PRODUCT_WITH_REVENUE,
} from "apis";
import { transformUrl } from "libs";
import useSWR from "swr";
import { CommonTableProps } from "interfaces";
import { Fragment, useEffect, useState } from "react";
import { useFetch } from "hooks";
import { Box } from "@mui/material";
import { LoadingDialog } from "components";
import { useReactToPrint } from "react-to-print";
import ColumnPrint from "./ColumnPrint";

interface Props {
  filter: any;
  viewType: string;
  isLoading: boolean;
  _viewType: any;
  dataTable: any;
}

export default function ProductReportPrint(props: any) {
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
    transformUrl(REPORT_PRODUCT_WITH_REVENUE, {
      ...filter,
      with_sum_net_revenue_incl_tax: true,
      with_sum_revenue_incl_tax: true,
      with_sum_base_amount_incl_tax: true,
      with_sum_quantity: true,
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

    if (_viewType === "sale" || _viewType === "profit") {
      changeKey(
        transformUrl(REPORT_PRODUCT_WITH_REVENUE, {
          ...filter,
          with_sum_net_revenue_incl_tax: true,
          with_sum_revenue_incl_tax: true,
          with_sum_base_amount_incl_tax: true,
          with_sum_quantity: true,
          page_size: 100,
          page: count,
        })
      );
    }

    if (_viewType === "warehouse_value" || _viewType === "import_export_stock") {
      changeKey(
        transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY, {
          ...filter,
          with_sum_input_quantity: true,
          with_sum_output_quantity: true,
          with_sum_beginning_amount: true,
          with_sum_beginning_quantity: true,
          with_sum_total_input_amount: true,
          with_sum_total_output_amount: true,
          with_sum_current_price_incl_tax: true,
          with_sum_current_base_price_incl_tax: true,
          with_total_current_price_incl_tax_till_date_end: true,
          with_total_current_base_price_incl_tax_till_date_end: true,
          page_size: 100,
          page: count,
        })
      );
    }
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
          //   maxHeight={200}
        />
      ) : (
        <Box></Box>
      )}
    </Fragment>
  );
}
