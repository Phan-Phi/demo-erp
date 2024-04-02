import useSWR from "swr";
import { get } from "lodash";
import { useMemo } from "react";
import { transformUrl } from "libs";
import { ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT } from "__generated__/END_POINT";

const useFetchReturnInvoiceQuantity = (invoiceId: number) => {
  const { data } = useSWR(() => {
    if (!invoiceId) return;

    return transformUrl(ADMIN_ORDERS_INVOICES_RETURN_INVOICES_QUANTITIES_END_POINT, {
      page_size: 1,
      is_confirmed: true,
      with_sum_quantity: true,
      invoice_quantity: invoiceId,
    });
  });

  const memoValue = useMemo(() => {
    if (data == undefined) return 0;

    const sumQuantity = get(data, "sum_quantity");

    if (sumQuantity == null) return 0;

    return sumQuantity;
  }, [data]);

  return {
    value: memoValue,
  };
};

export default useFetchReturnInvoiceQuantity;
