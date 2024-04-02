import { SWRConfig } from "swr";
import { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
// import axios as axios1 from 'axios';
import axios from "axios.config";
import { useNotification } from "hooks";

const SWR = ({ children }) => {
  const { enqueueSnackbarWithError } = useNotification();

  const { status, data } = useSession();
  // console.log("🚀 ~ SWR ~ data:", data);

  useEffect(() => {
    if (data == null) return;

    const { user } = data;

    if (user.shouldReLogin) {
      signOut();
    }
  }, [data]);

  useEffect(() => {
    if (data == undefined) return;
    if (!data.user.token) return;

    axios.defaults.headers["Authorization"] = `JWT ${data.user.token}`;
  }, [data]);

  if (status === "loading") return null;

  return (
    <SWRConfig
      value={{
        refreshInterval: 60000,
        revalidateIfStale: true,
        revalidateOnFocus: true,
        revalidateOnMount: true,
        revalidateOnReconnect: true,
        fetcher: async (resource) => {
          // console.log("🚀 ~ fetcher: ~ resource:", resource);
          return axios
            .get(resource)
            .then(async (res) => {
              return res.data;
            })
            .catch((err) => {
              enqueueSnackbarWithError(err);
              throw err;
            });
        },
      }}
    >
      {children}
    </SWRConfig>
  );
};

export default SWR;
