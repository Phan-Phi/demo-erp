import { get } from "lodash";
import dynamic from "next/dynamic";
import { MFMarker } from "react-map4d-map";
import React, { Fragment, useCallback, useMemo, useState } from "react";

import { useToggle } from "hooks";
import { SETTING_ICON } from "constant";
import { LoadingDynamic } from "components";
import { useMap } from "./context/MapContext";

const PopupInfo = dynamic(() => import("./PopupInfo"), {
  loading: () => {
    return <LoadingDynamic />;
  },
});

export default function RenderMarker() {
  const { markerData } = useMap();
  const { onClose, onOpen, open } = useToggle();
  const [customerId, setCustomerId] = useState(0);

  const openMarkerHandler = useCallback((args: any, id: number) => {
    setCustomerId(id);
    onOpen();
  }, []);

  const renderMarker = useMemo(() => {
    if (markerData == undefined) return null;

    return markerData.map((item, index) => {
      const lat = get(item, "coordinates.latitude");
      const lng = get(item, "coordinates.longitude");

      const position = { lat, lng };

      return (
        <MFMarker
          key={index}
          zIndex={1000}
          icon={SETTING_ICON}
          position={position}
          onClick={(args) => {
            openMarkerHandler(args, item.id as any);
          }}
        />
      );
    });
  }, [markerData]);

  return (
    <Fragment>
      {renderMarker}

      <PopupInfo
        open={open}
        onClose={onClose}
        customerId={customerId}
        setCustomerId={setCustomerId}
      />
    </Fragment>
  );
}
