import dynamic from "next/dynamic";

import { Stack, Tab, Tabs } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { TabPanel } from "components";
import { PRICE_TABLE_USAGE_LIMIT_ITEM_VIEW } from "constant";
import ItemUseByUser from "containers/ProductPrice/components/ItemUseByUser";

// import ItemUseByUser from "./ItemUseByUser";

const RenderItemListUseByUser = dynamic(
  import("containers/ProductPrice/components/ItemUseByUser")
);

export default function ListUseByUser() {
  const [tab, setTab] = useState(0);

  const onChangeTab = useCallback((_, newTab) => {
    setTab(newTab);
  }, []);

  const renderTabs = useMemo(() => {
    return PRICE_TABLE_USAGE_LIMIT_ITEM_VIEW.map((el, idx) => {
      return <Tab label={el.name} key={idx} />;
    });
  }, []);

  const renderTabPanel = useMemo(() => {
    return PRICE_TABLE_USAGE_LIMIT_ITEM_VIEW.map((el, idx) => {
      return (
        <TabPanel value={tab} index={idx} key={idx}>
          <RenderItemListUseByUser contentType={el.value} />
          {/* <ItemUseByUser contentType={el.value} /> */}
        </TabPanel>
      );
    });
  }, [tab]);

  return (
    <Stack gap="1.3rem">
      <Tabs value={tab} onChange={onChangeTab}>
        {renderTabs}
      </Tabs>

      {renderTabPanel}
    </Stack>
  );
}
// import { Row } from "react-table";
// import { Box } from "@mui/material";
// import { useRouter } from "next/router";
// import { cloneDeep, get } from "lodash";
// import { useCallback, useEffect, useMemo, useState } from "react";

// import { useIntl } from "react-intl";
// import { useUsedByUser } from "../context/UsedByUserProvider";
// import { useConfirmation, useFetch, useNotification } from "hooks";
// import { USAGE_LIMIT_ITEM_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
// import { ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT } from "__generated__/END_POINT";

// import {
//   checkResArr,
//   transformUrl,
//   deleteRequest,
//   setFilterValue,
//   createLoadingList,
// } from "libs";

// import DynamicMessage from "messages";
// import UserByUserTable from "./UserByUserTable";

// export type ProductPriceFilterType = {
//   page: 1;
//   page_size: 25;
//   with_count: boolean;
// };

// const defaultFilterValue: ProductPriceFilterType = {
//   page: 1,
//   page_size: 25,
//   with_count: true,
// };

// export default function ListUseByUser() {
//   const { query } = useRouter();
//   const { formatMessage } = useIntl();
//   const { setUpdateData } = useUsedByUser();
//   const { onConfirm, onClose } = useConfirmation();
//   const { enqueueSnackbarWithError, enqueueSnackbarWithSuccess } = useNotification();

//   const [filter, setFilter] = useState(defaultFilterValue);

//   const { data, isLoading, itemCount, refreshData } =
//     useFetch<USAGE_LIMIT_ITEM_VIEW_TYPE_V1>(
//       transformUrl(ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT, {
//         ...filter,
//         table: query.id,
//       })
//     );

//   useEffect(() => {
//     let obj = {
//       mutate: refreshData,
//     };

//     setUpdateData(obj);
//   }, []);

//   const onFilterChangeHandler = useCallback(
//     (key: string) => {
//       return (value: any) => {
//         let cloneFilter = cloneDeep(filter);

//         cloneFilter = setFilterValue(cloneFilter, key, value);

//         setFilter(cloneFilter);

//         return {};
//       };
//     },
//     [filter]
//   );

//   const deleteHandler = useCallback(({ data }: { data: Row<any>[] }) => {
//     const handler = async () => {
//       const filteredData = data.filter((el) => {
//         return el.original.id;
//       });

//       if (get(filteredData, "length") === 0) {
//         return;
//       }

//       const { list } = createLoadingList(filteredData);

//       try {
//         const results = await deleteRequest(
//           ADMIN_PRICE_TABLES_USAGE_LIMIT_ITEM_END_POINT,
//           list
//         );

//         const result = checkResArr(results);

//         if (result) {
//           enqueueSnackbarWithSuccess(
//             formatMessage(DynamicMessage.deleteSuccessfully, {
//               content: "đối tượng áp dụng",
//             })
//           );

//           refreshData();
//           onClose();
//         }
//       } catch (err) {
//         enqueueSnackbarWithError(err);
//       } finally {
//       }
//     };

//     onConfirm(handler, {
//       message: "Bạn có chắc muốn xóa?",
//     });
//   }, []);

//   const pagination = useMemo(() => {
//     return {
//       pageIndex: filter.page - 1,
//       pageSize: filter.page_size,
//     };
//   }, [filter]);

//   return (
//     <Box>
//       <UserByUserTable
//         data={data ?? []}
//         count={itemCount}
//         isLoading={isLoading}
//         pagination={pagination}
//         deleteHandler={deleteHandler}
//         onPageChange={onFilterChangeHandler("page")}
//         onPageSizeChange={onFilterChangeHandler("pageSize")}
//       />
//     </Box>
//   );
// }
