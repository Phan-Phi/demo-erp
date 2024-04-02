import dynamic from "next/dynamic";
import { useIntl } from "react-intl";
import { MFMap } from "react-map4d-map";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { Box, Grid, Stack } from "@mui/material";
import { cloneDeep, get, isEmpty, omit } from "lodash";

import Filter from "./Filter";
import { TableHeader, LoadingDynamic as Loading } from "components";

import { useFetch } from "hooks";
import { ProvinceTuple } from "interfaces";
import { defaultBbox, useMap } from "./context/MapContext";
import { appendMapData, setFilterValue, sortId, transformUrl } from "libs";
import { ACCESS_KEY_MAP_4D, MAP_OPTIONS, WRAPPER_TABLE_BOX_SHADOW } from "constant";

import { ADMIN_CUSTOMERS_ON_MAP_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

const RenderMarker = dynamic(() => import("./RenderMarker"), {
  loading: () => {
    return <Loading />;
  },
});

export type MapFilterType = {
  province: ProvinceTuple[] | null;
  district: ProvinceTuple[] | null;
  type: ADMIN_CUSTOMER_CUSTOMER_TYPE_VIEW_TYPE_V1 | null;
};

export const defaultFilterValue: MapFilterType = {
  province: null,
  district: null,
  type: null,
};

export default function Map() {
  const { messages } = useIntl();

  const { setBbox, bbox, markerData, setMarkerData } = useMap();

  const [holdData, setHoldData] = useState<any>([]);
  const [offCheckDataDifferent, setOffCheckDataDifferent] = useState(true);
  const [filter, setFilter] = useState<MapFilterType>(defaultFilterValue);

  const { resData, changeKey } = useFetch(
    transformUrl(ADMIN_CUSTOMERS_ON_MAP_END_POINT, {
      ...filter,
    })
  );

  const handlerChangeKey = useCallback(() => {
    if (bbox === "") return;

    changeKey(
      transformUrl(ADMIN_CUSTOMERS_ON_MAP_END_POINT, {
        ...omit(filter, "page"),
        in_bbox: bbox,
        type: filter.type ? get(filter, "type.id") : null,
        province: filter.province ? get(filter, "province[0]") : null,
        district: filter.district ? get(filter, "district[0]") : null,
      })
    );
  }, [filter, bbox]);

  useEffect(() => {
    handlerChangeKey();
  }, [handlerChangeKey]);

  useEffect(() => {
    if (resData == undefined) return;

    const data = appendMapData(resData);

    setHoldData(data);
  }, [resData]);

  useEffect(() => {
    if (resData == undefined) return;

    const data: any = resData;

    const isEqual = data.length === markerData.length;

    const checkIsDifferent = sortId(data).filter((item, index) => {
      const id = get(markerData[index], "id");

      return item.id === id;
    });

    if (!isEmpty(checkIsDifferent) && offCheckDataDifferent && isEqual) return;

    setMarkerData(holdData);
  }, [markerData, holdData, resData, offCheckDataDifferent]);

  const onFilterChangeHandler = useCallback(
    (key: string) => {
      return (value: any) => {
        let cloneFilter = cloneDeep(filter);

        cloneFilter = setFilterValue(cloneFilter, key, value);

        setFilter(cloneFilter);
        setOffCheckDataDifferent(false);
      };
    },
    [filter]
  );

  const resetFilterHandler = useCallback(() => {
    setFilter(defaultFilterValue);
    setOffCheckDataDifferent(true);
    setBbox(defaultBbox);
  }, []);

  const onMapReadyHandler = useCallback((map: any) => {
    // đông bắc

    map.setPOIsEnabled(false);

    const mapBounds = map.getBounds();

    const northeast_lat = get(mapBounds, "northeast.lat");
    const northeast_lng = get(mapBounds, "northeast.lng");

    //tây nam
    const southwest_lat = get(mapBounds, "southwest.lat");
    const southwest_lng = get(mapBounds, "southwest.lng");

    const result = `${southwest_lng},${southwest_lat},${northeast_lng},${northeast_lat}`;

    setBbox(result);

    map.addListener("idle", () => {
      setOffCheckDataDifferent(true);

      const mapBounds = map.getBounds();

      const northeast_lat = get(mapBounds, "northeast.lat");
      const northeast_lng = get(mapBounds, "northeast.lng");

      const southwest_lat = get(mapBounds, "southwest.lat");
      const southwest_lng = get(mapBounds, "southwest.lng");

      const result = `${southwest_lng},${southwest_lat},${northeast_lng},${northeast_lat}`;

      const timeout = setTimeout(() => {
        setBbox(result);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    });
  }, []);

  const renderMap = useMemo(() => {
    return (
      <MFMap
        version="2.4"
        options={MAP_OPTIONS}
        accessKey={ACCESS_KEY_MAP_4D}
        onMapReady={onMapReadyHandler}
      >
        <RenderMarker />
      </MFMap>
    );
  }, []);

  return (
    <Grid container>
      <Grid item xs={2}>
        <Filter
          filter={filter}
          resetFilter={resetFilterHandler}
          onTypeChange={onFilterChangeHandler("type")}
          onProvinceChange={onFilterChangeHandler("province")}
          onDistrictChange={onFilterChangeHandler("district")}
        />
      </Grid>
      <Grid item xs={10}>
        <Stack spacing={2}>
          <TableHeader title={messages["map"] as string} />

          <Box
            width="100%"
            height="600px"
            borderRadius="4px"
            boxShadow={WRAPPER_TABLE_BOX_SHADOW}
          >
            {renderMap}
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
}
