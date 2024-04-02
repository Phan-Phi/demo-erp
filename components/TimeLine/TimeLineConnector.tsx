import { Box, BoxProps, styled } from "@mui/material";

interface Props {
  active: boolean;
}

interface StyledContainerProps extends BoxProps {
  isDisplay: boolean;
}

export default function TimeLineConnector({ active }: Props) {
  return <StyledContainer isDisplay={active} />;
}

const StyledContainer = styled(Box, {
  shouldForwardProp: (propName) => propName != "isDisplay",
})<StyledContainerProps>(({ isDisplay }) => {
  return {
    display: isDisplay ? "none" : "block",
    width: "2px",
    height: "100%",
    background: "#bdbdbd",
  };
});
