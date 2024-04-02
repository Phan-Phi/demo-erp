import React, { createContext, useContext, useState } from "react";

type PriceTableContextProps = {
  updateData: { mutate: any };
  setUpdateData: any;
  updateLineList: { mutate: any };
  setUpdateLineList: (obj: { mutate: any }) => void;
};

const defaultState = {
  updateData: { mutate: async () => {} },
  setUpdateData: (obj: object) => {},
  updateLineList: { mutate: async () => {} },
  setUpdateLineList: (obj: object) => {},
};

const PriceTableContext = createContext<PriceTableContextProps>(defaultState);

function PriceTableProvider({ children }: { children: React.ReactNode }) {
  const [updateData, setUpdateData] = useState({
    mutate: () => {},
  });

  const [updateLineList, setUpdateLineList] = useState({
    mutate: () => {},
  });

  const values = {
    updateData,
    setUpdateData,
    updateLineList,
    setUpdateLineList,
  };

  return (
    <PriceTableContext.Provider value={values}>{children}</PriceTableContext.Provider>
  );
}

function usePriceTable() {
  const context = useContext(PriceTableContext);

  if (typeof context === undefined) {
    throw new Error("usePriceTable must be used within PriceTableProvider");
  }

  return context;
}

export { usePriceTable, PriceTableProvider };
