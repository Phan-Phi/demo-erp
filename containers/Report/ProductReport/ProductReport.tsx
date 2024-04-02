import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { useReactToPrint } from "react-to-print";
import { endOfWeek, startOfWeek } from "date-fns";
import { cloneDeep, get, omit, set } from "lodash";
import { Box, Grid, Stack, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DisplayCard } from "../components/DisplayCard";
import { ViewTypeForProduct } from "./ViewTypeForProduct";
import { ProductReportByChart } from "./ProductReportByChart";

import { useToggle } from "hooks";
import { PrintButton, LoadingDialog } from "components";
import { ProductReportByTable } from "./ProductReportByTable";
import { PRICE_TABLE_TYPE_V1 } from "__generated__/apiType_v1";
import { formatDate, printStyle, setFilterValue, transformDate } from "libs";

import Filter from "./Filter";

export type PartnerFilterType = {
  range: Range;
  category: any;
  search?: string;
  page: number;
  page_size: number;
  price_tables: PRICE_TABLE_TYPE_V1 | null;
};

const defaultFilterValue: PartnerFilterType = {
  category: null,
  search: "",
  page: 1,
  price_tables: null,
  page_size: 25,
  range: {
    startDate: startOfWeek(new Date()),
    endDate: endOfWeek(new Date()),
    key: "range",
  },
};

const ProductReport = () => {
  const { messages } = useIntl();
  const printComponentRef = useRef(null);

  const { open, onOpen, onClose } = useToggle();
  const { open: isPrinting, toggle: setIsPrinting } = useToggle();
  const { open: isPrint, onOpen: onPrint, onClose: closeIsPrint } = useToggle();

  const promiseResolveRef = useRef<(value?: any) => void>();

  const [filter, setFilter] = useState(defaultFilterValue);
  const [offPrint, setOffPrint] = useState("general");
  const [filterDate, setFilterDate] = useState(defaultFilterValue);

  const [displayType, setDisplayType] = useState<"chart" | "table">("chart");
  const [viewType, setViewType] = useState<
    "sale" | "profit" | "warehouse_value" | "import_export_stock"
  >("sale");

  const printHandler = useReactToPrint({
    content: () => printComponentRef.current,

    onBeforeGetContent: () => {},
    onAfterPrint: () => {
      onClose();
      closeIsPrint();
    },
  });

  useEffect(() => {
    if (isPrint) {
      printHandler();
    }
    return;
  }, [isPrint]);

  const onActivePrint = useCallback(() => {
    onPrint();
  }, []);

  const onIsDoneHandler = useCallback(() => {
    promiseResolveRef.current?.();
    onClose();
  }, []);

  const disablePrint = useCallback((value) => {
    setOffPrint(value);
  }, []);

  const onFilterDateHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);
        cloneFilter = setFilterValue(cloneFilter, key, value);
        setFilterDate(cloneFilter);
      };
    },
    [filter]
  );
  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        // let cloneFilter = cloneDeep(filterDate);
        let cloneFilter = cloneDeep({
          ...omit(filter, "range"),
          range: filterDate.range,
        });

        cloneFilter = setFilterValue(cloneFilter, key, value);
        const params = cloneDeep(cloneFilter);
        set(params, "category", get(params, "category"));
        set(params, "price_tables", get(params, "price_tables"));

        setFilter(params);
        if (key === "range") return;
      };
    },
    [filter, filterDate]
  );
  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    setFilterDate(defaultFilterValue);
  }, []);

  const onClickFilterByTime = useCallback(
    (key: string) => {
      let dateStart: any = get(filterDate, "range.startDate");
      let dateEnd: any = get(filterDate, "range.endDate");

      setFilter({
        ...omit(filter, "range"),
        range: {
          startDate: dateStart,
          endDate: dateEnd,
          key: "range",
        },
      });
    },
    [filterDate, filter]
  );

  const renderTitle = useMemo(() => {
    let theme = "";

    if (viewType === "sale") {
      theme = "bán hàng";
    } else if (viewType === "profit") {
      theme = "lợi nhuận";
    } else if (viewType === "warehouse_value") {
      theme = "giá trị kho";
    } else if (viewType === "import_export_stock") {
      theme = "xuất nhập tồn";
    }

    return (
      <Stack alignItems="center">
        <Typography variant="h6">{`Báo cáo sản phẩm theo ${theme}`}</Typography>
        <Typography>
          {"Thời gian: "}
          <Typography component="span" variant="body2" fontWeight="700">
            {filter.range.startDate
              ? formatDate(
                  transformDate(filter.range.startDate, "date_start") * 1000,
                  "dd/MM/yyyy"
                )
              : null}
          </Typography>
          {" - "}
          <Typography component="span" variant="body2" fontWeight="700">
            {filter.range.endDate
              ? formatDate(
                  transformDate(filter.range.endDate, "date_start") * 1000 - 1,
                  "dd/MM/yyyy"
                )
              : null}
          </Typography>
        </Typography>
      </Stack>
    );
  }, [viewType, filter]);

  const renderContent = useMemo(() => {
    if (displayType === "chart") {
      return <ProductReportByChart filter={filter} viewType={viewType} />;
    } else {
      return (
        <ProductReportByTable
          filter={{
            date_start: transformDate(filter.range?.startDate, "date_start"),
            date_end: transformDate(filter.range?.endDate, "date_end"),
            period: 3600 * 24,
            page: filter.page,
            page_size: filter.page_size,
            category: filter.category ? filter.category.id : undefined,
            name: filter.search,
            order_price_rule_source_id: filter.price_tables
              ? filter.price_tables.id
              : undefined,
            order_price_rule_source_type: filter.price_tables
              ? "price_table.pricetable"
              : undefined,
          }}
          viewType={viewType}
          isPrinting={isPrinting}
          onIsDoneHandler={onIsDoneHandler}
          onPageChange={onFilterChangeHandler("page")}
          onPageSizeChange={onFilterChangeHandler("pageSize")}
          isOpen={open}
          onActivePrint={onActivePrint}
          disablePrint={disablePrint}
        />
      );
    }
  }, [
    filter,
    viewType,
    isPrinting,
    displayType,
    printComponentRef,
    open,
    onActivePrint,
    onIsDoneHandler,
  ]);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Stack spacing={3}>
          <Typography fontWeight="700">{messages["productReport"]}</Typography>

          <DisplayCard value={displayType} onChange={setDisplayType} />

          <ViewTypeForProduct value={viewType} onChange={setViewType} />

          <Filter
            viewType={viewType}
            filter={filter}
            resetFilter={resetFilterHandler}
            filterDate={filterDate}
            onFilterByTime={onClickFilterByTime}
            onSearch={onFilterChangeHandler("search")}
            onDateRangeChange={onFilterChangeHandler("range")}
            onFilterDateHandler={onFilterDateHandler("range")}
            onCategoryChange={onFilterChangeHandler("category")}
            onPriceTablesChange={onFilterChangeHandler("price_tables")}
          />
        </Stack>
      </Grid>
      <Grid item xs={10}>
        <Stack position="relative" rowGap={2} ref={printComponentRef}>
          <Box position="absolute" right={0} top={0}>
            {offPrint === "general" && (
              <PrintButton
                onClick={() => {
                  if (displayType === "chart") {
                    printHandler();
                  }
                  onOpen();
                }}
              />
            )}
            <style type="text/css" media="print">
              {printStyle()}
            </style>
          </Box>

          {renderTitle}
          {renderContent}
        </Stack>
      </Grid>
      <LoadingDialog open={open} />
    </Grid>
  );
};

export default ProductReport;
