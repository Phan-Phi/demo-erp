import React from "react";
import { useRouter } from "next/router";
import { Box, styled, Typography, Button } from "@mui/material";

export default function Page404() {
  const router = useRouter();
  return (
    <StyledWrapper>
      <StyledTitle>404</StyledTitle>
      <StyledDesc>Trang bạn tìm kiếm hiện không tồn tại</StyledDesc>
      <Button
        onClick={() => {
          router.push("/");
        }}
      >
        Trở về trang chủ
      </Button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled(Box)(() => {
  return {
    gap: 40,
    padding: 40,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
  };
});

const StyledTitle = styled(Typography)(() => {
  return {
    fontSize: 100,
    lineHeight: "116px",
    fontWeight: 700,
    textAlign: "center",
  };
});

const StyledDesc = styled(Typography)(() => {
  return {
    fontSize: 32,
    lineHeight: "40px",
    fontWeight: 500,
    textAlign: "center",
  };
});
