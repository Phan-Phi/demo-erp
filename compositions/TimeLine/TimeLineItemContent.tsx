import { useIntl } from "react-intl";
import { useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { Avatar, Box, Button, Grid, Stack, styled } from "@mui/material";

import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

import { transformUrl } from "libs";
import { WRAPPER_TABLE_BOX_SHADOW } from "constant";
import { useFetch, useNotification, useToggle } from "hooks";
import { Container, Divider, LoadingDynamic, Spacing } from "components";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ISSUES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

import axios from "axios.config";
import DynamicMessage from "messages";
import RenderHTML from "compositions/RenderHTML/RenderHTML";
import FormTimeLineDescription from "./FormTimeLineDescription";
import TimeLineIssuesMainHeader from "./TimeLineIssuesMainHeader";
import TimeLineConnector from "components/TimeLine/TimeLineConnector";
import TableRelatedItem from "containers/Issues/components/TableRelatedItem";

interface Props {
  id: number;
  disableTimeLine: boolean;
}

export default function TimeLineItemContent({ id, disableTimeLine }: Props) {
  const [defaultValues, setDefaultValues] = useState<any>();

  const { open, onOpen, onClose } = useToggle();
  const { formatMessage } = useIntl();
  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const { resData, refreshData } = useFetch<ISSUE_VIEW_TYPE_V1>(
    transformUrl(`${ADMIN_ISSUES_END_POINT}${id}`, {
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
      const { data: resData } = await axios.patch(`${ADMIN_ISSUES_END_POINT}${id}`, {
        description: data.description,
      });

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.updateSuccessfully, {
          content: "nội dung bình luận",
        })
      );

      onClose();
      refreshData();
    } catch (err) {
      enqueueSnackbarWithError(err);
    }
  }, []);

  if (resData == undefined) return <LoadingDynamic />;

  const { description, owner }: any = resData;

  return (
    <StyledContainer>
      <Grid container>
        <Grid item xs={0.5} paddingTop="0 !important">
          <Stack alignItems="center" height="100%">
            <StyledAvatar>
              <QuestionAnswerIcon />
            </StyledAvatar>
            <TimeLineConnector active={disableTimeLine} />
          </Stack>
        </Grid>

        <Grid item xs={11.5} paddingTop="0 !important">
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
                  <TableRelatedItem id={id} isID={true} owner={owner} />
                  <Spacing spacing={2} />
                </>
              )}
            </StyledWrapperContent>
            <Spacing
              sx={{ marginTop: !disableTimeLine ? "3rem" : "1.5rem", padding: 0 }}
            />
          </StyledWrapper>
        </Grid>
      </Grid>
    </StyledContainer>
  );
}

const StyledContainer = styled(Container)(() => {
  return {
    padding: "0 2rem !important",
  };
});

const StyledAvatar = styled(Avatar)(() => {
  return {
    background: "#f09415",
    width: "50px",
    height: "50px",
    border: "5px solid white",
  };
});

const StyledWrapper = styled(Box)(() => {
  return {
    borderRadius: 8,
    boxShadow: WRAPPER_TABLE_BOX_SHADOW,
  };
});

const StyledWrapperContent = styled(Stack)(() => {
  return {
    borderRadius: "0 8px 8px 0",
    padding: "0.3rem 1.5rem",
  };
});

const StyledSpacing = styled(Box)(() => {
  return {
    padding: "0.5rem 0",
  };
});

const StyledButton = styled(Button)(() => {
  return {
    height: "36px",
  };
});
