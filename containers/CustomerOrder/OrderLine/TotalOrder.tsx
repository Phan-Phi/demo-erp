import { useRouter } from "next/router";
import { useUpdateEffect } from "react-use";
import React, { useState } from "react";

import useSWR from "swr";
import { get } from "lodash";
import { styled, Stack, Box, Typography } from "@mui/material";

import { transformUrl } from "libs";
import { NumberFormat } from "components";

import { ADMIN_ORDERS_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ORDER_ORDER_VIEW_TYPE_V1 } from "__generated__/apiType_v1";

export type TotalOrderFilterType = {
  nested_depth: number;
  use_cache: boolean;
};

const defaultFilterValue: TotalOrderFilterType = {
  nested_depth: 3,
  use_cache: false,
};

type TotalOrderProps = {
  triggerRender: boolean;
};

export default function TotalOrder({ triggerRender }: TotalOrderProps) {
  const router = useRouter();

  const [filter, setFilter] = useState<TotalOrderFilterType>(defaultFilterValue);

  const { data, mutate } = useSWR<ADMIN_ORDER_ORDER_VIEW_TYPE_V1>(() => {
    if (!router.query.id) return;

    return transformUrl(`${ADMIN_ORDERS_END_POINT}${router.query.id}`, {
      ...filter,
    });
  });

  useUpdateEffect(() => {
    mutate();
  }, [triggerRender]);

  const itemCount = get(data, "item_count");
  const totalPrice = get(data, "total_price.incl_tax");
  const totalBeforeDiscounts = get(data, "total_before_discounts.incl_tax");

  return (
    <StyledWrapper>
      <StyledWrapperContent>
        <Stack gap="20px">
          <StyledStack>
            <StyledText>Tổng số lượng hàng:</StyledText>
            <StyledText>{itemCount || 0}</StyledText>
          </StyledStack>

          <StyledStack>
            <StyledText>Tổng tiền hàng:</StyledText>
            <StyledNumberFormat value={parseFloat(totalBeforeDiscounts)} suffix=" đ" />
          </StyledStack>

          <StyledStack>
            <StyledText>Chiết khấu:</StyledText>
            <StyledNumberFormat
              value={parseFloat(totalBeforeDiscounts) - parseFloat(totalPrice)}
              suffix=" đ"
            />
          </StyledStack>

          <StyledStack>
            <StyledTextBold>Giá trị đơn hàng:</StyledTextBold>
            <StyledNumberFormatBold value={parseFloat(totalPrice)} suffix=" đ" />
          </StyledStack>
        </Stack>
      </StyledWrapperContent>
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Stack)(() => {
  return {
    marginTop: 20,
    alignItems: "end",
  };
});

const StyledWrapperContent = styled(Box)(() => {
  return {
    minWidth: 400,
    padding: 16,
    borderRadius: 4,
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  };
});

const StyledStack = styled(Stack)(() => {
  return {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  };
});

const StyledText = styled(Typography)(() => {
  return {
    fontSize: 14,
  };
});

const StyledNumberFormat = styled(NumberFormat)(() => {
  return {
    fontSize: 14,
  };
});

const StyledTextBold = styled(Typography)(() => {
  return {
    fontSize: 14,
    fontWeight: 700,
  };
});

const StyledNumberFormatBold = styled(NumberFormat)(() => {
  return {
    fontSize: 14,
    fontWeight: 700,
  };
});
