import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { IconButton, IconButtonProps } from "@mui/material";

const MoreButton = (props: IconButtonProps) => {
  return (
    <IconButton {...props}>
      <MoreHorizIcon />
    </IconButton>
  );
};

export default MoreButton;
