import { Stack, Typography, Button, Box } from "@mui/material";

import { usePermission, useToggle } from "hooks";

import DiscountedVariantDialog from "./DiscountedVariantDialog";
import DiscountedCategoryDialog from "./DiscountedCategoryDialog";

export default function AddDiscountedVariant() {
  const { open, onOpen, onClose } = useToggle();
  const { open: open2, onOpen: onOpen2, onClose: onClose2 } = useToggle();
  const { hasPermission: writePermission } = usePermission("write_voucher");

  return (
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="700">Danh sách sản phẩm</Typography>

      <Stack direction="row" spacing={3}>
        {writePermission && (
          <Button variant="contained" onClick={onOpen2}>
            Thêm danh mục
          </Button>
        )}
        {writePermission && (
          <Button variant="contained" onClick={onOpen}>
            Thêm sản phẩm
          </Button>
        )}
      </Stack>

      <DiscountedCategoryDialog onClose={onClose2} open={open2} />
      <DiscountedVariantDialog onClose={onClose} open={open} />
    </Stack>
  );
}
