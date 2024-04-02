import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Grid, Stack } from "@mui/material";
import { useMountedState } from "react-use";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";

import { ISSUES, EDIT } from "routes";
import { useNotification } from "hooks";
import { BackButton, Card, LoadingButton } from "components";

import { ADMIN_ISSUES_END_POINT } from "__generated__/END_POINT";
import { ADMIN_ISSUES_POST_YUP_RESOLVER } from "__generated__/POST_YUP";
import { ADMIN_ISSUES_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";

import axios from "axios.config";
import DynamicMessage from "messages";
import IssuesForm from "./components/IssuesForm";

export default function CreateIssues() {
  const { messages, formatMessage } = useIntl();
  const router = useRouter();
  const isMounted = useMountedState();

  const { loading, setLoading, enqueueSnackbarWithSuccess, enqueueSnackbarWithError } =
    useNotification();

  const { control, handleSubmit } = useForm({
    defaultValues: { ...ADMIN_ISSUES_POST_DEFAULT_VALUE },
    resolver: ADMIN_ISSUES_POST_YUP_RESOLVER,
  });

  const onSubmit = useCallback(
    async ({ data }: { data: any }) => {
      try {
        setLoading(true);
        const { data: resData } = await axios.post(ADMIN_ISSUES_END_POINT, data);

        enqueueSnackbarWithSuccess(
          formatMessage(DynamicMessage.createSuccessfully, {
            content: "khiếu nại",
          })
        );

        if (router.query.type) {
          router.push(`${EDIT}/${resData.parent.id}`);
        } else {
          router.push(`${EDIT}/${resData.id}`);
        }
      } catch (err) {
        enqueueSnackbarWithError(err);
      } finally {
        if (isMounted()) {
          setLoading(false);
        }
      }
    },
    [router.query.type]
  );

  return (
    <Grid container>
      <Grid item xs={10}>
        <Card
          title={router.query.type === "comment" ? "Tạo bình luận" : "Tạo khiếu nại"}
          body={<IssuesForm control={control} />}
        />
      </Grid>

      <Grid item xs={10}>
        <Stack flexDirection="row" justifyContent="space-between">
          <BackButton
            onClick={() => {
              router.back();
            }}
            disabled={loading}
          />

          <LoadingButton
            loading={loading}
            onClick={handleSubmit((data) => {
              onSubmit({ data });
            })}
          >
            {loading ? messages["creatingStatus"] : messages["createStatus"]}
          </LoadingButton>
        </Stack>
      </Grid>
    </Grid>
  );
}
