import useSWR from "swr";
import { get } from "lodash";
import { useEffect, useState } from "react";

import { transformUrl } from "libs";
import { CASHES, EDIT, OUTNOTES, VIEW_DETAIL } from "routes";
import { ADMIN_CASH_DEBT_RECORDS_END_POINT } from "__generated__/END_POINT";

const useTransFormUrlForSid = (sourceType: string | null, sourceId: number) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { data: invoiceData, isValidating } = useSWR(() => {
    if (!sourceType) return;
    if (sourceType !== "order.invoice") return;

    return transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
      page_size: 1,
      source_id: sourceId,
      source_type: "order.invoice",
    });
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
  }, [sourceType, sourceId]);

  return {
    url,
    loading: isLoading,
  };
};

export default useTransFormUrlForSid;
