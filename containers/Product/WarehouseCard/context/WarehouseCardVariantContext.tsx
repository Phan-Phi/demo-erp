import React, { useState, useContext, createContext, SetStateAction } from "react";
import { ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

type WarehouseCardVariantContextProps = {
  data: any[];
  setData: React.Dispatch<SetStateAction<any[]>>;
};

const defaultState = {
  data: [],
  setData: () => {},
};

const WarehouseCardVariantContext =
  createContext<WarehouseCardVariantContextProps>(defaultState);

function WarehouseCardVariantProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ADMIN_PRODUCT_PRODUCT_VARIANT_TIMELINE_VIEW_TYPE_V1[]>(
    []
  );

  const values = {
    data,
    setData,
  };

  return (
    <WarehouseCardVariantContext.Provider value={values}>
      {children}
    </WarehouseCardVariantContext.Provider>
  );
}

function useWarehouseCardVariant() {
  const context = useContext(WarehouseCardVariantContext);

  if (typeof context === undefined)
    throw new Error(
      "useWarehouseCardVariant must be used within WarehouseCardVariantProvider"
    );

  return context;
}

export { useWarehouseCardVariant, WarehouseCardVariantProvider };
