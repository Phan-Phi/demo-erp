import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import React, { useCallback, useEffect, useState } from "react";

import useSWR, { KeyedMutator } from "swr";
import { formatISO, parseISO } from "date-fns";
import { Grid, Stack, styled } from "@mui/material";
import { get, set, isEmpty, omit, pick } from "lodash";

import {
  transformUrl,
  transformJSONToFormData,
  convertValueToTupleForAddress,
} from "libs";
import axios from "axios.config";
import DynamicMessage from "messages";
import { CREATE, CUSTOMERS, DRAFT, EDIT } from "routes";
import { useConfirmation, useNotification, usePermission } from "hooks";

import {
  Card,
  BackButton,
  AddNewAddress,
  LoadingButton,
  LoadingDynamic as Loading,
} from "components";
import CustomerDraftForm from "./CustomerDraftForm";
import AddressDetailDraft from "./AddressDetailDraft";

import {
  ADMIN_CUSTOMERS_DRAFTS_END_POINT,
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_RESOLVER,
  ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
  ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE,
} from "__generated__/PATCH_YUP";

import { ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

export default function DraftCustomerDetail() {
  const router = useRouter();
  const isMounted = useMountedState();
  const [defaultValues, setDefaultValues] = useState<any>();
  const [transformedAddressListData, setTransformedAddressListData] = useState<any[]>();

  const { data: customerData, mutate: customerDataMutate } =
    useSWR<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>(() => {
      const id = router.query.id;

      if (!id) return;

      return `${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}`;
    });

  const { data: addressListData, mutate: addressListMutate } = useSWR(() => {
    const draftId = get(customerData, "id");

    if (draftId) {
      const params = {
        user: draftId,
        type: "draft",
        use_cache: false,
        get_all: true,
      };

      return transformUrl(ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT, params);
    }
  });

  useEffect(() => {
    if (customerData == undefined) return;

    let body = {} as ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
    const keyList = [...Object.keys(ADMIN_CUSTOMERS_DRAFTS_POST_DEFAULT_VALUE)];

    keyList.forEach((key) => {
      if (key === "avatar") {
        if (!isEmpty(customerData[key])) {
          const imageLink = get(customerData, "avatar.default");

          set(body, "avatar", [
            {
              file: imageLink,
            },
          ]);
        } else {
          set(body, "avatar", []);
        }

        return;
      }

      if (key === "tax_identification_number" || key === "email") {
        if (customerData[key] == null) {
          set(customerData, key, "");
          return;
        }
      }

      if (key === "birthday") {
        const value = get(customerData, key);

        if (value == null) {
          set(body, key, null);
          return;
        }

        set(body, key, parseISO(value));

        return;
      }

      set(body, key, customerData[key]);
    });

    set(body, "id", customerData.id);

    setDefaultValues(body);
  }, [customerData]);

  useEffect(() => {
    if (addressListData == undefined) return;

    Promise.all(
      addressListData.map(async (el) => {
        return convertValueToTupleForAddress(el).then((resData) => {
          return {
            ...omit(el, ["ward", "district", "province"]),
            ...resData,
          };
        });
      })
    ).then((responseArr) => {
      if (!isMounted()) return;

      setTransformedAddressListData(responseArr as any[] as any[]);
    });
  }, [addressListData]);

  if (defaultValues == undefined || transformedAddressListData == undefined)
    return <Loading />;

  return (
    <RootComponent
      defaultValues={defaultValues}
      transformedAddressListData={transformedAddressListData}
      addressListMutate={addressListMutate}
      customerDataMutate={customerDataMutate}
    />
  );
}

type RootComponentProps = {
  defaultValues: any;
  transformedAddressListData: any;
  addressListMutate: KeyedMutator<
    ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_WITH_ID_PATCH_YUP_SCHEMA_TYPE[]
  >;
  customerDataMutate: KeyedMutator<ADMIN_CUSTOMER_DRAFT_CUSTOMER_VIEW_TYPE_V1>;
};

const RootComponent = (props: RootComponentProps) => {
  const {
    defaultValues,
    addressListMutate,
    customerDataMutate,
    transformedAddressListData,
  } = props;

  const router = useRouter();
  const isMounted = useMountedState();
  const [loading, setLoading] = useState({});
  const { messages, formatMessage } = useIntl();
  const { onConfirm, onClose } = useConfirmation();
  const [deleteLoading, setDeleteLoading] = useState({});
  const { hasPermission: writePermission } = usePermission("write_customer");
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const {
    watch,
    control,
    setError,
    clearErrors,
    handleSubmit,
    formState: { dirtyFields },
  } = useForm({
    defaultValues: defaultValues,
    resolver: ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_RESOLVER,
  });

  const createAddressHandler = useCallback(() => {
    const id = router.query.id;

    router.push(`/${CUSTOMERS}/${DRAFT}/${id}/${CREATE}`);
  }, [router.query.id]);

  const updateAddressHandler = useCallback(
    async (data) => {
      const id = router.query.id;
      const addressId = get(data, "id");

      if (addressId) {
        router.push(`/${CUSTOMERS}/${DRAFT}/${id}/${EDIT}/${addressId}`);
      }
    },
    [router.query.id]
  );

  const deleteAddressHandler = useCallback((id) => {
    const handler = async () => {
      setDeleteLoading((prevState) => {
        return {
          ...prevState,
          [id]: true,
        };
      });
      try {
        await axios.delete(`${ADMIN_CUSTOMERS_DRAFTS_ADDRESSES_END_POINT}${id}/`);
        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.deleteSuccessfully, {
            content: "địa chỉ",
          })
        );
        onClose();
        addressListMutate();
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setDeleteLoading((prevState) => {
            return {
              ...prevState,
              [id]: false,
            };
          });
        }
      }
    };
    onConfirm(handler, {
      message: "Bạn có chắc muốn xóa?",
    });
  }, []);

  const onSubmit = useCallback(
    async ({
      data,
      dirtyFields,
    }: {
      data: ADMIN_CUSTOMERS_DRAFTS_WITH_ID_PATCH_YUP_SCHEMA_TYPE;
      dirtyFields: object;
    }) => {
      try {
        setLoading(true);

        if (!isEmpty(dirtyFields)) {
          const { id, tax_identification_number } = data;

          const email = get(data, "email");
          const birthday = get(data, "birthday");

          const avatar = get(data, "avatar");

          if (email === "") {
            set(data, "email", null);
          }

          if (birthday) {
            set(data, "birthday", formatISO(new Date(birthday)));
          }

          if (!isEmpty(avatar)) {
            const transformedAvatar = avatar.map((el) => {
              return el.file;
            });
            set(data, "avatar", transformedAvatar);
          } else {
            set(data, "avatar", null);
          }

          const isChangeType = get(dirtyFields, "type");

          if (isChangeType) {
            set(data, "type", get(data, "type"));
          }

          if (isEmpty(tax_identification_number)) {
            set(data, "tax_identification_number", null);
          }

          if (data.avatar == null) {
            const body = pick(data, Object.keys(dirtyFields));

            await axios.patch(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}/`, body);
          } else {
            const formData = transformJSONToFormData(data, dirtyFields);

            await axios.patch(`${ADMIN_CUSTOMERS_DRAFTS_END_POINT}${id}/`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });
          }

          enqueueSnackbarWithSuccess(
            formatMessage(DynamicMessage.updateSuccessfully, {
              content: "khách hàng",
            })
          );

          customerDataMutate();

          router.push(`/${CUSTOMERS}`);
        } else {
          router.push(`/${CUSTOMERS}`);
        }
      } catch (error) {
        enqueueSnackbarWithError(error);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    []
  );

  return (
    <Grid container>
      <Grid item xs={6}>
        <Card
          title={messages["customerInfo"] as string}
          body={
            <CustomerDraftForm
              {...{
                control,
                watch,
                setError,
                clearErrors,
              }}
            />
          }
        />
      </Grid>
      <Grid item xs={6}>
        <Card
          title={messages["addressInfo"]}
          body={
            <Stack spacing={2}>
              <AddNewAddress onClick={createAddressHandler} />

              <AddressDetailDraft
                {...{
                  data: transformedAddressListData,
                  deleteAddressHandler,
                  updateAddressHandler,
                  deleteLoading,
                  writePermission,
                }}
              />
            </Stack>
          }
        />
      </Grid>

      <Grid item xs={12}>
        <StyledStack>
          <BackButton onClick={router.back} />

          <LoadingButton
            loading={!!loading["complete"]}
            onClick={handleSubmit((data) => {
              onSubmit({ data, dirtyFields });
            })}
          >
            {loading["complete"] ? messages["updatingStatus"] : messages["updateStatus"]}
          </LoadingButton>
        </StyledStack>
      </Grid>
    </Grid>
  );
};

const StyledStack = styled(Stack)(() => {
  return {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  };
});
