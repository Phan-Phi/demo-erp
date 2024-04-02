import { Box, Grid, Stack, StackProps, Typography, styled } from "@mui/material";

interface StyledStackProps extends StackProps {
  line: boolean;
}

interface Props {
  count: number;
  name: string;
  countGrid: number;
  borderRight?: any;
  onClick: any;
}

export default function ToDoListItem({
  count,
  name,
  onClick,
  countGrid,
  borderRight = true,
}: Props) {
  return (
    <Grid item xs={countGrid}>
      <StyledStack direction="row" onClick={onClick}>
        <Box flexGrow={1} textAlign="center">
          <Count variant="h6">{count}</Count>
          <Typography>{name}</Typography>
        </Box>

        {borderRight && <Line />}
      </StyledStack>
    </Grid>
  );
}

const Wrapper = styled(Box)(() => {
  return {
    flexGrow: 1,
    textAlign: "center",
    padding: "1rem 0",
  };
});

const Count = styled(Typography)(({ theme }) => {
  return {
    fontSize: "24px",
    paddingBottom: "0.5rem",
    color: theme.palette.secondary.main,
    fontWeight: 700,
  };
});

const Text = styled(Typography)(({ theme }) => {
  return {
    ...theme.typography.h6,
    fontWeight: 500,
  };
});

const Line = styled(Typography)(() => {
  return {
    width: "2px",
    height: "40px",
    backgroundColor: "rgb(118,118,118,0.7)",
  };
});

const StyledStack = styled(Stack)(() => {
  return {
    alignItems: "center",
    cursor: "pointer",
  };
});
