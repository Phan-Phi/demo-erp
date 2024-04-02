import React, { Fragment } from "react";
import { SETTING_ICON } from "constant";
import { MFMarker } from "react-map4d-map";
import { useMapForFormControl } from "./context/MapForFormControlContext";

export default function RenderMarker() {
  const { markerPosition } = useMapForFormControl();

  return (
    <Fragment>
      <MFMarker icon={SETTING_ICON} position={markerPosition} />
    </Fragment>
  );
}
