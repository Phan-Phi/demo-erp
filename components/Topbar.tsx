import { signOut } from "next-auth/react";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/router";
import { useContext, useCallback, useRef, useEffect } from "react";
import { usePopupState, bindHover, bindPopper } from "material-ui-popup-state/hooks";
import {
  Box,
  Fade,
  Stack,
  Popper,
  MenuItem,
  Typography,
  IconButton,
} from "@mui/material";

import DisplaySettingsIcon from "@mui/icons-material/DisplaySettings";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { AUDIT_LOGS, SETTING } from "routes";
import { LayoutContext } from "contexts";
import { Link, Image, LoadingDynamic, Container } from "components";
import { useTheme as useCustomTheme, useSetting, useUser, usePermission } from "hooks";

export const Topbar = () => {
  const theme = useTheme();
  const router = useRouter();
  const userInfo = useUser();
  const setting = useSetting();
  const topbarRef = useRef<HTMLDivElement>();
  const customThemeContext = useCustomTheme();
  const layoutContext = useContext(LayoutContext);
  const profilePopupState = usePopupState({ variant: "popper", popupId: "profileMenu" });
  const settingPopupState = usePopupState({ variant: "popper", popupId: "settingMenu" });

  const { hasPermission } = usePermission("write_site");
  const { hasPermission: readAuditlogPermission } = usePermission("read_auditlog");

  const signOutHandler = async () => {
    await signOut();
  };

  const changeThemeHandler = useCallback(() => {
    customThemeContext.toggleMode();
  }, []);

  useEffect(() => {
    if (topbarRef.current) {
      const topbarHeight = topbarRef.current.offsetHeight;

      layoutContext.setState({
        topbarHeight,
      });
    }
  }, []);

  if (setting == undefined) {
    return <LoadingDynamic />;
  }

  return (
    <Box
      ref={topbarRef}
      component="header"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderBottom: (theme) => {
          return `1px solid ${theme.palette.divider}`;
        },
        paddingY: 1,
        backgroundColor: "background.default",
        boxShadow: 1,
      }}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link href="/">
            <Image
              src={setting.logo?.default || "/logo.png"}
              width="4rem"
              height="4rem"
              objectFit="contain"
              alt=""
            />
          </Link>
          <Stack
            spacing={2}
            direction="row"
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box>
              {hasPermission && (
                <IconButton
                  sx={{
                    color: theme.palette.text.primary,
                  }}
                  {...bindHover(settingPopupState)}
                  // onClick={() => {
                  //   const pathname = `/${SETTING}`;

                  //   router.push(pathname, pathname, {
                  //     shallow: true,
                  //   });
                  // }}
                >
                  <SettingsOutlinedIcon />
                </IconButton>
              )}

              <Popper
                {...bindPopper(settingPopupState)}
                transition
                style={{
                  zIndex: 1301,
                }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={300}>
                    <Box
                      sx={{
                        padding: 2,
                        boxShadow: 2,
                        backgroundColor: "background.default",
                      }}
                    >
                      <MenuItem
                        sx={{
                          ["&:hover .MuiBox-root"]: {
                            color: ({ palette }) => {
                              return `${palette.common.white} !important`;
                            },
                          },
                        }}
                      >
                        <Box
                          onClick={() => {
                            const pathname = `/${SETTING}`;

                            router.push(pathname, pathname, {
                              shallow: true,
                            });
                          }}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.primary",
                            justifyContent: "space-between",
                          }}
                        >
                          <DisplaySettingsIcon />
                          <Typography marginLeft={1}>Cài đặt cửa hàng</Typography>
                        </Box>
                      </MenuItem>

                      {readAuditlogPermission && (
                        <MenuItem
                          sx={
                            {
                              // pointerEvents: "none",
                              // opacity: 0.5,
                              // userSelect: "none",
                            }
                          }
                        >
                          <Stack
                            onClick={() => {
                              const pathname = `/${AUDIT_LOGS}`;

                              router.push(pathname, pathname, {
                                shallow: true,
                              });
                            }}
                            direction="row"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <ManageHistoryIcon />
                            <Typography marginLeft={1}>Lịch sử thao tác</Typography>
                          </Stack>
                        </MenuItem>
                      )}
                    </Box>
                  </Fade>
                )}
              </Popper>
            </Box>

            {/* <IconButton onClick={changeThemeHandler}>
              {theme.palette.mode === "light" ? (
                <WbSunnyOutlinedIcon />
              ) : (
                <DarkModeOutlinedIcon />
              )}
            </IconButton> */}

            <Box>
              <Stack
                direction="row"
                spacing={1}
                sx={{
                  alignItems: "center",
                  cursor: "pointer",
                }}
                {...bindHover(profilePopupState)}
              >
                <Typography fontWeight={700}>
                  {userInfo?.username || userInfo?.email || "TEST"}
                </Typography>
              </Stack>
              <Popper
                {...bindPopper(profilePopupState)}
                transition
                style={{
                  zIndex: 1301,
                }}
              >
                {({ TransitionProps }) => (
                  <Fade {...TransitionProps} timeout={300}>
                    <Box
                      sx={{
                        padding: 2,
                        boxShadow: 2,
                        backgroundColor: "background.default",
                      }}
                    >
                      <MenuItem
                        sx={{
                          ["&:hover .MuiLink-root"]: {
                            color: ({ palette }) => {
                              return `${palette.common.white} !important`;
                            },
                          },
                        }}
                      >
                        <Link
                          href="/users/change-password"
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            color: "text.primary",
                            justifyContent: "space-between",
                          }}
                        >
                          <PersonOutlineOutlinedIcon />
                          <Typography marginLeft={1}>Đổi mật khẩu</Typography>
                        </Link>
                      </MenuItem>

                      <MenuItem>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          onClick={signOutHandler}
                        >
                          <LogoutOutlinedIcon />
                          <Typography marginLeft={1}>Logout</Typography>
                        </Stack>
                      </MenuItem>
                    </Box>
                  </Fade>
                )}
              </Popper>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};
