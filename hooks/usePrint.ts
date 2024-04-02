import { useCallback, useState } from "react";

import { useSnackbar } from "notistack";

import axios from "axios";

export const usePrint = () => {
  const [isPrint, setIsPrint] = useState(false);

  const handleOpenPrint = useCallback((message: string) => {
    setIsPrint(true);
  }, []);

  const handleClosePrint = useCallback((err: unknown) => {
    setIsPrint(false);
  }, []);

  return {
    isPrint,
    setIsPrint,
    handleOpenPrint,
    handleClosePrint,
  };
};
