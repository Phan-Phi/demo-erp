import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useState, useCallback, useEffect } from "react";

import useSWR, { KeyedMutator } from "swr";
import { get, set, isEmpty } from "lodash";
import { Stack, Grid } from "@mui/material";

import AddressForm from "../components/AddressForm";
import { BackButton, Card, LoadingDynamic as Loading, LoadingButton } from "components";

import axios from "axios.config";
import DynamicMessage from "messages";
import { useNotification } from "hooks";
import { CUSTOMERS, DRAFT } from "routes";
import { convertValueToTupleForAddress } from "libs";

import {
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_CUSTOMER_CUSTOMER_ADDRESS_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

export default function EditAddressCustomerDraft() {
  const router = useRouter();
  const isMounted = useMountedState();
  const [defaultValues, setDefaultValues] = useState<any>();

  const { data: addressData, mutate: addressDataMutate } = useSWR<
    Required<ADMIN_CUSTOMER_CUSTOMER_ADDRESS_VIEW_TYPE_V1>
  >(() => {
    const addressId = router.query.editId;

    if (!addressId) return;

    return `${ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT}${addressId}`;
  });

  useEffect(() => {
    if (addressData == undefined) return;

    convertValueToTupleForAddress(addressData).then((resData) => {
      if (resData && isMounted()) {
        const { province, ward, district } = resData;

        const userId = get(addressData, "user.id");

        const data = {} as ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE;

        const keyList = [
          ...Object.keys(ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_POST_DEFAULT_VALUE),
          "id",
        ];

        keyList.forEach((key) => {
          set(data, key, addressData[key]);
        });

        setDefaultValues({
          ...data,
          province: province[0] === "" ? null : province,
          district: district[0] === "" ? null : district,
          ward: ward[0] === "" ? null : ward,
          user: userId,
        });
      }
    });
  }, [addressData]);

  if (defaultValues == undefined) return <Loading />;

  return (
    <RootComponent defaultValues={defaultValues} addressDataMutate={addressDataMutate} />
  );
}

type RootComponentProps = {
  defaultValues: ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
  addressDataMutate: KeyedMutator<Required<ADMIN_CUSTOMER_CUSTOMER_ADDRESS_VIEW_TYPE_V1>>;
};

const RootComponent = (props: RootComponentProps) => {
  const { defaultValues, addressDataMutate } = props;

  const {
    watch,
    control,
    setValue,
    getValues,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues,
    resolver: ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const router = useRouter();
  const isMounted = useMountedState();
  const { formatMessage, messages } = useIntl();

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError, loading, setLoading } =
    useNotification();

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
      try {
        const href = `/${CUSTOMERS}/${DRAFT}/${router.query.id}`;

        if (!isEmpty(dirtyFields)) {
          let body = {};

          Object.keys(dirtyFields).forEach((key) => {
            set(body, key, data[key]);
          });

          setLoading(true);

          const id = get(data, "id");

          await axios.patch(`${ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT}${id}/`, body);

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "địa chỉ khách hàng",
            })
          );

          addressDataMutate();
          router.push(href);
        }

        router.push(href);
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [router.query.id]
  );

  return (
    <Grid container>
      <Grid item xs={12}>
        <Card
          title={messages["updateAddress"]}
          cardBodyComponent={() => {
            return (
              <AddressForm
                {...{
                  control,
                  getValues,
                  watch,
                  setValue,
                }}
              />
            );
          }}
        />
      </Grid>

      <Grid item xs={12}>
        <Stack flexDirection="row" justifyContent={"space-between"}>
          <BackButton onClick={router.back} />

          <LoadingButton
            loading={!!loading}
            onClick={handleSubmit((data) => {
              onSubmit({ data, dirtyFields });
            })}
          >
            {loading ? messages["updatingStatus"] : messages["updateStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
};
