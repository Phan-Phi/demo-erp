import { useIntl } from "react-intl";
import { Range } from "react-date-range";
import { useCallback, useMemo, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";
import { cloneDeep, get, omit, set } from "lodash";

import Filter from "./Filter";
import { TagsModal } from "compositions";
import CustomerTable from "./CustomerTable";
import { TableHeader, WrapperTable } from "components";

import {
  transformUrl,
  transformDate,
  setFilterValue,
  convertTagsNameToString,
} from "libs";
import { CREATE, CUSTOMERS } from "routes";
import { useFetch, useLayout, useToggle } from "hooks";
import { SELECTED_TABLE, SOURCE_TYPE_FOR_TAGS } from "constant";

import {
  ADMIN_USER_USER_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";
import { ADMIN_CUSTOMERS_DRAFTS_END_POINT } from "__generated__/END_POINT";

export type CustomerFilterType = {
  page: number;
  page_size: number;
  with_count: boolean;
  search?: string;
  range: Range;
  official_customer_isnull: boolean;
  nested_depth: number;
  gender: string;
  in_business: boolean | undefined;
  type: ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 | null;
  sales_in_charge: ADMIN_USER_USER_VIEW_TYPE_V1 | null;
  birthday: Range;
  range_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  birthDay_params: {
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  tag_names_params: any[];
  tag_names: string;
};

const defaultFilterValue: CustomerFilterType = {
  page: 1,
  page_size: 25,
  with_count: true,
  search: "",
  official_customer_isnull: false,
  nested_depth: 4,
  gender: "",
  in_business: undefined,
  type: null,
  sales_in_charge: null,
  range: {
    startDate: undefined,
    endDate: undefined,
    key: "range",
  },
  birthday: {
    startDate: undefined,
    endDate: undefined,
    key: "birthday",
  },
  range_params: {
    startDate: undefined,
    endDate: undefined,
  },
  birthDay_params: {
    startDate: undefined,
    endDate: undefined,
  },
  tag_names_params: [],
  tag_names: "",
};

const omitFields = [
  "range",
  "birthday",
  "range_params",
  "birthDay_params",
  "tag_names_params",
];

const ListCustomer = () => {
  const { messages } = useIntl();
  const { state: layoutState } = useLayout();

  const {
    open: isOpenTagsModal,
    onOpen: onOpenTagsModal,
    onClose: onCloseTagsModal,
  } = useToggle();

  const [objectId, setObjectId] = useState(0);
  const [objectTable, setObjectTable] = useState<any>({});
  const [hideAndShow, setHideAndShow] = useState<any>(SELECTED_TABLE.customers);
  const [filter, setFilter] = useState<CustomerFilterType>(defaultFilterValue);

  const {
    changeKey,
    itemCount,
    isLoading,
    refreshData,
    data: dataListCustomer,
  } = useFetch<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>(
    transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, omit(filter, omitFields))
  );

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);

        if (key === "range" || key === "birthday" || key === "tag_names_params") return;

        const params = cloneDeep(cloneFilter);

        const dateStart = transformDate(cloneFilter.range_params.startDate, "date_start");

        const dateEnd = transformDate(cloneFilter.range_params.endDate, "date_end");

        const birthDayStart = transformDate(
          cloneFilter.birthDay_params.startDate,
          "date_start"
        );

        const birthDayEnd = transformDate(
          cloneFilter.birthDay_params.endDate,
          "date_end"
        );

        let isStartDate = cloneFilter.range_params.startDate;
        let isEndDate = cloneFilter.range_params.endDate;

        let isStartBirthDay = cloneFilter.birthDay_params.startDate;
        let isEndBirthDay = cloneFilter.birthDay_params.endDate;

        set(params, "type", get(params, "type.id"));
        set(params, "sales_in_charge", get(params, "sales_in_charge.id"));

        changeKey(
          transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
            ...omit(params, omitFields),
            date_created_start: isStartDate ? dateStart : undefined,
            date_created_end: isEndDate ? dateEnd : undefined,
            birthday_start: isStartBirthDay ? birthDayStart : undefined,
            birthday_end: isEndBirthDay ? birthDayEnd : undefined,
          })
        );
      };
    },
    [filter]
  );

  const onClickFilterByTime = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      range_params: {
        startDate: cloneFilter.range.startDate,
        endDate: cloneFilter.range.endDate,
      },
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let birthDayStart = transformDate(
      updateFilter.birthDay_params.startDate,
      "date_start"
    );
    let birthDayEnd = transformDate(updateFilter.birthDay_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isBirthDayStart = updateFilter.birthDay_params.startDate;
    let isBirthDayEnd = updateFilter.birthDay_params.endDate;

    const params = cloneDeep(updateFilter);

    set(params, "type", get(params, "type.id"));
    set(params, "sales_in_charge", get(params, "sales_in_charge.id"));

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isDateStart ? dateStart : undefined,
        date_created_end: isDateEnd ? dateEnd : undefined,
        birthday_start: isBirthDayStart ? birthDayStart : undefined,
        birthday_end: isBirthDayEnd ? birthDayEnd : undefined,
      })
    );
  }, [filter]);

  const onClickFilterBirthDay = useCallback(() => {
    let cloneFilter = cloneDeep(filter);

    let updateFilter = {
      ...cloneFilter,
      birthDay_params: {
        startDate: cloneFilter.birthday.startDate,
        endDate: cloneFilter.birthday.endDate,
      },
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let birthDayStart = transformDate(
      updateFilter.birthDay_params.startDate,
      "date_start"
    );

    let birthDayEnd = transformDate(updateFilter.birthDay_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isBirthDayStart = updateFilter.birthDay_params.startDate;
    let isBirthDayEnd = updateFilter.birthDay_params.endDate;

    const params = cloneDeep(updateFilter);

    set(params, "type", get(params, "type.id"));
    set(params, "sales_in_charge", get(params, "sales_in_charge.id"));

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isDateStart ? dateStart : undefined,
        date_created_end: isDateEnd ? dateEnd : undefined,
        birthday_start: isBirthDayStart ? birthDayStart : undefined,
        birthday_end: isBirthDayEnd ? birthDayEnd : undefined,
      })
    );
  }, [filter]);

  const onClickFilterTag = useCallback(() => {
    let cloneFilter = cloneDeep(filter);
    let listTagsName = convertTagsNameToString(cloneFilter.tag_names_params);

    let updateFilter = {
      ...cloneFilter,
      tag_names: listTagsName,
    };

    setFilter(updateFilter);

    let dateStart = transformDate(updateFilter.range_params.startDate, "date_start");
    let dateEnd = transformDate(updateFilter.range_params.endDate, "date_end");

    let birthDayStart = transformDate(
      updateFilter.birthDay_params.startDate,
      "date_start"
    );
    let birthDayEnd = transformDate(updateFilter.birthDay_params.endDate, "date_end");

    let isDateStart = updateFilter.range_params.startDate;
    let isDateEnd = updateFilter.range_params.endDate;

    let isBirthDayStart = updateFilter.birthDay_params.startDate;
    let isBirthDayEnd = updateFilter.birthDay_params.endDate;

    const params = cloneDeep(updateFilter);

    set(params, "type", get(params, "type.id"));
    set(params, "sales_in_charge", get(params, "sales_in_charge.id"));

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
        ...omit(params, omitFields),
        date_created_start: isDateStart ? dateStart : undefined,
        date_created_end: isDateEnd ? dateEnd : undefined,
        birthday_start: isBirthDayStart ? birthDayStart : undefined,
        birthday_end: isBirthDayEnd ? birthDayEnd : undefined,
      })
    );
  }, [filter]);

  const onViewTagsHandler = useCallback((id: number) => {
    setObjectId(id);
    onOpenTagsModal();
  }, []);

  const pagination = useMemo(() => {
    return {
      pageIndex: filter.page - 1,
      pageSize: filter.page_size,
    };
  }, [filter]);

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, omit(defaultFilterValue, omitFields))
    );
  }, [filter]);

  const getTable = useCallback((item) => {
    setObjectTable(item);
  }, []);

  const showAndHideTable = useCallback((item) => {
    setHideAndShow((el) => {
      const index = el.findIndex((el) => el === item);

      if (index === -1) {
        return [...el, item];
      } else {
        const data = el.filter((el) => el !== item);
        return [...data];
      }
    });
  }, []);

  return (
    <Box>
      <TagsModal
        objectId={objectId}
        open={isOpenTagsModal}
        refreshData={refreshData}
        onClose={onCloseTagsModal}
        source_type={SOURCE_TYPE_FOR_TAGS.customer}
      />

      <Grid container>
        <Grid item xs={2}>
          <Filter
            filter={filter}
            setFilter={setFilter}
            resetFilter={resetFilterHandler}
            onClickFilterTag={onClickFilterTag}
            onFilterByTime={onClickFilterByTime}
            onClickFilterBirthDay={onClickFilterBirthDay}
            onChangeSearch={onFilterChangeHandler("search")}
            onChangeGender={onFilterChangeHandler("gender")}
            onDateRangeChange={onFilterChangeHandler("range")}
            onChangeCustomerType={onFilterChangeHandler("type")}
            onBirthDayChange={onFilterChangeHandler("birthday")}
            onChangeStatus={onFilterChangeHandler("in_business")}
            onTagsChange={onFilterChangeHandler("tag_names_params")}
            onChangeUserType={onFilterChangeHandler("sales_in_charge")}
          />
        </Grid>

        <Grid item xs={10}>
          <Stack spacing={2}>
            <TableHeader
              objectTable={objectTable}
              showAndHideTable={showAndHideTable}
              pathname={`/${CUSTOMERS}/${CREATE}`}
              title={messages["listingCustomer"] as string}
            />

            <WrapperTable>
              <CustomerTable
                count={itemCount}
                getTable={getTable}
                isLoading={isLoading}
                pagination={pagination}
                hideAndShow={hideAndShow}
                data={dataListCustomer ?? []}
                onViewTagsHandler={onViewTagsHandler}
                onPageChange={onFilterChangeHandler("page")}
                onPageSizeChange={onFilterChangeHandler("pageSize")}
                maxHeight={layoutState.windowHeight - layoutState.sumHeight}
              />
            </WrapperTable>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};
export default ListCustomer;
