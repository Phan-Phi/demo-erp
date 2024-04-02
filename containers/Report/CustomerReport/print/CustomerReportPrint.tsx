import { REPORT_CUSTOMER_WITH_DEBT_AMOUNT, REPORT_CUSTOMER_WITH_REVENUE } from "apis";
import { transformUrl } from "libs";
import useSWR from "swr";
import ColumnPrint from "./ColumnPrint";
import { CommonTableProps } from "interfaces";
import { Fragment, useEffect, useState } from "react";
import { useFetch } from "hooks";
import { Box } from "@mui/material";
import { LoadingDialog } from "components";
import { useReactToPrint } from "react-to-print";

interface Props {
  filter: any;
  viewType: string;
  isLoading: boolean;
  _viewType: any;
  dataTable: any;
}

export default function CustomerReportPrint(props: any) {
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
    transformUrl(REPORT_CUSTOMER_WITH_REVENUE, {
      ...filter,
      with_sum_credit: true,
      with_sum_debit: true,
      with_sum_beginning_debt_amount: true,
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
        transformUrl(REPORT_CUSTOMER_WITH_REVENUE, {
          ...filter,
          with_sum_credit: true,
          with_sum_debit: true,
          with_sum_beginning_debt_amount: true,
          page_size: 100,
          page: count,
        })
      );
    }

    if (_viewType === "debt") {
      changeKey(
        transformUrl(REPORT_CUSTOMER_WITH_DEBT_AMOUNT, {
          ...filter,
          with_sum_credit: true,
          with_sum_debit: true,
          with_sum_beginning_debt_amount: true,
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
