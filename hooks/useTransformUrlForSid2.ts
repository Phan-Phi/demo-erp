import useSWR from "swr";
import { get } from "lodash";
import { useEffect, useState } from "react";

import { transformUrl } from "libs";
import { CASHES, EDIT, ORDERS, OUTNOTES, VIEW_DETAIL } from "routes";
import { ADMIN_CASH_DEBT_RECORDS_END_POINT } from "__generated__/END_POINT";

const currentType = ["order.invoice", "stock.receiptorder"];
const useTransFormUrlForSid2 = (
  sourceType: string | null,
  sourceId: number,
  sourceInvoiceOrder: number,
  data: any
) => {
  const { source_type, source } = data;

  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: invoiceData, isValidating } = useSWR(() => {
    if (!sourceType) return;
    // if (sourceType !== "order.invoice") return;

    if (sourceType === "stock.returnorder") {
      return transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
        page_size: 1,
        // source_id: source.id,
        source_id: sourceId,
      });
    }
    if (currentType.includes(sourceType)) {
      return transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
        page_size: 1,
        source_id: sourceId,
        source_type: sourceType,
      });
    }
    // if (source_type === "order.invoice") {
    //   return transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
    //     page_size: 1,
    //     source_id: source.id,
    //     source_type: "order.invoice",
    //   });
    // }

    return;
  });

  useEffect(() => {
    if (invoiceData == undefined && isValidating) setIsLoading(true);
    if (isValidating) return;

    const id = get(invoiceData, "results[0].id");

    if (id) {
      const temp = `/${VIEW_DETAIL}/${id}`;
      setUrl(temp);
      setIsLoading(false);
    }
  }, [invoiceData, isValidating]);

  useEffect(() => {
    if (sourceType) {
      switch (sourceType) {
        case "stock.receiptorder":
          break;
        case "stock.stockoutnote":
          setUrl(`/${OUTNOTES}/${EDIT}/${sourceId}/`);
          break;
        case "stock.returnorder":
          break;
        case "cash.transaction":
          setUrl(`/${CASHES}/${EDIT}/${sourceId}/`);
          break;
        case "order.returninvoice":
          if (sourceInvoiceOrder) {
            // setUrl(`/${ORDERS}/${EDIT}/${source.invoice.order}/`);
            setUrl(`/${ORDERS}/${EDIT}/${sourceInvoiceOrder}/`);
            break;
          }
          break;
        case "order.invoice":
          break;
        default:
          setUrl("");
          break;
      }
    } else {
      setUrl("");
    }
  }, [sourceType, sourceId, sourceInvoiceOrder]);

  return {
    url,
    loading: isLoading,
  };
};

export default useTransFormUrlForSid2;
