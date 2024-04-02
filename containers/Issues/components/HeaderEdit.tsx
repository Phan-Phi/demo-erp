import { get } from "lodash";
import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { Controller, useForm } from "react-hook-form";
import { useCallback, useEffect, useState } from "react";
import { Box, Button, Stack, Typography, styled } from "@mui/material";

import { transformUrl } from "libs";
import { FormControl } from "compositions";
import { Loading, LoadingDynamic } from "components";
import { useFetch, useNotification, usePermission, useToggle, useUser } from "hooks";

import { ISSUE_VIEW_TYPE_V1 } from "__generated__/apiType_v1";
import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ISSUES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

import axios from "axios.config";
import DynamicMessage from "messages";

export default function HeaderEdit() {
  const router = useRouter();
  const userInfo = useUser();
  const { open, onOpen, onClose } = useToggle();
  const { formatMessage } = useIntl();
  const { hasPermission: writePermission } = usePermission("write_issue");

  const { enqueueSnackbarWithSuccess, enqueueSnackbarWithError } = useNotification();

  const [defaultValues, setDefaultValues] = useState<any>();

  const { resData, refreshData } = useFetch<ISSUE_VIEW_TYPE_V1>(
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

    setDefaultValues(resData);
    setValue("description", get(resData, "description"));
    setValue("title", get(resData, "title"));
  }, [resData]);

  const onSubmit = useCallback(async ({ data }: { data: any }) => {
    try {
      const { data: resData } = await axios.patch(
        `${ADMIN_ISSUES_END_POINT}${router.query.idx}`,
        {
          title: data.title,
        }
      );

      enqueueSnackbarWithSuccess(
        formatMessage(DynamicMessage.updateSuccessfully, {
          content: "tiêu đề khiếu nại",
        })
      );

      onClose();
      refreshData();
    } catch (err) {
      enqueueSnackbarWithError(err);
    }
  }, []);

  if (resData == undefined) return <LoadingDynamic />;

  const { title }: any = resData;
  return (
    <Box>
      {!open && (
        <StyledStackSpaceBetween direction="row">
          <StyledTitle>{title}</StyledTitle>
          {writePermission && get(resData, "owner.id") === userInfo.id && (
            <StyledButton onClick={() => onOpen()}>Chỉnh sửa</StyledButton>
          )}
        </StyledStackSpaceBetween>
      )}

      {open && (
        <StyledStackSpaceBetween direction="row" spacing={2}>
          <Controller
            control={control}
            name="title"
            render={(props) => {
              return <FormControl controlState={props} placeholder="Tiêu đề" />;
            }}
          />
          <Stack direction="row" spacing={2.5} alignItems="center">
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
        </StyledStackSpaceBetween>
      )}
    </Box>
  );
}

const StyledStackSpaceBetween = styled(Stack)(() => {
  return {
    justifyContent: "space-between",
    alignItems: "center",
  };
});

const StyledButton = styled(Button)(() => {
  return {
    height: "36px",
  };
});

const StyledTitle = styled(Typography)(({ theme }) => {
  return {
    ...theme.typography.h3,
    width: "90%",
    fontSize: "2.5rem",
    lineHeight: "50px",
  };
});
