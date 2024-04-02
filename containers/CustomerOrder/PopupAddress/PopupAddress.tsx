import { useMountedState } from "react-use";
import { UseFormSetValue, useWatch, Control } from "react-hook-form";
import React, { useCallback, useEffect, useMemo, useState } from "react";

import useSWR from "swr";
import { get, isEmpty, isEqual, omit } from "lodash";
import { Box, styled, Modal, Typography, Stack, Button, RadioGroup } from "@mui/material";

import AddressItem from "./AddressItem";
import { CUSTOMERS, DETAIL } from "routes";
import { Divider, LoadingDynamic, NoData } from "components";
import { convertValueToTupleForAddress, transformUrl } from "libs";

import {
  ADMIN_CUSTOMERS_DRAFTS_END_POINT,
  ADMIN_CUSTOMERS_ADDRESSES_END_POINT,
} from "__generated__/END_POINT";

import {
  ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1,
  ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1,
} from "__generated__/apiType_v1";

type PopupAddressProps = {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
  setValue: any;
  control: any;
};

export default function PopupAddress(props: PopupAddressProps) {
  const { userId, isOpen, onClose } = props;

  const isMounted = useMountedState();

  const control = props.control as Control<ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1>;
  const setValue =
    props.setValue as UseFormSetValue<ADMIN_USER_USER_ADDRESS_VIEW_TYPE_V1>;

  const watchValue = useWatch({ control });

  const [currentAddress, setCurrentAddress] =
    useState<ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1[]>();

  const currentAddressId = get(currentAddress, "[0].id");

  const [choiceAddress, setChoiceAddress] =
    useState<ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1[]>();

  const [transformedAddressListData, setTransformedAddressListData] =
    useState<ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1[]>();

  const { data: customerData } = useSWR(() => {
    if (!userId) return;

    return transformUrl(ADMIN_CUSTOMERS_DRAFTS_END_POINT, {
      official_customer: userId,
    });
  });

  const customerId = get(customerData, "results.[0].id");

  const { data: addressListData } = useSWR<
    ADMIN_CUSTOMER_DRAFT_CUSTOMER_ADDRESS_VIEW_TYPE_V1[]
  >(() => {
    if (!userId) return;

    return transformUrl(ADMIN_CUSTOMERS_ADDRESSES_END_POINT, {
      get_all: true,
      user: userId,
    });
  });

  useEffect(() => {
    if (addressListData == undefined) return;

    Promise.all(
      addressListData.map(async (item: any) => {
        return convertValueToTupleForAddress(item).then((resData) => {
          return {
            ...omit(item, ["ward", "district", "province"]),
            ...resData,
          };
        });
      })
    ).then((responseArr) => {
      if (!isMounted()) return;

      setTransformedAddressListData(responseArr as any[] as any[]);
    });
  }, [addressListData]);

  useEffect(() => {
    if (transformedAddressListData == undefined) return;

    const selectFieldsAddressData = transformedAddressListData.map((item) => {
      return {
        id: item.id,
        phone_number: item.phone_number,
        line1: item.line1,
        province: item.province,
        district: item.district,
        ward: item.ward,
        notes: item.notes,
      };
    });

    const objWatchValue = {
      phone_number: watchValue.phone_number,
      line1: watchValue.line1,
      province: watchValue.province,
      district: watchValue.district,
      ward: watchValue.ward,
      notes: watchValue.notes,
    };

    const filteredData = selectFieldsAddressData.filter((item) => {
      return isEqual(omit(item, "id"), objWatchValue);
    });

    setCurrentAddress(filteredData);
  }, [transformedAddressListData, watchValue, isOpen]);

  const onGoToHandler = useCallback(
    (id: number) => () => {
      if (!id) return;

      window.open(`/${CUSTOMERS}/${DETAIL}/${id}`, "_blank");
    },
    []
  );

  const handleClose = useCallback(() => {
    onClose();
    setChoiceAddress(undefined);
    setCurrentAddress(undefined);
  }, []);

  const onAddressChange = useCallback(
    (event: React.SyntheticEvent, id: string) => {
      if (transformedAddressListData == undefined) return;

      if (id) {
        const filteredData = transformedAddressListData.filter((item) => {
          const itemId = get(item, "id");

          return itemId === Number(id);
        });

        setChoiceAddress(filteredData);
      }
    },
    [transformedAddressListData]
  );

  const onConfirmAddress = useCallback(() => {
    if (choiceAddress == undefined) return;

    const line = get(choiceAddress, "[0].line1");
    const district = get(choiceAddress, "[0].district");
    const province = get(choiceAddress, "[0].province");
    const ward = get(choiceAddress, "[0].ward");
    const phoneNumber = get(choiceAddress, "[0].phone_number");
    const note = get(choiceAddress, "[0].notes");

    new Promise((resolve) => {
      setValue("province", province, { shouldDirty: true });
      resolve(null);
    })
      .then(() => {
        setValue("district", district, { shouldDirty: true });
      })
      .then(() => {
        setValue("ward", ward, { shouldDirty: true });
      });

    setValue("line1", line, { shouldDirty: true });
    setValue("phone_number", phoneNumber, { shouldDirty: true });
    setValue("notes", note, { shouldDirty: true });

    handleClose();
  }, [choiceAddress]);

  const renderAddressItem = useMemo(() => {
    if (transformedAddressListData == undefined)
      return <NoData>Không có địa chỉ giao hàng</NoData>;
    if (isEmpty(transformedAddressListData))
      return <NoData>Không có địa chỉ giao hàng</NoData>;

    return transformedAddressListData.map((item, index) => {
      const district = get(item, "district[1]");
      const province = get(item, "province[1]");
      const ward = get(item, "ward[1]");

      return (
        <AddressItem
          key={index}
          ward={ward}
          id={item.id}
          note={item.notes}
          district={district}
          province={province}
          address={item.line1}
          phoneNumber={item.phone_number}
          isDefaultForShipping={item.is_default_for_shipping}
        />
      );
    });
  }, [transformedAddressListData]);

  return (
    <StyledModal onClose={handleClose} open={isOpen}>
      <StyledWrapperContent>
        {transformedAddressListData == undefined ? (
          <LoadingDynamic />
        ) : (
          <Stack gap="20px">
            <Stack flexDirection="row" alignItems="center" justifyContent="space-between">
              <StyledTitle>Địa chỉ giao hàng</StyledTitle>
              <StyledButton onClick={onGoToHandler(customerId)}>
                Thêm địa chỉ mới
              </StyledButton>
            </Stack>

            <RadioGroup defaultValue={currentAddressId} onChange={onAddressChange}>
              <Stack gap="16px" divider={<Divider />}>
                {renderAddressItem}
              </Stack>
            </RadioGroup>

            {!isEmpty(transformedAddressListData) && (
              <StyledButton
                fullWidth={true}
                onClick={onConfirmAddress}
                disabled={isEmpty(choiceAddress)}
              >
                Xác Nhận
              </StyledButton>
            )}
          </Stack>
        )}
      </StyledWrapperContent>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)(() => {
  return {};
});

const StyledWrapperContent = styled(Box)(() => {
  return {
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",

    width: "50%",
    padding: 20,
    height: "80vh",
    borderRadius: 8,
    overflowY: "scroll",
  };
});

const StyledTitle = styled(Typography)(() => {
  return {
    fontSIze: 28,
    fontWeight: 700,
  };
});

const StyledButton = styled(Button)(() => {
  return {};
});
