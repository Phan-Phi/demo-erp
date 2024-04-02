import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios.config";
import { Stack } from "@mui/material";
import { cloneDeep, get } from "lodash";

import ReceiptOrderTabTable from "./table/ReceiptOrderTabTable";
import { SearchField, LoadingDynamic as Loading } from "components";

import { VIEW_DETAIL } from "routes";
import { setFilterValue, transformUrl } from "libs";
import { useFetch, useNotification, useToggle } from "hooks";

import { ADMIN_CASH_DEBT_RECORDS_END_POINT } from "__generated__/END_POINT";

const PaymentDialog = dynamic(() => import("../../Partner/AddItem/PaymentDialog"));

interface OrderHistoryTabProps {
  noteUrl: string;
  noteLineUrl: string;
}

export type OrderHistoryTabFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  partner: string | undefined;
  search: string;
};

const defaultFilterValue: OrderHistoryTabFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  partner: undefined,
  search: "",
};

const ImportHistoryTable = ({ noteUrl, noteLineUrl }: OrderHistoryTabProps) => {
  const router = useRouter();
  const { messages } = useIntl();
  const { open, onClose, onOpen } = useToggle();
  const { enqueueSnackbar } = useNotification();

  // const [selectedNote, setSelectedNote] = useState<number>();

  const [filter, setFilter] = useState<OrderHistoryTabFilterType>(defaultFilterValue);
  const [urlDetailTransaction, setUrlDetailTransaction] = useState("");

  const { data, changeKey, itemCount, isLoading } = useFetch(
    transformUrl(noteUrl, {
      ...filter,
      partner: router.query.id,
    })
  );

  useEffect(() => {
    if (router.query.id) {
      changeKey(
        transformUrl(noteUrl, {
          ...defaultFilterValue,
          partner: router.query.id,
        })
      );
    }
  }, [router.query.id]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        changeKey(
          transformUrl(noteUrl, {
            ...cloneFilter,
            partner: router.query.id,
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
      source_type: "stock.receiptorder",
    });

    const currentRCOData = await axios.get(url);
    const currentRCOId = await get(currentRCOData, "data.results[0].id");

    if (currentRCOId) {
      router.push(`/${VIEW_DETAIL}/${currentRCOId}`);
    } else {
      enqueueSnackbar("Không tìm thấy", {
        variant: "error",
      });
    }
  }, []);

  const onOpenPaymentInline = useCallback(async (id: number) => {
    const url = transformUrl(ADMIN_CASH_DEBT_RECORDS_END_POINT, {
      source_id: id,
      source_type: "stock.receiptorder",
    });

    const currentRCOData = await axios.get(url);
    const currentRCOId = await get(currentRCOData, "data.results[0].id");

    if (currentRCOId) {
      setUrlDetailTransaction(`${ADMIN_CASH_DEBT_RECORDS_END_POINT}${currentRCOId}`);
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

      <ReceiptOrderTabTable
        data={data ?? []}
        count={itemCount}
        pagination={pagination}
        isLoading={isLoading}
        onPageChange={onFilterChangeHandler("page")}
        onPageSizeChange={onFilterChangeHandler("pageSize")}
        maxHeight={300}
        messages={messages}
        onViewNoteHandler={onViewNoteHandler}
        onOpenPaymentInline={onOpenPaymentInline}
      />

      <PaymentDialog open={open} onClose={onClose} url={urlDetailTransaction} />

      {/* {open && (
        <ViewDetailLineDialogOfImport
          {...{
            open,
            toggle,
            url: transformUrl(noteLineUrl, {
              order: selectedNote,
            }),
          }}
        />
      )} */}
    </Stack>
  );
};

export default ImportHistoryTable;
