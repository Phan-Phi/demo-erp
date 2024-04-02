import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useState, useContext, useEffect, useCallback, useMemo } from "react";

import axios from "axios.config";
import { Stack } from "@mui/material";
import { cloneDeep, get } from "lodash";

import InvoiceTable from "./InvoiceTable";
import { SearchField, LoadingDynamic as Loading } from "components";

import { VIEW_DETAIL } from "routes";
import { setFilterValue, transformUrl } from "libs";
import { Context as CustomerContext } from "./context";
import { useFetch, useNotification, useToggle } from "hooks";
import { ADMIN_CASH_DEBT_RECORDS_END_POINT } from "__generated__/END_POINT";

const PaymentDialog = dynamic(
  () => import("../../Customer/official/PaymentInline/PaymentDialog")
);

interface OrderHistoryTabProps {
  noteUrl: string;
  noteLineUrl: string;
}

export type OrderHistoryTabFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  receiver: number | undefined;
};

const defaultFilterValue: OrderHistoryTabFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  receiver: undefined,
};

const OrderHistoryTab = ({ noteUrl, noteLineUrl }: OrderHistoryTabProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const context = useContext(CustomerContext);
  const { open, onClose, onOpen } = useToggle();
  const { enqueueSnackbar } = useNotification();

  // const [selectedNote, setSelectedNote] = useState<number>();
  const [urlDetailTransaction, setUrlDetailTransaction] = useState("");
  const [filter, setFilter] = useState<OrderHistoryTabFilterType>(defaultFilterValue);

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(noteUrl, {
      ...filter,
      receiver: context.state.id,
    })
  );

  useEffect(() => {
    if (context.state.id) {
      changeKey(
        transformUrl(noteUrl, {
          ...filter,
          receiver: context.state.id,
        })
      );
    }
  }, [context.state.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(noteUrl, {
            ...cloneFilter,
            receiver: context.state.id,
            parent: router.query.id,
          })
        );
      };
    },
    [filter]
  );

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  // const onViewNoteHandler = useCallback((row: Row<any>) => {
  //   setSelectedNote(row.original.id);
  //   toggle(true);
  // }, []);

  const onViewNoteHandler = useCallback(async (id: number) => {
    const url = transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
      source_id: id,
      source_type: "order.invoice",
    });

    const currentInvoiceData = await axios.get(url);

    const currentInvoiceId = await get(currentInvoiceData, "data.results[0].id");

    if (currentInvoiceId) {
      router.push(`/${VIEW_DETAIL}/${currentInvoiceId}`);
    } else {
      enqueueSnackbar("Không tìm thấy", {
        variant: "error",
      });
    }
  }, []);

  const onOpenPaymentInline = useCallback(async (id: number) => {
    const url = transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
      source_id: id,
      source_type: "order.invoice",
    });

    const currentInvoiceData = await axios.get(url);
    const currentInvoiceId = await get(currentInvoiceData, "data.results[0].id");
    if (currentInvoiceId) {
      setUrlDetailTransaction(`${ADMIN_CASH_DEBT_RECORDS_END_POINT}${currentInvoiceId}`);
      onOpen();
    } else {
      enqueueSnackbar("Không tìm thấy", {
        variant: "error",
      });
    }
  }, []);

  if (data == undefined) return <Loading />;

  return (
    <Stack spacing={3}>
      <SearchField
        initSearch={filter.search}
        onChange={onFilterChangeHandler("search")}
      />

      <InvoiceTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        messages={messages}
        onViewNoteHandler={onViewNoteHandler}
        onOpenPaymentInline={onOpenPaymentInline}
        maxHeight={300}
      />

      <PaymentDialog open={open} onClose={onClose} url={urlDetailTransaction} />

      {/* 
      <ViewDetailLineDialog
        {...{
          open,
          toggle,
          url: transformUrl(noteLineUrl, {
            invoice: selectedNote,
          }),
        }}
      /> */}
    </Stack>
  );
};

export default OrderHistoryTab;
