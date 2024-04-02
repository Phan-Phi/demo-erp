import React from "react";
import { Box } from "@mui/material";
import { useSetting } from "hooks";
import { Image } from "../../components/Image";

export default function HomeWithLogo() {
  const setting = useSetting();

  return (
    <Box
      position="fixed"
      top="50%"
      left="50%"
      sx={{
        transform: "translate(-50%, -50%)",
      }}
    >
      <Image
        alt=""
        width="250px"
        height="250px"
        objectFit="contain"
        src={setting.logo?.default || "/logo.png"}
      />
    </Box>
  );
}
