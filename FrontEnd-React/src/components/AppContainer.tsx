import {
  AppBar,
  Avatar,
  Container,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link, useNavigate } from "react-router-dom";
import { SideBarMenu } from "../utils/utils";
import { cleanupSessionUser, useSessionUser } from "../store/userStore";
import React, { useEffect } from "react";
import { Box } from "@mui/system";
import backEndUrl from "../environment";

interface Props {
  children: JSX.Element[] | JSX.Element;
  navigation?: SideBarMenu[];
}

export default function AppContainer(props: Props) {
  const drawerWidth = 180;
  const navigation = useNavigate();
  const user = useSessionUser();

  useEffect(() => {
    !user && navigation("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Card Game
          </Typography>
          {user && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Avatar
                src={user.avatar_url ? `${backEndUrl}/${user.avatar_url}` : ""}
                alt=""
              ></Avatar>
              <Typography>{user && user.name}</Typography>
            </div>
          )}
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          {props.navigation &&
            props.navigation.map((item, index) => {
              if (
                item.showAlways ||
                (user && item.loggedUserOnly) ||
                (!user && !item.loggedUserOnly)
              ) {
                return (
                  <ListItem disablePadding key={item.name}>
                    <Link
                      to={"/" + item.path}
                      style={{
                        textDecoration: "none",
                        color: "black",
                        width: "100%",
                      }}
                    >
                      <ListItemButton>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.name} />
                      </ListItemButton>
                    </Link>
                  </ListItem>
                );
              } else {
                return null;
              }
            })}

          {user && (
            <ListItem
              key={"Logout"}
              disablePadding
              onClick={() => {
                cleanupSessionUser();
                navigation("/");
              }}
            >
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={"Log Out"} />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Drawer>
      <Container maxWidth="md" sx={{ flexGrow: 1, p: 9 }}>
        {props.children}
      </Container>
    </Box>
  );
}
