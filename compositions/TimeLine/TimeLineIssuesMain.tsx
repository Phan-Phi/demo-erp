import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Box, Button, Grid, Stack, styled } from "@mui/material";
import { transformUrl } from "libs";
import { WRAPPER_TABLE_BOX_SHADOW } from "constant";
import { useFetch, useNotification, useToggle, useUser } from "hooks";
import { Spacing, Container, Divider, LoadingDynamic } from "components";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ISSUES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

import axios from "axios.config";
import DynamicMessage from "messages";
import RenderHTML from "compositions/RenderHTML/RenderHTML";
import FormTimeLineDescription from "./FormTimeLineDescription";
import TableRelatedItem from "containers/Issues/components/TableRelatedItem";
import TimeLineIssuesMainHeader from "./TimeLineIssuesMainHeader";

export default function TimeLineIssuesMain() {
  const router = useRouter();
  const { formatMessage } = useIntl();
  const { open, onOpen, onClose } = useToggle();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [defaultValues, setDefaultValues] = useState<any>();

  const { resData, isLoading, itemCount, changeKey, refreshData } =
    useFetch<ISSUE_VIEW_TYPE_V1>(
      transformUrl(`${ADMIN_ISSUES_END_POINT}${router.query.idx}`, {
        use_cache: false,
      })
    );

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: defaultValues,
    resolver: ADMIN_ISSUES_POST_YUP_RESOLVER,
  });

  useEffect(() => {
    if (resData == undefined) return;
    const { description, title }: any = resData;

    setDefaultValues(resData);
    setValue("description", description);
    setValue("title", title);
  }, [resData]);

  const onSubmit = useCallback(async ({ data }: { data: any }) => {
    try {
      const { data: resData } = await axios.patch(
        `${ADMIN_ISSUES_END_POINT}${router.query.idx}`,
        {
          description: data.description,
        }
      );

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.updateSuccessfully, {
          content: "nội dung khiếu nại",
        })
      );

      onClose();
      refreshData();
    } catch (err) {
      enqueueSnackbarWithError(err);
    }
  }, []);

  if (resData == undefined) return <LoadingDynamic />;

  const {
    owner,
    owner_name,
    owner_email,
    description,
    date_created,
    owner_phone_number,
  }: any = resData;

  return (
    <Container>
      <Grid container>
        {/* <Grid item xs={0.6}>
          <StyledAvatar alt={owner.username} src={owner.avatar.default} />
        </Grid> */}
        <Grid item xs={12}>
          <StyledWrapper>
            <TimeLineIssuesMainHeader resData={resData} onOpen={onOpen} />

            <StyledWrapperContent>
              {!open && <RenderHTML data={description} />}

              {open && (
                <>
                  <FormTimeLineDescription control={control} />
                  <Spacing spacing={2} />

                  <Stack
                    direction="row"
                    spacing={2.5}
                    alignItems="center"
                    justify-content="flex-end"
                  >
                    <StyledButton
                      onClick={handleSubmit((data) => {
                        onSubmit({ data });
                      })}
                    >
                      Lưu
                    </StyledButton>
                    <StyledButton color="error" onClick={() => onClose()}>
                      Hủy
                    </StyledButton>
                  </Stack>
                  <Spacing spacing={2} />
                </>
              )}
              <StyledSpacing />
              <Divider />
              <StyledSpacing />

              {!open && (
                <>
                  <TableRelatedItem isID={false} owner={owner} />
                  <Spacing spacing={2} />
                </>
              )}
            </StyledWrapperContent>
          </StyledWrapper>
        </Grid>
      </Grid>
    </Container>
  );
}

const StyledWrapper = styled(Box)(() => {
  return {
    borderRadius: 8,
    boxShadow: WRAPPER_TABLE_BOX_SHADOW,
  };
});

const StyledSpacing = styled(Box)(() => {
  return {
    padding: "0.5rem 0",
  };
});

const StyledWrapperContent = styled(Stack)(() => {
  return {
    borderRadius: "0 8px 8px 0",
    padding: "0.3rem 1.5rem",
  };
});

const StyledAvatar = styled(Avatar)(() => {
  return {
    boxShadow: WRAPPER_TABLE_BOX_SHADOW,
    width: "50px",
    height: "50px",
  };
});

const StyledButton = styled(Button)(() => {
  return {
    height: "36px",
  };
});
