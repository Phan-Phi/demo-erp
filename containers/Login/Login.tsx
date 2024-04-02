import useSWR from "swr";
import get from "lodash/get";
import dynamic from "next/dynamic";

import { useIntl } from "react-intl";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useMountedState } from "react-use";
import { useSession } from "next-auth/react";
import { Box, Stack, styled } from "@mui/material";
import { useState, useCallback, useEffect } from "react";

import LoginForm from "./components/LoginForm";
import LoginHeader from "./components/LoginHeader";
import LoginFooter from "./components/LoginFooter";

import { PUBLIC_SETTING } from "apis";
import { LoadingButton } from "components";
import { getSeoObject } from "libs/getSeoObject";
import { LOGIN_POST_DEFAULT_VALUE } from "__generated__/POST_DEFAULT_VALUE";
import { LOGIN_POST_YUP_RESOLVER } from "__generated__/POST_YUP";

const SEODynamic = dynamic(import("../../components/SEO"), {
  ssr: false,
});

const Login = () => {
  const { data: settingData } = useSWR(PUBLIC_SETTING);

  const router = useRouter();
  const { messages } = useIntl();
  const { status } = useSession();
  const isMounted = useMountedState();
  const { enqueueSnackbar } = useSnackbar();

  const [loginLoading, setLoginLoading] = useState(false);

  const { control, handleSubmit } = useForm({
    defaultValues: LOGIN_POST_DEFAULT_VALUE,
    resolver: LOGIN_POST_YUP_RESOLVER,
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status]);

  const onLoginHandler = useCallback(async (data: any) => {
    setLoginLoading(true);

    try {
      const result = await signIn("sign-in", {
        ...data,
        redirect: false,
      });

      if (result?.error) {
        enqueueSnackbar("Tên đăng nhập hoặc mật khẩu không đúng", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(messages["loginSuccessfully"], {
          variant: "success",
        });
      }
    } catch (err) {
    } finally {
      if (isMounted()) {
        setLoginLoading(false);
      }
    }
  }, []);

  if (status === "authenticated") {
    return null;
  }

  return (
    <Wrapper>
      <SEODynamic {...getSeoObject(settingData)} />

      <WrapperContent>
        <WrapperLoginHeader>
          <LoginHeader src={get(settingData, "logo.default")} />
        </WrapperLoginHeader>

        <Stack spacing={2} component="form">
          <LoginForm control={control} />

          <Box>
            <LoadingButton
              loading={loginLoading}
              onClick={handleSubmit(onLoginHandler)}
              fullWidth={false}
              type="submit"
            >
              {loginLoading ? messages["loggingIn"] : messages["login"]}
            </LoadingButton>
          </Box>
        </Stack>

        <WrapperLoginFooter>
          <LoginFooter />
        </WrapperLoginFooter>
      </WrapperContent>
    </Wrapper>
  );
};

const Wrapper = styled(Box)({
  width: "100%",
  maxWidth: "100vw",
  minHeight: "100vh",
  maxHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
});

const WrapperLoginFooter = styled(Box)({
  display: "flex",
  justifyContent: "center",
  marginTop: 5,
});

const WrapperLoginHeader = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const WrapperContent = styled(Box)({
  minWidth: "600px",
  width: "fit-content",
});

export default Login;
