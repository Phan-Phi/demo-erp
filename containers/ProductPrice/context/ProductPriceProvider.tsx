import { createContext, useContext, useState } from "react";

type ProductPriceProps = {
  updateData: { mutate: any };
  setUpdateData: any;
};

const defaultState = {
  updateData: { mutate: async () => {} },
  setUpdateData: (obj: object) => {},
};

const ProductPriceContext = createContext<ProductPriceProps>(defaultState);

function ProductPriceProvider({ children }: { children: React.ReactNode }) {
  const [updateData, setUpdateData] = useState({
    mutate: () => {},
  });
  const [rank, setRank] = useState(0);

  const values = {
    updateData,
    setUpdateData,
    rank,
    setRank,
  };

  return (
    <ProductPriceContext.Provider value={values}>{children}</ProductPriceContext.Provider>
  );
}

function useProductPrice() {
  const context = useContext(ProductPriceContext);

  if (typeof context === undefined)
    throw new Error("useProductPrice must be used within useProductPrice");

  return context;
}

export { useProductPrice, ProductPriceProvider };
