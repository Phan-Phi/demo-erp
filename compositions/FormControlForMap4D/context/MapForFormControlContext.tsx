import { createContext, useContext, useState } from "react";

type MarkerPosition = { lat: number; lng: number };

type MapContextProps = {
  markerPosition: MarkerPosition;
  setMarkerPosition: (obj: MarkerPosition) => void;
};

const defaultState: MapContextProps = {
  markerPosition: { lat: 0, lng: 0 },
  setMarkerPosition: () => {},
};

const MapContext = createContext<MapContextProps>(defaultState);

function MapProvider({ children }: { children: React.ReactNode }) {
  const [markerPosition, setMarkerPosition] = useState<MarkerPosition>({
    lat: 0,
    lng: 0,
  });

  const values = { markerPosition, setMarkerPosition };

  return <MapContext.Provider value={values}>{children}</MapContext.Provider>;
}

function useMapForFormControl() {
  const context = useContext(MapContext);

  if (typeof context === undefined) {
    throw new Error("useMapForFormControl must be used within MapProvider");
  }

  return context;
}

export { useMapForFormControl, MapProvider };
