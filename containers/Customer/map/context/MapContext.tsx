import { createContext, useContext, useState } from "react";

export type Bbox = string;
export type MarkerData = any[];

export interface MapContextProps {
  bbox: Bbox;
  setBbox: (s: Bbox) => void;
  markerData: MarkerData;
  setMarkerData: (arr: MarkerData) => void;
}

const defaultState: MapContextProps = {
  bbox: "",
  setBbox: () => {},
  markerData: [],
  setMarkerData: () => {},
};

export const defaultBbox: Bbox =
  "106.55876284894322,10.81502764676334,106.6112224901658,10.8403183925778";

const MapContext = createContext<MapContextProps>(defaultState);

function MapProvider({ children }: { children: React.ReactNode }) {
  const [bbox, setBbox] = useState<Bbox>(defaultBbox);
  const [markerData, setMarkerData] = useState<MarkerData>([]);

  const values = {
    bbox,
    setBbox,
    markerData,
    setMarkerData,
  };

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
}

function useMap() {
  const context = useContext(MapContext);

  if (typeof context === undefined) {
    throw new Error("useMap must be used within MapProvider");
  }

  return context;
}

export { useMap, MapProvider };
