import HomeIcon from "@mui/icons-material/Home";
import LoginIcon from "@mui/icons-material/Login";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

export interface ApiResponse<T> {
  status: number;
  success: boolean;
  message: string;
  content: T;
}

export interface SideBarMenu {
  path: string;
  name: string;
  icon: JSX.Element;
  loggedUserOnly?: boolean;
  showAlways?: boolean;
}

export const getOptions = (): SideBarMenu[] => {
  return [
    { path: "", name: "Home", icon: <HomeIcon />, showAlways: true },
    {
      path: "board",
      icon: <SportsEsportsIcon />,
      name: "Play",
      loggedUserOnly: true,
    },
    {
      path: "profile",
      icon: <SettingsAccessibilityIcon />,
      name: "Profile",
      loggedUserOnly: true,
    },
    {
      path: "register-user",
      icon: <AccountCircleIcon />,
      name: "Create User",
    },
    {
      path: "login",
      icon: <LoginIcon />,
      name: "Login",
    },
  ];
};
