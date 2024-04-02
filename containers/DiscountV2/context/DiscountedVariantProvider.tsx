import { createContext, useContext, useState } from "react";

type DiscountedVariantProps = {
  updateData: { mutate: any };
  setUpdateData: any;
};

const defaultState = {
  updateData: { mutate: async () => {} },
  setUpdateData: (obj: object) => {},
};

const DiscountedVariantContext = createContext<DiscountedVariantProps>(defaultState);

function DiscountedVariantProvider({ children }: { children: React.ReactNode }) {
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
    <DiscountedVariantContext.Provider value={values}>
      {children}
    </DiscountedVariantContext.Provider>
  );
}

function useDiscountedVariant() {
  const context = useContext(DiscountedVariantContext);

  if (typeof context === undefined)
    throw new Error(
      "DiscountedVariantProvider must be used within DiscountedVariantProvider"
    );

  return context;
}

export { useDiscountedVariant, DiscountedVariantProvider };
