import {
  REPORT_CUSTOMER_WITH_DEBT_AMOUNT,
  REPORT_CUSTOMER_WITH_REVENUE,
  REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE,
} from "apis";
import { transformUrl } from "libs";
import useSWR from "swr";
import { CommonTableProps } from "interfaces";
import { Fragment, useEffect, useState } from "react";
import { useFetch } from "hooks";
import { Box } from "@mui/material";
import { LoadingDialog } from "components";
import { useReactToPrint } from "react-to-print";
import { ADMIN_ORDERS_INVOICES_END_POINT } from "__generated__/END_POINT";
import ColumnDetailPrint from "./ColumnDetailPrint";

interface Props {
  filter: any;
  viewType: string;
  isLoading: boolean;
  _viewType: any;
  dataTable: any;
}

export default function ProductReportWarehouseDetailPrint(props: any) {
  const {
    typeInvoice,
    data,
    variantSku,
    _viewType,
    onPageChange,
    onPageSizeChange,
    dataTotal,
    dataInvoice,
    dataInvoiceQuantity,
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
    owner,
    ...restProps
  } = props;

  const [items, setItems] = useState<any>([]);

  const [count, setCount] = useState<number>(1);

  const [active, setActive] = useState<boolean>(false);

  const [totalCount, setTotalCount] = useState<any>(() => {
    if (dataInvoice.length === 0) return 1;
    return Math.ceil(dataInvoice.length / 100);
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
    transformUrl(REPORT_PRODUCT_WITH_IO_INVENTORY_WAREHOUSE, {
      sku: variantSku,
      date_created_end: filter.date_end,
      date_created_start: filter.date_start,
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
  }, [count]);

  return (
    <Fragment>
      {active ? (
        <ColumnDetailPrint
          type={_viewType}
          isLoading={isLoading}
          data={items ? items : []}
          dataInvoice={dataInvoice ? [dataInvoice] : []}
          dataInvoiceQuantity={dataInvoiceQuantity ? dataInvoiceQuantity : []}
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
