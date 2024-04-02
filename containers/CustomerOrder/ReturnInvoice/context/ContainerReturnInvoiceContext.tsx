import React, { createContext, useContext, useState } from "react";

type ContainerReturnInvoiceContextProps = {
  updateData: { mutate: any };
  setUpdateData: any;
  updateViewDetail: { mutate: any };
  setUpdateViewDetail: any;
};

const defaultState = {
  updateData: { mutate: async () => {} },
  setUpdateData: (obj: object) => {},
  updateViewDetail: { mutate: async () => {} },
  setUpdateViewDetail: (obj: object) => {},
};

const ContainerReturnInvoiceContext =
  createContext<ContainerReturnInvoiceContextProps>(defaultState);

function ContainerReturnInvoiceProvider({ children }: { children: React.ReactNode }) {
  const [updateData, setUpdateData] = useState({
    mutate: () => {},
  });

  const [updateViewDetail, setUpdateViewDetail] = useState({
    mutate: () => {},
  });

  const values = {
    updateData,
    setUpdateData,
    updateViewDetail,
    setUpdateViewDetail,
  };

  return (
    <ContainerReturnInvoiceContext.Provider value={values}>
      {children}
    </ContainerReturnInvoiceContext.Provider>
  );
}

function useContainerReturnInvoice() {
  const context = useContext(ContainerReturnInvoiceContext);

  if (typeof context === undefined) {
    throw new Error(
      "useContainerReturnInvoice must be used within ContainerReturnInvoiceProvider"
    );
  }

  return context;
}

export { useContainerReturnInvoice, ContainerReturnInvoiceProvider };
