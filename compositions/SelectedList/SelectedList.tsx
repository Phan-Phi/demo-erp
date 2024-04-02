import { useIntl } from "react-intl";
import ListIcon from "@mui/icons-material/List";
import { useCallback, useMemo, useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Popover,
  styled,
} from "@mui/material";
import { CheckboxItem } from "components";

interface ListItemProps extends BoxProps {
  isOpen: boolean;
}

interface Props {
  columnTable: any;
  showAndHideTable: any;
}

const hideField = ["primary_image", "action", "selection"];

export default function SelectedList({ columnTable, showAndHideTable }: Props) {
  const { messages } = useIntl();
  const [active, setActive] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handle = useCallback(() => {
    setActive((el) => !el);
  }, []);
  const render = useMemo(() => {
    if (columnTable == undefined) return null;
    if (columnTable.allColumns == undefined) return null;

    return columnTable.allColumns.map((el, idx) => {
      const isDisable = columnTable.noDefault.includes(el.id);

      if (hideField.includes(el.id)) return;

      const title =
        el.Header.props?.id == undefined ? el.className : el.Header.props?.id || "";

      if (columnTable.defaultSelect.includes(el.id)) {
        return (
          <Grid item xs={6} key={idx}>
            <CheckboxItem
              label={messages[title] as string}
              CheckboxProps={{
                checked: isDisable ? false : true,
                onChange: (e, value) => {
                  showAndHideTable(el.id);
                },

                disableRipple: true,
              }}
            />
          </Grid>
        );
      }
      return (
        <Grid item xs={6} key={idx}>
          <CheckboxItem
            label={messages[title] as string}
            CheckboxProps={{
              checked: true,
              disabled: true,
              onChange: (e, value) => {
                showAndHideTable(el.id);
              },
              disableRipple: true,
            }}
          />
        </Grid>
      );
    });
  }, [columnTable]);

  return (
    <Box>
      <Wrapper>
        <Button aria-describedby={id} variant="contained" onClick={handleClick}>
          <ListIcon />
        </Button>
        <MuiPopover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <ListItem isOpen={open}>
            <StyledGrid container>{render}</StyledGrid>
          </ListItem>
        </MuiPopover>
      </Wrapper>
    </Box>
  );
}

const Wrapper = styled(Box)(({ theme }) => {
  return {
    position: "relative",
  };
});

const MuiPopover = styled(Popover)(() => {
  return {
    "& .MuiPaper-root": {
      width: "650px",
      height: "250px",
    },
  };
});

const StyledGrid = styled(Grid)(() => {
  return {
    width: "100%",
    justifyContent: "flex-start",
    marginLeft: 0,

    "& .MuiGrid-item": {
      paddingTop: "10px",
    },
  };
});

const ListItem = styled(Box, {
  shouldForwardProp: (propName) => {
    return propName !== "isOpen";
  },
})<ListItemProps>(({ theme, isOpen }) => {
  return {
    // display: isOpen ? "block" : "none",
    position: "absolute",
    zIndex: 10,
    right: 0,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    padding: "1rem",
    borderRadius: "1rem",
    background: theme.palette.common.white,
    width: "100%",
  };
});
