import { MFMap } from "react-map4d-map";
import React, { useCallback, useMemo } from "react";
import { UseFormSetValue, UseFormWatch } from "react-hook-form";

import { get } from "lodash";
import { Box, Stack } from "@mui/material";

import {
  MAP_OPTIONS,
  ACCESS_KEY_MAP_4D,
  SETTING_EVENTS_MAP4D,
  WRAPPER_TABLE_BOX_SHADOW,
} from "constant";

import { FormLabel } from "components";
import RenderMarker from "./RenderMarker";

import { useMapForFormControl } from "./context/MapForFormControlContext";
import { ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE } from "__generated__/POST_YUP";

type FormControlMap4D = {
  setValue: any;
  watch: any;
};

type POSITION_TYPE = {
  lat: number;
  lng: number;
};

export default function FormControlMap4D(props: FormControlMap4D) {
  const setValue =
    props.setValue as UseFormSetValue<ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  const watch =
    props.watch as UseFormWatch<ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_YUP_SCHEMA_TYPE>;

  const coordinate = watch("coordinates");

  const { setMarkerPosition } = useMapForFormControl();

  const onMapReadyHandler = useCallback((map: any) => {
    map.setPOIsEnabled(false);

    const coordinateLat = get(coordinate, "latitude", 0);
    const coordinateLng = get(coordinate, "longitude", 0);

    setMarkerPosition({
      lat: coordinateLat,
      lng: coordinateLng,
    });

    const latMap = coordinateLat !== 0 ? coordinateLat : 10.824766930830133;
    const lngMap = coordinateLng !== 0 ? coordinateLng : 106.60176403899342;

    map.panTo({ lat: latMap, lng: lngMap });

    map.addListener(
      "click",
      (event) => {
        const lat: number = get(event, "location.lat");
        const lng: number = get(event, "location.lng");

        const coordinate: POSITION_TYPE = {
          lat,
          lng,
        };

        setMarkerPosition(coordinate);
        setValue(
          "coordinates",
          {
            latitude: coordinate.lat,
            longitude: coordinate.lng,
          },
          {
            shouldDirty: true,
          }
        );
      },
      SETTING_EVENTS_MAP4D
    );
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
    <Stack gap="8px">
      <FormLabel>Vị trí</FormLabel>

      <Box
        width="100%"
        height="400px"
        borderRadius="4px"
        boxShadow={WRAPPER_TABLE_BOX_SHADOW}
      >
        {renderMap}
      </Box>
    </Stack>
  );
}
