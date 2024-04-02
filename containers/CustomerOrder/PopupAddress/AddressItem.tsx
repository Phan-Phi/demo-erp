import React from "react";

import {
  Box,
  Grid,
  Radio,
  Stack,
  styled,
  useTheme,
  Typography,
  FormControlLabel,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import { Link } from "components";
import { formatPhoneNumber } from "libs";

type AddressItemProps = {
  ward: string;
  address: string;
  province: string;
  district: string;
  id?: number;
  note?: string;
  phoneNumber?: string;
  isDefaultForShipping?: boolean;
};

export default function AddressItem(props: AddressItemProps) {
  const {
    id,
    note,
    ward,
    address,
    district,
    province,
    phoneNumber,
    isDefaultForShipping,
  } = props;

  const theme = useTheme();

  return (
    <StyledAddressItem>
      <Grid container spacing="16px">
        <Grid item xs={11}>
          <StyledWrapper>
            {isDefaultForShipping && (
              <StyledStackRow>
                <Typography
                  component="span"
                  sx={{
                    color: theme.palette.success.main,
                    fontSize: "13px",
                    marginLeft: 1,
                    display: "inline-flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 0,
                  }}
                >
                  <CheckIcon
                    sx={{
                      marginRight: "0.25rem",
                    }}
                  />
                  Địa chỉ giao hàng mặc định
                </Typography>
              </StyledStackRow>
            )}

            <StyledStackRow>
              <StyledTitle>Địa chỉ:</StyledTitle>
              <StyledText>{address || "-"}</StyledText>
            </StyledStackRow>

            <StyledStackRow>
              <StyledTitle>Phường / Xã:</StyledTitle>
              <StyledText>{ward || "-"}</StyledText>
            </StyledStackRow>

            <StyledStackRow>
              <StyledTitle>Quận / Huyện:</StyledTitle>
              <StyledText>{district || "-"}</StyledText>
            </StyledStackRow>

            <StyledStackRow>
              <StyledTitle>Tỉnh / Thành:</StyledTitle>
              <StyledText>{province || "-"}</StyledText>
            </StyledStackRow>

            <StyledStackRow>
              <StyledTitle>Số điện thoại:</StyledTitle>
              <StyledLink href={`tel:${phoneNumber}`}>
                {formatPhoneNumber(phoneNumber) || "-"}
              </StyledLink>
            </StyledStackRow>

            <StyledWrapperNote>
              <StyledTitle width="70px">Ghi chú:</StyledTitle>
              <StyledTextNote>{note || "-"}</StyledTextNote>
            </StyledWrapperNote>
          </StyledWrapper>
        </Grid>

        <Grid item xs={1}>
          <Stack height="100%" alignItems="center" justifyContent="center">
            <FormControlLabel value={id} control={<Radio />} label="" />
          </Stack>
        </Grid>
      </Grid>
    </StyledAddressItem>
  );
}

const StyledAddressItem = styled(Box)(() => {
  return {
    padding: 16,
    borderRadius: 8,
    boxShadow:
      "0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)",
  };
});

const StyledWrapper = styled(Stack)(() => {
  return {
    gap: 8,
  };
});

const StyledTitle = styled(Typography)(() => {
  return {
    fontSize: 16,
    fontWeight: 700,
  };
});

const StyledText = styled(Typography)(() => {
  return {
    fontSize: 16,
    lineHeight: "20px",
  };
});

const StyledLink = styled(Link)(() => {
  return {
    fontSize: 16,
    lineHeight: "20px",
  };
});

const StyledTextNote = styled(Typography)(() => {
  return {
    fontSize: 16,
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    minHeight: 19 * 2,
  };
});

const StyledWrapperNote = styled(Stack)(() => {
  return {
    gap: 4,
    flexDirection: "row",
    alignItems: "baseline",
  };
});

const StyledStackRow = styled(Stack)(() => {
  return {
    gap: 4,
    flexDirection: "row",
  };
});
