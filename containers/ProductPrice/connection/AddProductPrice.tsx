import { Stack, Typography, Button } from "@mui/material";

import { useToggle } from "hooks";
import CreateProductPriceDialog from "../components/CreateProductPriceVariant";
import ProductPriceCategoryDialog from "../components/ProductPriceCategoryDialog";

export default function AddProductPrice() {
  const { open, onOpen, onClose } = useToggle();
  const { open: open2, onOpen: onOpen2, onClose: onClose2 } = useToggle();

  return (
    <Stack flexDirection="row" justifyContent="space-between" alignItems="center">
      <Typography fontWeight="700">Danh Sách Sản Phẩm</Typography>

      <Stack direction="row" spacing={2}>
        <Button variant="contained" onClick={onOpen2}>
          Thêm danh mục
        </Button>

        <Button variant="contained" onClick={onOpen}>
          Thêm sản phẩm
        </Button>
      </Stack>

      <CreateProductPriceDialog onClose={onClose} open={open} />
      <ProductPriceCategoryDialog onClose={onClose2} open={open2} />
    </Stack>
  );
}
