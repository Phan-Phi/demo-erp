import { Stack, Typography, Button } from "@mui/material";

import { useToggle } from "hooks";

import UsedByUserDialog from "./UsedByUserDialog";
import UsedByCustomerDialog from "../connection/UsedByCustomerDialog";

export default function AddUsedByUser() {
  const { open, onOpen, onClose } = useToggle();
  const { open: open2, onOpen: onOpen2, onClose: onClose2 } = useToggle();

  return (
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="700">Phạm vi áp dụng</Typography>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={onOpen}>
          Thêm Sale phụ trách
        </Button>

        <Button variant="contained" onClick={onOpen2}>
          Thêm khách hàng
        </Button>
      </Stack>

      <UsedByUserDialog onClose={onClose} open={open} />
      <UsedByCustomerDialog onClose={onClose2} open={open2} />
    </Stack>
  );
}
