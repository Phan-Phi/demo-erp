import { useIntl } from "react-intl";
import React, { Fragment } from "react";

import { isEmpty, get } from "lodash";
import { Stack, styled, Typography, Box } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";

import { formatPhoneNumber } from "libs";
import { NoData, IconButtonBackground, Link } from "components";

type AddressDetailDraftProps = {
  data: any[];
  deleteAddressHandler?: (id: number) => void;
  updateAddressHandler?: (value: any) => void;
  deleteLoading?: object;
  writePermission?: boolean;
};

export default function AddressDetailDraft(props: AddressDetailDraftProps) {
  const {
    data,
    deleteLoading,
    writePermission,
    updateAddressHandler,
    deleteAddressHandler,
  } = props;

  const { messages } = useIntl();

  if (isEmpty(data)) return <NoData />;

  return (
    <Fragment>
      {data.map((el) => {
        return (
          <StyledStack key={el.id}>
            <Box>
              <StyledStackAddressDefault>
                {el.is_default_for_shipping && (
                  <AddressDefault
                    message={messages["defaultShippingAddress"] as string}
                  />
                )}

                {el.is_default_for_billing && (
                  <AddressDefault message={messages["defaultBillingAddress"] as string} />
                )}
              </StyledStackAddressDefault>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["address"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "line1", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["ward"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "ward.[1]", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["district"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "district.[1]", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["province"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "province.[1]", "-")}
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["phoneNumber"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  <Link href={`tel:${el.phone_number}`}>
                    {formatPhoneNumber(el.phone_number)}
                  </Link>
                </Typography>
              </Typography>

              <Typography gutterBottom>
                <Typography component="span" fontWeight="700">
                  {`${messages["note"]}:`}
                </Typography>
                <Typography component="span" marginLeft={1}>
                  {get(el, "notes") || "-"}
                </Typography>
              </Typography>
            </Box>

            {writePermission && (
              <Stack spacing={2}>
                <StyledIconButtonBackground
                  children={<DeleteIcon />}
                  onClick={() => {
                    if (el.id) {
                      deleteAddressHandler?.(el.id);
                    }
                  }}
                  loading={el?.id ? deleteLoading?.[el.id] : false}
                />

                <StyledIconButtonBackground
                  children={<EditIcon />}
                  onClick={() => {
                    updateAddressHandler?.(el);
                  }}
                />
              </Stack>
            )}
          </StyledStack>
        );
      })}
    </Fragment>
  );
}

const AddressDefault = ({ message }: { message: string }) => {
  return (
    <StyledWrapperAddressDefault>
      <StyledCheckIcon />
      <StyledTextPrimary>{message}</StyledTextPrimary>
    </StyledWrapperAddressDefault>
  );
};

const StyledStack = styled(Stack)(() => {
  return {
    columnGap: 4,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "background.paper",
  };
});

const StyledStackAddressDefault = styled(Stack)(() => {
  return {
    gap: 4,
    flexDirection: "row",
  };
});

const StyledWrapperAddressDefault = styled(Stack)(() => {
  return {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };
});

const StyledTextPrimary = styled(Typography)(({ theme }) => {
  return {
    fontSize: 13,
    color: theme.palette.success.main,
  };
});

const StyledCheckIcon = styled(CheckIcon)(({ theme }) => {
  return {
    marginRight: 4,
    color: theme.palette.success.main,
  };
});

const StyledIconButtonBackground = styled(IconButtonBackground)(({ theme }) => {
  return {
    backgroundColor: theme.palette.error.main,
    ["&:hover"]: {
      opacity: 0.8,
      backgroundColor: theme.palette.error.main,
    },
  };
});
