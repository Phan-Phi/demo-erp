import { useCallback, useState } from "react";
import { Box, Popover, Stack, Typography, styled } from "@mui/material";

import MoreButton from "components/Button/MoreButton";
import { usePermission, useUser } from "hooks";

interface Props {
  onOpen: () => void;
  idItem: number;
}

export default function MorePopover({ onOpen, idItem }: Props) {
  const { id: idUser } = useUser();
  const { hasPermission: writePermission } = usePermission("write_issue");
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <MoreButton aria-describedby={id} onClick={handleClick} />

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <WrapperPopoverContent>
          {/* <WrapperPopoverItem>
            <Typography>Xoá</Typography>
          </WrapperPopoverItem> */}

          {writePermission || idUser === idItem ? (
            <WrapperPopoverItem>
              <Typography
                onClick={() => {
                  onOpen();
                  setAnchorEl(null);
                }}
              >
                Chỉnh sửa
              </Typography>
            </WrapperPopoverItem>
          ) : null}
        </WrapperPopoverContent>
      </Popover>
    </>
  );
}

const WrapperPopoverContent = styled(Stack)(() => {
  return {};
});

const WrapperPopoverItem = styled(Box)(() => {
  return {
    cursor: "pointer",
    padding: "0.6rem 1rem",
    textAlign: "center",
    transition: "all 0.3s ease",

    "&:hover": {
      background: "#edecec",
    },
  };
});
