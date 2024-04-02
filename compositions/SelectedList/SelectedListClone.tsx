import { useIntl } from "react-intl";
import ListIcon from "@mui/icons-material/List";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Box, BoxProps, Button, Grid, Menu, styled } from "@mui/material";
import { usePopupState, bindTrigger, bindMenu } from "material-ui-popup-state/hooks";
import PopupState from "material-ui-popup-state";

import { CheckboxItem } from "components";

interface ListItemProps extends BoxProps {
  isOpen: boolean;
}

interface Props {
  columnTable: any;
  showAndHideTable: any;
}

export default function SelectedList({ columnTable, showAndHideTable }: Props) {
  const { messages } = useIntl();
  const [active, setActive] = useState<boolean>(false);
  const popupState = usePopupState({ variant: "popover", popupId: "selectLanguage" });

  const render = useMemo(() => {
    if (columnTable == undefined) return null;
    if (columnTable.allColumns == undefined) return null;

    return columnTable.allColumns.map((el, idx) => {
      const isDisable = columnTable.noDefault.includes(el.id);

      return (
        <Grid item xs={6} key={idx}>
          {isDisable ? (
            <CheckboxItem
              label={messages[el.Header.props?.id || ""] as string}
              CheckboxProps={{
                onChange: (e, value) => {
                  showAndHideTable(el.id);
                },
              }}
            />
          ) : (
            <CheckboxItem
              label={messages[el.Header.props?.id || ""] as string}
              CheckboxProps={{
                checked: true,
                disabled: true,
                onChange: (e, value) => {
                  showAndHideTable(el.id);
                },
              }}
            />
          )}
        </Grid>
      );
    });
  }, [columnTable.allColumns, columnTable.noDefault]);

  const handle = useCallback(() => {
    setActive((el) => !el);
  }, []);

  return (
    <Wrapper>
      <PopupState variant="popover" popupId="demoMenu">
        {(popupState) => (
          <Fragment>
            <Button variant="contained" {...bindTrigger(popupState)}>
              <ListIcon />
            </Button>
            <StyledMenu
              {...bindMenu(popupState)}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
            >
              <ListItem isOpen={active}>
                <StyledGrid container>{render}</StyledGrid>
              </ListItem>
            </StyledMenu>
          </Fragment>
        )}
      </PopupState>
      {/* <Button onClick={handle}>
          <ListIcon />
        </Button> */}

      {/* <ListItem isOpen={active}>
          <StyledGrid container>{render}</StyledGrid>
        </ListItem> */}
    </Wrapper>
  );
}

const StyledMenu = styled(Menu)(({ theme }) => {
  return {
    "& .MuiList-root": {
      width: "500px !important",
      height: "400px !important",
    },
  };
});

const Wrapper = styled(Box)(({ theme }) => {
  return {};
});

const StyledGrid = styled(Grid)(() => {
  return {
    justifyContent: "flex-start",
  };
});

const ListItem = styled(Box, {
  shouldForwardProp: (propName) => {
    return propName !== "isOpen";
  },
})<ListItemProps>(({ theme, isOpen }) => {
  return {
    position: "absolute",
    zIndex: 10,
    right: 0,
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    padding: "1rem",
    borderRadius: "1rem",
    background: theme.palette.common.white,
  };
});
