import { createContext, useContext, useState } from "react";

type UsedByUserProps = {
  updateData: { mutate: any };
  setUpdateData: any;
};

const defaultState = {
  updateData: { mutate: async () => {} },
  setUpdateData: (obj: object) => {},
};

const UsedByUserContext = createContext<UsedByUserProps>(defaultState);

function UsedByUserProvider({ children }: { children: React.ReactNode }) {
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
    <UsedByUserContext.Provider value={values}>{children}</UsedByUserContext.Provider>
  );
}

function useUsedByUser() {
  const context = useContext(UsedByUserContext);

  if (typeof context === undefined)
    throw new Error("useUsedByUser must be used within UsedByUserProvider");

  return context;
}

export { useUsedByUser, UsedByUserProvider };
