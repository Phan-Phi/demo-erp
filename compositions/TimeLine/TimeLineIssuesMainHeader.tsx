import { Stack, Typography, styled } from "@mui/material";

import { useUser } from "hooks";
import { EditButton } from "components";
import { formatDate, formatPhoneNumber } from "libs";
import MorePopover from "compositions/Popover/MorePopover";

interface Props {
  resData: any;
  onOpen: () => void;
}

export default function TimeLineIssuesMainHeader({ resData, onOpen }: Props) {
  const {
    owner,
    owner_name,
    owner_email,
    description,
    date_created,
    owner_phone_number,
  }: any = resData;

  return (
    <StyledWrapperTop direction="row" justifyContent="space-between" alignItems="center">
      <Typography component="span">
        <Typography component="span" fontWeight={700}>
          {owner_name}
        </Typography>
        {/* {owner_name} - {formatDate(date_created)} */} - {owner_email} -{" "}
        {formatPhoneNumber(owner_phone_number)}
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0}>
        <Typography>{formatDate(date_created, "dd/MM/yyyy")}</Typography>
        <MorePopover onOpen={onOpen} idItem={owner.id} />
      </Stack>
    </StyledWrapperTop>
  );
}

const StyledWrapperTop = styled(Stack)(() => {
  return {
    borderRadius: "8px 8px 0 0",
    padding: "0.3rem 1.5rem",
    background: "#F1F1F1",
    borderBottom: "1px solid #CDCDCD ",
  };
});
